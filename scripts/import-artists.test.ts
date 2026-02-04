import { describe, expect, it, vi } from "vitest";
import {
  createEnumNormalizer,
  createOptionalEnumNormalizer,
  defaultNormalizers,
  importArtists,
  mapRowToArtist,
  toSafeString,
  type ImporterDependencies,
} from "./import-artists";

describe("toSafeString", () => {
  it("returns empty string for non-primitive values", () => {
    expect(toSafeString({ foo: "bar" })).toBe("");
    expect(toSafeString(undefined)).toBe("");
    expect(toSafeString(null)).toBe("");
  });

  it("stringifies primitives", () => {
    expect(toSafeString("abc")).toBe("abc");
    expect(toSafeString(42)).toBe("42");
    expect(toSafeString(false)).toBe("false");
  });
});

describe("normalizers", () => {
  const allowed = ["a", "b"] as const;

  it("falls back when value is not allowed", () => {
    const normalizer = createEnumNormalizer(allowed, "b");
    expect(normalizer.normalize("a")).toBe("a");
    expect(normalizer.normalize("unknown")).toBe("b");
  });

  it("returns null for optional enum when value is empty or invalid", () => {
    const normalizer = createOptionalEnumNormalizer(allowed);
    expect(normalizer.normalize("a")).toBe("a");
    expect(normalizer.normalize("c")).toBeNull();
    expect(normalizer.normalize("")).toBeNull();
  });
});

describe("mapRowToArtist", () => {
  it("normalizes unknown enum values to fallbacks", () => {
    const row = {
      spotify_id: "1",
      scraper_name: "name",
      chartmasters_name: "",
      scraper_image_url: "",
      mb_id: "uuid",
      mb_type_raw: "type",
      parsed_artist_type: "not-real",
      gender: "unknown-value",
      country: "US",
      birth_date: "",
      death_date: "",
      disband_date: "",
      debut_year: "2000",
      member_count: "4",
      genres: "rock",
      primary_genre: "unknown-genre",
      secondary_genre: "invalid",
      is_dead: "false",
      is_disbanded: "false",
    };

    const artist = mapRowToArtist(row, defaultNormalizers);
    expect(artist.parsed_artist_type).toBe("unknown");
    expect(artist.gender).toBe("unknown");
    expect(artist.primary_genre).toBe("pop");
    expect(artist.secondary_genre).toBeNull();
  });
});

describe("importArtists", () => {
  it("chunks work and uses provided dependencies", async () => {
    const rows = [
      { spotify_id: "1", scraper_name: "a", chartmasters_name: "", scraper_image_url: "", mb_id: "id1", mb_type_raw: "type", parsed_artist_type: "solo", gender: "male", country: "US", birth_date: "", death_date: "", disband_date: "", debut_year: "2000", member_count: "3", genres: "rock", primary_genre: "rock", secondary_genre: "", is_dead: "false", is_disbanded: "false" },
      { spotify_id: "2", scraper_name: "b", chartmasters_name: "", scraper_image_url: "", mb_id: "id2", mb_type_raw: "type", parsed_artist_type: "group", gender: "female", country: "GB", birth_date: "", death_date: "", disband_date: "", debut_year: "2001", member_count: "4", genres: "pop", primary_genre: "pop", secondary_genre: "", is_dead: "false", is_disbanded: "false" },
    ];

    const reader: ImporterDependencies["reader"] = {
      read: vi.fn().mockResolvedValue("raw-csv"),
    };
    const parser: ImporterDependencies["parser"] = {
      parse: vi.fn().mockReturnValue(rows),
    };
    const repository: ImporterDependencies["repository"] = {
      upsertBatch: vi.fn().mockResolvedValue(undefined),
    };

    await importArtists("fake.csv", {
      reader,
      parser,
      repository,
      normalizers: defaultNormalizers,
      chunkSize: 1,
    });

    expect(reader.read).toHaveBeenCalledWith("fake.csv");
    expect(parser.parse).toHaveBeenCalledWith("raw-csv");
    expect(repository.upsertBatch).toHaveBeenCalledTimes(2);
    expect(repository.upsertBatch).toHaveBeenCalledWith(expect.any(Array));
  });
});
