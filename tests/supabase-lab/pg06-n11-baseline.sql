-- Synthetic baseline MUST precede all PG06-N10 events.
INSERT INTO pg06_n11.source_versions(source_id,child_id,version)
SELECT id,child_id,version FROM pg06_events.nodes WHERE kind='SOURCE';
DO $tag$
BEGIN
 IF (SELECT count(*) FROM pg06_n11.source_versions)<>7
 THEN RAISE EXCEPTION 'synthetic source baseline incomplete'; END IF;
END $tag$;
