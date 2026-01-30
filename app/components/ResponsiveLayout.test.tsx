import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ResponsiveLayout from "./ResponsiveLayout";

describe("ResponsiveLayout", () => {
  it("renders children", () => {
    const { container } = render(
      <ResponsiveLayout>
        <div>Test Content</div>
      </ResponsiveLayout>
    );
    expect(container.textContent).toContain("Test Content");
  });

  it("applies correct container styles", () => {
    const { container } = render(
      <ResponsiveLayout>
        <div>Content</div>
      </ResponsiveLayout>
    );
    
    const layout = container.firstChild as HTMLElement;
    expect(layout.style.display).toBe("flex");
    expect(layout.style.flexDirection).toBe("column");
  });

  it("handles multiple children", () => {
    const { container } = render(
      <ResponsiveLayout>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ResponsiveLayout>
    );
    expect(container.textContent).toContain("Child 1");
    expect(container.textContent).toContain("Child 2");
    expect(container.textContent).toContain("Child 3");
  });
});
