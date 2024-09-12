DO $$ BEGIN
 CREATE TYPE "public"."SkillLevel" AS ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form_user" (
	"id" text PRIMARY KEY NOT NULL,
	"firstname" text,
	"lastname" text,
	"location" text,
	"email" text NOT NULL,
	"password" text,
	"skillLevel" "SkillLevel" DEFAULT 'Beginner' NOT NULL
);
