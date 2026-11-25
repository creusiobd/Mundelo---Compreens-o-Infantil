-- PG06-N12: SYNTHETIC ONLY, disposable local Supabase. Never deploy.
-- Runs AFTER PG06-N10 and PG06-N11 schemas. No hosted connection/migration.
BEGIN;
CREATE SCHEMA pg06_n12;
REVOKE ALL ON SCHEMA pg06_n12 FROM PUBLIC, anon, authenticated;

CREATE TABLE pg06_n12.perspectives(
 id uuid PRIMARY KEY,
 child_id uuid NOT NULL,
 derived_id uuid NOT NULL REFERENCES pg06_events.nodes(id),
 author_id uuid NOT NULL,
 provenance text NOT NULL CHECK(provenance IN ('DIRECT_OBSERVATION','REPORTED','INTERPRETATION')),
 statement text NOT NULL,
 recorded_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE TABLE pg06_n12.authorities(
 reviewer_id uuid NOT NULL,
 child_id uuid NOT NULL,
 derived_id uuid NOT NULL REFERENCES pg06_events.nodes(id),
 purpose text NOT NULL,
 decision text NOT NULL CHECK(decision IN ('APPROVE','REQUEST_COMPLEMENT','KEEP_BLOCKED')),
 verified boolean NOT NULL DEFAULT false,
 PRIMARY KEY(reviewer_id,child_id,derived_id,purpose,decision)
);
CREATE TABLE pg06_n12.decisions(
 decision_id uuid PRIMARY KEY,
 child_id uuid NOT NULL,
 derived_id uuid NOT NULL REFERENCES pg06_events.nodes(id),
 actor_id uuid NOT NULL,
 purpose text NOT NULL,
 outcome text NOT NULL CHECK(outcome IN ('APPROVE','REQUEST_COMPLEMENT','KEEP_BLOCKED')),
 expected_revision integer NOT NULL,
 committed_revision integer NOT NULL,
 evidence_id uuid NOT NULL REFERENCES pg06_n11.verified_evidence(evidence_id),
 source_versions jsonb NOT NULL,
 perspectives jsonb NOT NULL,
 reason text NOT NULL CHECK(length(btrim(reason)) BETWEEN 20 AND 500),
 requested_information text,
 recorded_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 UNIQUE(child_id,committed_revision)
);
CREATE INDEX ON pg06_n12.decisions(child_id,derived_id,committed_revision);
-- Defense in depth, schema is unexposed, no direct user privileges.
ALTER TABLE pg06_n12.perspectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_n12.perspectives FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_n12.authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_n12.authorities FORCE ROW LEVEL SECURITY;
ALTER TABLE pg06_n12.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg06_n12.decisions FORCE ROW LEVEL SECURITY;

-- Close the old revalidation bypass; from now on, human decision is required.
REVOKE EXECUTE ON FUNCTION public.pg06_n11_revalidate(
 uuid,uuid,uuid,text,integer,jsonb,text,uuid) FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.pg06_n12_decide(
 p_decision uuid, p_child uuid, p_derived uuid, p_outcome text,
 p_expected_revision integer, p_versions jsonb, p_reason text,
 p_evidence uuid, p_perspective_ids uuid[], p_request text DEFAULT NULL,
 p_purpose text DEFAULT 'care'
) RETURNS integer
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE actor uuid; d pg06_events.nodes%rowtype;
 old pg06_n12.decisions%rowtype; ev pg06_n11.verified_evidence%rowtype;
 hold pg06_n11.holds%rowtype; state_revision integer; new_revision integer;
 perspectives_json jsonb; current_versions jsonb;
BEGIN
 actor:=auth.uid();
 IF actor IS NULL OR p_decision IS NULL OR p_child IS NULL OR p_derived IS NULL
   OR p_outcome IS NULL OR p_outcome NOT IN ('APPROVE','REQUEST_COMPLEMENT','KEEP_BLOCKED')
   OR p_expected_revision IS NULL OR p_evidence IS NULL
   OR p_reason IS NULL OR length(pg_catalog.btrim(p_reason)) NOT BETWEEN 20 AND 500
   OR p_versions IS NULL OR pg_catalog.jsonb_typeof(p_versions)<>'array'
   OR p_perspective_ids IS NULL OR pg_catalog.array_length(p_perspective_ids,1) IS NULL
   OR p_purpose IS NULL OR length(p_purpose) NOT BETWEEN 1 AND 100
   OR (p_outcome='REQUEST_COMPLEMENT' AND
       (p_request IS NULL OR length(pg_catalog.btrim(p_request)) NOT BETWEEN 15 AND 500))
   OR (p_outcome<>'REQUEST_COMPLEMENT' AND p_request IS NOT NULL)
 THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
 SELECT * INTO d FROM pg06_events.nodes n WHERE n.id=p_derived AND n.child_id=p_child;
 IF NOT FOUND OR d.kind<>'DERIVED'
 THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_child::text,93010));
 -- Build and compare canonically sorted exact perspectives, preserving the
 -- independent author and provenance instead of inventing one consensus.
 SELECT pg_catalog.jsonb_agg(
   pg_catalog.jsonb_build_object('id',p.id::text,
    'author',p.author_id::text,'provenance',p.provenance)
   ORDER BY p.id::text)
 INTO perspectives_json FROM pg06_n12.perspectives p
 WHERE p.id=ANY(p_perspective_ids) AND p.child_id=p_child AND p.derived_id=p_derived;
 IF perspectives_json IS NULL OR
   pg_catalog.jsonb_array_length(perspectives_json)<>pg_catalog.array_length(p_perspective_ids,1) OR
   (SELECT count(DISTINCT v) FROM pg_catalog.unnest(p_perspective_ids) AS v)
     <>pg_catalog.array_length(p_perspective_ids,1)
 THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
 -- Same ID and exactly same semantics = idempotency; mutation denied.
 SELECT * INTO old FROM pg06_n12.decisions WHERE decision_id=p_decision;
 IF FOUND THEN
  IF old.actor_id<>actor OR old.child_id<>p_child OR old.derived_id<>p_derived OR
    old.outcome<>p_outcome OR old.expected_revision<>p_expected_revision OR
    old.purpose<>p_purpose OR old.evidence_id<>p_evidence OR
    old.source_versions<>p_versions OR old.perspectives<>perspectives_json OR
    old.reason<>p_reason OR old.requested_information IS DISTINCT FROM p_request
  THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
  RETURN old.committed_revision;
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg06_n12.authorities a
   WHERE a.reviewer_id=actor AND a.child_id=p_child AND
     a.derived_id=p_derived AND a.purpose=p_purpose AND
     a.decision=p_outcome AND a.verified)
 THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
 SELECT revision INTO state_revision FROM pg06_events.child_state
 WHERE child_id=p_child FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
 IF state_revision<>p_expected_revision
 THEN RAISE EXCEPTION 'stale human decision' USING ERRCODE='PT409'; END IF;
 SELECT * INTO hold FROM pg06_n11.holds
 WHERE derived_id=p_derived AND child_id=p_child;
 IF NOT FOUND OR hold.review_id IS NOT NULL
 THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
 SELECT * INTO d FROM pg06_events.nodes WHERE id=p_derived AND child_id=p_child;
 IF NOT FOUND OR d.validity<>'REVIEW_REQUIRED' OR
  d.presentation<>'BLOCK' OR d.use_status<>'BLOCK'
 THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
 SELECT * INTO ev FROM pg06_n11.verified_evidence WHERE evidence_id=p_evidence;
 IF NOT FOUND OR NOT ev.verified OR ev.expires_at<=clock_timestamp()
  OR ev.reviewer_id<>actor OR ev.child_id<>p_child OR
   ev.derived_id<>p_derived OR ev.purpose<>p_purpose OR
   ev.bound_block_revision<>hold.blocked_revision
 THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
 current_versions:=pg06_n11.source_snapshot(p_derived);
 IF current_versions='[]'::jsonb OR current_versions<>p_versions OR
    ev.source_snapshot<>current_versions
 THEN RAISE EXCEPTION 'decision unavailable' USING ERRCODE='42501'; END IF;
 IF p_outcome='APPROVE' THEN
  -- Existing verified gate checks exact lineage and intermediate checkpoints.
  new_revision:=public.pg06_n11_revalidate(
   p_decision,p_child,p_derived,p_purpose,
   p_expected_revision,p_versions,p_reason,p_evidence);
 ELSE
  UPDATE pg06_events.child_state SET revision=state_revision+1 WHERE child_id=p_child;
  new_revision:=state_revision+1;
  -- Do NOT release the hold. No permission is granted or restored.
 END IF;
 INSERT INTO pg06_n12.decisions(
  decision_id,child_id,derived_id,actor_id,purpose,outcome,
  expected_revision,committed_revision,evidence_id,source_versions,
  perspectives,reason,requested_information)
 VALUES (p_decision,p_child,p_derived,actor,p_purpose,p_outcome,
   p_expected_revision,new_revision,p_evidence,current_versions,
   perspectives_json,p_reason,p_request);
 RETURN new_revision;
END $fn$;
REVOKE ALL ON FUNCTION public.pg06_n12_decide(
 uuid,uuid,uuid,text,integer,jsonb,text,uuid,uuid[],text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.pg06_n12_decide(
 uuid,uuid,uuid,text,integer,jsonb,text,uuid,uuid[],text,text) TO authenticated;
COMMIT;
