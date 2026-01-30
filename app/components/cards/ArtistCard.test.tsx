import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ArtistCard from "./ArtistCard";

describe("ArtistCard", () => {
  it("renders artist name", () => {
    render(<ArtistCard id="123" name="Drake" />);
    expect(screen.getByText("Drake")).toBeInTheDocument();
  });

  it("renders with image URL", () => {
    const { container } = render(
      <ArtistCard id="123" name="Drake" imageUrl="https://example.com/image.jpg" />
    );
    const imageDiv = container.querySelector('div[style*="background"]');
    expect(imageDiv).toBeInTheDocument();
    expect(imageDiv?.style.background).toContain("https://example.com/image.jpg");
  });

  it("renders with default background when no image", () => {
    const { container } = render(<ArtistCard id="123" name="Drake" />);
    const imageDiv = container.querySelector('div[style*="lightgray"]');
    expect(imageDiv).toBeInTheDocument();
  });

  it("links to artist detail page", () => {
    render(<ArtistCard id="test-id" name="Drake" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/artists/test-id");
  });

  it("applies custom card size", () => {
    const { container } = render(<ArtistCard id="123" name="Drake" cardSize={150} />);
    const link = container.querySelector('a[style*="width: 150px"]');
    expect(link).toBeInTheDocument();
  });

  it("uses smaller font size for smaller cards", () => {
    const { container } = render(<ArtistCard id="123" name="Drake" cardSize={150} />);
    const nameElement = container.querySelector('p[style*="font-size: 14px"]');
    expect(nameElement).toBeInTheDocument();
  });

  it("uses default font size for larger cards", () => {
    const { container } = render(<ArtistCard id="123" name="Drake" cardSize={200} />);
    const nameElement = container.querySelector('p[style*="font-size: 16px"]');
    expect(nameElement).toBeInTheDocument();
  });
});
