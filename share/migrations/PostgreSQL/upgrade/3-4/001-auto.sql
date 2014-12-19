-- Convert schema '/Users/spot/dev/angular-webshop/share/migrations/_source/deploy/3/001-auto.yml' to '/Users/spot/dev/angular-webshop/share/migrations/_source/deploy/4/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE image ADD COLUMN cloudinary_cloud_name character varying(100);

;
ALTER TABLE image ADD COLUMN cloudinary_public_id character varying(100);

;

COMMIT;

