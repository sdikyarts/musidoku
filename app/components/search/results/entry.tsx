import React, { useState } from "react";
import Image from "next/image";

type Props = {
  name: string;
  imageUrl?: string | null;
  showDivider?: boolean;
};

export default function SearchResultEntry({
  name,
  imageUrl,
  showDivider = true,
}: Readonly<Props>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      style={{
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
                    padding: "6px",
                    borderRadius: "4px",
                    backgroundColor: isHovered ? "#E5F4F8" : "transparent",
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
                    <div
                        style={{
                        width: "32px",
                        height: "32px",
                        flexShrink: 0,
                        overflow: "hidden",
                        borderRadius: "4px",
                        }}
                    >
                        {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            width={32}
                            height={32}
                            style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            }}
                        />
                        ) : null}
                    </div>
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
  );
}
