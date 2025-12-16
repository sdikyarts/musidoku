// scripts/import-artists.ts
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { sql } from "drizzle-orm";
import { db } from "./db";
import { artists, type NewArtist } from "../db/schema/artists";

type CsvRow = Record<string, string>;
type ParsedArtistType = NewArtist["parsed_artist_type"];
type Gender = NewArtist["gender"];
type Genre = NewArtist["primary_genre"];

const parsedArtistTypes = new Set<ParsedArtistType>(["solo", "group", "unknown"]);
const genderTypes = new Set<Gender>(["male", "female", "non-binary", "mixed", "unknown"]);
const genreTypes = new Set<Genre>([
  "afrobeats",
  "alternative",
  "country",
  "electronic",
  "hip hop",
  "k-pop",
  "latin",
  "metal",
  "other",
  "pop",
  "r&b",
  "reggae",
  "rock",
]);

function toNull(v: unknown) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function toInt(v: unknown) {
  const s = toNull(v);
  if (s === null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function toBool(v: unknown) {
  const s = toNull(v);
  if (s === null) return null;
  const t = String(s).toLowerCase();
  if (t === "true" || t === "1" || t === "yes") return true;
  if (t === "false" || t === "0" || t === "no") return false;
  return null;
}

function norm(v: unknown) {
  return String(v ?? "").trim().toLowerCase();
}

function isParsedArtistType(value: string): value is ParsedArtistType {
  return parsedArtistTypes.has(value as ParsedArtistType);
}

function isGender(value: string): value is Gender {
  return genderTypes.has(value as Gender);
}

function isGenre(value: string): value is Genre {
  return genreTypes.has(value as Genre);
}

function toParsedArtistType(v: unknown): ParsedArtistType {
  const value = norm(v);
  return isParsedArtistType(value) ? value : "unknown";
}

function toGender(v: unknown): Gender {
  const value = norm(v);
  return isGender(value) ? value : "unknown";
}

function toGenre(v: unknown): Genre {
  const value = norm(v);
  return isGenre(value) ? value : "other";
}

function toSecondaryGenre(v: unknown): NewArtist["secondary_genre"] {
  const value = toNull(v);
  if (value === null) return null;
  const normalized = norm(value);
  return isGenre(normalized) ? normalized : null;
}

const batchSize = 1000;

try {
  const csvPath = path.join(process.cwd(), "artist.csv");
  const raw = fs.readFileSync(csvPath, "utf8");

  const rows = parse<CsvRow>(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);

    const values: NewArtist[] = chunk.map((r) => ({
      spotify_id: String(r.spotify_id),
      scraper_name: String(r.scraper_name),
      chartmasters_name: toNull(r.chartmasters_name),
      scraper_image_url: toNull(r.scraper_image_url),

      mb_id: String(r.mb_id),
      mb_type_raw: String(r.mb_type_raw),
      parsed_artist_type: toParsedArtistType(r.parsed_artist_type),

      gender: toGender(r.gender),
      country: String(r.country),

      birth_date: toNull(r.birth_date),
      death_date: toNull(r.death_date),
      disband_date: toNull(r.disband_date),

      debut_year: toInt(r.debut_year),
      member_count: toInt(r.member_count),

      genres: String(r.genres),

      primary_genre: toGenre(r.primary_genre),
      secondary_genre: toSecondaryGenre(r.secondary_genre),

      is_dead: toBool(r.is_dead),
      is_disbanded: toBool(r.is_disbanded),
    }));

    await db
      .insert(artists)
      .values(values)
      .onConflictDoUpdate({
        target: artists.spotify_id,
        set: {
          scraper_name: sql`excluded.scraper_name`,
          chartmasters_name: sql`excluded.chartmasters_name`,
          scraper_image_url: sql`excluded.scraper_image_url`,
          mb_id: sql`excluded.mb_id`,
          mb_type_raw: sql`excluded.mb_type_raw`,
          parsed_artist_type: sql`excluded.parsed_artist_type`,
          gender: sql`excluded.gender`,
          country: sql`excluded.country`,
          birth_date: sql`excluded.birth_date`,
          death_date: sql`excluded.death_date`,
          disband_date: sql`excluded.disband_date`,
          debut_year: sql`excluded.debut_year`,
          member_count: sql`excluded.member_count`,
          genres: sql`excluded.genres`,
          primary_genre: sql`excluded.primary_genre`,
          secondary_genre: sql`excluded.secondary_genre`,
          is_dead: sql`excluded.is_dead`,
          is_disbanded: sql`excluded.is_disbanded`,
        },
      });

    console.log(`Imported ${Math.min(i + batchSize, rows.length)} / ${rows.length}`);
  }

  console.log("Done.");
} catch (e) {
  console.error(e);
  process.exit(1);
}
