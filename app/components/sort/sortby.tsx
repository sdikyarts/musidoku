import React from "react";
import HoverableListItem from "../shared/HoverableListItem";

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
    return (
        <HoverableListItem
            showDivider={showDivider}
            onClick={onSelect}
            isActive={active}
            padding="6px 10px 6px 6px"
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
        </HoverableListItem>
    );
}
