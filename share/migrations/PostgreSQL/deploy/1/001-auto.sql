-- 
-- Created by SQL::Translator::Producer::PostgreSQL
-- Created on Wed Nov 12 12:44:30 2014
-- 
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
-- Foreign Key Definitions
--

;
ALTER TABLE "siteuser_role" ADD CONSTRAINT "siteuser_role_fk_role" FOREIGN KEY ("role")
  REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
ALTER TABLE "siteuser_role" ADD CONSTRAINT "siteuser_role_fk_siteuser" FOREIGN KEY ("siteuser")
  REFERENCES "siteuser" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE;

;
