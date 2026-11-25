-- PG06-N12 independent committed SQL audit; no personal data.
SELECT pg_catalog.set_config('pg06.n12.expected_reviewer', :'guardian', false);
DO $audit$
DECLARE reviewer uuid:=pg_catalog.current_setting('pg06.n12.expected_reviewer')::uuid;
BEGIN
 IF (SELECT revision FROM pg06_events.child_state
   WHERE child_id='11111111-1111-4111-8111-111111111111')<>15
 THEN RAISE EXCEPTION 'Unexpected final child revision'; END IF;
 IF (SELECT COUNT(*) FROM pg06_n12.decisions)<>7
 THEN RAISE EXCEPTION 'Human review replay or race created wrong event count'; END IF;
 IF (SELECT COUNT(*) FROM pg06_n12.decisions WHERE outcome='REQUEST_COMPLEMENT')<>1 OR
    (SELECT COUNT(*) FROM pg06_n12.decisions WHERE outcome='KEEP_BLOCKED')
       NOT IN (1,2) OR
    (SELECT COUNT(*) FROM pg06_n12.decisions WHERE outcome='APPROVE')
       NOT IN (4,5)
 THEN RAISE EXCEPTION 'Review choices were not persisted independently'; END IF;
 IF (SELECT COUNT(*) FROM pg06_n12.decisions WHERE outcome='APPROVE')+
    (SELECT COUNT(*) FROM pg06_n12.decisions WHERE outcome='KEEP_BLOCKED')<>6
 THEN RAISE EXCEPTION 'Opposing race did not result in exactly one outcome'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_n12.decisions
   WHERE actor_id<>reviewer OR length(reason)<20 OR
    jsonb_array_length(source_versions)<>1 OR
    jsonb_array_length(perspectives)<>2 OR
    evidence_id IS NULL OR committed_revision<>expected_revision+1)
 THEN RAISE EXCEPTION 'Decision provenance/versions/evidence invalid'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_n12.decisions d
   JOIN LATERAL jsonb_array_elements(d.perspectives) AS p(item) ON true
   WHERE p.item->>'author' IS NULL OR p.item->>'provenance' IS NULL)
 THEN RAISE EXCEPTION 'Independent perspective attribution lost'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_n12.decisions d
  WHERE (SELECT COUNT(DISTINCT p.item->>'author')
         FROM jsonb_array_elements(d.perspectives) AS p(item))<>2)
 THEN RAISE EXCEPTION 'Distinct adult perspectives were flattened'; END IF;
 IF (SELECT COUNT(*) FROM pg06_events.events
  WHERE child_id='11111111-1111-4111-8111-111111111111')<>8
 THEN RAISE EXCEPTION 'Source changes overwritten or omitted'; END IF;
 IF (SELECT COUNT(*) FROM pg06_events.nodes
  WHERE id IN ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
               'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
               'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb7')
  AND presentation='BLOCK' AND use_status='BLOCK' AND validity='REVIEW_REQUIRED')<>3
 THEN RAISE EXCEPTION 'Revalidation improperly survived later source change'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_events.grants
   WHERE derived_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4' AND active)
 THEN RAISE EXCEPTION 'A human decision restored revoked access'; END IF;
 IF (SELECT retention FROM pg06_events.nodes
   WHERE id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4')<>'REVIEW_REQUIRED'
 THEN RAISE EXCEPTION 'Human decision silently approved retention'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_events.nodes
   WHERE child_id='22222222-2222-4222-8222-222222222222'
   AND (presentation<>'ALLOW' OR use_status<>'ALLOW'))
 THEN RAISE EXCEPTION 'Human reviews leaked across children'; END IF;
 IF (SELECT body FROM pg06_events.nodes WHERE
    id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2')<>'SYNTH-CONTEST-SOURCE'
 THEN RAISE EXCEPTION 'Contested adult record was overwritten'; END IF;
END $audit$;
SELECT 'PASS: human outcomes, evidence, attributed perspectives, CAS, grants and re-block confirmed' AS result;
