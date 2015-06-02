-- 
-- Created by SQL::Translator::Producer::PostgreSQL
-- Created on Sat Jan  3 14:25:21 2015
-- 
;
--
-- Table: category.
--
CREATE TABLE "category" (
  "id" serial NOT NULL,
  "slug" character varying(150),
  "title" character varying(250) NOT NULL,
  "description" text,
  "position" integer,
  "hidden" integer,
  PRIMARY KEY ("id"),
  CONSTRAINT "category_slug" UNIQUE ("slug")
);

;
--
-- Table: color.
--
CREATE TABLE "color" (
  "id" serial NOT NULL,
  "title" character varying(60) NOT NULL,
  "code" character varying(6) NOT NULL,
  PRIMARY KEY ("id")
);

;
--
-- Table: image.
--
CREATE TABLE "image" (
  "id" serial NOT NULL,
  "link" character varying(250) NOT NULL,
  "width" integer,
  "height" integer,
  "cloudinary_cloud_name" character varying(100),
  "cloudinary_public_id" character varying(100),
  PRIMARY KEY ("id"),
  CONSTRAINT "image_link" UNIQUE ("link")
);

;
--
-- Table: order.
--
CREATE TABLE "order" (
  "id" serial NOT NULL,
  "reference" integer,
  "created" timestamp with time zone NOT NULL,
  "updated" timestamp with time zone,
  "contact" json NOT NULL,
  "products" json NOT NULL,
  "paid" boolean DEFAULT 'false' NOT NULL,
  "packaged" boolean DEFAULT 'false' NOT NULL,
  "shipped" boolean DEFAULT 'false' NOT NULL,
  "shipping_code" character varying(250) NOT NULL,
  PRIMARY KEY ("id")
);

;
--
-- Table: role.
--
CREATE TABLE "role" (
  "id" serial NOT NULL,
  "name" character varying(80) NOT NULL,
  PRIMARY KEY ("id")
);

;
--
-- Table: session.
--
CREATE TABLE "session" (
  "id" character(72) NOT NULL,
  "session_data" text,
  "expires" integer,
  PRIMARY KEY ("id")
);

;
--
-- Table: siteuser.
--
CREATE TABLE "siteuser" (
  "id" serial NOT NULL,
  "email" character varying(50),
  "username" character varying(50),
  "password" character varying(255),
  "first_name" character varying(50),
  "last_name" character varying(50),
  PRIMARY KEY ("id"),
  CONSTRAINT "siteuser_email_username" UNIQUE ("email", "username")
);

;
--
-- Table: siteuser_role.
--
CREATE TABLE "siteuser_role" (
  "siteuser" integer NOT NULL,
  "role" integer NOT NULL,
  PRIMARY KEY ("siteuser", "role")
);
CREATE INDEX "siteuser_role_idx_role" on "siteuser_role" ("role");
CREATE INDEX "siteuser_role_idx_siteuser" on "siteuser_role" ("siteuser");

;
--
-- Table: size.
--
CREATE TABLE "size" (
  "id" serial NOT NULL,
  "title" character varying(10) NOT NULL,
  PRIMARY KEY ("id")
);

;
--
-- Table: vat.
--
CREATE TABLE "vat" (
  "id" serial NOT NULL,
  "amount" numeric NOT NULL,
  "default" integer,
  PRIMARY KEY ("id")
);

;
--
-- Table: product.
--
CREATE TABLE "product" (
  "id" serial NOT NULL,
  "created" timestamp with time zone NOT NULL,
  "updated" timestamp with time zone,
  "slug" character varying(150),
  "title" character varying(250) NOT NULL,
  "description" text,
  "main_image" integer,
  "payload" json NOT NULL,
  "vat" integer,
  "price" numeric,
  "discount" numeric,
  "custom_image" integer,
  "custom_text" integer,
  "hidden" integer,
  PRIMARY KEY ("id"),
  CONSTRAINT "product_slug" UNIQUE ("slug")
);
CREATE INDEX "product_idx_main_image" on "product" ("main_image");

;
--
-- Table: productimage.
--
CREATE TABLE "productimage" (
  "product" integer NOT NULL,
  "image" integer NOT NULL,
  PRIMARY KEY ("product", "image")
);
CREATE INDEX "productimage_idx_image" on "productimage" ("image");
CREATE INDEX "productimage_idx_product" on "productimage" ("product");

;
--
-- Table: productsold.
--
CREATE TABLE "productsold" (
  "id" serial NOT NULL,
  "product" integer NOT NULL,
  "created" timestamp with time zone NOT NULL,
  "amount" integer NOT NULL,
  PRIMARY KEY ("id")
);
CREATE INDEX "productsold_idx_product" on "productsold" ("product");

;
--
-- Table: productbasecolor.
--
CREATE TABLE "productbasecolor" (
  "product" integer NOT NULL,
  "color" integer NOT NULL,
  PRIMARY KEY ("product", "color")
);
CREATE INDEX "productbasecolor_idx_color" on "productbasecolor" ("color");
CREATE INDEX "productbasecolor_idx_product" on "productbasecolor" ("product");

;
--
-- Table: productcategory.
--
CREATE TABLE "productcategory" (
  "product" integer NOT NULL,
  "category" integer NOT NULL,
  "position" integer,
  PRIMARY KEY ("product", "category")
);
CREATE INDEX "productcategory_idx_category" on "productcategory" ("category");
CREATE INDEX "productcategory_idx_product" on "productcategory" ("product");

;
--
-- Table: productprintcolor.
--
CREATE TABLE "productprintcolor" (
  "product" integer NOT NULL,
  "color" integer NOT NULL,
  PRIMARY KEY ("product", "color")
);
CREATE INDEX "productprintcolor_idx_color" on "productprintcolor" ("color");
CREATE INDEX "productprintcolor_idx_product" on "productprintcolor" ("product");

;
--
-- Table: productsize.
--
CREATE TABLE "productsize" (
  "product" integer NOT NULL,
  "size" integer NOT NULL,
  PRIMARY KEY ("product", "size")
);
CREATE INDEX "productsize_idx_product" on "productsize" ("product");
CREATE INDEX "productsize_idx_size" on "productsize" ("size");

;
--
-- Foreign Key Definitions
--

;
ALTER TABLE "siteuser_role" ADD CONSTRAINT "siteuser_role_fk_role" FOREIGN KEY ("role")
  REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "siteuser_role" ADD CONSTRAINT "siteuser_role_fk_siteuser" FOREIGN KEY ("siteuser")
  REFERENCES "siteuser" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "product" ADD CONSTRAINT "product_fk_main_image" FOREIGN KEY ("main_image")
  REFERENCES "image" ("id") DEFERRABLE;

;
ALTER TABLE "productimage" ADD CONSTRAINT "productimage_fk_image" FOREIGN KEY ("image")
  REFERENCES "image" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productimage" ADD CONSTRAINT "productimage_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") DEFERRABLE;

;
ALTER TABLE "productsold" ADD CONSTRAINT "productsold_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productbasecolor" ADD CONSTRAINT "productbasecolor_fk_color" FOREIGN KEY ("color")
  REFERENCES "color" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productbasecolor" ADD CONSTRAINT "productbasecolor_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productcategory" ADD CONSTRAINT "productcategory_fk_category" FOREIGN KEY ("category")
  REFERENCES "category" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productcategory" ADD CONSTRAINT "productcategory_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productprintcolor" ADD CONSTRAINT "productprintcolor_fk_color" FOREIGN KEY ("color")
  REFERENCES "color" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productprintcolor" ADD CONSTRAINT "productprintcolor_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productsize" ADD CONSTRAINT "productsize_fk_product" FOREIGN KEY ("product")
  REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "productsize" ADD CONSTRAINT "productsize_fk_size" FOREIGN KEY ("size")
  REFERENCES "size" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
