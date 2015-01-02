-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/7/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/6/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE product DROP COLUMN vat;

;
ALTER TABLE product DROP COLUMN price;

;
ALTER TABLE product DROP COLUMN discount;

;
DROP TABLE vat CASCADE;

;

COMMIT;

