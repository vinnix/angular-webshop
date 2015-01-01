-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/6/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/5/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE category DROP COLUMN description;

;

COMMIT;

