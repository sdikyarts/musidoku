import { describe, it, expect } from "vitest";
import { calculateHorizontalPadding, calculateNavbarHorizontalPadding } from "./padding";

describe("calculateHorizontalPadding", () => {
  it("returns 288 for screens >= 1440px", () => {
    expect(calculateHorizontalPadding(1440)).toBe(288);
    expect(calculateHorizontalPadding(1920)).toBe(288);
  });

  it("returns 224 for screens >= 1280px and < 1440px", () => {
    expect(calculateHorizontalPadding(1280)).toBe(224);
    expect(calculateHorizontalPadding(1439)).toBe(224);
  });

  it("returns 128 for screens >= 1096px and < 1280px", () => {
    expect(calculateHorizontalPadding(1096)).toBe(128);
    expect(calculateHorizontalPadding(1279)).toBe(128);
  });

  it("returns 96 for screens >= 960px and < 1096px", () => {
    expect(calculateHorizontalPadding(960)).toBe(96);
    expect(calculateHorizontalPadding(1095)).toBe(96);
  });

  it("returns 48 for screens >= 640px and < 960px", () => {
    expect(calculateHorizontalPadding(640)).toBe(48);
    expect(calculateHorizontalPadding(959)).toBe(48);
  });

  it("returns 24 for screens < 640px", () => {
    expect(calculateHorizontalPadding(320)).toBe(24);
    expect(calculateHorizontalPadding(639)).toBe(24);
  });

  it("returns default value when no screenWidth provided", () => {
    const result = calculateHorizontalPadding();
    expect(result).toBe(96); // Returns value based on window.innerWidth in test environment
  });
});

describe("calculateNavbarHorizontalPadding", () => {
  it("returns 96 for screens >= 1096px", () => {
    expect(calculateNavbarHorizontalPadding(1096)).toBe(96);
    expect(calculateNavbarHorizontalPadding(1440)).toBe(96);
    expect(calculateNavbarHorizontalPadding(1920)).toBe(96);
  });

  it("uses universal padding for screens < 1096px", () => {
    expect(calculateNavbarHorizontalPadding(960)).toBe(96);
    expect(calculateNavbarHorizontalPadding(640)).toBe(48);
    expect(calculateNavbarHorizontalPadding(320)).toBe(24);
  });

  it("returns default value when no screenWidth provided", () => {
    const result = calculateNavbarHorizontalPadding();
    expect(result).toBe(96); // SSR default
  });
});
