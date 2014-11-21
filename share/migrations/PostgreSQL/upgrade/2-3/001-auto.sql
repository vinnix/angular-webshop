-- Convert schema '/Users/spot/dev/angular-webshop/share/migrations/_source/deploy/2/001-auto.yml' to '/Users/spot/dev/angular-webshop/share/migrations/_source/deploy/3/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE productcategory DROP CONSTRAINT productcategory_pkey;

;
ALTER TABLE productcategory ALTER COLUMN position DROP NOT NULL;

;
ALTER TABLE productcategory ADD PRIMARY KEY (product, category);

;

COMMIT;

