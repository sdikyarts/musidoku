"use client";

import React, { useState } from "react";
import SearchIcon from "./icons/SearchIcon";
import CloseSmallIcon from "./icons/CloseSmallIcon";

export default function Search() {
  const [query, setQuery] = useState("");
  const placeholderColor = "var(--Colors-Search-Bar-Placeholder, #6D7FD9)";
  const textColor = query ? "var(--foreground, #051411)" : placeholderColor;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "44px",
        minWidth: "360px",
        padding: "10px 16px",
        borderRadius: "6px",
        background: "var(--Colors-Search-Bar-Fill, #C2D4ED)",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--Spacings-Gaps-8px, 8px)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--Spacings-Gaps-8px, 8px)",
          width: "100%",
        }}
      >
        <SearchIcon color={placeholderColor} />
        <input
          aria-label="Search artists"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="search-input"
          style={{
            color: textColor,
            fontFamily: "Inter",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 550,
            lineHeight: "normal",
            background: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
          }}
        />
      </div>
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Clear search"
        >
          <CloseSmallIcon className="close-icon" />
        </button>
      )}
      <style>{`
        .search-input::placeholder {
          color: ${placeholderColor};
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
