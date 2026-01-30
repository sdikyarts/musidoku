import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChoicePill from "./choice";

describe("ChoicePill", () => {
  it("renders with default label", () => {
    render(<ChoicePill />);
    expect(screen.getByLabelText("Pill")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<ChoicePill label="Custom Label" />);
    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<ChoicePill label="Click me" onClick={handleClick} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies selected styles when selected", () => {
    const { container } = render(<ChoicePill label="Selected" selected={true} />);
    const button = container.querySelector('button');
    expect(button?.style.background).toContain("#6D7FD9");
  });

  it("applies unselected styles when not selected", () => {
    const { container } = render(<ChoicePill label="Unselected" selected={false} />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it("uses custom text color", () => {
    const { container } = render(<ChoicePill label="Custom" textColor="#FF0000" />);
    const button = container.querySelector('button');
    expect(button?.style.color).toBe("#FF0000");
  });

  it("uses custom background color", () => {
    const { container } = render(<ChoicePill label="Custom" backgroundColor="#00FF00" />);
    const button = container.querySelector('button');
    expect(button?.style.background).toBe("#00FF00");
  });

  it("renders custom icon", () => {
    const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;
    render(<ChoicePill label="With Icon" icon={<CustomIcon />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("uses selectedIcon when selected", () => {
    const SelectedIcon = () => <span data-testid="selected-icon">Selected</span>;
    const UnselectedIcon = () => <span data-testid="unselected-icon">Unselected</span>;
    render(
      <ChoicePill 
        label="Icon Switch" 
        icon={<UnselectedIcon />} 
        selectedIcon={<SelectedIcon />}
        selected={true}
      />
    );
    expect(screen.getByTestId("selected-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("unselected-icon")).not.toBeInTheDocument();
  });

  it("calls mouse event handlers", () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <ChoicePill 
        label="Mouse Events" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );
    
    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(button);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("calls focus event handlers", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <ChoicePill 
        label="Focus Events" 
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
    
    const button = screen.getByRole("button");
    fireEvent.focus(button);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(button);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});
