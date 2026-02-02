// scripts/import-artists.ts
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "csv-parse/sync";
import { sql } from "drizzle-orm";
import { db } from "./db";
import { artists, type NewArtist } from "../db/schema/artists";

type CsvRow = Record<string, string>;
type ParsedArtistType = NewArtist["parsed_artist_type"];
type Gender = NewArtist["gender"];
type Genre = NewArtist["primary_genre"];

export type ValueNormalizer<T> = {
  normalize: (value: unknown) => T;
};

type FileReader = {
  read: (filePath: string) => Promise<string>;
};

type CsvParser = {
  parse: (raw: string) => CsvRow[];
};

export type ArtistRepository = {
  upsertBatch: (values: NewArtist[]) => Promise<void>;
};

export type Normalizers = {
  parsedArtistType: ValueNormalizer<ParsedArtistType>;
  gender: ValueNormalizer<Gender>;
  primaryGenre: ValueNormalizer<Genre>;
  secondaryGenre: ValueNormalizer<NewArtist["secondary_genre"]>;
};

export type ImporterDependencies = {
  reader: FileReader;
  parser: CsvParser;
  repository: ArtistRepository;
  chunkSize?: number;
  normalizers?: Normalizers;
};

export const parsedArtistTypeValues = ["solo", "group", "unknown"] as const;
export const genderValues = ["male", "female", "non-binary", "mixed", "unknown"] as const;
export const genreValues = [
  "afrobeats",
  "alternative",
  "bollywood",
  "country",
  "electronic",
  "hip hop",
  "k-pop",
  "latin",
  "metal",
  "pop",
  "r&b",
  "reggae",
  "rock",
  "soundtrack",
] as const;

export function toSafeString(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  return "";
}

export const nodeFileReader: FileReader = {
  read: (filePath) => fs.promises.readFile(filePath, "utf8"),
};

export const csvSyncParser: CsvParser = {
  parse: (raw) =>
    parse<CsvRow>(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }),
};

export function createDrizzleRepository(dbInstance: typeof db): ArtistRepository {
  return {
    upsertBatch: async (values) => {
      await dbInstance
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
            roster_order: sql`excluded.roster_order`,
          },
        });
    },
  };
}

export function toNull(v: unknown) {
  const s = toSafeString(v).trim();
  return s === "" ? null : s;
}

export function toInt(v: unknown) {
  const s = toNull(v);
  if (s === null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function toBool(v: unknown) {
  const s = toNull(v);
  if (s === null) return null;
  const t = String(s).toLowerCase();
  if (t === "true" || t === "1" || t === "yes") return true;
  if (t === "false" || t === "0" || t === "no") return false;
  return null;
}

export function norm(v: unknown) {
  return toSafeString(v).trim().toLowerCase();
}

export function createEnumNormalizer<T extends string>(
  allowed: readonly T[],
  fallback: T
): ValueNormalizer<T> {
  const allowedSet = new Set(allowed);

  return {
    normalize: (value: unknown) => {
      const normalized = norm(value);
      return allowedSet.has(normalized as T) ? (normalized as T) : fallback;
    },
  };
}

export function createOptionalEnumNormalizer<T extends string>(
  allowed: readonly T[]
): ValueNormalizer<T | null> {
  return {
    normalize: (value: unknown) => {
      const nullable = toNull(value);
      if (nullable === null) return null;
      const normalized = norm(nullable);
      return allowed.includes(normalized as T) ? (normalized as T) : null;
    },
  };
}

export const defaultNormalizers: Normalizers = {
  parsedArtistType: createEnumNormalizer(parsedArtistTypeValues, "unknown"),
  gender: createEnumNormalizer(genderValues, "unknown"),
  primaryGenre: createEnumNormalizer(genreValues, "pop"),
  secondaryGenre: createOptionalEnumNormalizer(genreValues),
};

export function mapRowToArtist(row: CsvRow, normalizers: Normalizers): NewArtist {
  return {
    spotify_id: String(row.spotify_id),
    scraper_name: String(row.scraper_name),
    chartmasters_name: toNull(row.chartmasters_name),
    scraper_image_url: toNull(row.scraper_image_url),
    mb_id: String(row.mb_id),
    mb_type_raw: String(row.mb_type_raw),
    parsed_artist_type: normalizers.parsedArtistType.normalize(row.parsed_artist_type),
    gender: normalizers.gender.normalize(row.gender),
    country: String(row.country),
    birth_date: toNull(row.birth_date),
    death_date: toNull(row.death_date),
    disband_date: toNull(row.disband_date),
    debut_year: toInt(row.debut_year),
    member_count: toInt(row.member_count),
    genres: String(row.genres),
    primary_genre: normalizers.primaryGenre.normalize(row.primary_genre),
    secondary_genre: normalizers.secondaryGenre.normalize(row.secondary_genre),
    is_dead: toBool(row.is_dead),
    is_disbanded: toBool(row.is_disbanded),
  };
}

export async function importArtists(csvPath: string, deps: ImporterDependencies) {
  const {
    reader,
    parser,
    repository,
    chunkSize = 1000,
    normalizers = defaultNormalizers,
  } = deps;
  const raw = await reader.read(csvPath);
  const rows = parser.parse(raw);

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const values = chunk.map((row, index) => ({
      ...mapRowToArtist(row, normalizers),
      roster_order: i + index,
    }));

    await repository.upsertBatch(values);
    console.log(`Imported ${Math.min(i + chunkSize, rows.length)} / ${rows.length}`);
  }
}

const csvPath = path.join(process.cwd(), "artist.csv");

const isDirectExecution =
  typeof process !== "undefined" &&
  process.argv?.[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectExecution) {
  try {
    await importArtists(csvPath, {
      reader: nodeFileReader,
      parser: csvSyncParser,
      repository: createDrizzleRepository(db),
      chunkSize: 1000,
    });

    console.log("Done.");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
