import { vi, describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";
import { mockArtists } from "../test-utils";

vi.mock("@/lib/artists/repo", () => ({
  getArtistBySpotifyId: vi.fn(),
}));

const { getArtistBySpotifyId } = await import("@/lib/artists/repo");

describe("GET /api/artists/[spotifyId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns artist when found", async () => {
    vi.mocked(getArtistBySpotifyId).mockResolvedValue(mockArtists.drake);

    const req = new NextRequest("http://localhost:3000/api/artists/3TVXtAsR1Inumwj472S9r4");
    const context = { params: Promise.resolve({ spotifyId: "3TVXtAsR1Inumwj472S9r4" }) };
    const response = await GET(req, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockArtists.drake);
    expect(getArtistBySpotifyId).toHaveBeenCalledWith("3TVXtAsR1Inumwj472S9r4");
  });

  it("returns 404 when artist not found", async () => {
    vi.mocked(getArtistBySpotifyId).mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/artists/nonexistent");
    const context = { params: Promise.resolve({ spotifyId: "nonexistent123" }) };
    const response = await GET(req, context);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: "Not found" });
  });

  it("returns 400 for invalid spotify ID format", async () => {
    const req = new NextRequest("http://localhost:3000/api/artists/invalid");
    const context = { params: Promise.resolve({ spotifyId: "" }) };
    const response = await GET(req, context);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
  });

  it("trims whitespace from spotify ID", async () => {
    vi.mocked(getArtistBySpotifyId).mockResolvedValue(mockArtists.drake);

    const req = new NextRequest("http://localhost:3000/api/artists/3TVXtAsR1Inumwj472S9r4");
    const context = { params: Promise.resolve({ spotifyId: "  3TVXtAsR1Inumwj472S9r4  " }) };
    const response = await GET(req, context);

    expect(response.status).toBe(200);
    expect(getArtistBySpotifyId).toHaveBeenCalledWith("3TVXtAsR1Inumwj472S9r4");
  });
});
