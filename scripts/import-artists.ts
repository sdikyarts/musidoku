// scripts/import-artists.ts
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { sql } from "drizzle-orm";
import { db } from "./db";
import { artists, type NewArtist } from "../db/schema/artists";

type CsvRow = Record<string, string>;

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

async function main() {
  const csvPath = path.join(process.cwd(), "artist.csv");
  const raw = fs.readFileSync(csvPath, "utf8");

  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  const batchSize = 1000;

  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);

    const values: NewArtist[] = chunk.map((r) => ({
      spotify_id: String(r.spotify_id),
      scraper_name: String(r.scraper_name),
      chartmasters_name: toNull(r.chartmasters_name),
      scraper_image_url: toNull(r.scraper_image_url),

      mb_id: String(r.mb_id),
      mb_type_raw: String(r.mb_type_raw),
      parsed_artist_type: norm(r.parsed_artist_type) as NewArtist["parsed_artist_type"],

      gender: norm(r.gender) as NewArtist["gender"],
      country: String(r.country),

      birth_date: toNull(r.birth_date),
      death_date: toNull(r.death_date),
      disband_date: toNull(r.disband_date),

      debut_year: toInt(r.debut_year),
      member_count: toInt(r.member_count),

      genres: String(r.genres),

      primary_genre: norm(r.primary_genre) as NewArtist["primary_genre"],
      secondary_genre: toNull(r.secondary_genre) as NewArtist["secondary_genre"],

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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
