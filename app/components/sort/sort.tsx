'use client';

import React, { useEffect, useRef } from "react";
import SortBy from "./sortby";
import type { ArtistSortValue } from "../../artists/sortOptions";

type Props = {
  categories: SortCategory[];
  visible: boolean;
  onSelectCategory: (categoryValue: ArtistSortValue) => void;
  activeValue: ArtistSortValue;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClickOutside?: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

type SortCategory = {
    name: string;
    value: ArtistSortValue;
    icon: React.ReactNode;
}

export default function SortArtist({
    categories,
    visible,
    onSelectCategory,
    activeValue,
    onMouseEnter,
    onMouseLeave,
    onClickOutside,
    triggerRef,
}: Readonly<Props>) {
    const listRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (!visible) return;
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!listRef.current) return;
            if (event.target instanceof Node && (listRef.current.contains(event.target) || triggerRef?.current?.contains(event.target))) {
                return;
            }
            onClickOutside?.();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [visible, onClickOutside, triggerRef]);

    if (!visible) {
        return null;
    }

    return (
        <ul
            aria-label="Sort options"
            ref={listRef}
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
                right: "auto",
                width: "fit-content",
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
            {categories.map((category, index) => (
                <li key={category.name} style={{ width: "100%" }}>
                    <SortBy
                        name={category.name}
                        icon={category.icon}
                        onSelect={() => onSelectCategory(category.value)}
                        active={category.value === activeValue}
                        showDivider={index < categories.length - 1}
                    />
                </li>
            ))}
        </ul>
    )
}
