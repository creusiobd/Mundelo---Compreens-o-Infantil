-- Administrative synthetic review fixtures, installed only after PG06-N10 HTTP events.
-- They are not legal approvals, signed human documents, or client submissions.
BEGIN;
INSERT INTO pg06_n11.review_authorities(reviewer_id,child_id,derived_id,purpose,verified)
SELECT :'guardian'::uuid,n.child_id,n.id,'care',true
FROM pg06_events.nodes n
WHERE n.kind='DERIVED' AND n.child_id='11111111-1111-4111-8111-111111111111'::uuid;
-- Explicit stable opaque synthetic evidence IDs, not source-derived tokens.
INSERT INTO pg06_n11.verified_evidence(
 evidence_id,reviewer_id,child_id,derived_id,purpose,
 bound_block_revision,source_snapshot,verification_reference,verified,expires_at)
SELECT ('10000000-0000-4000-8000-00000000000'||right(n.id::text,1))::uuid,
 :'guardian'::uuid,n.child_id,n.id,'care',h.blocked_revision,
 pg06_n11.source_snapshot(n.id),'synthetic-external-review-fixture',true,
 now()+interval '1 day'
FROM pg06_events.nodes n JOIN pg06_n11.holds h ON h.derived_id=n.id
WHERE n.child_id='11111111-1111-4111-8111-111111111111'::uuid
 AND n.kind='DERIVED';
COMMIT;
