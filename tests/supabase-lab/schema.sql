-- PG06-N06: LOCAL SUPABASE SANDBOX ONLY. NEVER DEPLOY; synthetic-only.
-- This schema intentionally uses public pg06_lab_* names because PostgREST exposes public.
-- Rights are denied by RLS; protected effects are private verified RPCs.
begin;
create schema if not exists pg06_lab;
revoke all on schema pg06_lab from public, anon, authenticated;

create table public.pg06_lab_perspectives (
  id uuid not null,
  version integer not null check(version>0),
  child_id uuid not null,
  category text not null check(category in ('OBSERVATION','INTERPRETATION','CONTEXT','RELATION')),
  recorder_id uuid not null,
  body text not null check(length(body) between 3 and 2000),
  context text not null check(length(context) between 1 and 2000),
  created_at timestamptz not null default now(),
  primary key(id,version)
);
create table pg06_lab.authorities (
  actor_id uuid not null,
  child_id uuid not null,
  authority text not null check(authority in ('CONTRIBUTE','GRANT','REVOKE','RESTRICT')),
  category text not null,
  purpose text not null,
  verified boolean not null default false,
  primary key(actor_id,child_id,authority,category,purpose)
);
create table pg06_lab.policy_state (
  child_id uuid primary key,
  policy_revision integer not null default 1,
  restriction_revision integer not null default 1
);
create table pg06_lab.grants (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null,
  recipient_id uuid not null,
  source_id uuid not null,
  source_version integer not null,
  category text not null,
  purpose text not null,
  operation text not null check(operation in ('READ','USE','SHARE','EXPORT','PREPARE')),
  issued_by uuid not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  revision integer not null default 1,
  policy_revision integer not null,
  restriction_revision integer not null,
  foreign key(source_id,source_version) references public.pg06_lab_perspectives(id,version),
  unique(child_id,recipient_id,source_id,source_version,category,purpose,operation)
);
create index on pg06_lab.grants(recipient_id,source_id,source_version,purpose,operation) where revoked_at is null;

alter table public.pg06_lab_perspectives enable row level security;
alter table public.pg06_lab_perspectives force row level security;
alter table pg06_lab.authorities enable row level security;
alter table pg06_lab.authorities force row level security;
alter table pg06_lab.grants enable row level security;
alter table pg06_lab.grants force row level security;
alter table pg06_lab.policy_state enable row level security;
alter table pg06_lab.policy_state force row level security;
-- Explicit policy for direct reads: denied. These tables may only be accessed through
-- restricted and vetted RPCs, not PostgREST table access.
create policy pg06_lab_deny_direct_read on public.pg06_lab_perspectives
for select to authenticated using (false);
create policy pg06_lab_deny_direct_insert on public.pg06_lab_perspectives
for insert to authenticated with check (false);
create policy pg06_lab_deny_direct_update on public.pg06_lab_perspectives
for update to authenticated using (false) with check (false);
create policy pg06_lab_deny_direct_delete on public.pg06_lab_perspectives
for delete to authenticated using (false);
revoke all on public.pg06_lab_perspectives from public, anon, authenticated;
grant select, insert, update, delete on public.pg06_lab_perspectives to authenticated;
-- RLS remains denied even if grants above exist. No direct access to authority/grant tables.

create or replace function public.pg06_lab_read(
  p_id uuid, p_version integer, p_purpose text
) returns table(id uuid,version integer,child_id uuid,category text,body text,context text)
language plpgsql security definer set search_path=''
as $$
declare rec public.pg06_lab_perspectives%rowtype; actor uuid;
begin
 actor := auth.uid();
 if actor is null or p_purpose is null or length(p_purpose)=0 then
   raise exception 'access unavailable' using errcode='42501';
 end if;
 select * into rec from public.pg06_lab_perspectives x
  where x.id=p_id and x.version=p_version;
 if not found then raise exception 'access unavailable' using errcode='42501'; end if;
 -- Shared transaction lock key. GRANT/REVOKE must acquire this same key.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(rec.child_id::text, 307));
 if not exists (
    select 1 from pg06_lab.grants g
    where g.child_id=rec.child_id and g.source_id=rec.id and g.source_version=rec.version
      and g.category=rec.category and g.recipient_id=actor and g.purpose=p_purpose
      and g.operation='READ' and g.revoked_at is null and g.expires_at > now()
      and exists (
        select 1 from pg06_lab.policy_state state
        where state.child_id=rec.child_id
          and state.policy_revision=g.policy_revision
          and state.restriction_revision=g.restriction_revision
      )
 ) then raise exception 'access unavailable' using errcode='42501'; end if;
 return query select rec.id,rec.version,rec.child_id,rec.category,rec.body,rec.context;
end $$;

create or replace function public.pg06_lab_register(
 p_child_id uuid,p_category text,p_body text,p_context text
) returns uuid
language plpgsql security definer set search_path=''
as $$
declare actor uuid; identity_id uuid := gen_random_uuid();
begin
 actor:=auth.uid();
 if actor is null or p_category not in ('OBSERVATION','INTERPRETATION','CONTEXT','RELATION')
 or p_body is null or length(p_body) not between 3 and 2000
 or p_context is null or length(p_context) not between 1 and 2000 then
   raise exception 'operation unavailable' using errcode='42501';
 end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_child_id::text,307));
 if not exists(select 1 from pg06_lab.authorities a where a.actor_id=actor
  and a.child_id=p_child_id and a.authority='CONTRIBUTE'
  and a.category=p_category and a.purpose='authoring' and a.verified)
 then raise exception 'operation unavailable' using errcode='42501'; end if;
 insert into public.pg06_lab_perspectives(id,version,child_id,category,recorder_id,body,context)
 values(identity_id,1,p_child_id,p_category,actor,p_body,p_context);
 return identity_id;
end $$;

create or replace function public.pg06_lab_grant(
 p_id uuid,p_version integer,p_recipient uuid,p_purpose text
) returns uuid
language plpgsql security definer set search_path=''
as $$
declare source public.pg06_lab_perspectives%rowtype; actor uuid; grant_id uuid;
 state pg06_lab.policy_state%rowtype;
begin
 actor:=auth.uid();
 if actor is null or p_purpose is null or length(p_purpose) not between 1 and 100
 or p_recipient is null then raise exception 'operation unavailable' using errcode='42501'; end if;
 select * into source from public.pg06_lab_perspectives x
  where x.id=p_id and x.version=p_version;
 if not found then raise exception 'operation unavailable' using errcode='42501'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(source.child_id::text,307));
 if not exists(select 1 from pg06_lab.authorities a where a.actor_id=actor
    and a.child_id=source.child_id and a.authority='GRANT'
    and a.category=source.category and a.purpose=p_purpose and a.verified)
 or not exists(select 1 from auth.users u where u.id=p_recipient)
 then raise exception 'operation unavailable' using errcode='42501'; end if;
 select * into state from pg06_lab.policy_state where child_id=source.child_id;
 if not found then raise exception 'operation unavailable' using errcode='42501'; end if;
 insert into pg06_lab.grants (child_id,recipient_id,source_id,source_version,category,purpose,operation,issued_by,expires_at,policy_revision,restriction_revision)
 values (source.child_id,p_recipient,p_id,p_version,source.category,p_purpose,'READ',actor,now()+interval '1 day',state.policy_revision,state.restriction_revision)
 on conflict (child_id,recipient_id,source_id,source_version,category,purpose,operation)
 do update set revoked_at=null,expires_at=excluded.expires_at,issued_by=excluded.issued_by,
    revision=pg06_lab.grants.revision+1,policy_revision=excluded.policy_revision,
    restriction_revision=excluded.restriction_revision
 returning id into grant_id;
 return grant_id;
end $$;

create or replace function public.pg06_lab_revoke(p_grant uuid) returns boolean
language plpgsql security definer set search_path=''
as $$
declare g pg06_lab.grants%rowtype; actor uuid;
begin
 actor:=auth.uid();
 if actor is null then raise exception 'operation unavailable' using errcode='42501'; end if;
 select * into g from pg06_lab.grants where id=p_grant;
 if not found then raise exception 'operation unavailable' using errcode='42501'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(g.child_id::text,307));
 if not exists(select 1 from pg06_lab.authorities a where a.actor_id=actor
  and a.child_id=g.child_id and a.authority='REVOKE'
  and a.category=g.category and a.purpose=g.purpose and a.verified)
 then raise exception 'operation unavailable' using errcode='42501'; end if;
 update pg06_lab.grants set revoked_at=now(),revision=revision+1
 where id=p_grant and revoked_at is null;
 return true;
end $$;


create or replace function public.pg06_lab_revise(
 p_id uuid,p_expected_version integer,p_body text,p_context text
) returns integer
language plpgsql security definer set search_path=''
as $$
declare actor uuid; rec public.pg06_lab_perspectives%rowtype;
 latest integer;
begin
 actor:=auth.uid();
 if actor is null or p_body is null or length(p_body) not between 3 and 2000
 or p_context is null or length(p_context) not between 1 and 2000
 then raise exception 'operation unavailable' using errcode='42501'; end if;
 select * into rec from public.pg06_lab_perspectives
  where id=p_id and version=p_expected_version;
 if not found then raise exception 'operation unavailable' using errcode='42501'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(rec.child_id::text,307));
 if rec.recorder_id<>actor or not exists (
  select 1 from pg06_lab.authorities a where a.actor_id=actor
   and a.child_id=rec.child_id and a.authority='CONTRIBUTE'
   and a.category=rec.category and a.purpose='authoring' and a.verified
 ) then raise exception 'operation unavailable' using errcode='42501'; end if;
 select max(version) into latest from public.pg06_lab_perspectives where id=p_id;
 if latest<>p_expected_version then
   raise exception 'stale version' using errcode='PT409';
 end if;
 insert into public.pg06_lab_perspectives(id,version,child_id,category,recorder_id,body,context)
 values(rec.id,latest+1,rec.child_id,rec.category,rec.recorder_id,p_body,p_context);
 return latest+1;
end $$;

create or replace function public.pg06_lab_restrict(
 p_child uuid,p_category text,p_purpose text
) returns boolean
language plpgsql security definer set search_path=''
as $$
declare actor uuid;
begin
 actor:=auth.uid();
 if actor is null then raise exception 'operation unavailable' using errcode='42501'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_child::text,307));
 if not exists (select 1 from pg06_lab.authorities a
   where a.actor_id=actor and a.child_id=p_child
    and a.authority='RESTRICT' and a.category=p_category
    and a.purpose=p_purpose and a.verified
 ) then raise exception 'operation unavailable' using errcode='42501'; end if;
 update pg06_lab.policy_state set restriction_revision=restriction_revision+1
  where child_id=p_child;
 if not found then raise exception 'operation unavailable' using errcode='42501'; end if;
 return true;
end $$;

-- Do not let default EXECUTE privilege expose SECURITY DEFINER functions to anon.
revoke all on function public.pg06_lab_read(uuid,integer,text) from public, anon;
revoke all on function public.pg06_lab_register(uuid,text,text,text) from public, anon;
revoke all on function public.pg06_lab_grant(uuid,integer,uuid,text) from public, anon;
revoke all on function public.pg06_lab_revoke(uuid) from public, anon;
revoke all on function public.pg06_lab_revise(uuid,integer,text,text) from public, anon;
revoke all on function public.pg06_lab_restrict(uuid,text,text) from public, anon;
grant execute on function public.pg06_lab_read(uuid,integer,text) to authenticated;
grant execute on function public.pg06_lab_register(uuid,text,text,text) to authenticated;
grant execute on function public.pg06_lab_grant(uuid,integer,uuid,text) to authenticated;
grant execute on function public.pg06_lab_revoke(uuid) to authenticated;
grant execute on function public.pg06_lab_revise(uuid,integer,text,text) to authenticated;
grant execute on function public.pg06_lab_restrict(uuid,text,text) to authenticated;
commit;
