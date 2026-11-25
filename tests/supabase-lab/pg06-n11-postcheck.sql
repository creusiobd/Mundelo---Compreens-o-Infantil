-- Independent private DB proof after authenticated PG06-N11 HTTP tests.
SELECT pg_catalog.set_config('pg06.n11.expected_reviewer', :'guardian', false);
DO $tag$
DECLARE reviewer uuid:=pg_catalog.current_setting('pg06.n11.expected_reviewer')::uuid;
 reviews_total integer; state_rev integer;
BEGIN
 SELECT COUNT(*) INTO reviews_total FROM pg06_n11.reviews;
 SELECT revision INTO state_rev FROM pg06_events.child_state
 WHERE child_id='11111111-1111-4111-8111-111111111111';
 IF reviews_total NOT IN (4,5) OR state_rev<>9+reviews_total
 THEN RAISE EXCEPTION 'incorrect committed checkpoint vs event revisions'; END IF;
 IF (SELECT COUNT(*) FROM pg06_events.events WHERE
   child_id='11111111-1111-4111-8111-111111111111')<>9
 THEN RAISE EXCEPTION 'event was lost or duplicated'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_n11.reviews WHERE actor_id<>reviewer OR
  reason IS NULL OR length(reason)<20 OR
  source_snapshot='[]'::jsonb OR blocked_revision<1)
 THEN RAISE EXCEPTION 'review provenance or justification invalid'; END IF;
 IF (SELECT MAX(version) FROM pg06_n11.source_versions
    WHERE source_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1')<>3
 OR (SELECT MAX(version) FROM pg06_n11.source_versions
    WHERE source_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa7')<>3
 OR (SELECT MAX(version) FROM pg06_n11.source_versions
    WHERE source_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2')<>2
 THEN RAISE EXCEPTION 'append-only revision markers missing'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_events.nodes
 WHERE id IN (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb7')
 AND (presentation<>'BLOCK' OR use_status<>'BLOCK' OR validity<>'REVIEW_REQUIRED'))
 THEN RAISE EXCEPTION 'previously approved derivative was released after reblock'; END IF;
 IF (SELECT presentation FROM pg06_events.nodes
   WHERE id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4')<>'ALLOW'
 OR EXISTS(SELECT 1 FROM pg06_events.grants WHERE
   derived_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4' AND active)
 THEN RAISE EXCEPTION 'checkpoint resurrected revoked grant'; END IF;
 IF (SELECT retention FROM pg06_events.nodes
   WHERE id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4')<>'REVIEW_REQUIRED'
 THEN RAISE EXCEPTION 'retention was incorrectly auto-approved'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_events.nodes
   WHERE child_id='22222222-2222-4222-8222-222222222222'
   AND (presentation<>'ALLOW' OR use_status<>'ALLOW'))
 THEN RAISE EXCEPTION 'cross-child isolation broken'; END IF;
 IF (SELECT body FROM pg06_events.nodes
   WHERE id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2')<>'SYNTH-CONTEST-SOURCE'
 THEN RAISE EXCEPTION 'contestation overwrote the original'; END IF;
END $tag$;
SELECT 'PASS: review evidence, checkpoint CAS, reblock, grant isolation and retained history confirmed' AS result;
