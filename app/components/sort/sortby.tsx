import React, { useState } from "react";

type Props = {
  name: string;
  icon: React.ReactNode;
  onSelect: () => void;
  showDivider?: boolean;
  active?: boolean;
};

export default function SortBy({ 
    name,
    icon,
    onSelect,
    showDivider = true,
    active = false,
}: Readonly<Props>) {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = active || isHovered;

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
            onClick={onSelect}
            aria-pressed={active}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    padding: showDivider ? "0 0 6px 0" : "0"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        padding: "6px 10px 6px 6px",
                        borderRadius: "4px",
                        backgroundColor: isActive ? "#E5F4F8" : "transparent",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            height: "100%",
                            alignItems: "center",
                            flexShrink: "0",
                            gap: "12px",
                        }}
                    >
                        {icon}
                        <div
                            style={{
                            color: "var(--Colors-Text-Primary, #051411)",
                            fontFamily: "Inter",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 550,
                            lineHeight: "20px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            }}
                        >
                            {name}
                        </div>
                    </div>
                </div>
            </div>
                    {showDivider ? (
          <div
            style={{
                    width: "100%",
                    height: "1.5px",
                    background: "var(--Colors-Search-Bar-Placeholder, #6D7FD9)",
                    borderRadius: "1.5px",
                }}
            />
            ) : null}
        </button>
    )
}
