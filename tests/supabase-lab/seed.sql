-- PG06-N06 seed, only local authenticated fictitious UUIDs passed by CI.
begin;
insert into pg06_lab.authorities(actor_id,child_id,authority,category,purpose,verified) values
 (:'guardian'::uuid,'11111111-1111-4111-8111-111111111111'::uuid,'CONTRIBUTE','OBSERVATION','authoring',true),
 (:'guardian'::uuid,'11111111-1111-4111-8111-111111111111'::uuid,'GRANT','OBSERVATION','care',true),
 (:'guardian'::uuid,'11111111-1111-4111-8111-111111111111'::uuid,'REVOKE','OBSERVATION','care',true),
 (:'family_b'::uuid,'22222222-2222-4222-8222-222222222222'::uuid,'CONTRIBUTE','OBSERVATION','authoring',true),
 (:'professional'::uuid,'11111111-1111-4111-8111-111111111111'::uuid,'CONTRIBUTE','INTERPRETATION','authoring',true);
commit;
notify pgrst,'reload schema';
