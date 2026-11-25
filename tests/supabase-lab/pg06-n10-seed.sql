-- PG06-N10: all rows are fabricated fixture data; never hosted.
BEGIN;
INSERT INTO pg06_events.child_state (child_id,revision) VALUES
 ('11111111-1111-4111-8111-111111111111',0),
 ('22222222-2222-4222-8222-222222222222',0);
INSERT INTO pg06_events.authorities(actor_id,child_id,action,verified) VALUES
 (:'guardian'::uuid,'11111111-1111-4111-8111-111111111111','SOURCE_REVISED',true),
 (:'guardian'::uuid,'11111111-1111-4111-8111-111111111111','INTERPRETATION_CONTESTED',true),
 (:'guardian'::uuid,'11111111-1111-4111-8111-111111111111','ACCESS_REVOKED',true);
INSERT INTO pg06_events.nodes (id,child_id,version,kind,body) VALUES
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1','11111111-1111-4111-8111-111111111111',1,'SOURCE','SYNTH-CORRECTION-SOURCE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1','11111111-1111-4111-8111-111111111111',1,'DERIVED','SYNTH-CORRECTION-DERIVED'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2','11111111-1111-4111-8111-111111111111',1,'DERIVED','SYNTH-DOWNSTREAM-REPORT'),
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2','11111111-1111-4111-8111-111111111111',1,'SOURCE','SYNTH-CONTEST-SOURCE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3','11111111-1111-4111-8111-111111111111',1,'DERIVED','SYNTH-CONTEST-DERIVED'),
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3','11111111-1111-4111-8111-111111111111',1,'SOURCE','SYNTH-REVOKE-SOURCE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4','11111111-1111-4111-8111-111111111111',1,'DERIVED','SYNTH-REVOKE-DERIVED'),
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4','11111111-1111-4111-8111-111111111111',1,'SOURCE','SYNTH-RACE-SOURCE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5','11111111-1111-4111-8111-111111111111',1,'DERIVED','SYNTH-RACE-DERIVED'),
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa7','11111111-1111-4111-8111-111111111111',1,'SOURCE','SYNTH-READ-RACE-SOURCE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb7','11111111-1111-4111-8111-111111111111',1,'DERIVED','SYNTH-READ-RACE-DERIVED'),
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa8','11111111-1111-4111-8111-111111111111',1,'SOURCE','SYNTH-SHARE-RACE-SOURCE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb8','11111111-1111-4111-8111-111111111111',1,'DERIVED','SYNTH-SHARE-RACE-DERIVED'),
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5','22222222-2222-4222-8222-222222222222',1,'SOURCE','SYNTH-OTHER-CHILD-SOURCE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb6','22222222-2222-4222-8222-222222222222',1,'DERIVED','SYNTH-OTHER-CHILD-DERIVED');
INSERT INTO pg06_events.edges (child_id,derived_id,input_id) VALUES
 ('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
 ('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'),
 ('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2'),
 ('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3'),
 ('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4'),
 ('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb7','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa7'),
 ('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb8','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa8'),
 ('22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb6','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5');
INSERT INTO pg06_events.grants(child_id,derived_id,recipient_id,purpose,operation)
SELECT n.child_id,n.id,:'professional'::uuid,'care',ops.operation
FROM pg06_events.nodes n
CROSS JOIN (VALUES ('READ'),('SHARE'),('EXPORT')) AS ops(operation)
WHERE n.kind='DERIVED' AND n.child_id='11111111-1111-4111-8111-111111111111'::uuid;
INSERT INTO pg06_events.grants(child_id,derived_id,recipient_id,purpose,operation)
SELECT n.child_id,n.id,:'family_b'::uuid,'care',ops.operation
FROM pg06_events.nodes n
CROSS JOIN (VALUES ('READ'),('SHARE'),('EXPORT')) AS ops(operation)
WHERE n.id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb6'::uuid;
COMMIT;
NOTIFY pgrst,'reload schema';
