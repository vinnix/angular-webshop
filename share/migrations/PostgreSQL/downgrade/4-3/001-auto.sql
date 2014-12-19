-- Convert schema '/Users/spot/dev/angular-webshop/share/migrations/_source/deploy/4/001-auto.yml' to '/Users/spot/dev/angular-webshop/share/migrations/_source/deploy/3/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE image DROP COLUMN cloudinary_cloud_name;

;
ALTER TABLE image DROP COLUMN cloudinary_public_id;

;

COMMIT;

