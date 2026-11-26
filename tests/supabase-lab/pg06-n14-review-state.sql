-- PG06-N14. Disposable local Supabase only. Never migrate to hosted DB.
-- Read-only reviewer snapshot with the SAME per-child advisory transaction lock
-- used by PG06-N10 event writes, N11 checkpoints, N12 human decisions.
BEGIN;
CREATE FUNCTION public.pg06_n14_review_state(
 p_child uuid,p_derived uuid,p_purpose text DEFAULT 'care'
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE reviewer uuid; n pg06_events.nodes%rowtype;
 h pg06_n11.holds%rowtype; revision integer;
 evidence uuid; perspectives jsonb; decisions jsonb;
 versions jsonb; decision_type text;
BEGIN
 reviewer:=auth.uid();
 IF reviewer IS NULL OR p_child IS NULL OR p_derived IS NULL OR
    p_purpose IS NULL OR length(p_purpose) NOT BETWEEN 1 AND 100
 THEN RAISE EXCEPTION 'review state unavailable' USING ERRCODE='42501'; END IF;
 -- Reject unauthorized caller before exposing graph metadata or case existence.
 IF NOT EXISTS(SELECT 1 FROM pg06_n12.authorities a
   WHERE a.reviewer_id=reviewer AND a.child_id=p_child AND
    a.derived_id=p_derived AND a.purpose=p_purpose AND a.verified)
 THEN RAISE EXCEPTION 'review state unavailable' USING ERRCODE='42501'; END IF;

 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_child::text,93010));
 SELECT * INTO n FROM pg06_events.nodes
  WHERE id=p_derived AND child_id=p_child AND kind='DERIVED';
 SELECT * INTO h FROM pg06_n11.holds
  WHERE derived_id=p_derived AND child_id=p_child;
 SELECT s.revision INTO revision FROM pg06_events.child_state s
  WHERE s.child_id=p_child;
 IF NOT FOUND OR n.id IS NULL OR h.derived_id IS NULL
 THEN RAISE EXCEPTION 'review state unavailable' USING ERRCODE='42501'; END IF;

 versions:=pg06_n11.source_snapshot(p_derived);
 SELECT e.evidence_id INTO evidence FROM pg06_n11.verified_evidence e
  WHERE e.reviewer_id=reviewer AND e.child_id=p_child AND
   e.derived_id=p_derived AND e.purpose=p_purpose AND e.verified AND
   e.expires_at>clock_timestamp() AND
   e.bound_block_revision=h.blocked_revision AND
   e.source_snapshot=versions
  ORDER BY e.expires_at DESC,e.evidence_id
  LIMIT 1;

 SELECT COALESCE(pg_catalog.jsonb_agg(
  pg_catalog.jsonb_build_object(
   'id',p.id::text,'authorId',p.author_id::text,
   'provenance',p.provenance,'statement',p.statement
  ) ORDER BY p.id::text
 ),'[]'::jsonb) INTO perspectives
 FROM pg06_n12.perspectives p
 WHERE p.child_id=p_child AND p.derived_id=p_derived;

 SELECT COALESCE(pg_catalog.jsonb_agg(
  pg_catalog.jsonb_build_object(
   'id',d.decision_id::text,'authorId',d.actor_id::text,
   'outcome',d.outcome,'reason',d.reason,
   'request',d.requested_information,
   'revision',d.committed_revision,
   'perspectives',d.perspectives
  ) ORDER BY d.committed_revision
 ),'[]'::jsonb) INTO decisions
 FROM pg06_n12.decisions d
 WHERE d.child_id=p_child AND d.derived_id=p_derived AND d.purpose=p_purpose;

 SELECT d.outcome INTO decision_type FROM pg06_n12.decisions d
  WHERE d.child_id=p_child AND d.derived_id=p_derived AND d.purpose=p_purpose
   AND d.committed_revision>h.blocked_revision
  ORDER BY d.committed_revision DESC LIMIT 1;

 RETURN pg_catalog.jsonb_build_object(
  'childId',p_child::text,'derivedId',p_derived::text,'purpose',p_purpose,
  'revision',revision,'sourceVersions',versions,
  'evidenceId',evidence::text,'perspectives',perspectives,
  'history',decisions,
  'status',CASE
    WHEN n.presentation='ALLOW' AND n.use_status='ALLOW'
        AND n.validity='CURRENT' AND h.review_id IS NOT NULL THEN 'REVIEWED'
    WHEN decision_type='REQUEST_COMPLEMENT' THEN 'COMPLEMENT_REQUESTED'
    ELSE 'BLOCKED'
   END,
  'retentionPending',n.retention='REVIEW_REQUIRED'
 );
END $fn$;
REVOKE ALL ON FUNCTION public.pg06_n14_review_state(uuid,uuid,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.pg06_n14_review_state(uuid,uuid,text) TO authenticated;

-- Every N12 review must explicitly consider ALL perspectives associated with
-- the derivative, never a client-chosen subset that excludes dissent.
CREATE FUNCTION pg06_n12.require_complete_perspectives() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE expected_count integer;
BEGIN
 SELECT count(*) INTO expected_count
 FROM pg06_n12.perspectives p
 WHERE p.child_id=NEW.child_id AND p.derived_id=NEW.derived_id;
 IF expected_count=0 OR pg_catalog.jsonb_array_length(NEW.perspectives)<>expected_count
 THEN RAISE EXCEPTION 'incomplete review perspectives' USING ERRCODE='42501'; END IF;
 RETURN NEW;
END $fn$;
REVOKE ALL ON FUNCTION pg06_n12.require_complete_perspectives() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER pg06_n14_all_perspectives
 BEFORE INSERT ON pg06_n12.decisions
 FOR EACH ROW EXECUTE FUNCTION pg06_n12.require_complete_perspectives();
COMMIT;
