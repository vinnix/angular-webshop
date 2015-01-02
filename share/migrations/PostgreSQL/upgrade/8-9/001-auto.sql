-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/8/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/9/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE "color" (
  "id" serial NOT NULL,
  "title" character varying(60) NOT NULL,
  "code" character varying(6) NOT NULL,
  PRIMARY KEY ("id")
);

;
CREATE TABLE "productcolor" (
  "product" integer NOT NULL,
  "color" integer NOT NULL,
  PRIMARY KEY ("product", "color")
);
CREATE INDEX "productcolor_idx_color" on "productcolor" ("color");
CREATE INDEX "productcolor_idx_product" on "productcolor" ("product");

;
CREATE TABLE "productsize" (
  "product" integer NOT NULL,
  "size" integer NOT NULL,
  PRIMARY KEY ("product", "size")
);
CREATE INDEX "productsize_idx_product" on "productsize" ("product");
CREATE INDEX "productsize_idx_size" on "productsize" ("size");

;
CREATE TABLE "size" (
  "id" serial NOT NULL,
  "title" character varying(10) NOT NULL,
  PRIMARY KEY ("id")
);

;
ALTER TABLE "productcolor" ADD CONSTRAINT "productcolor_fk_color" FOREIGN KEY ("color")
  REFERENCES "color" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productcolor" ADD CONSTRAINT "productcolor_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productsize" ADD CONSTRAINT "productsize_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productsize" ADD CONSTRAINT "productsize_fk_size" FOREIGN KEY ("size")
  REFERENCES "size" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;

COMMIT;

