import {
  DEFAULT_ARTIST_LIMIT,
  MAX_ARTIST_LIMIT,
  parseArtistQuery,
  validateSpotifyId,
} from "./artist";

describe("parseArtistQuery", () => {
  it("returns defaults when no params provided", () => {
    const result = parseArtistQuery(new URLSearchParams());
    expect(result).toEqual({
      ok: true,
      value: { query: undefined, limit: DEFAULT_ARTIST_LIMIT, offset: 0 },
    });
  });

  it("accepts valid query, limit, and offset", () => {
    const result = parseArtistQuery(new URLSearchParams({ q: " adele ", limit: "10", offset: "5" }));
    expect(result).toEqual({
      ok: true,
      value: { query: "adele", limit: 10, offset: 5 },
    });
  });

  it("rejects invalid limit values", () => {
    expect(parseArtistQuery(new URLSearchParams({ limit: "0" })).ok).toBe(false);
    expect(parseArtistQuery(new URLSearchParams({ limit: String(MAX_ARTIST_LIMIT + 1) })).ok).toBe(false);
    expect(parseArtistQuery(new URLSearchParams({ limit: "not-a-number" })).ok).toBe(false);
  });

  it("rejects invalid offset values", () => {
    expect(parseArtistQuery(new URLSearchParams({ offset: "-1" })).ok).toBe(false);
    expect(parseArtistQuery(new URLSearchParams({ offset: "1.5" })).ok).toBe(false);
  });
});

describe("validateSpotifyId", () => {
  it("rejects empty ids", () => {
    expect(validateSpotifyId("   ").ok).toBe(false);
  });

  it("trims and returns ids", () => {
    expect(validateSpotifyId("  abc123  ")).toEqual({ ok: true, value: "abc123" });
  });
});
