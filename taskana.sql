\echo 'Delete and recreate taskana db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE taskana;
CREATE DATABASE taskana;
\connect taskana

\i taskana-schema.sql
\i taskana-seed.sql



\echo 'Delete and recreate taskana_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE taskana_test;
CREATE DATABASE taskana_test;
\connect taskana_test

\i taskana-schema.sql
