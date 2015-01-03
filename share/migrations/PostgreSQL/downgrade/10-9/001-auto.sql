-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/10/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/9/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE "productcolor" (
  "product" integer NOT NULL,
  "color" integer NOT NULL,
  PRIMARY KEY ("product", "color")
);
CREATE INDEX "productcolor_idx_color" on "productcolor" ("color");
CREATE INDEX "productcolor_idx_product" on "productcolor" ("product");

;
ALTER TABLE "productcolor" ADD CONSTRAINT "productcolor_fk_color" FOREIGN KEY ("color")
  REFERENCES "color" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productcolor" ADD CONSTRAINT "productcolor_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
DROP TABLE productbasecolor CASCADE;

;
DROP TABLE productprintcolor CASCADE;

;

COMMIT;

