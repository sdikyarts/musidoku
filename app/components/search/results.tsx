import React from "react";
import SearchResultEntry from "./results/entry";

type Result = {
  id: string;
  name: string;
  imageUrl?: string | null;
};

type Props = {
  results: Result[];
  visible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function SearchResults({
  results,
  visible,
  onMouseEnter,
  onMouseLeave,
}: Readonly<Props>) {
  if (!visible || results.length === 0) {
    return null;
  }

  return (
    <ul
      aria-label="Search results"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        right: 0,
        width: "100%",
        padding: "12px",
        gap: "6px",
        borderRadius: "6px",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.0875)",
        background: "var(--Colors-Background-Secondary, #C2D4ED)",
        display: "flex",
        flexDirection: "column",
        listStyleType: "none",
        margin: 0,
        zIndex: 100,
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {results.map((result, index) => (
        <li key={result.id} style={{ width: "100%" }}>
          <SearchResultEntry
            id={result.id}
            name={result.name}
            imageUrl={result.imageUrl}
            showDivider={index !== results.length - 1}
          />
        </li>
      ))}
    </ul>
  );
}
