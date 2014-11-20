-- Convert schema '/Users/spot/dev/angular-webshop/share/migrations/_source/deploy/1/001-auto.yml' to '/Users/spot/dev/angular-webshop/share/migrations/_source/deploy/2/001-auto.yml':;

;
BEGIN;

;
CREATE TABLE "category" (
  "id" serial NOT NULL,
  "slug" character varying(150),
  "title" character varying(250) NOT NULL,
  "position" integer,
  "hidden" integer,
  PRIMARY KEY ("id"),
  CONSTRAINT "category_slug" UNIQUE ("slug")
);

;
CREATE TABLE "image" (
  "id" serial NOT NULL,
  "link" character varying(250) NOT NULL,
  "width" integer,
  "height" integer,
  PRIMARY KEY ("id"),
  CONSTRAINT "image_link" UNIQUE ("link")
);

;
CREATE TABLE "product" (
  "id" serial NOT NULL,
  "created" timestamp with time zone NOT NULL,
  "updated" timestamp with time zone,
  "slug" character varying(150),
  "title" character varying(250) NOT NULL,
  "main_image" integer,
  "payload" json NOT NULL,
  "hidden" integer,
  PRIMARY KEY ("id"),
  CONSTRAINT "product_slug" UNIQUE ("slug")
);
CREATE INDEX "product_idx_main_image" on "product" ("main_image");

;
CREATE TABLE "productcategory" (
  "product" integer NOT NULL,
  "category" integer NOT NULL,
  "position" integer NOT NULL,
  PRIMARY KEY ("product", "category", "position")
);
CREATE INDEX "productcategory_idx_category" on "productcategory" ("category");
CREATE INDEX "productcategory_idx_product" on "productcategory" ("product");

;
CREATE TABLE "productimage" (
  "product" integer NOT NULL,
  "image" integer NOT NULL,
  PRIMARY KEY ("product", "image")
);
CREATE INDEX "productimage_idx_image" on "productimage" ("image");
CREATE INDEX "productimage_idx_product" on "productimage" ("product");

;
ALTER TABLE "product" ADD CONSTRAINT "product_fk_main_image" FOREIGN KEY ("main_image")
  REFERENCES "image" ("id") DEFERRABLE;

;
ALTER TABLE "productcategory" ADD CONSTRAINT "productcategory_fk_category" FOREIGN KEY ("category")
  REFERENCES "category" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productcategory" ADD CONSTRAINT "productcategory_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productimage" ADD CONSTRAINT "productimage_fk_image" FOREIGN KEY ("image")
  REFERENCES "image" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productimage" ADD CONSTRAINT "productimage_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") DEFERRABLE;

;

COMMIT;

