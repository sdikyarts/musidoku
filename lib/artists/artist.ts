// lib/artists/artist.ts
import { Artist as DbArtist } from "@/db/schema/artists";

export type Artist = DbArtist;

export const DEFAULT_ARTIST_LIMIT = 50;
export const MAX_ARTIST_LIMIT = 200;

export type ArtistQuery = {
  query?: string;
  limit: number;
  offset: number;
};

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function parseArtistQuery(searchParams: URLSearchParams): ValidationResult<ArtistQuery> {
  const query = searchParams.get("q")?.trim() || undefined;
  const limitParam = searchParams.get("limit");
  const offsetParam = searchParams.get("offset");

  const limit = limitParam ? Number(limitParam) : DEFAULT_ARTIST_LIMIT;
  const offset = offsetParam ? Number(offsetParam) : 0;

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_ARTIST_LIMIT) {
    return { ok: false, error: `limit must be an integer between 1 and ${MAX_ARTIST_LIMIT}` };
  }

  if (!Number.isInteger(offset) || offset < 0) {
    return { ok: false, error: "offset must be an integer 0 or greater" };
  }

  return { ok: true, value: { query, limit, offset } };
}

export function validateSpotifyId(rawSpotifyId: string): ValidationResult<string> {
  const spotifyId = rawSpotifyId.trim();
  if (!spotifyId) {
    return { ok: false, error: "spotifyId is required" };
  }

  return { ok: true, value: spotifyId };
}
