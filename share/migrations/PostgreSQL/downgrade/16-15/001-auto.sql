-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/16/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/15/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE productimage DROP CONSTRAINT productimage_fk_product;

;
ALTER TABLE productimage ADD CONSTRAINT productimage_fk_product FOREIGN KEY (product)
  REFERENCES product (id) DEFERRABLE;

;

COMMIT;

