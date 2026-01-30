import { formatRosterNumber } from "./formatters";

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
