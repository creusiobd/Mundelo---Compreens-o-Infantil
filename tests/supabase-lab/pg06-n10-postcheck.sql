-- PG06-N10: assert committed database state only; never print synthetic contents.
SELECT pg_catalog.set_config('pg06.n10.expected_guardian', :'guardian', false);
DO $tag$
DECLARE guardian uuid := pg_catalog.current_setting('pg06.n10.expected_guardian')::uuid;
BEGIN
 IF (SELECT revision FROM pg06_events.child_state
     WHERE child_id='11111111-1111-4111-8111-111111111111')<>6 THEN
  RAISE EXCEPTION 'Incorrect monotonic child revision'; END IF;
 IF (SELECT count(*) FROM pg06_events.events
     WHERE child_id='11111111-1111-4111-8111-111111111111')<>6 THEN
  RAISE EXCEPTION 'Expected exactly one row per logical event'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_events.events WHERE actor_id<>guardian) THEN
  RAISE EXCEPTION 'Event actor must be derived from authenticated JWT'; END IF;
 IF (SELECT count(*) FROM pg06_events.nodes WHERE kind='DERIVED'
     AND child_id='11111111-1111-4111-8111-111111111111'
     AND presentation='BLOCK' AND use_status='BLOCK'
     AND validity='REVIEW_REQUIRED' AND retention='REVIEW_REQUIRED')<>7 THEN
  RAISE EXCEPTION 'Not all descendant derivatives entered quarantine'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_events.nodes
     WHERE child_id='22222222-2222-4222-8222-222222222222'
     AND (presentation<>'ALLOW' OR use_status<>'ALLOW')) THEN
  RAISE EXCEPTION 'Cross-child effects escaped isolation'; END IF;
 IF EXISTS(SELECT 1 FROM pg06_events.grants
     WHERE derived_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4' AND active) THEN
  RAISE EXCEPTION 'Revoke event failed to persist disabled grants'; END IF;
 IF (SELECT body FROM pg06_events.nodes
     WHERE id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2') <> 'SYNTH-CONTEST-SOURCE' THEN
  RAISE EXCEPTION 'Contestation rewrote source instead of preserving its history'; END IF;
END $tag$;
SELECT 'PASS: committed revisions, event provenance, quarantine, revocation and cross-child isolation' AS verification;
