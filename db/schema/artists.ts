// db/schema/artists.ts
import {
  pgTable,
  text,
  varchar,
  integer,
  date,
  pgEnum,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core';

export const parsedArtistTypeEnum = pgEnum('parsed_artist_type_enum', [
  'solo',
  'group',
  'unknown',
]);

// Values observed in your CSV
export const genderEnum = pgEnum('gender_enum', [
  'male',
  'female',
  'non-binary',
  'mixed',
  'unknown',
]);

// Values observed in your CSV (primary_genre + secondary_genre)
export const genreEnum = pgEnum('genre_enum', [
  'afrobeats',
  'alternative',
  'country',
  'electronic',
  'hip hop',
  'k-pop',
  'latin',
  'metal',
  'other',
  'pop',
  'r&b',
  'reggae',
  'rock',
]);

export const artists = pgTable('artists', {
  // matches CSV
  spotify_id: varchar('spotify_id', { length: 64 }).primaryKey(),

  // matches CSV
  scraper_name: text('scraper_name').notNull(),
  chartmasters_name: text('chartmasters_name'),
  scraper_image_url: text('scraper_image_url'),

  // matches CSV (always populated there)
  mb_id: uuid('mb_id').notNull(),
  mb_type_raw: varchar('mb_type_raw', { length: 32 }).notNull(),

  // constrained to your CSV values
  parsed_artist_type: parsedArtistTypeEnum('parsed_artist_type').notNull(),

  // constrained to your CSV values
  gender: genderEnum('gender').notNull(),
  country: varchar('country', { length: 2 }).notNull(),

  // store as DATE, use mode: 'string' if you prefer strings in TS
  birth_date: date('birth_date', { mode: 'string' }),
  death_date: date('death_date', { mode: 'string' }),
  disband_date: date('disband_date', { mode: 'string' }),

  debut_year: integer('debut_year'),
  member_count: integer('member_count'),

  // CSV stores this as a delimited string
  genres: text('genres').notNull(),

  // added from CSV
  primary_genre: genreEnum('primary_genre').notNull(),
  secondary_genre: genreEnum('secondary_genre'),

  // added from CSV (nullable because your CSV has blanks)
  is_dead: boolean('is_dead'),
  is_disbanded: boolean('is_disbanded'),
  
  // roster order to maintain CSV order
  roster_order: integer('roster_order'),
});

// Type helpers
export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;
