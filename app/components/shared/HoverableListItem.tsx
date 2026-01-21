import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
  showDivider?: boolean;
  onClick?: () => void;
  isActive?: boolean;
  padding?: string;
};

export default function HoverableListItem({
  children,
  showDivider = true,
  onClick,
  isActive = false,
  padding = "6px",
}: Readonly<Props>) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldHighlight = isActive || isHovered;

  return (
    <button
      type="button"
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
        width: "100%",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          padding: showDivider ? "0 0 6px 0" : "0",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            padding,
            borderRadius: "4px",
            backgroundColor: shouldHighlight ? "#E5F4F8" : "transparent",
          }}
        >
          {children}
        </div>
      </div>
      {showDivider && (
        <div
          style={{
            width: "100%",
            height: "1.5px",
            background: "var(--Colors-Search-Bar-Placeholder, #6D7FD9)",
            borderRadius: "1.5px",
          }}
        />
      )}
    </button>
  );
}
