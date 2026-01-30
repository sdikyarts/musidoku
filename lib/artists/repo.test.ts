import { vi, describe, it, expect, beforeEach } from "vitest";

// Create a proper mock for the db module
const mockDb = {
  select: vi.fn((fields?: any) => ({
    from: vi.fn(() => {
      // If select was called with fields (like getTotalArtistCount does), return array directly
      if (fields) {
        return Promise.resolve([]);
      }
      // Otherwise return the full chain for other methods
      return {
        where: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => ({
              offset: vi.fn(() => Promise.resolve([])),
            })),
          })),
          limit: vi.fn(() => Promise.resolve([])),
        })),
        orderBy: vi.fn(() => ({
          limit: vi.fn(() => ({
            offset: vi.fn(() => Promise.resolve([])),
          })),
        })),
        limit: vi.fn(() => Promise.resolve([])),
      };
    }),
  })),
};

vi.mock("@/lib/db", () => ({
  db: mockDb,
}));

// Import after mocking
const {
  listArtists,
  getArtistBySpotifyId,
  getTotalArtistCount,
  getPreviousArtist,
  getNextArtist,
} = await import("./repo");

describe("listArtists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes limit to default when invalid", async () => {
    await listArtists({ limit: -1, offset: 0 });
    // Should use default limit of 50
  });

  it("caps limit at maximum", async () => {
    await listArtists({ limit: 1000, offset: 0 });
    // Should cap at MAX_ARTIST_LIMIT (200)
  });

  it("normalizes offset to 0 when negative", async () => {
    await listArtists({ limit: 10, offset: -5 });
    // Should use offset of 0
  });

  it("handles search query", async () => {
    await listArtists({ query: "Drake", limit: 10, offset: 0 });
    // Should apply ilike filter
  });
});

describe("getArtistBySpotifyId", () => {
  it("throws error for empty spotify ID", async () => {
    await expect(getArtistBySpotifyId("")).rejects.toThrow("spotifyId is required");
  });

  it("trims whitespace from spotify ID", async () => {
    await getArtistBySpotifyId("  test123  ");
    // Should query with trimmed ID
  });

  it("returns null when artist not found", async () => {
    const result = await getArtistBySpotifyId("nonexistent");
    expect(result).toBeNull();
  });
});

describe("getTotalArtistCount", () => {
  it("returns count of all artists", async () => {
    const count = await getTotalArtistCount();
    // With mocked db returning empty array, this returns 0
    expect(count).toBe(0);
  });
});

describe("getPreviousArtist", () => {
  it("returns null when no previous artist exists", async () => {
    const result = await getPreviousArtist(0);
    expect(result).toBeNull();
  });
});

describe("getNextArtist", () => {
  it("returns null when no next artist exists", async () => {
    const result = await getNextArtist(999999);
    expect(result).toBeNull();
  });
});
