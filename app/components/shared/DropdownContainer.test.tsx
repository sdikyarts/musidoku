import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DropdownContainer from "./DropdownContainer";

describe("DropdownContainer", () => {
  it("renders children when visible", () => {
    render(
      <DropdownContainer visible={true}>
        <div>Dropdown Content</div>
      </DropdownContainer>
    );
    expect(screen.getByText("Dropdown Content")).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    render(
      <DropdownContainer visible={false}>
        <div>Dropdown Content</div>
      </DropdownContainer>
    );
    expect(screen.queryByText("Dropdown Content")).not.toBeInTheDocument();
  });

  it("calls onClickOutside when clicking outside", () => {
    const handleClickOutside = vi.fn();
    render(
      <DropdownContainer visible={true} onClickOutside={handleClickOutside}>
        <div>Dropdown Content</div>
      </DropdownContainer>
    );
    
    fireEvent.mouseDown(document.body);
    expect(handleClickOutside).toHaveBeenCalledTimes(1);
  });

  it("does not call onClickOutside when clicking inside", () => {
    const handleClickOutside = vi.fn();
    render(
      <DropdownContainer visible={true} onClickOutside={handleClickOutside}>
        <div>Dropdown Content</div>
      </DropdownContainer>
    );
    
    const content = screen.getByText("Dropdown Content");
    fireEvent.mouseDown(content);
    expect(handleClickOutside).not.toHaveBeenCalled();
  });

  it("applies custom minWidth", () => {
    const { container } = render(
      <DropdownContainer visible={true} minWidth="400px">
        <div>Content</div>
      </DropdownContainer>
    );
    
    const dropdown = container.firstChild as HTMLElement;
    expect(dropdown.style.minWidth).toBe("400px");
  });

  it("uses default minWidth when not specified", () => {
    const { container } = render(
      <DropdownContainer visible={true}>
        <div>Content</div>
      </DropdownContainer>
    );
    
    const dropdown = container.firstChild as HTMLElement;
    expect(dropdown.style.minWidth).toBe("256px");
  });

  it("handles touch events for mobile", () => {
    const handleClickOutside = vi.fn();
    render(
      <DropdownContainer visible={true} onClickOutside={handleClickOutside}>
        <div>Dropdown Content</div>
      </DropdownContainer>
    );
    
    fireEvent.touchStart(document.body);
    expect(handleClickOutside).toHaveBeenCalledTimes(1);
  });
});
