import { vi, describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";
import type { Artist } from "@/db/schema/artists";
import { mockArtists } from "./test-utils";

vi.mock("@/lib/artists/repo", () => ({
  listArtists: vi.fn(),
}));

const { listArtists } = await import("@/lib/artists/repo");

describe("GET /api/artists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns artists with valid query parameters", async () => {
    const artists = [mockArtists.drake, mockArtists.taylorSwift];
    vi.mocked(listArtists).mockResolvedValue(artists);

    const req = new NextRequest("http://localhost:3000/api/artists?limit=10&offset=0");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(artists);
    expect(listArtists).toHaveBeenCalledWith({ limit: 10, offset: 0 });
  });

  it("returns artists with search query", async () => {
    const artists = [mockArtists.drake];
    vi.mocked(listArtists).mockResolvedValue(artists);

    const req = new NextRequest("http://localhost:3000/api/artists?q=Drake");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(artists);
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
