-- Disposable ONB-004 lab only. Not a production migration.
begin;
create schema onb_lab;
revoke all on schema onb_lab from public, anon, authenticated;
create table onb_lab.acceptances(subject_id uuid references auth.users(id), version int not null check(version=1), accepted_at timestamptz not null default now(), primary key(subject_id,version));
create table public.onb_lab_profiles(subject_id uuid primary key references auth.users(id), alias text not null check(alias in ('Adulto Teste A','Adulto Teste B','Adulto Teste P')), journey text not null check(journey in ('FAMILY','PRO_INFO')));
create table public.onb_lab_spaces(id uuid primary key default gen_random_uuid(), creator_subject_id uuid not null unique references public.onb_lab_profiles(subject_id));
create table public.onb_lab_memberships(space_id uuid references public.onb_lab_spaces(id), subject_id uuid references public.onb_lab_profiles(subject_id), technical_role text not null check(technical_role='INITIAL_CREATOR'), primary key(space_id,subject_id));
alter table onb_lab.acceptances enable row level security;
alter table public.onb_lab_profiles enable row level security;
alter table public.onb_lab_spaces enable row level security;
alter table public.onb_lab_memberships enable row level security;
revoke all on all tables in schema onb_lab from public,anon,authenticated;
revoke all on public.onb_lab_profiles,public.onb_lab_spaces,public.onb_lab_memberships from public,anon,authenticated;
-- No direct grants: all effects use explicit, scoped RPC; RLS also denies direct access.
create table onb_lab.session_state(sid uuid primary key, subject_id uuid not null, last_activity timestamptz not null default clock_timestamp(), revoked boolean not null default false);
alter table onb_lab.session_state enable row level security;
revoke all on onb_lab.session_state from public,anon,authenticated;
create table onb_lab.effects(id uuid primary key, subject_id uuid not null, sid uuid not null);
alter table onb_lab.effects enable row level security;
revoke all on onb_lab.effects from public,anon,authenticated;
create function onb_lab.actor() returns uuid language plpgsql security definer set search_path='' as $$
declare actor uuid := auth.uid(); sid uuid;
begin
 if actor is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then raise exception 'access unavailable' using errcode='42501'; end if;
 sid := (auth.jwt()->>'session_id')::uuid;
 if sid is null then raise exception 'access unavailable' using errcode='42501'; end if;
 -- Use provider-signed AMR claims validated by PostgREST; never user metadata.
 -- Require password and explicitly reject recovery, including mixed AMR.
 if not (coalesce(auth.jwt()->'amr','[]'::jsonb) @> '[{"method":"password"}]'::jsonb)
    or (coalesce(auth.jwt()->'amr','[]'::jsonb) @> '[{"method":"recovery"}]'::jsonb) then
  raise exception 'access unavailable' using errcode='42501';
 end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(actor::text, 873));
 if not exists(select 1 from auth.sessions s join auth.users u on u.id=s.user_id where s.id=sid and s.user_id=actor and u.email_confirmed_at is not null and (u.banned_until is null or u.banned_until<=now()) and (s.not_after is null or s.not_after>now()) and s.created_at>clock_timestamp()-interval '8 hours') then
  raise exception 'access unavailable' using errcode='42501';
 end if;
 insert into onb_lab.session_state(sid,subject_id) values(sid,actor) on conflict on constraint session_state_pkey do nothing;
 if not exists(select 1 from onb_lab.session_state x where x.sid=(auth.jwt()->>'session_id')::uuid and x.subject_id=actor and not x.revoked and x.last_activity>clock_timestamp()-interval '30 minutes') then
  raise exception 'access unavailable' using errcode='42501';
 end if;
 update onb_lab.session_state x set last_activity=clock_timestamp() where x.sid=(auth.jwt()->>'session_id')::uuid;
 return actor;
end $$;
revoke all on function onb_lab.actor() from public,anon,authenticated;
-- Exposed wrappers are invoker; privileged helpers stay in unexposed schema.
create function onb_lab.accept_terms(p_version int,p_terms boolean,p_privacy boolean) returns boolean language plpgsql security definer set search_path='' as $$
declare a uuid := onb_lab.actor();
begin
 if p_version is distinct from 1 or p_terms is distinct from true or p_privacy is distinct from true then raise exception 'invalid acceptance' using errcode='22023'; end if;
 insert into onb_lab.acceptances(subject_id,version) values(a,1) on conflict do nothing;
 return true;
end $$;
create function onb_lab.bootstrap(p_alias text,p_journey text) returns jsonb language plpgsql security definer set search_path='' as $$
declare a uuid := onb_lab.actor(); space uuid; existing_journey text;
begin
 if p_alias is null or p_alias not in ('Adulto Teste A','Adulto Teste B','Adulto Teste P') or p_journey is null or p_journey not in ('FAMILY','PRO_INFO') then raise exception 'invalid input' using errcode='22023'; end if;
 if not exists(select 1 from onb_lab.acceptances where subject_id=a and version=1) then raise exception 'access unavailable' using errcode='42501'; end if;
 insert into public.onb_lab_profiles(subject_id,alias,journey) values(a,p_alias,p_journey) on conflict do nothing;
 select journey into existing_journey from public.onb_lab_profiles where subject_id=a;
 if existing_journey is distinct from p_journey then raise exception 'journey unavailable' using errcode='42501'; end if;
 if p_journey='FAMILY' then
 insert into public.onb_lab_spaces(creator_subject_id) values(a) on conflict(creator_subject_id) do nothing;
 select id into space from public.onb_lab_spaces where creator_subject_id=a;
 insert into public.onb_lab_memberships(space_id,subject_id,technical_role) values(space,a,'INITIAL_CREATOR') on conflict do nothing;
 end if;
 return jsonb_build_object('journey',existing_journey,'space_id',space);
end $$;
create function onb_lab.read_space(p_space uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare a uuid := onb_lab.actor();
begin
 if not exists(select 1 from public.onb_lab_memberships m join onb_lab.acceptances t on t.subject_id=m.subject_id where m.subject_id=a and m.space_id=p_space and t.version=1) then raise exception 'access unavailable' using errcode='42501'; end if;
 return jsonb_build_object('space_id',p_space,'empty',true);
end $$;
revoke all on all functions in schema onb_lab from public,anon,authenticated;
grant usage on schema onb_lab to authenticated;
grant execute on function onb_lab.accept_terms(int,boolean,boolean),onb_lab.bootstrap(text,text),onb_lab.read_space(uuid) to authenticated;
create function public.onb_lab_accept(p_version int,p_terms boolean,p_privacy boolean) returns boolean language sql security invoker set search_path='' as $$select onb_lab.accept_terms(p_version,p_terms,p_privacy)$$;
create function public.onb_lab_bootstrap(p_alias text,p_journey text) returns jsonb language sql security invoker set search_path='' as $$select onb_lab.bootstrap(p_alias,p_journey)$$;
create function public.onb_lab_read_space(p_space uuid) returns jsonb language sql security invoker set search_path='' as $$select onb_lab.read_space(p_space)$$;
revoke all on function public.onb_lab_accept(int,boolean,boolean),public.onb_lab_bootstrap(text,text),public.onb_lab_read_space(uuid) from public,anon,authenticated;
grant execute on function public.onb_lab_accept(int,boolean,boolean),public.onb_lab_bootstrap(text,text),public.onb_lab_read_space(uuid) to authenticated;
-- Same per-subject transaction lock as actor(); revocation survives token refresh.
create function onb_lab.revoke_current() returns boolean language plpgsql security definer set search_path='' as $$
declare a uuid := onb_lab.actor();
begin
 update onb_lab.session_state x set revoked=true where x.sid=(auth.jwt()->>'session_id')::uuid and x.subject_id=a;
 return true;
end $$;
create function onb_lab.write_effect(p_id uuid) returns boolean language plpgsql security definer set search_path='' as $$
declare a uuid := onb_lab.actor();
begin
 if not exists(select 1 from public.onb_lab_profiles p where p.subject_id=a) then raise exception 'access unavailable' using errcode='42501'; end if;
 insert into onb_lab.effects(id,subject_id,sid) values(p_id,a,(auth.jwt()->>'session_id')::uuid);
 return true;
end $$;
revoke all on function onb_lab.revoke_current(),onb_lab.write_effect(uuid) from public,anon,authenticated;
grant execute on function onb_lab.revoke_current(),onb_lab.write_effect(uuid) to authenticated;
create function public.onb_lab_revoke_current() returns boolean language sql security invoker set search_path='' as $$select onb_lab.revoke_current()$$;
create function public.onb_lab_write_effect(p_id uuid) returns boolean language sql security invoker set search_path='' as $$select onb_lab.write_effect(p_id)$$;
revoke all on function public.onb_lab_revoke_current(),public.onb_lab_write_effect(uuid) from public,anon,authenticated;
grant execute on function public.onb_lab_revoke_current(),public.onb_lab_write_effect(uuid) to authenticated;
notify pgrst,'reload schema';
commit;
