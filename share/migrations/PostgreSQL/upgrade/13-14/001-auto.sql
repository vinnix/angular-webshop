-- Convert schema '/Users/spot/dev/paahine/share/migrations/_source/deploy/13/001-auto.yml' to '/Users/spot/dev/paahine/share/migrations/_source/deploy/14/001-auto.yml':;

;
BEGIN;

;
ALTER TABLE color ADD CONSTRAINT color_title UNIQUE (title);

;

COMMIT;

