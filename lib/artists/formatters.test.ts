import { vi } from "vitest";
import {
  formatRosterNumber,
  formatGenre,
  formatType,
  formatGender,
  getCountryDisplay,
  getLifeStatusLabel,
  getGroupStatusLabel,
} from "./formatters";

// Mock the country-kit module
vi.mock("@andreasnicolaou/country-kit", () => ({
  CountryKit: {
    getCountryByCode: (code: string) => {
      const countries: Record<string, { emoji: string; name: string }> = {
        us: { emoji: "🇺🇸", name: "United States" },
        gb: { emoji: "🇬🇧", name: "United Kingdom" },
        ca: { emoji: "🇨🇦", name: "Canada" },
      };
      return countries[code];
    },
  },
}));

describe("formatRosterNumber", () => {
  it("converts 0-indexed database value to 1-indexed display value", () => {
    expect(formatRosterNumber(0)).toBe(1);
    expect(formatRosterNumber(1)).toBe(2);
    expect(formatRosterNumber(199)).toBe(200);
  });

  it("handles null by defaulting to 1", () => {
    expect(formatRosterNumber(null)).toBe(1);
  });

  it("handles undefined by defaulting to 1", () => {
    expect(formatRosterNumber(undefined)).toBe(1);
  });
});

describe("formatGenre", () => {
  it("formats hip hop correctly", () => {
    expect(formatGenre("hip hop")).toBe("Hip-Hop");
  });

  it("capitalizes hyphenated genres", () => {
    expect(formatGenre("pop-rock")).toBe("Pop-Rock");
    expect(formatGenre("indie-folk")).toBe("Indie-Folk");
  });

  it("capitalizes single word genres", () => {
    expect(formatGenre("pop")).toBe("Pop");
    expect(formatGenre("rock")).toBe("Rock");
  });
});

describe("formatType", () => {
  it("formats solo as Soloist", () => {
    expect(formatType("solo")).toBe("Soloist");
  });

  it("capitalizes other types", () => {
    expect(formatType("band")).toBe("Band");
    expect(formatType("group")).toBe("Group");
  });
});

describe("formatGender", () => {
  it("capitalizes gender", () => {
    expect(formatGender("male")).toBe("Male");
    expect(formatGender("female")).toBe("Female");
    expect(formatGender("other")).toBe("Other");
  });
});

describe("getCountryDisplay", () => {
  it("returns emoji and name for known countries", () => {
    expect(getCountryDisplay("us")).toBe("🇺🇸 United States");
    expect(getCountryDisplay("gb")).toBe("🇬🇧 United Kingdom");
  });

  it("returns country code for unknown countries", () => {
    expect(getCountryDisplay("xx")).toBe("xx");
  });
});

describe("getLifeStatusLabel", () => {
  it("returns Deceased for true", () => {
    expect(getLifeStatusLabel(true)).toBe("Deceased");
  });

  it("returns Alive for false", () => {
    expect(getLifeStatusLabel(false)).toBe("Alive");
  });

  it("returns - for null", () => {
    expect(getLifeStatusLabel(null)).toBe("-");
  });
});

describe("getGroupStatusLabel", () => {
  it("returns Disbanded for true", () => {
    expect(getGroupStatusLabel(true)).toBe("Disbanded");
  });

  it("returns Existing for false", () => {
    expect(getGroupStatusLabel(false)).toBe("Existing");
  });

  it("returns - for null", () => {
    expect(getGroupStatusLabel(null)).toBe("-");
  });
});
