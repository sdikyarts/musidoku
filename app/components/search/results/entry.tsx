import React from "react";
import Image from "next/image";
import HoverableListItem from "../../shared/HoverableListItem";

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
  return (
    <HoverableListItem showDivider={showDivider}>
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
    </HoverableListItem>
  );
}
