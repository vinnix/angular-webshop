-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/8/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/7/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE product DROP COLUMN custom_image;

;
ALTER TABLE product DROP COLUMN custom_text;

;

COMMIT;

