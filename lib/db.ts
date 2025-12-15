// lib/db.ts
import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const client = postgres(url, {
  max: 1,
  ssl: "require",
});

export const db = drizzle(client);
