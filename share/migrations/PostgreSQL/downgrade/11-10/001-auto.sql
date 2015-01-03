-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/11/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/10/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE product DROP COLUMN description;

;

COMMIT;

