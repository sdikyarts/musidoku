CREATE TYPE "public"."gender_enum" AS ENUM('male', 'female', 'non-binary', 'mixed', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."genre_enum" AS ENUM('afrobeats', 'alternative', 'country', 'electronic', 'hip hop', 'k-pop', 'latin', 'metal', 'other', 'pop', 'r&b', 'reggae', 'rock');--> statement-breakpoint
CREATE TYPE "public"."parsed_artist_type_enum" AS ENUM('solo', 'group', 'unknown');--> statement-breakpoint
CREATE TABLE "artists" (
	"spotify_id" varchar(64) PRIMARY KEY NOT NULL,
	"scraper_name" text NOT NULL,
	"chartmasters_name" text,
	"scraper_image_url" text,
	"mb_id" uuid NOT NULL,
	"mb_type_raw" varchar(32) NOT NULL,
	"parsed_artist_type" "parsed_artist_type_enum" NOT NULL,
	"gender" "gender_enum" NOT NULL,
	"country" varchar(2) NOT NULL,
	"birth_date" date,
	"death_date" date,
	"disband_date" date,
	"debut_year" integer,
	"member_count" integer,
	"genres" text NOT NULL,
	"primary_genre" "genre_enum" NOT NULL,
	"secondary_genre" "genre_enum",
	"is_dead" boolean,
	"is_disbanded" boolean
);
