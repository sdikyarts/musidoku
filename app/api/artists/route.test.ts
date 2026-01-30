import { vi, describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";
import type { Artist } from "@/db/schema/artists";

vi.mock("@/lib/artists/repo", () => ({
  listArtists: vi.fn(),
}));

const { listArtists } = await import("@/lib/artists/repo");

describe("GET /api/artists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns artists with valid query parameters", async () => {
    const mockArtists: Artist[] = [
      {
        scraper_name: "Drake",
        spotify_id: "3TVXtAsR1Inumwj472S9r4",
        roster_order: 0,
        mb_id: "00000000-0000-0000-0000-000000000000",
        mb_type_raw: "Person",
        parsed_artist_type: "solo",
        gender: "male",
        country: "CA",
        birth_date: null,
        death_date: null,
        disband_date: null,
        debut_year: 2006,
        member_count: null,
        genres: "hip hop",
        primary_genre: "hip hop",
        secondary_genre: null,
        is_dead: false,
        is_disbanded: null,
        scraper_image_url: null,
        chartmasters_name: null,
      },
      {
        scraper_name: "Taylor Swift",
        spotify_id: "06HL4z0CvFAxyc27GXpf02",
        roster_order: 1,
        mb_id: "00000000-0000-0000-0000-000000000001",
        mb_type_raw: "Person",
        parsed_artist_type: "solo",
        gender: "female",
        country: "US",
        birth_date: null,
        death_date: null,
        disband_date: null,
        debut_year: 2006,
        member_count: null,
        genres: "pop",
        primary_genre: "pop",
        secondary_genre: null,
        is_dead: false,
        is_disbanded: null,
        scraper_image_url: null,
        chartmasters_name: null,
      },
    ];
    vi.mocked(listArtists).mockResolvedValue(mockArtists);

    const req = new NextRequest("http://localhost:3000/api/artists?limit=10&offset=0");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockArtists);
    expect(listArtists).toHaveBeenCalledWith({ limit: 10, offset: 0 });
  });

  it("returns artists with search query", async () => {
    const mockArtists: Artist[] = [
      {
        scraper_name: "Drake",
        spotify_id: "3TVXtAsR1Inumwj472S9r4",
        roster_order: 0,
        mb_id: "00000000-0000-0000-0000-000000000000",
        mb_type_raw: "Person",
        parsed_artist_type: "solo",
        gender: "male",
        country: "CA",
        birth_date: null,
        death_date: null,
        disband_date: null,
        debut_year: 2006,
        member_count: null,
        genres: "hip hop",
        primary_genre: "hip hop",
        secondary_genre: null,
        is_dead: false,
        is_disbanded: null,
        scraper_image_url: null,
        chartmasters_name: null,
      },
    ];
    vi.mocked(listArtists).mockResolvedValue(mockArtists);

    const req = new NextRequest("http://localhost:3000/api/artists?q=Drake");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockArtists);
    expect(listArtists).toHaveBeenCalledWith({ query: "Drake", limit: 50, offset: 0 });
  });

  it("returns 400 for invalid limit", async () => {
    const req = new NextRequest("http://localhost:3000/api/artists?limit=invalid");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
  });

  it("returns 400 for negative offset", async () => {
    const req = new NextRequest("http://localhost:3000/api/artists?offset=-1");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
  });

  it("uses default values when no parameters provided", async () => {
    const mockArtists: Artist[] = [];
    vi.mocked(listArtists).mockResolvedValue(mockArtists);

    const req = new NextRequest("http://localhost:3000/api/artists");
    const response = await GET(req);

    expect(response.status).toBe(200);
    expect(listArtists).toHaveBeenCalledWith({ limit: 50, offset: 0 });
  });
});
