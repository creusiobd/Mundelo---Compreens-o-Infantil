
-- PG06-N05: isolated PostgreSQL laboratory, synthetic fixtures ONLY.
-- Lab-only credentials; database recreated for each CI run, never deploy.
-- NOT a production migration, Supabase schema, or authorization rollout.
BEGIN;
CREATE ROLE mundelo_lab_family_a LOGIN;
CREATE ROLE mundelo_lab_family_b LOGIN;
CREATE ROLE mundelo_lab_professional_a LOGIN;
CREATE ROLE mundelo_lab_outsider LOGIN;
CREATE SCHEMA mundelo_lab;
REVOKE ALL ON SCHEMA mundelo_lab FROM PUBLIC;
CREATE TABLE mundelo_lab.principal (
  db_role name PRIMARY KEY, subject_id text NOT NULL UNIQUE, active boolean NOT NULL
);
CREATE TABLE mundelo_lab.contribution (
  id text NOT NULL, version integer NOT NULL CHECK (version > 0),
  child_id text NOT NULL, category text NOT NULL CHECK (category IN ('OBSERVATION','INTERPRETATION','CONTEXT','RELATION')),
  body text NOT NULL, PRIMARY KEY(id,version)
);
CREATE TABLE mundelo_lab.access_grant (
  id text PRIMARY KEY, child_id text NOT NULL, subject_id text NOT NULL,
  source_id text NOT NULL, source_version integer NOT NULL,
  category text NOT NULL, purpose text NOT NULL, operation text NOT NULL,
  approved_authority boolean NOT NULL DEFAULT false,
  revoked boolean NOT NULL DEFAULT false,
  policy_revision integer NOT NULL CHECK (policy_revision > 0),
  restriction_revision integer NOT NULL CHECK (restriction_revision > 0),
  valid_from timestamptz NOT NULL, valid_until timestamptz NOT NULL,
  CHECK (valid_until > valid_from),
  CHECK (operation IN ('READ','USE','PREPARE','SHARE','EXPORT')),
  FOREIGN KEY(source_id,source_version) REFERENCES mundelo_lab.contribution(id,version)
);
CREATE TABLE mundelo_lab.policy_state (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  policy_revision integer NOT NULL, restriction_revision integer NOT NULL
);
INSERT INTO mundelo_lab.policy_state VALUES(true,1,1);
INSERT INTO mundelo_lab.principal VALUES
  ('mundelo_lab_family_a','family-a',true),
  ('mundelo_lab_family_b','family-b',true),
  ('mundelo_lab_professional_a','professional-a',true),
  ('mundelo_lab_outsider','outsider',true);
INSERT INTO mundelo_lab.contribution VALUES
 ('p-a',1,'child-a','OBSERVATION','SYNTHETIC A version 1'),
 ('p-a',2,'child-a','OBSERVATION','SYNTHETIC A version 2'),
 ('p-b',1,'child-a','INTERPRETATION','SYNTHETIC B interpretation'),
 ('p-c',1,'child-b','OBSERVATION','SYNTHETIC other child');
INSERT INTO mundelo_lab.access_grant
(id,child_id,subject_id,source_id,source_version,category,purpose,operation,
 approved_authority,revoked,policy_revision,restriction_revision,valid_from,valid_until)
VALUES
 ('g-a','child-a','family-a','p-a',1,'OBSERVATION','care','READ',true,false,1,1,'2026-01-01','2027-01-01'),
 ('g-b','child-a','family-b','p-b',1,'INTERPRETATION','care','READ',true,false,1,1,'2026-01-01','2027-01-01'),
 ('g-prof','child-a','professional-a','p-a',1,'OBSERVATION','follow-up','READ',true,false,1,1,'2026-01-01','2027-01-01'),
 ('g-outside','child-b','outsider','p-c',1,'OBSERVATION','care','READ',true,false,1,1,'2026-01-01','2027-01-01');
-- Privileged ownership stays with fixture administrator. Never grant mutating rights to readers.
CREATE FUNCTION mundelo_lab.can_read(
 p_child text,p_id text,p_version integer,p_category text
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, mundelo_lab, pg_temp
AS $fn$
 SELECT EXISTS (
   SELECT 1 FROM mundelo_lab.principal p
   JOIN mundelo_lab.access_grant g ON g.subject_id=p.subject_id
   CROSS JOIN mundelo_lab.policy_state ps
   WHERE p.db_role = session_user AND p.active
     AND g.subject_id=p.subject_id AND g.child_id=p_child
     AND g.source_id=p_id AND g.source_version=p_version
     AND g.category=p_category AND g.operation='READ'
     AND g.purpose=current_setting('mundelo_lab.purpose',true)
     AND g.approved_authority AND NOT g.revoked
     AND g.policy_revision=ps.policy_revision
     AND g.restriction_revision=ps.restriction_revision
     AND ps.singleton AND now()>=g.valid_from AND now()<g.valid_until
 )
$fn$;
REVOKE ALL ON FUNCTION mundelo_lab.can_read(text,text,integer,text) FROM PUBLIC;
ALTER TABLE mundelo_lab.contribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE mundelo_lab.contribution FORCE ROW LEVEL SECURITY;
CREATE POLICY only_verified_scoped_reader ON mundelo_lab.contribution
 FOR SELECT TO mundelo_lab_family_a,mundelo_lab_family_b,mundelo_lab_professional_a,mundelo_lab_outsider
 USING (mundelo_lab.can_read(child_id,id,version,category));
GRANT USAGE ON SCHEMA mundelo_lab TO
  mundelo_lab_family_a,mundelo_lab_family_b,mundelo_lab_professional_a,mundelo_lab_outsider;
GRANT SELECT ON mundelo_lab.contribution TO
  mundelo_lab_family_a,mundelo_lab_family_b,mundelo_lab_professional_a,mundelo_lab_outsider;
GRANT EXECUTE ON FUNCTION mundelo_lab.can_read(text,text,integer,text) TO
  mundelo_lab_family_a,mundelo_lab_family_b,mundelo_lab_professional_a,mundelo_lab_outsider;
COMMIT;
