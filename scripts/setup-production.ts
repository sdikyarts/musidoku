// scripts/setup-production.ts
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "node:path";
import { importArtists } from "./import-artists";
import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { db as defaultDb } from "./db";
import { artists, type NewArtist } from "../db/schema/artists";
import { sql } from "drizzle-orm";

async function setupProduction() {
  // Check if production URL is provided
  const productionUrl = process.env.DATABASE_URL_PRODUCTION || process.env.DATABASE_URL;

  if (!productionUrl) {
    console.error("❌ Error: DATABASE_URL_PRODUCTION or DATABASE_URL is not set");
    console.log("\nUsage:");
    console.log("  DATABASE_URL_PRODUCTION=your-production-url npm run db:setup-production");
    console.log("\nOr add DATABASE_URL_PRODUCTION to your .env.local file");
    process.exit(1);
  }

  console.log("🚀 Setting up production database...\n");

  const migrationClient = postgres(productionUrl, { max: 1, ssl: "require" });
  const db = drizzle(migrationClient);

  // Step 1: Run migrations
  console.log("📦 Step 1: Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations complete!\n");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    await migrationClient.end();
    process.exit(1);
  }

  // Step 2: Import artists data
  console.log("📊 Step 2: Importing artists data...");
  const csvPath = path.join(process.cwd(), "artist.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Error: artist.csv not found at ${csvPath}`);
    await migrationClient.end();
    process.exit(1);
  }

  try {
    const nodeFileReader = {
      read: (filePath: string) => fs.promises.readFile(filePath, "utf8"),
    };

    const csvSyncParser = {
      parse: (raw: string) =>
        parse(raw, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        }),
    };

    const productionRepository = {
      upsertBatch: async (values: NewArtist[]) => {
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
              roster_order: sql`excluded.roster_order`,
            },
          });
      },
    };

    await importArtists(csvPath, {
      reader: nodeFileReader,
      parser: csvSyncParser,
      repository: productionRepository,
      chunkSize: 1000,
    });

    console.log("✅ Data import complete!\n");
  } catch (err) {
    console.error("❌ Data import failed:", err);
    await migrationClient.end();
    process.exit(1);
  }

  await migrationClient.end();
  console.log("🎉 Production database setup complete!");
}

setupProduction().catch((err) => {
  console.error("❌ Setup failed:", err);
  process.exit(1);
});
