import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Search from "./search";

describe("Search", () => {
  it("renders search input", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Search");
    expect(input).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Search") as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: "Drake" } });
    expect(input.value).toBe("Drake");
  });

  it("shows clear button when query is not empty", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Search");
    
    fireEvent.change(input, { target: { value: "Drake" } });
    const clearButton = screen.getByLabelText("Clear search");
    expect(clearButton).toBeInTheDocument();
  });

  it("hides clear button when query is empty", () => {
    render(<Search />);
    const clearButton = screen.queryByLabelText("Clear search");
    expect(clearButton).not.toBeInTheDocument();
  });

  it("clears input when clear button is clicked", () => {
    render(<Search />);
    const input = screen.getByPlaceholderText("Search") as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: "Drake" } });
    expect(input.value).toBe("Drake");
    
    const clearButton = screen.getByLabelText("Clear search");
    fireEvent.click(clearButton);
    expect(input.value).toBe("");
  });

  it("has proper accessibility labels", () => {
    render(<Search />);
    const input = screen.getByLabelText("Search artists");
    expect(input).toBeInTheDocument();
  });
});
