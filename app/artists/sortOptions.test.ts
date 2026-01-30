import { describe, it, expect } from "vitest";
import { parseSortParam, sortArtists, DEFAULT_ARTIST_SORT, type SortableArtist } from "./sortOptions";

describe("parseSortParam", () => {
  it("returns valid sort value when provided", () => {
    expect(parseSortParam("name-asc")).toBe("name-asc");
    expect(parseSortParam("name-desc")).toBe("name-desc");
    expect(parseSortParam("debut-asc")).toBe("debut-asc");
    expect(parseSortParam("debut-desc")).toBe("debut-desc");
    expect(parseSortParam("roster-asc")).toBe("roster-asc");
    expect(parseSortParam("roster-desc")).toBe("roster-desc");
  });

  it("returns default sort for invalid values", () => {
    expect(parseSortParam("invalid")).toBe(DEFAULT_ARTIST_SORT);
    expect(parseSortParam(null)).toBe(DEFAULT_ARTIST_SORT);
    expect(parseSortParam("")).toBe(DEFAULT_ARTIST_SORT);
  });
});

describe("sortArtists", () => {
  const mockArtists: SortableArtist[] = [
    { name: "Drake", debutYear: 2006 },
    { name: "Taylor Swift", debutYear: 2006 },
    { name: "The Beatles", debutYear: 1960 },
    { name: "Adele", debutYear: 2008 },
    { name: "Unknown Artist", debutYear: null },
  ];

  it("returns artists in original order for roster-asc", () => {
    const result = sortArtists(mockArtists, "roster-asc");
    expect(result[0].name).toBe("Drake");
    expect(result[1].name).toBe("Taylor Swift");
  });

  it("returns artists in reverse order for roster-desc", () => {
    const result = sortArtists(mockArtists, "roster-desc");
    expect(result[0].name).toBe("Unknown Artist");
    expect(result[4].name).toBe("Drake");
  });

  it("sorts artists alphabetically for name-asc", () => {
    const result = sortArtists(mockArtists, "name-asc");
    expect(result[0].name).toBe("Adele");
    expect(result[1].name).toBe("Drake");
    expect(result[2].name).toBe("Taylor Swift");
    expect(result[3].name).toBe("The Beatles");
  });

  it("sorts artists reverse alphabetically for name-desc", () => {
    const result = sortArtists(mockArtists, "name-desc");
    expect(result[0].name).toBe("Unknown Artist");
    expect(result[1].name).toBe("The Beatles");
    expect(result[2].name).toBe("Taylor Swift");
  });

  it("sorts artists by debut year ascending", () => {
    const result = sortArtists(mockArtists, "debut-asc");
    expect(result[0].name).toBe("The Beatles");
    expect(result[1].name).toBe("Drake");
    expect(result[2].name).toBe("Taylor Swift");
    expect(result[3].name).toBe("Adele");
    // Null values should be last
    expect(result[4].name).toBe("Unknown Artist");
  });

  it("sorts artists by debut year descending", () => {
    const result = sortArtists(mockArtists, "debut-desc");
    expect(result[0].name).toBe("Adele");
    expect(result[result.length - 2].name).toBe("The Beatles");
    // Null values should be last
    expect(result[result.length - 1].name).toBe("Unknown Artist");
  });

  it("uses default sort for invalid sort value", () => {
    const result = sortArtists(mockArtists, null);
    expect(result[0].name).toBe("Drake");
  });

  it("does not mutate original array", () => {
    const original = [...mockArtists];
    sortArtists(mockArtists, "name-asc");
    expect(mockArtists).toEqual(original);
  });

  it("handles empty array", () => {
    const result = sortArtists([], "name-asc");
    expect(result).toEqual([]);
  });

  it("sorts by name when debut years are equal", () => {
    const artists: SortableArtist[] = [
      { name: "Zara", debutYear: 2006 },
      { name: "Aaron", debutYear: 2006 },
    ];
    const result = sortArtists(artists, "debut-asc");
    expect(result[0].name).toBe("Aaron");
    expect(result[1].name).toBe("Zara");
  });
});
