import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryButton from "./category";

describe("CategoryButton", () => {
  it("renders with default label", () => {
    render(<CategoryButton />);
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<CategoryButton label="Custom Category" />);
    expect(screen.getByText("Custom Category")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<CategoryButton label="Click me" onClick={handleClick} />);
    
    const button = screen.getByRole("button");
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows close icon when showCloseIcon is true", () => {
    const { container } = render(<CategoryButton label="With Close" showCloseIcon={true} />);
    const closeIcon = container.querySelector('.close-icon');
    expect(closeIcon).toBeInTheDocument();
  });

  it("hides close icon when showCloseIcon is false", () => {
    const { container } = render(<CategoryButton label="Without Close" showCloseIcon={false} />);
    const closeIcon = container.querySelector('.close-icon');
    expect(closeIcon).not.toBeInTheDocument();
  });

  it("applies custom text color", () => {
    const { container } = render(<CategoryButton label="Custom" textColor="#FF0000" />);
    const button = container.querySelector('button');
    expect(button?.style.color).toBe("#FF0000");
  });

  it("applies custom background color", () => {
    const { container } = render(<CategoryButton label="Custom" backgroundColor="#00FF00" />);
    const button = container.querySelector('button');
    expect(button?.style.backgroundColor).toBe("#00FF00");
  });

  it("renders custom icon", () => {
    const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;
    render(<CategoryButton label="With Icon" icon={<CustomIcon />} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("applies custom icon size", () => {
    const { container } = render(<CategoryButton label="Custom Size" iconSize={32} />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it("calls mouse event handlers", () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <CategoryButton 
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
      <CategoryButton 
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
