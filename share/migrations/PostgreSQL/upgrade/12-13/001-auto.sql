-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/12/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/13/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE product DROP COLUMN payload;

;

COMMIT;

