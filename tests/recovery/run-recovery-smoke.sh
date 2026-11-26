#!/usr/bin/env bash
# PG06-N07: disposable PostgreSQL backup/restore proof, synthetic strings only.
set -euo pipefail
: "$PGHOST" "$PGPORT" "$PGUSER" "$PGDATABASE"
src="mundelo_recovery_source"
dst="mundelo_recovery_restored"
work="$(mktemp -d)"
cleanup(){
  dropdb --if-exists --force "$dst" >/dev/null 2>&1 || true
  dropdb --if-exists --force "$src" >/dev/null 2>&1 || true
  rm -rf "$work"
}
trap cleanup EXIT
createdb "$src"
psql -X -q -d "$src" -v ON_ERROR_STOP=1 <<'SQL'
create table synthetic_perspectives(id text primary key,body text not null,child_ref text not null);
create table synthetic_deletion_register(id text primary key,authority_ref text not null,approved boolean not null);
insert into synthetic_perspectives values
 ('synthetic-a','SYNTHETIC-PRIVATE-FOR-RESTORE','child-a'),
 ('synthetic-b','SYNTHETIC-KEEP','child-b');
SQL
pg_dump -Fp --no-owner --no-acl -d "$src" -f "$work/snapshot.sql"
# Some newer distro clients emit transaction_timeout unsupported by PostgreSQL 16.
sed -i '/^SET transaction_timeout = /d' "$work/snapshot.sql"
test -s "$work/snapshot.sql"
psql -X -q -d "$src" -v ON_ERROR_STOP=1 <<'SQL'
insert into synthetic_deletion_register values('synthetic-a','verified-synthetic-review',true);
delete from synthetic_perspectives where id='synthetic-a';
SQL
[[ "$(psql -X -qAt -d "$src" -c "select count(*) from synthetic_perspectives;")" == "1" ]]
echo "PASS: synthetic deletion executed after snapshot"
createdb "$dst"
psql -X -q -v ON_ERROR_STOP=1 -d "$dst" -f "$work/snapshot.sql" > /dev/null
[[ "$(psql -X -qAt -d "$dst" -c "select count(*) from synthetic_perspectives where id='synthetic-a';")" == "1" ]]
echo "PASS: restore resurrected pre-deletion bytes (quarantine required)"
# Never expose the restored contents before reconciliation. Both databases are
# local CI instances without application APIs or client access.
psql -X -q -d "$dst" -v ON_ERROR_STOP=1 -c "truncate synthetic_deletion_register;"
pg_dump --data-only --column-inserts --table=synthetic_deletion_register -d "$src" > "$work/post_snapshot_deletions.sql"
sed -i '/^SET transaction_timeout = /d' "$work/post_snapshot_deletions.sql"
psql -X -q -d "$dst" -v ON_ERROR_STOP=1 -f "$work/post_snapshot_deletions.sql" > /dev/null
psql -X -q -d "$dst" -v ON_ERROR_STOP=1 <<'SQL'
do $$
begin
 if exists(select 1 from synthetic_deletion_register where not approved or authority_ref='') then
  raise exception 'invalid deletion review';
 end if;
end $$;
delete from synthetic_perspectives where id in (select id from synthetic_deletion_register where approved);
SQL
[[ "$(psql -X -qAt -d "$dst" -c "select count(*) from synthetic_perspectives where id='synthetic-a';")" == "0" ]]
[[ "$(psql -X -qAt -d "$dst" -c "select count(*) from synthetic_perspectives where id='synthetic-b';")" == "1" ]]
echo "PASS: reconciled deleted entry without affecting retained synthetic record"
rm -f "$work/snapshot.sql" "$work/post_snapshot_deletions.sql"
test ! -e "$work/snapshot.sql"
echo "PASS: ephemeral backup file removed from runner workspace"
echo "PG06-N07: local synthetic backup/restore/reconciliation smoke test passed"
