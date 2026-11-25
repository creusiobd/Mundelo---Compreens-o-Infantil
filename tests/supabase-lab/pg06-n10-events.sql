-- PG06-N10: disposable local Supabase ONLY. Synthetic data, not a migration.
-- This file is applied after tests/supabase-lab/schema.sql in ephemeral CI.
BEGIN;
CREATE SCHEMA IF NOT EXISTS pg06_events;
REVOKE ALL ON SCHEMA pg06_events FROM PUBLIC, anon, authenticated;
CREATE TABLE pg06_events.nodes (
 id uuid PRIMARY KEY,
 child_id uuid NOT NULL,
 version integer NOT NULL CHECK(version>0),
 kind text NOT NULL CHECK(kind IN ('SOURCE','DERIVED')),
 body text NOT NULL,
 validity text NOT NULL DEFAULT 'CURRENT' CHECK(validity IN ('CURRENT','REVIEW_REQUIRED')),
 presentation text NOT NULL DEFAULT 'ALLOW' CHECK(presentation IN ('ALLOW','BLOCK')),
 use_status text NOT NULL DEFAULT 'ALLOW' CHECK(use_status IN ('ALLOW','BLOCK')),
 retention text NOT NULL DEFAULT 'UNCHANGED' CHECK(retention IN ('UNCHANGED','REVIEW_REQUIRED'))
);
CREATE TABLE pg06_events.edges (
 child_id uuid NOT NULL,
 derived_id uuid NOT NULL REFERENCES pg06_events.nodes(id),
 input_id uuid NOT NULL REFERENCES pg06_events.nodes(id),
 PRIMARY KEY(derived_id,input_id),
 CHECK(derived_id<>input_id)
);
CREATE TABLE pg06_events.authorities (
 actor_id uuid NOT NULL,
 child_id uuid NOT NULL,
 action text NOT NULL CHECK(action IN ('SOURCE_REVISED','INTERPRETATION_CONTESTED','ACCESS_REVOKED')),
 verified boolean NOT NULL DEFAULT false,
 PRIMARY KEY(actor_id,child_id,action)
);
CREATE TABLE pg06_events.grants (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 child_id uuid NOT NULL,
 derived_id uuid NOT NULL REFERENCES pg06_events.nodes(id),
 recipient_id uuid NOT NULL,
 purpose text NOT NULL,
 operation text NOT NULL CHECK(operation IN ('READ','SHARE','EXPORT')),
 active boolean NOT NULL DEFAULT true,
 revision integer NOT NULL DEFAULT 1,
 UNIQUE(derived_id,recipient_id,purpose,operation)
);
CREATE TABLE pg06_events.child_state (
 child_id uuid PRIMARY KEY,
 revision integer NOT NULL DEFAULT 0
);
CREATE TABLE pg06_events.events (
 event_id uuid PRIMARY KEY,
 child_id uuid NOT NULL,
 actor_id uuid NOT NULL,
 revision integer NOT NULL,
 kind text NOT NULL,
 target_id uuid NOT NULL,
 recipient_id uuid,
 recorded_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 UNIQUE(child_id,revision)
);
CREATE INDEX ON pg06_events.edges(input_id);
CREATE INDEX ON pg06_events.grants(derived_id,recipient_id,purpose,operation) WHERE active;
CREATE INDEX ON pg06_events.events(child_id,revision);
-- Defense in depth, even though this schema is absent from PostgREST exposed schemas.
ALTER TABLE pg06_events.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.nodes FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.edges FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.authorities FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.grants FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.child_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.child_state FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_events.events FORCE ROW LEVEL SECURITY;

-- All events and their effects commit in one transaction.
-- No client-supplied actor identity or trusted role; use Supabase validated auth.uid().
CREATE FUNCTION public.pg06_n10_record_event(
 p_event uuid,p_child uuid,p_kind text,p_target uuid,p_expected_revision integer,
 p_recipient uuid DEFAULT NULL
) RETURNS integer
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path=''
AS $$
DECLARE actor uuid; present pg06_events.events%rowtype; current_revision integer;
 target_kind text; changed integer;
BEGIN
 actor:=auth.uid();
 IF actor IS NULL OR p_event IS NULL OR p_child IS NULL OR p_target IS NULL
    OR p_kind NOT IN ('SOURCE_REVISED','INTERPRETATION_CONTESTED','ACCESS_REVOKED')
    OR (p_kind='ACCESS_REVOKED' AND p_recipient IS NULL)
    OR (p_kind<>'ACCESS_REVOKED' AND p_recipient IS NOT NULL)
 THEN RAISE EXCEPTION 'operation unavailable' USING ERRCODE='42501'; END IF;
 -- Serializes all derived effects for this child, including delivery.
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_child::text, 93010));
 SELECT * INTO present FROM pg06_events.events WHERE event_id=p_event;
 IF FOUND THEN
  IF present.actor_id<>actor OR present.child_id<>p_child OR
     present.kind<>p_kind OR present.target_id<>p_target OR
     present.recipient_id IS DISTINCT FROM p_recipient
  THEN RAISE EXCEPTION 'operation unavailable' USING ERRCODE='42501'; END IF;
  RETURN present.revision; -- Idempotent replay; no second effects.
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg06_events.authorities a
   WHERE a.actor_id=actor AND a.child_id=p_child AND a.action=p_kind AND a.verified)
 THEN RAISE EXCEPTION 'operation unavailable' USING ERRCODE='42501'; END IF;
 SELECT n.kind INTO target_kind FROM pg06_events.nodes n
  WHERE n.id=p_target AND n.child_id=p_child;
 IF target_kind IS DISTINCT FROM 'SOURCE' THEN
  RAISE EXCEPTION 'operation unavailable' USING ERRCODE='42501'; END IF;
 SELECT revision INTO current_revision FROM pg06_events.child_state WHERE child_id=p_child FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'operation unavailable' USING ERRCODE='42501'; END IF;
 IF current_revision<>p_expected_revision THEN
  RAISE EXCEPTION 'stale policy revision' USING ERRCODE='PT409'; END IF;
 -- The traversal uses the server-owned graph. Node IDs do not flow to callers.
 WITH RECURSIVE affected(id) AS (
  SELECT e.derived_id FROM pg06_events.edges e
   WHERE e.child_id=p_child AND e.input_id=p_target
  UNION
  SELECT e.derived_id FROM pg06_events.edges e
   JOIN affected a ON e.input_id=a.id WHERE e.child_id=p_child
 )
 UPDATE pg06_events.nodes n SET validity='REVIEW_REQUIRED',
   presentation='BLOCK',use_status='BLOCK',retention='REVIEW_REQUIRED'
 WHERE n.child_id=p_child AND n.kind='DERIVED' AND n.id IN (SELECT id FROM affected);
 -- Revocation of grants for affected derivatives is independent of historical records.
 IF p_kind='ACCESS_REVOKED' THEN
  WITH RECURSIVE affected(id) AS (
   SELECT e.derived_id FROM pg06_events.edges e
    WHERE e.child_id=p_child AND e.input_id=p_target
   UNION
   SELECT e.derived_id FROM pg06_events.edges e
    JOIN affected a ON e.input_id=a.id WHERE e.child_id=p_child
  )
  UPDATE pg06_events.grants g SET active=false,revision=g.revision+1
  WHERE g.child_id=p_child AND g.recipient_id=p_recipient AND g.active
    AND g.derived_id IN (SELECT id FROM affected);
 END IF;
 UPDATE pg06_events.child_state SET revision=current_revision+1 WHERE child_id=p_child;
 INSERT INTO pg06_events.events(event_id,child_id,actor_id,revision,kind,target_id,recipient_id)
 VALUES(p_event,p_child,actor,current_revision+1,p_kind,p_target,p_recipient);
 RETURN current_revision+1;
END $$;

-- Demo result is a synthetic body, never a persisted/exported file.
-- The same transaction lock prevents a post-revocation fresh delivery.
CREATE FUNCTION public.pg06_n10_deliver(
 p_derived uuid,p_purpose text,p_operation text,p_hold_ms integer DEFAULT 0
) RETURNS text LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path=''
AS $$
DECLARE actor uuid; d pg06_events.nodes%rowtype;
BEGIN
 actor:=auth.uid();
 IF actor IS NULL OR p_operation NOT IN ('READ','SHARE','EXPORT') OR
   p_purpose IS NULL OR length(p_purpose) NOT BETWEEN 1 AND 100 OR
   p_hold_ms IS NULL OR p_hold_ms<0 OR p_hold_ms>1500
 THEN RAISE EXCEPTION 'access unavailable' USING ERRCODE='42501'; END IF;
 SELECT * INTO d FROM pg06_events.nodes WHERE id=p_derived;
 IF NOT FOUND OR d.kind<>'DERIVED' THEN
   RAISE EXCEPTION 'access unavailable' USING ERRCODE='42501'; END IF;
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(d.child_id::text,93010));
 -- Re-read after acquiring the child lock: no pre-lock snapshot can authorize delivery.
 SELECT * INTO d FROM pg06_events.nodes WHERE id=p_derived;
 IF NOT FOUND OR d.kind<>'DERIVED' THEN RAISE EXCEPTION 'access unavailable' USING ERRCODE='42501'; END IF;
 IF d.presentation<>'ALLOW' OR d.use_status<>'ALLOW' OR d.validity<>'CURRENT' THEN
   RAISE EXCEPTION 'access unavailable' USING ERRCODE='42501'; END IF;
 IF NOT EXISTS(SELECT 1 FROM pg06_events.grants g
    WHERE g.derived_id=d.id AND g.child_id=d.child_id AND
      g.recipient_id=actor AND g.purpose=p_purpose AND
      g.operation=p_operation AND g.active)
 THEN RAISE EXCEPTION 'access unavailable' USING ERRCODE='42501'; END IF;
 -- Only a CI race hook. Production endpoints must not have a caller-controlled delay.
 IF p_hold_ms>0 THEN PERFORM pg_catalog.pg_sleep(p_hold_ms::double precision/1000); END IF;
 RETURN d.body;
END $$;

-- Revoke PUBLIC default EXECUTE and anon explicitly. Only authenticated role can RPC.
REVOKE ALL ON FUNCTION public.pg06_n10_record_event(uuid,uuid,text,uuid,integer,uuid) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.pg06_n10_deliver(uuid,text,text,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.pg06_n10_record_event(uuid,uuid,text,uuid,integer,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.pg06_n10_deliver(uuid,text,text,integer) TO authenticated;
COMMIT;
