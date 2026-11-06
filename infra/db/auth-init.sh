#!/bin/sh
# Runs once, the first time the auth database container starts with an empty volume.
set -eu

psql -v ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -v owner_password="$AUTH_DB_OWNER_PASSWORD" \
  -v app_password="$AUTH_DB_PASSWORD" <<'EOSQL'
-- 1. auth_owner can log in, using the owner password

CREATE ROLE auth_owner LOGIN PASSWORD :'owner_password';
CREATE ROLE auth_app LOGIN PASSWORD :'app_password';


-- 3. auth_owner owns schema public
ALTER SCHEMA public OWNER TO auth_owner;

-- 4. Every other role loses all rights on schema public
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- 5. auth_app may use schema public
GRANT USAGE ON SCHEMA public TO auth_app;

-- 6. Schema "migrations", owned by auth_owner
CREATE SCHEMA migrations AUTHORIZATION auth_owner;

-- 7. Tables auth_owner creates later: auth_app gets row-level rights only
ALTER DEFAULT PRIVILEGES FOR ROLE auth_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO auth_app;

-- 8. The same for sequences (counters used by auto-numbered columns)
ALTER DEFAULT PRIVILEGES FOR ROLE auth_owner IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO auth_app;
EOSQL
