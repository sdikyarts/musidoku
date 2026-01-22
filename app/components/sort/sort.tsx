'use client';

import React, { useEffect, useRef, useState } from "react";
import SortBy from "./sortby";
import type { ArtistSortValue } from "../../artists/sortOptions";
import { calculateHorizontalPadding } from "@/lib/layout/padding";

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
    const [isCenteredPopup, setIsCenteredPopup] = useState(false);
    const [horizontalPadding, setHorizontalPadding] = useState(24);

    useEffect(() => {
        const checkScreenWidth = () => {
            if (globalThis.window === undefined) return;
            const width = globalThis.window.innerWidth;
            setIsCenteredPopup(width <= 959);
            setHorizontalPadding(calculateHorizontalPadding(width));
        };
        
        checkScreenWidth();
        globalThis.window.addEventListener('resize', checkScreenWidth);
        return () => globalThis.window.removeEventListener('resize', checkScreenWidth);
    }, []);

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
        <>
            {isCenteredPopup && (
                <button
                    type="button"
                    aria-label="Close sort menu"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        zIndex: 9999,
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                    }}
                    onClick={onClickOutside}
                />
            )}
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
                    position: isCenteredPopup ? "fixed" : "absolute",
                    top: isCenteredPopup ? "50%" : "calc(100% + 8px)",
                    left: isCenteredPopup ? `${horizontalPadding}px` : 0,
                    right: isCenteredPopup ? `${horizontalPadding}px` : "auto",
                    transform: isCenteredPopup ? "translateY(-50%)" : "none",
                    width: isCenteredPopup ? "auto" : "fit-content",
                    minWidth: isCenteredPopup ? "452px" : "auto",
                    maxWidth: isCenteredPopup ? "959px" : "none",
                    maxHeight: isCenteredPopup ? "min(60vh, 500px)" : "none",
                    padding: "12px",
                    gap: "6px",
                    borderRadius: "6px",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.0875)",
                    background: "var(--Colors-Background-Secondary, #C2D4ED)",
                    display: "flex",
                    flexDirection: "column",
                    listStyleType: "none",
                    margin: 0,
                    zIndex: 10000,
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
        </>
    )
}
