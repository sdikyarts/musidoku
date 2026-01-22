'use client';

import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../dropdown";
import FilterArtistType from "./types";
import PersonIcon from "../icons/Person";
import GroupIcon from "../icons/Group";
import CategoryButton from "./category";
import CalendarClock from "../icons/CalendarClock";
import GlobeIcon from "../icons/Globe";
import MusicNoteIcon from "../icons/MusicNote";
import SkullIcon from "../icons/Skull";
import BrokenHeartIcon from "../icons/BrokenHeart";
import type { ArtistTypeValue } from "../../artists/filter/typeOptions";
import { typeValueToLabel } from "../../artists/filter/typeOptions";
import { calculateHorizontalPadding } from "@/lib/layout/padding";

type Props = {
    visible: boolean;
    onClickOutside?: () => void;
    triggerRef?: React.RefObject<HTMLElement | null>;
    selectedTypes?: ArtistTypeValue[];
    onTypesChange?: (types: ArtistTypeValue[]) => void;
    selectedMisc?: Array<'deceased' | 'disbanded'>;
    onMiscChange?: (misc: Array<'deceased' | 'disbanded'>) => void;
};

type FilterArtistContentProps = Omit<Props, "visible">;

export default function FilterArtist({ visible, onClickOutside, triggerRef, selectedTypes = [], onTypesChange, selectedMisc = [], onMiscChange }: Readonly<Props>) {
    if (!visible) {
        return null;
    }

    return <FilterArtistContent onClickOutside={onClickOutside} triggerRef={triggerRef} selectedTypes={selectedTypes} onTypesChange={onTypesChange} selectedMisc={selectedMisc} onMiscChange={onMiscChange} />;
}

// Helper functions for styling
const getTypeButtonStyles = (isSelected: boolean) => ({
    textColor: isSelected ? "#F3FDFB" : "#051411",
    backgroundColor: isSelected ? "#6D7FD9" : "#E5F4F8",
});

const getMiscButtonStyles = (isSelected: boolean) => ({
    textColor: isSelected ? "#F3FDFB" : "#051411",
    backgroundColor: isSelected ? "#6D7FD9" : "#E5F4F8",
    iconColor: isSelected ? "#F3FDFB" : undefined,
});

const getContainerStyles = (isCentered: boolean, padding: number): React.CSSProperties => ({
    position: isCentered ? "fixed" : "absolute",
    top: isCentered ? "50%" : "calc(100% + 8px)",
    left: isCentered ? `${padding}px` : "auto",
    right: isCentered ? `${padding}px` : 0,
    transform: isCentered ? "translateY(-50%)" : "none",
    width: isCentered ? "auto" : "100%",
    minWidth: isCentered ? "452px" : "800px",
    maxWidth: isCentered ? "959px" : "none",
    maxHeight: isCentered ? "min(60vh, 600px)" : "none",
});

function FilterArtistContent({ onClickOutside, triggerRef, selectedTypes = [], onTypesChange, selectedMisc = [], onMiscChange }: Readonly<FilterArtistContentProps>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const typeButtonRef = useRef<HTMLButtonElement | null>(null);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isCenteredPopup, setIsCenteredPopup] = useState(false);
    const [horizontalPadding, setHorizontalPadding] = useState(24);

    const handleToggleType = (type: ArtistTypeValue) => {
        const newTypes = selectedTypes.includes(type) 
            ? selectedTypes.filter((value) => value !== type) 
            : [...selectedTypes, type];
        onTypesChange?.(newTypes);
    };

    const handleRemoveType = (type: ArtistTypeValue) => {
        const newTypes = selectedTypes.filter((value) => value !== type);
        onTypesChange?.(newTypes);
    };

    const handleToggleMisc = (misc: 'deceased' | 'disbanded') => {
        const newMisc = selectedMisc.includes(misc)
            ? selectedMisc.filter((value) => value !== misc)
            : [...selectedMisc, misc];
        onMiscChange?.(newMisc);
    };

    const handleRemoveMisc = (misc: 'deceased' | 'disbanded') => {
        const newMisc = selectedMisc.filter((value) => value !== misc);
        onMiscChange?.(newMisc);
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

    const containerStyles = getContainerStyles(isCenteredPopup, horizontalPadding);
    const typeButtonStyles = getTypeButtonStyles(selectedTypes.length > 0);
    const deceasedStyles = getMiscButtonStyles(selectedMisc.includes('deceased'));
    const disbandedStyles = getMiscButtonStyles(selectedMisc.includes('disbanded'));

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
                    ...containerStyles,
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
                            {selectedTypes.map((type) => (
                                <CategoryButton
                                    key={type}
                                    label={typeValueToLabel[type]}
                                    textColor="#F3FDFB"
                                    backgroundColor="#6D7FD9"
                                    icon={type === 'solo' ? <PersonIcon color="#F3FDFB" /> : <GroupIcon color="#F3FDFB" />}
                                    showCloseIcon={true}
                                    onClick={() => handleRemoveType(type)}
                                />
                            ))}
                            {selectedMisc.map((misc) => (
                                <CategoryButton
                                    key={misc}
                                    label={misc === 'deceased' ? 'Deceased' : 'Disbanded'}
                                    textColor="#F3FDFB"
                                    backgroundColor="#6D7FD9"
                                    icon={misc === 'deceased' ? <SkullIcon color="#F3FDFB" /> : <BrokenHeartIcon color="#F3FDFB" />}
                                    showCloseIcon={true}
                                    onClick={() => handleRemoveMisc(misc)}
                                />
                            ))}
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
                                            icon={selectedTypes.length > 0 ? <PersonIcon color="#F3FDFB" /> : <PersonIcon />}
                                            iconSize={60}
                                            textColor={typeButtonStyles.textColor}
                                            backgroundColor={typeButtonStyles.backgroundColor}
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
                                    textColor={deceasedStyles.textColor}
                                    backgroundColor={deceasedStyles.backgroundColor}
                                    icon={<SkullIcon color={deceasedStyles.iconColor} />}
                                    onClick={() => handleToggleMisc('deceased')}
                                />
                                <CategoryButton
                                    label="Disbanded"
                                    textColor={disbandedStyles.textColor}
                                    backgroundColor={disbandedStyles.backgroundColor}
                                    icon={<BrokenHeartIcon color={disbandedStyles.iconColor} />}
                                    onClick={() => handleToggleMisc('disbanded')}
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
