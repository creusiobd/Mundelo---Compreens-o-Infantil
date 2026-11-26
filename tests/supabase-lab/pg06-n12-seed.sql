-- PG06-N12: two attributed, independent synthetic perspectives per derivative.
-- Authority fixture intentionally does NOT certify legal guardianship.
BEGIN;
INSERT INTO pg06_n12.authorities(reviewer_id,child_id,derived_id,purpose,decision,verified)
SELECT :'guardian'::uuid,n.child_id,n.id,'care',o.value,true
FROM pg06_events.nodes n
CROSS JOIN (VALUES ('APPROVE'),('REQUEST_COMPLEMENT'),('KEEP_BLOCKED')) AS o(value)
JOIN pg06_n11.holds h ON h.derived_id=n.id
WHERE n.child_id='11111111-1111-4111-8111-111111111111'::uuid
  AND n.kind='DERIVED';
INSERT INTO pg06_n12.perspectives(id,child_id,derived_id,author_id,provenance,statement)
SELECT ('20000000-0000-4000-8000-00000000000'||right(n.id::text,1))::uuid,
 n.child_id,n.id,:'guardian'::uuid,'DIRECT_OBSERVATION',
 'Synthetic original observer statement, never automatically a definitive interpretation'
FROM pg06_events.nodes n
JOIN pg06_n11.holds h ON h.derived_id=n.id
WHERE n.child_id='11111111-1111-4111-8111-111111111111'::uuid
AND n.kind='DERIVED';
INSERT INTO pg06_n12.perspectives(id,child_id,derived_id,author_id,provenance,statement)
SELECT ('20000000-0000-4000-8000-00000000001'||right(n.id::text,1))::uuid,
 n.child_id,n.id,:'professional'::uuid,'INTERPRETATION',
 'Synthetic independent professional perspective, attributed without claiming objective truth'
FROM pg06_events.nodes n
JOIN pg06_n11.holds h ON h.derived_id=n.id
WHERE n.child_id='11111111-1111-4111-8111-111111111111'::uuid
AND n.kind='DERIVED';
COMMIT;
