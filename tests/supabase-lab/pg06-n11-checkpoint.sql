-- PG06-N11 | LOCAL SUPABASE SANDBOX ONLY. NEVER APPLY TO HOSTED DB.
-- Applied after pg06-n10-events.sql; uses actual auth.uid() from local PostgREST.
BEGIN;
CREATE SCHEMA pg06_n11;
REVOKE ALL ON SCHEMA pg06_n11 FROM PUBLIC, anon, authenticated;

-- Revision marker is append-only and does not overwrite the historical source.
-- A "revised" event proves the version changed, not the corrected content.
CREATE TABLE pg06_n11.source_versions(
 source_id uuid NOT NULL REFERENCES pg06_events.nodes(id),
 child_id uuid NOT NULL,
 version integer NOT NULL CHECK(version > 0),
 event_id uuid UNIQUE,
 recorded_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(source_id,version)
);
CREATE TABLE pg06_n11.holds(
 derived_id uuid PRIMARY KEY REFERENCES pg06_events.nodes(id),
 child_id uuid NOT NULL,
 blocked_revision integer NOT NULL CHECK(blocked_revision>0),
 review_id uuid,
 reinstated_revision integer
);
CREATE TABLE pg06_n11.review_authorities(
 reviewer_id uuid NOT NULL,
 child_id uuid NOT NULL,
 derived_id uuid NOT NULL REFERENCES pg06_events.nodes(id),
 purpose text NOT NULL,
 verified boolean NOT NULL DEFAULT false,
 PRIMARY KEY(reviewer_id,child_id,derived_id,purpose)
);
-- Evidence is issued only by trusted synthetic fixture administrator, not browser.
CREATE TABLE pg06_n11.verified_evidence(
 evidence_id uuid PRIMARY KEY,
 reviewer_id uuid NOT NULL,
 child_id uuid NOT NULL,
 derived_id uuid NOT NULL REFERENCES pg06_events.nodes(id),
 purpose text NOT NULL,
 bound_block_revision integer NOT NULL,
 source_snapshot jsonb NOT NULL,
 verification_reference text NOT NULL CHECK(length(verification_reference)>5),
 verified boolean NOT NULL,
 expires_at timestamptz NOT NULL
);
CREATE TABLE pg06_n11.reviews(
 review_id uuid PRIMARY KEY,
 child_id uuid NOT NULL,
 derived_id uuid NOT NULL,
 actor_id uuid NOT NULL,
 evidence_id uuid NOT NULL REFERENCES pg06_n11.verified_evidence(evidence_id),
 purpose text NOT NULL,
 reason text NOT NULL,
 source_snapshot jsonb NOT NULL,
 blocked_revision integer NOT NULL,
 requested_revision integer NOT NULL,
 revision integer NOT NULL,
 reviewed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 UNIQUE(child_id,revision)
);
CREATE INDEX ON pg06_n11.holds(child_id,blocked_revision);
CREATE INDEX ON pg06_n11.reviews(child_id,derived_id);
ALTER TABLE pg06_n11.source_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_n11.source_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_n11.holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_n11.holds FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_n11.review_authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_n11.review_authorities FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_n11.verified_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_n11.verified_evidence FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_n11.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_n11.reviews FORCE ROW LEVEL SECURITY;

-- Resolve every upstream source, with exact current source version.
-- Function is private; end users never receive this provenance list.
CREATE FUNCTION pg06_n11.source_snapshot(p_derived uuid) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $fn$
 WITH RECURSIVE closure(id) AS (
  SELECT e.input_id FROM pg06_events.edges e WHERE e.derived_id=p_derived
  UNION
  SELECT e.input_id FROM pg06_events.edges e JOIN closure c ON e.derived_id=c.id
 ),
 upstream(id) AS (
  SELECT DISTINCT n.id FROM closure c
   JOIN pg06_events.nodes n ON n.id=c.id
   WHERE n.kind='SOURCE'
     AND n.child_id=(SELECT child_id FROM pg06_events.nodes WHERE id=p_derived)
 )
 SELECT COALESCE(pg_catalog.jsonb_agg(
   pg_catalog.jsonb_build_object('id',u.id::text,'version',v.version)
   ORDER BY u.id::text), '[]'::jsonb)
 FROM upstream u
 JOIN LATERAL (
  SELECT MAX(s.version) AS version
  FROM pg06_n11.source_versions s WHERE s.source_id=u.id
 ) v ON v.version IS NOT NULL
$fn$;
REVOKE ALL ON FUNCTION pg06_n11.source_snapshot(uuid) FROM PUBLIC,anon,authenticated;

-- A new event invalidates any old revalidation checkpoint in the same transaction.
CREATE FUNCTION pg06_n11.on_event() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
BEGIN
 IF NEW.kind='SOURCE_REVISED' THEN
  INSERT INTO pg06_n11.source_versions(source_id,child_id,version,event_id)
  SELECT NEW.target_id,NEW.child_id,COALESCE(MAX(version),0)+1,NEW.event_id
  FROM pg06_n11.source_versions WHERE source_id=NEW.target_id
  HAVING COUNT(*)>0;
  IF NOT FOUND THEN RAISE EXCEPTION 'missing source baseline'; END IF;
 END IF;
 WITH RECURSIVE affected(id) AS (
  SELECT e.derived_id FROM pg06_events.edges e
  WHERE e.child_id=NEW.child_id AND e.input_id=NEW.target_id
  UNION
  SELECT e.derived_id FROM pg06_events.edges e
   JOIN affected a ON e.input_id=a.id WHERE e.child_id=NEW.child_id
 )
 INSERT INTO pg06_n11.holds(derived_id,child_id,blocked_revision,review_id,reinstated_revision)
 SELECT id,NEW.child_id,NEW.revision,NULL,NULL FROM affected
 ON CONFLICT(derived_id) DO UPDATE SET
  blocked_revision=EXCLUDED.blocked_revision,
  review_id=NULL,
  reinstated_revision=NULL;
 RETURN NEW;
END $fn$;
CREATE TRIGGER pg06_n11_event_after_insert
AFTER INSERT ON pg06_events.events
FOR EACH ROW EXECUTE FUNCTION pg06_n11.on_event();

-- No frontend claim can re-open the node. It needs JWT identity, scoped
-- reviewer authority, externally seeded evidence, exact versions and CAS.
CREATE FUNCTION public.pg06_n11_revalidate(
 p_review uuid,p_child uuid,p_derived uuid,p_purpose text,
 p_expected_revision integer,p_versions jsonb,p_reason text,p_evidence uuid
) RETURNS integer
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE actor uuid; d pg06_events.nodes%rowtype; state_revision integer;
 h pg06_n11.holds%rowtype; evidence pg06_n11.verified_evidence%rowtype;
 prior pg06_n11.reviews%rowtype; current_snapshot jsonb;
BEGIN
 actor:=auth.uid();
 IF actor IS NULL OR p_review IS NULL OR p_child IS NULL OR p_derived IS NULL
  OR p_evidence IS NULL OR p_purpose IS NULL OR length(p_purpose) NOT BETWEEN 1 AND 100
  OR p_expected_revision IS NULL OR p_versions IS NULL
  OR pg_catalog.jsonb_typeof(p_versions)<>'array'
  OR p_reason IS NULL OR length(pg_catalog.btrim(p_reason)) NOT BETWEEN 20 AND 500
 THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;
 SELECT * INTO d FROM pg06_events.nodes WHERE id=p_derived AND child_id=p_child;
 IF NOT FOUND OR d.kind<>'DERIVED'
 THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_child::text,93010));
 SELECT * INTO prior FROM pg06_n11.reviews WHERE review_id=p_review;
 IF FOUND THEN
  IF prior.actor_id<>actor OR prior.child_id<>p_child OR prior.derived_id<>p_derived OR
   prior.evidence_id<>p_evidence OR prior.purpose<>p_purpose OR
   prior.reason<>p_reason OR prior.source_snapshot<>p_versions OR
   prior.requested_revision<>p_expected_revision
  THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;
  RETURN prior.revision; -- identical replay has no side effect
 END IF;
 SELECT * INTO d FROM pg06_events.nodes WHERE id=p_derived AND child_id=p_child;
 IF NOT FOUND OR d.kind<>'DERIVED' OR d.validity<>'REVIEW_REQUIRED'
  OR d.presentation<>'BLOCK' OR d.use_status<>'BLOCK'
 THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;
 SELECT revision INTO state_revision FROM pg06_events.child_state
 WHERE child_id=p_child FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;
 IF state_revision<>p_expected_revision THEN
  RAISE EXCEPTION 'stale review revision' USING ERRCODE='PT409'; END IF;
 SELECT * INTO h FROM pg06_n11.holds WHERE derived_id=p_derived AND child_id=p_child;
 IF NOT FOUND OR h.review_id IS NOT NULL
 THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg06_n11.review_authorities a
   WHERE a.reviewer_id=actor AND a.child_id=p_child AND
         a.derived_id=p_derived AND a.purpose=p_purpose AND a.verified)
 THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;
 SELECT * INTO evidence FROM pg06_n11.verified_evidence e WHERE e.evidence_id=p_evidence;
 IF NOT FOUND OR NOT evidence.verified OR evidence.expires_at<=clock_timestamp()
  OR evidence.reviewer_id<>actor OR evidence.child_id<>p_child
  OR evidence.derived_id<>p_derived OR evidence.purpose<>p_purpose
  OR evidence.bound_block_revision<>h.blocked_revision
  OR length(evidence.verification_reference)<6
 THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;

 current_snapshot:=pg06_n11.source_snapshot(p_derived);
 IF current_snapshot='[]'::jsonb OR current_snapshot<>p_versions
   OR evidence.source_snapshot<>current_snapshot
 THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;
 -- No previously blocked intermediate synthesis may be silently re-enabled
 -- by revalidating a downstream synthesis alone.
 IF EXISTS (
  WITH RECURSIVE deps(id) AS (
   SELECT e.input_id FROM pg06_events.edges e WHERE e.derived_id=p_derived
   UNION
   SELECT e.input_id FROM pg06_events.edges e JOIN deps a ON e.derived_id=a.id
  )
  SELECT 1 FROM deps JOIN pg06_events.nodes n ON n.id=deps.id
  WHERE n.child_id<>p_child OR
    (n.kind='DERIVED' AND
      (n.validity<>'CURRENT' OR n.presentation<>'ALLOW' OR n.use_status<>'ALLOW'))
 ) THEN RAISE EXCEPTION 'review unavailable' USING ERRCODE='42501'; END IF;

 UPDATE pg06_events.child_state SET revision=state_revision+1 WHERE child_id=p_child;
 UPDATE pg06_events.nodes SET validity='CURRENT',presentation='ALLOW',use_status='ALLOW'
 WHERE id=p_derived AND child_id=p_child AND kind='DERIVED';
 UPDATE pg06_n11.holds SET review_id=p_review,reinstated_revision=state_revision+1
 WHERE derived_id=p_derived AND child_id=p_child;
 INSERT INTO pg06_n11.reviews(review_id,child_id,derived_id,actor_id,evidence_id,
   purpose,reason,source_snapshot,blocked_revision,requested_revision,revision)
 VALUES(p_review,p_child,p_derived,actor,p_evidence,p_purpose,p_reason,
        current_snapshot,h.blocked_revision,p_expected_revision,state_revision+1);
 RETURN state_revision+1;
END $fn$;
REVOKE ALL ON FUNCTION public.pg06_n11_revalidate(uuid,uuid,uuid,text,integer,jsonb,text,uuid)
 FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.pg06_n11_revalidate(uuid,uuid,uuid,text,integer,jsonb,text,uuid)
 TO authenticated;
COMMIT;
