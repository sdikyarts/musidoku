import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Logo from "./logo";

describe("Logo", () => {
  it("renders the logo text", () => {
    render(<Logo />);
    expect(screen.getByText("Musidoku")).toBeInTheDocument();
  });

  it("links to home page", () => {
    render(<Logo />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("has proper accessibility label", () => {
    render(<Logo />);
    const link = screen.getByLabelText("Home");
    expect(link).toBeInTheDocument();
  });

  it("applies correct styling", () => {
    const { container } = render(<Logo />);
    const span = container.querySelector('span');
    expect(span?.style.fontWeight).toBe("800");
    expect(span?.style.fontSize).toBe("27px");
  });
});
