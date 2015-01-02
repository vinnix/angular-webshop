-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/7/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/8/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE product ADD COLUMN custom_image integer;

;
ALTER TABLE product ADD COLUMN custom_text integer;

;

COMMIT;

