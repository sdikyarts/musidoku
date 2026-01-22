// scripts/setup-production.ts
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "node:path";
import { 
  importArtists, 
  nodeFileReader, 
  csvSyncParser, 
  createDrizzleRepository 
} from "./import-artists";
import fs from "node:fs";
import * as schema from "../db/schema/artists";

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
  const db = drizzle(migrationClient, { schema });

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
    await importArtists(csvPath, {
      reader: nodeFileReader,
      parser: csvSyncParser,
      repository: createDrizzleRepository(db),
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

await setupProduction();
