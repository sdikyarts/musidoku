'use client';

import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../dropdown";
import FilterArtistType from "./types";
import PersonIcon from "../icons/Person";
import CategoryButton from "./category";
import CalendarClock from "../icons/CalendarClock";
import GlobeIcon from "../icons/Globe";
import MusicNoteIcon from "../icons/MusicNote";
import SkullIcon from "../icons/Skull";
import BrokenHeartIcon from "../icons/BrokenHeart";
import type { ArtistTypeValue } from "../../artists/filter/typeOptions";
import { calculateHorizontalPadding } from "@/lib/layout/padding";

type Props = {
    visible: boolean;
    onClickOutside?: () => void;
    triggerRef?: React.RefObject<HTMLElement | null>;
};

type FilterArtistContentProps = Omit<Props, "visible">;

export default function FilterArtist({ visible, onClickOutside, triggerRef }: Readonly<Props>) {
    if (!visible) {
        return null;
    }

    return <FilterArtistContent onClickOutside={onClickOutside} triggerRef={triggerRef} />;
}

function FilterArtistContent({ onClickOutside, triggerRef }: Readonly<FilterArtistContentProps>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const typeButtonRef = useRef<HTMLButtonElement | null>(null);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<ArtistTypeValue[]>([]);
    const [isCenteredPopup, setIsCenteredPopup] = useState(false);
    const [horizontalPadding, setHorizontalPadding] = useState(24);

    const handleToggleType = (type: ArtistTypeValue) => {
        setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((value) => value !== type) : [...prev, type]));
    };

    const closeTypeDropdown = () => {
        setIsTypeDropdownOpen(false);
    };

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
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!containerRef.current) return;
            if (event.target instanceof Node && (containerRef.current.contains(event.target) || triggerRef?.current?.contains(event.target))) {
                return;
            }
            setIsTypeDropdownOpen(false);
            onClickOutside?.();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [onClickOutside, triggerRef]);

    return (
        <>
            {isCenteredPopup && (
                <button
                    type="button"
                    aria-label="Close filter menu"
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
            <div
                ref={containerRef}
                style={{
                    position: isCenteredPopup ? "fixed" : "absolute",
                    top: isCenteredPopup ? "50%" : "calc(100% + 8px)",
                    left: isCenteredPopup ? `${horizontalPadding}px` : "auto",
                    right: isCenteredPopup ? `${horizontalPadding}px` : 0,
                    transform: isCenteredPopup ? "translateY(-50%)" : "none",
                    width: isCenteredPopup ? "auto" : "100%",
                    minWidth: isCenteredPopup ? "452px" : "800px",
                    maxWidth: isCenteredPopup ? "959px" : "none",
                    maxHeight: isCenteredPopup ? "min(60vh, 600px)" : "none",
                    padding: "16px",
                    gap: "6px",
                    borderRadius: "6px",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.0875)",
                    background: "var(--Colors-Background-Secondary, #C2D4ED)",
                    display: "inline-flex",
                    flexDirection: "column",
                    listStyleType: "none",
                    margin: 0,
                    zIndex: 10000,
                    boxSizing: "border-box",
                    overflowY: "auto",
                }}
            >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    alignSelf: "stretch",
                    gap: "24px",
                    width: "100%",
                    
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        width: "100%",
                        gap: "24px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            gap: "12px"
                        }}
                    >
                        <p
                            style={{
                                color: "#6D7FD9",
                                fontFamily: "Inter",
                                fontSize: "14px",
                                fontWeight: 550,
                                textTransform: "uppercase",
                            }}
                        >
                            Seleted Filters
                        </p>
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                alignContent: "center",
                                gap: "16px",
                                flexWrap: "wrap",
                            }}
                        >
                        </div>
                    </div>
                    <div
                        style={{
                                width: "100%",
                                height: "1.5px",
                                background: "var(--Colors-Search-Bar-Placeholder, #6D7FD9)",
                                borderRadius: "1.5px",
                            }}
                    />
                    <div
                        style={{
                            display: "flex",
                            overflow: "hidden",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "28px"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                gap: "12px"
                            }}
                        >
                            <p
                                style={{
                                    color: "#6D7FD9",
                                    fontFamily: "Inter",
                                    fontSize: "14px",
                                    fontWeight: 550,
                                    textTransform: "uppercase",
                                }}
                            >
                                Filter By General Attributes
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    alignItems: "center",
                                    alignContent: "center",
                                    gap: "16px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "16px",
                                        width: "100%",
                                        
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            display: "flex",
                                        }}
                                    >
                                        <Dropdown 
                                            ref={typeButtonRef}
                                            icon ={<PersonIcon />}
                                            iconSize={60}
                                            textColor="#051411"
                                            backgroundColor="#E5F4F8"
                                            label="Artist Type"
                                            alwaysShowLabel={true}
                                            onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "calc(100% + 8px)",
                                                left: 0,
                                                zIndex: 200,
                                            }}
                                        >
                                            <FilterArtistType
                                                selectedTypes={selectedTypes}
                                                visible={isTypeDropdownOpen}
                                                onToggleType={handleToggleType}
                                                onClickOutside={closeTypeDropdown}
                                                triggerRef={typeButtonRef}
                                            />
                                        </div>
                                    </div>
                                    <Dropdown 
                                        icon ={<GlobeIcon />}
                                        iconSize={32}
                                        textColor="#051411"
                                        backgroundColor="#E5F4F8"
                                        label="Country"
                                        alwaysShowLabel={true}
                                    />
                                    <Dropdown 
                                        icon ={<MusicNoteIcon />}
                                        iconSize={34}
                                        textColor="#051411"
                                        backgroundColor="#E5F4F8"
                                        label="Genre"
                                        alwaysShowLabel={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                gap: "12px"
                            }}
                        >
                            <p
                                style={{
                                    color: "#6D7FD9",
                                    fontFamily: "Inter",
                                    fontSize: "14px",
                                    fontWeight: 550,
                                    textTransform: "uppercase",
                                }}
                            >
                                Filter By Debut Year Range
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    alignItems: "center",
                                    alignContent: "center",
                                    gap: "16px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Dropdown 
                                    icon ={<CalendarClock />}
                                    iconSize={32}
                                    textColor="#051411"
                                    backgroundColor="#E5F4F8"
                                    label="Start Year"
                                    alwaysShowLabel={true}
                                />
                                <p
                                    style={{
                                        color: "#6D7FD9",
                                        fontFamily: "Inter",
                                        fontSize: "24px",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    -
                                </p>
                                <Dropdown 
                                    icon ={<CalendarClock />}
                                    iconSize={32}
                                    textColor="#051411"
                                    backgroundColor="#E5F4F8"
                                    label="End Year"
                                    alwaysShowLabel={true}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                gap: "12px"
                            }}
                        >
                            <p
                                style={{
                                    color: "#6D7FD9",
                                    fontFamily: "Inter",
                                    fontSize: "14px",
                                    fontWeight: 550,
                                    textTransform: "uppercase",
                                }}
                            >
                                Filter By Miscellaneous Categories
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    alignItems: "center",
                                    alignContent: "center",
                                    gap: "16px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <CategoryButton
                                    label="Deceased"
                                    textColor="#051411"
                                    backgroundColor="#E5F4F8"
                                    icon={<SkullIcon />}
                                    onClick={() => {}}
                                />
                                <CategoryButton
                                    label="Disbanded"
                                    textColor="#051411"
                                    backgroundColor="#E5F4F8"
                                    icon={<BrokenHeartIcon />}
                                    onClick={() => {}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
