import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./button";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button href="/test" text="Click me" />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders as a link with correct href", () => {
    render(<Button href="/artists" text="Artists" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/artists");
  });

  it("applies small size styles", () => {
    const { container } = render(<Button href="/test" text="Small" size="small" />);
    const button = container.querySelector('button[style*="height: 32px"]');
    expect(button).toBeInTheDocument();
  });

  it("applies medium size styles by default", () => {
    const { container } = render(<Button href="/test" text="Medium" />);
    const button = container.querySelector('button[style*="height: 36px"]');
    expect(button).toBeInTheDocument();
  });

  it("applies large size styles", () => {
    const { container } = render(<Button href="/test" text="Large" size="large" />);
    const button = container.querySelector('button[style*="height: 44px"]');
    expect(button).toBeInTheDocument();
  });

  it("applies solid variant styles by default", () => {
    const { container } = render(<Button href="/test" text="Solid" />);
    const button = container.querySelector('button[style*="background"]');
    expect(button).toBeInTheDocument();
  });

  it("applies ghost variant styles", () => {
    const { container } = render(<Button href="/test" text="Ghost" variant="ghost" />);
    const button = container.querySelector('button[style*="transparent"]');
    expect(button).toBeInTheDocument();
  });

  it("applies active color for ghost variant", () => {
    const { container } = render(<Button href="/test" text="Active" variant="ghost" isActive />);
    const button = container.querySelector('button[style*="#6D7FD9"]');
    expect(button).toBeInTheDocument();
  });

  it("removes padding when noPadding is true for ghost variant", () => {
    const { container } = render(<Button href="/test" text="No Padding" variant="ghost" noPadding />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button?.style.paddingLeft).toBe("0px");
  });

  it("has proper accessibility label", () => {
    render(<Button href="/test" text="Accessible Button" />);
    const link = screen.getByLabelText("Accessible Button");
    expect(link).toBeInTheDocument();
  });
});
