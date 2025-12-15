// scripts/db.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { artists } from "../db/schema/artists";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is missing. Put it in .env.local as DATABASE_URL=...");
}

// For a one-off import, keep connections minimal
const client = postgres(url, { max: 1 });

export const db = drizzle(client, { schema: { artists } });