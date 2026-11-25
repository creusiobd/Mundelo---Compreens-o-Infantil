#!/usr/bin/env bash
set -euo pipefail
export PGHOST="${PGHOST:-127.0.0.1}" PGPORT="${PGPORT:-5432}" PGUSER="${PGUSER:-postgres}" PGDATABASE="${PGDATABASE:-postgres}"
SQL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
psql -X -q -v ON_ERROR_STOP=1 -f "$SQL_DIR/pg06-n05-fixtures.sql" >/dev/null
passed=0

query_as(){
  local role="$1" purpose="$2" sql="$3" password
  case "$role" in
    mundelo_lab_family_a) password="lab-family-a-password";;
    mundelo_lab_family_b) password="lab-family-b-password";;
    mundelo_lab_professional_a) password="lab-professional-a-password";;
    mundelo_lab_outsider) password="lab-outsider-password";;
    *) echo "Unknown synthetic lab principal" >&2; return 1;;
  esac
  PGPASSWORD="$password" psql -h "$PGHOST" -p "$PGPORT" -U "$role" -d "$PGDATABASE" -X -qAt -v ON_ERROR_STOP=1 -c "SET mundelo_lab.purpose='$purpose'; $sql"
}
check_count(){
  local name="$1" role="$2" purpose="$3" expected="$4"
  local actual
  actual="$(query_as "$role" "$purpose" "SELECT COUNT(*) FROM mundelo_lab.contribution;")"
  if [[ "$actual" != "$expected" ]]; then
    echo "FAIL: $name expected=$expected actual=$actual" >&2; exit 1
  fi
  passed=$((passed+1))
  echo "PASS: $name"
}
check_denied(){
  local name="$1" role="$2" sql="$3"
  if query_as "$role" care "$sql" >/dev/null 2>&1; then
    echo "FAIL: $name unexpected privileged effect" >&2; exit 1
  fi
  passed=$((passed+1)); echo "PASS: $name"
}
check_count "family A only own granted version" mundelo_lab_family_a care 1
check_count "family B only authored perspective" mundelo_lab_family_b care 1
check_count "professional only expressly scoped source" mundelo_lab_professional_a follow-up 1
check_count "outsider cannot read child A" mundelo_lab_outsider care 1
check_count "different purpose no grant" mundelo_lab_professional_a care 0
check_count "missing purpose denies" mundelo_lab_family_a unrelated 0
# Crucially a different child's record and another version remain invisible.
view="$(query_as mundelo_lab_family_a care "SELECT id || ':' || version || ':' || child_id FROM mundelo_lab.contribution;")"
[[ "$view" == "p-a:1:child-a" ]] || { echo "FAIL: source/version/child leak: $view"; exit 1; }
passed=$((passed+1)); echo "PASS: exact source/version/child isolation"
check_denied "cannot self-approve grant" mundelo_lab_family_a "UPDATE mundelo_lab.access_grant SET approved_authority=true WHERE id='g-a';"
check_denied "cannot create self-grant" mundelo_lab_family_a "INSERT INTO mundelo_lab.access_grant (id) VALUES ('forged');"
check_denied "cannot alter restricted perspective" mundelo_lab_family_a "UPDATE mundelo_lab.contribution SET body='forged' WHERE id='p-a';"
check_denied "cannot query grant metadata" mundelo_lab_family_a "SELECT * FROM mundelo_lab.access_grant;"
check_denied "cannot impersonate another login via SET ROLE" mundelo_lab_family_a "SET ROLE mundelo_lab_family_b;"
# The server has previously allowed the professional's read. Revoke in the admin connection.
psql -X -q -v ON_ERROR_STOP=1 -c "UPDATE mundelo_lab.access_grant SET revoked=true WHERE id='g-prof';" >/dev/null
check_count "revoked professional next SQL statement denied" mundelo_lab_professional_a follow-up 0
check_count "other family grant unaffected" mundelo_lab_family_a care 1
# Two independent DB sessions: professional starts an explicit READ COMMITTED transaction;
# administrator revokes during pg_sleep; the second SELECT must observe the commit.
psql -X -q -v ON_ERROR_STOP=1 -c "UPDATE mundelo_lab.access_grant SET revoked=false WHERE id='g-prof';" >/dev/null
result_file="$(mktemp)"
trap 'rm -f "$result_file"' EXIT
PGPASSWORD="lab-professional-a-password" psql -h "$PGHOST" -p "$PGPORT" -U mundelo_lab_professional_a -d "$PGDATABASE" -X -qAt -v ON_ERROR_STOP=1 \
 -c "BEGIN ISOLATION LEVEL READ COMMITTED; SET mundelo_lab.purpose='follow-up'; SELECT COUNT(*) FROM mundelo_lab.contribution; SELECT pg_sleep(5); SELECT COUNT(*) FROM mundelo_lab.contribution; COMMIT;" >"$result_file" &
reader_pid=$!
seen=0
for attempt in $(seq 1 35); do
  active="$(psql -X -qAt -v ON_ERROR_STOP=1 -c "SELECT COUNT(*) FROM pg_stat_activity WHERE usename='mundelo_lab_professional_a' AND state='active' AND query LIKE '%pg_sleep(5)%';")"
  if [[ "$active" == "1" ]]; then seen=1; break; fi
  sleep 0.1
done
if [[ "$seen" != "1" ]]; then
  wait "$reader_pid" || true
  echo "FAIL: failed to confirm active concurrent reader" >&2; exit 1
fi
psql -X -q -v ON_ERROR_STOP=1 -c "UPDATE mundelo_lab.access_grant SET revoked=true WHERE id='g-prof';" >/dev/null
wait "$reader_pid"
readings="$(grep -E '^[01]
psql -X -q -v ON_ERROR_STOP=1 -c "UPDATE mundelo_lab.policy_state SET policy_revision=2;" >/dev/null
check_count "stale policy invalidates grant" mundelo_lab_family_a care 0
psql -X -q -v ON_ERROR_STOP=1 -c "UPDATE mundelo_lab.access_grant SET policy_revision=2 WHERE id='g-a';" >/dev/null
check_count "explicit renewed policy restores allowed scope" mundelo_lab_family_a care 1
psql -X -q -v ON_ERROR_STOP=1 -c "UPDATE mundelo_lab.policy_state SET restriction_revision=2;" >/dev/null
check_count "restriction revision invalidates grant" mundelo_lab_family_a care 0
# Existing sessions must not be evaluated under REPEATABLE READ for mutable access grants:
# production will require server-enforced effect ordering / a transaction-level strategy.
echo "PG06-N05: $passed isolated PostgreSQL assertions passed."
 "$result_file" | paste -sd, -)"
if [[ "$readings" != "1,0" ]]; then
  echo "FAIL: expected read-committed transaction to observe revoke (1,0), got $readings" >&2; exit 1
fi
passed=$((passed+1)); echo "PASS: concurrent committed revocation visible in open READ COMMITTED transaction"
# Policy and restriction revision changes require revalidation of remaining grants.
psql -X -q -v ON_ERROR_STOP=1 -c "UPDATE mundelo_lab.policy_state SET policy_revision=2;" >/dev/null
check_count "stale policy invalidates grant" mundelo_lab_family_a care 0
psql -X -q -v ON_ERROR_STOP=1 -c "UPDATE mundelo_lab.access_grant SET policy_revision=2 WHERE id='g-a';" >/dev/null
check_count "explicit renewed policy restores allowed scope" mundelo_lab_family_a care 1
psql -X -q -v ON_ERROR_STOP=1 -c "UPDATE mundelo_lab.policy_state SET restriction_revision=2;" >/dev/null
check_count "restriction revision invalidates grant" mundelo_lab_family_a care 0
# Existing sessions must not be evaluated under REPEATABLE READ for mutable access grants:
# production will require server-enforced effect ordering / a transaction-level strategy.
echo "PG06-N05: $passed isolated PostgreSQL assertions passed."
