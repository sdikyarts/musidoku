import { describe, it, expect, vi, beforeEach } from "vitest";
import { filterArtists, type Artist } from "./ArtistGrid";

describe("filterArtists", () => {
  const mockArtists: Artist[] = [
    { id: "1", name: "Drake", imageUrl: null, debutYear: 2006, type: "solo", isDead: false, isDisbanded: null },
    { id: "2", name: "The Beatles", imageUrl: null, debutYear: 1960, type: "group", isDead: null, isDisbanded: true },
    { id: "3", name: "Michael Jackson", imageUrl: null, debutYear: 1971, type: "solo", isDead: true, isDisbanded: null },
    { id: "4", name: "Queen", imageUrl: null, debutYear: 1970, type: "group", isDead: null, isDisbanded: false },
    { id: "5", name: "Taylor Swift", imageUrl: null, debutYear: 2006, type: "solo", isDead: false, isDisbanded: null },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all artists when no filters applied", () => {
    const result = filterArtists(mockArtists, null);
    expect(result).toHaveLength(5);
  });

  it("filters by search query (case insensitive)", () => {
    const result = filterArtists(mockArtists, "drake");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Drake");
  });

  it("filters by partial name match", () => {
    const result = filterArtists(mockArtists, "the");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("The Beatles");
  });

  it("filters by artist type - solo", () => {
    const result = filterArtists(mockArtists, null, ["solo"]);
    expect(result).toHaveLength(3);
    expect(result.every(a => a.type === "solo")).toBe(true);
  });

  it("filters by artist type - group", () => {
    const result = filterArtists(mockArtists, null, ["group"]);
    expect(result).toHaveLength(2);
    expect(result.every(a => a.type === "group")).toBe(true);
  });

  it("filters by multiple artist types", () => {
    const result = filterArtists(mockArtists, null, ["solo", "group"]);
    expect(result).toHaveLength(5);
  });

  it("filters by deceased status", () => {
    const result = filterArtists(mockArtists, null, undefined, ["deceased"]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Michael Jackson");
  });

  it("filters by disbanded status", () => {
    const result = filterArtists(mockArtists, null, undefined, ["disbanded"]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("The Beatles");
  });

  it("filters by multiple misc categories", () => {
    const result = filterArtists(mockArtists, null, undefined, ["deceased", "disbanded"]);
    expect(result).toHaveLength(2);
  });

  it("combines search query and type filter", () => {
    const result = filterArtists(mockArtists, "a", ["solo"]);
    expect(result).toHaveLength(3); // Drake, Michael Jackson, and Taylor Swift contain 'a'
  });

  it("combines all filters", () => {
    const result = filterArtists(mockArtists, "michael", ["solo"], ["deceased"]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Michael Jackson");
  });

  it("returns empty array when no matches", () => {
    const result = filterArtists(mockArtists, "nonexistent");
    expect(result).toHaveLength(0);
  });

  it("handles empty search query", () => {
    const result = filterArtists(mockArtists, "");
    expect(result).toHaveLength(5);
  });

  it("handles whitespace in search query", () => {
    const result = filterArtists(mockArtists, "  drake  ");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Drake");
  });

  it("handles empty type filter array", () => {
    const result = filterArtists(mockArtists, null, []);
    expect(result).toHaveLength(5);
  });

  it("handles empty misc filter array", () => {
    const result = filterArtists(mockArtists, null, undefined, []);
    expect(result).toHaveLength(5);
  });
});
