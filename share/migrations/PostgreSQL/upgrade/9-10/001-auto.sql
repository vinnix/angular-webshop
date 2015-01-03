-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/9/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/10/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE "productbasecolor" (
  "product" integer NOT NULL,
  "color" integer NOT NULL,
  PRIMARY KEY ("product", "color")
);
CREATE INDEX "productbasecolor_idx_color" on "productbasecolor" ("color");
CREATE INDEX "productbasecolor_idx_product" on "productbasecolor" ("product");

;
CREATE TABLE "productprintcolor" (
  "product" integer NOT NULL,
  "color" integer NOT NULL,
  PRIMARY KEY ("product", "color")
);
CREATE INDEX "productprintcolor_idx_color" on "productprintcolor" ("color");
CREATE INDEX "productprintcolor_idx_product" on "productprintcolor" ("product");

;
ALTER TABLE "productbasecolor" ADD CONSTRAINT "productbasecolor_fk_color" FOREIGN KEY ("color")
  REFERENCES "color" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productbasecolor" ADD CONSTRAINT "productbasecolor_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productprintcolor" ADD CONSTRAINT "productprintcolor_fk_color" FOREIGN KEY ("color")
  REFERENCES "color" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productprintcolor" ADD CONSTRAINT "productprintcolor_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
DROP TABLE productcolor CASCADE;

;

COMMIT;

