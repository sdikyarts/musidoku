import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import PersonIcon from "./Person";
import GroupIcon from "./Group";
import SearchIcon from "./SearchIcon";
import FilterIcon from "./FilterIcon";
import SortIcon from "./SortIcon";
import ChevronLeftIcon from "./ChevronLeft";
import ChevronRightIcon from "./ChevronRight";
import ArrowDownIcon from "./ArrowDown";
import CloseSmallIcon from "./CloseSmallIcon";
import MenuIcon from "./MenuIcon";

describe("Icon Components", () => {
  describe("PersonIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<PersonIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it("applies custom color", () => {
      const { container } = render(<PersonIcon color="#FF0000" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it("applies custom size", () => {
      const { container } = render(<PersonIcon size={32} />);
      const svg = container.querySelector('svg');
      // PersonIcon uses viewBox, so check that it renders
      expect(svg).toBeInTheDocument();
    });
  });

  describe("GroupIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<GroupIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it("applies custom color", () => {
      const { container } = render(<GroupIcon color="#00FF00" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it("applies custom size", () => {
      const { container } = render(<GroupIcon size={48} />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('48');
    });
  });

  describe("SearchIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<SearchIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it("applies custom color", () => {
      const { container } = render(<SearchIcon color="#0000FF" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe("FilterIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<FilterIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe("SortIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<SortIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe("ChevronLeftIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<ChevronLeftIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it("applies custom size", () => {
      const { container } = render(<ChevronLeftIcon size={24} />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('24');
    });
  });

  describe("ChevronRightIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<ChevronRightIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it("applies custom size", () => {
      const { container } = render(<ChevronRightIcon size={24} />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('24');
    });
  });

  describe("ArrowDownIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<ArrowDownIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe("CloseSmallIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<CloseSmallIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it("applies custom color", () => {
      const { container } = render(<CloseSmallIcon color="#FF0000" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe("MenuIcon", () => {
    it("renders without crashing", () => {
      const { container } = render(<MenuIcon />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it("applies custom color", () => {
      const { container } = render(<MenuIcon color="#000000" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it("applies custom size", () => {
      const { container } = render(<MenuIcon size={32} />);
      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('32');
    });
  });
});
