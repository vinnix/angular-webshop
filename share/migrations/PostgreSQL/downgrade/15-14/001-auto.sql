-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/15/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/14/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE size ALTER COLUMN title TYPE character varying(10);

;

COMMIT;

