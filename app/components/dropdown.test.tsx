import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Dropdown from "./dropdown";

describe("Dropdown", () => {
  beforeEach(() => {
    // Mock globalThis.window.innerWidth
    Object.defineProperty(globalThis.window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renders with default label", () => {
    render(<Dropdown />);
    expect(screen.getByLabelText("Dropdown")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<Dropdown label="Filter" />);
    expect(screen.getByLabelText("Filter")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Dropdown onClick={handleClick} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onMouseEnter handler", () => {
    const handleMouseEnter = vi.fn();
    render(<Dropdown onMouseEnter={handleMouseEnter} />);
    
    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
    
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
  });

  it("calls onMouseLeave handler", () => {
    const handleMouseLeave = vi.fn();
    render(<Dropdown onMouseLeave={handleMouseLeave} />);
    
    const button = screen.getByRole("button");
    fireEvent.mouseLeave(button);
    
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("calls onFocus handler", () => {
    const handleFocus = vi.fn();
    render(<Dropdown onFocus={handleFocus} />);
    
    const button = screen.getByRole("button");
    fireEvent.focus(button);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("calls onBlur handler", () => {
    const handleBlur = vi.fn();
    render(<Dropdown onBlur={handleBlur} />);
    
    const button = screen.getByRole("button");
    fireEvent.blur(button);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("shows label on wide screens", () => {
    Object.defineProperty(globalThis.window, "innerWidth", { value: 1024 });
    render(<Dropdown label="Wide Screen" />);
    expect(screen.getByText("Wide Screen")).toBeInTheDocument();
  });

  it("always shows label when alwaysShowLabel is true", () => {
    Object.defineProperty(globalThis.window, "innerWidth", { value: 800 });
    render(<Dropdown label="Always Visible" alwaysShowLabel />);
    expect(screen.getByText("Always Visible")).toBeInTheDocument();
  });

  it("applies custom text color", () => {
    const { container } = render(<Dropdown textColor="#FF0000" />);
    const button = container.querySelector('button[style*="color"]');
    expect(button).toBeInTheDocument();
  });

  it("applies custom background color", () => {
    const { container } = render(<Dropdown backgroundColor="#00FF00" />);
    const button = container.querySelector('button[style*="background"]');
    expect(button).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;
    render(<Dropdown icon={<CustomIcon />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
