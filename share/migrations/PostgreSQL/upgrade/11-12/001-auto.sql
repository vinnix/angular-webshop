-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/11/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/12/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE "productsold" (
  "id" serial NOT NULL,
  "product" integer NOT NULL,
  "created" timestamp with time zone NOT NULL,
  "amount" integer NOT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX "productsold_idx_product" on "productsold" ("product");

;
ALTER TABLE "productsold" ADD CONSTRAINT "productsold_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;

COMMIT;

