// scripts/migrate.ts
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Load .env.local file
config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const migrationClient = postgres(url, { max: 1, ssl: "require" });
const db = drizzle(migrationClient);

try {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete!");
  await migrationClient.end();
} catch (err) {
  console.error("Migration failed:", err);
  process.exit(1);
}
