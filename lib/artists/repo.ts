// lib/artists/repo.ts
import { artists } from "@/db/schema/artists";
import { ArtistQuery, DEFAULT_ARTIST_LIMIT, MAX_ARTIST_LIMIT } from "@/lib/artists/artist";
import { db } from "@/lib/db";
import { eq, ilike } from "drizzle-orm";

function normalizeLimit(limit: number) {
  if (!Number.isInteger(limit) || limit < 1) return DEFAULT_ARTIST_LIMIT;
  return Math.min(limit, MAX_ARTIST_LIMIT);
}

function normalizeOffset(offset: number) {
  if (!Number.isInteger(offset) || offset < 0) return 0;
  return offset;
}

export async function listArtists({ query, limit, offset }: ArtistQuery) {
  const normalizedLimit = normalizeLimit(limit);
  const normalizedOffset = normalizeOffset(offset);
  const where = query ? ilike(artists.scraper_name, `%${query}%`) : undefined;

  return db.select().from(artists).where(where).limit(normalizedLimit).offset(normalizedOffset);
}

export async function getArtistBySpotifyId(spotifyId: string) {
  const trimmedId = spotifyId.trim();
  if (!trimmedId) {
    throw new Error("spotifyId is required");
  }

  const rows = await db.select().from(artists).where(eq(artists.spotify_id, trimmedId)).limit(1);
  return rows[0] ?? null;
}
