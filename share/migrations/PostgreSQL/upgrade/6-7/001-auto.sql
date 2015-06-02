-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/6/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/7/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE "vat" (
  "id" serial NOT NULL,
  "amount" numeric NOT NULL,
  "default" integer,
  PRIMARY KEY ("id")
);

;
ALTER TABLE product ADD COLUMN vat integer;

;
ALTER TABLE product ADD COLUMN price numeric;

;
ALTER TABLE product ADD COLUMN discount numeric;

;

COMMIT;

