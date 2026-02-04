'use client';

import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../dropdown";
import FilterArtistType from "./types";
import FilterCountries, { type CountryOption } from "./countries";
import FilterGenres from "./genres";
import PersonIcon from "../icons/Person";
import GroupIcon from "../icons/Group";
import CategoryButton from "./category";
import GlobeIcon from "../icons/Globe";
import YearPicker from "./YearPicker";
import MusicNoteIcon from "../icons/MusicNote";
import CalendarClock from "../icons/CalendarClock";
import SkullIcon from "../icons/Skull";
import BrokenHeartIcon from "../icons/BrokenHeart";
import GiftIcon from "../icons/Gift";
import type { ArtistTypeValue } from "../../artists/filter/typeOptions";
import { typeValueToLabel } from "../../artists/filter/typeOptions";
import { calculateHorizontalPadding } from "@/lib/layout/padding";
import { getTypeColors } from "@/lib/artists/type-colors";
import { GENRE_COLORS, getSelectedGenreBackground } from "@/lib/artists/genre-colors";
import Afrobeats from "@/app/components/icons/genres/afrobeats";
import Alternative from "@/app/components/icons/genres/alternative";
import Bollywood from "@/app/components/icons/genres/bollywood";
import Country from "@/app/components/icons/genres/country";
import Electronic from "@/app/components/icons/genres/electronic";
import HipHop from "@/app/components/icons/genres/hiphop";
import KPop from "@/app/components/icons/genres/kpop";
import Latin from "@/app/components/icons/genres/latin";
import Metal from "@/app/components/icons/genres/metal";
import Pop from "@/app/components/icons/genres/pop";
import RnB from "@/app/components/icons/genres/rnb";
import Reggae from "@/app/components/icons/genres/reggae";
import Rock from "@/app/components/icons/genres/rock";
import Soundtrack from "@/app/components/icons/genres/soundtrack";

import GrammyIcon from "../icons/Grammy";

type MiscFilterValue = 'deceased' | 'disbanded' | 'grammy2026nominee' | 'grammy2026winner';

type Props = {
    visible: boolean;
    onClickOutside?: () => void;
    triggerRef?: React.RefObject<HTMLElement | null>;
    selectedTypes?: ArtistTypeValue[];
    onTypesChange?: (types: ArtistTypeValue[]) => void;
    selectedMisc?: MiscFilterValue[];
    onMiscChange?: (misc: MiscFilterValue[]) => void;
    selectedCountries?: string[];
    onCountriesChange?: (countries: string[]) => void;
    countryData?: CountryOption[];
    selectedGenres?: string[];
    onGenresChange?: (genres: string[]) => void;
    genreData?: Array<{ value: string; label: string }>;
    debutStartYear?: number | null;
    debutEndYear?: number | null;
    onDebutStartYearChange?: (year: number | null) => void;
    onDebutEndYearChange?: (year: number | null) => void;
    birthStartYear?: number | null;
    birthEndYear?: number | null;
    onBirthStartYearChange?: (year: number | null) => void;
    onBirthEndYearChange?: (year: number | null) => void;
    memberCountMin?: number | null;
    memberCountMax?: number | null;
    onMemberCountMinChange?: (count: number | null) => void;
    onMemberCountMaxChange?: (count: number | null) => void;
};

type FilterArtistContentProps = Omit<Props, "visible">;

// Map genre values to their icons
const genreIcons: Record<string, React.ComponentType<{ color?: string; size?: number }>> = {
    'afrobeats': Afrobeats,
    'alternative': Alternative,
    'bollywood': Bollywood,
    'country': Country,
    'electronic': Electronic,
    'hip hop': HipHop,
    'k-pop': KPop,
    'latin': Latin,
    'metal': Metal,
    'pop': Pop,
    'r&b': RnB,
    'reggae': Reggae,
    'rock': Rock,
    'soundtrack': Soundtrack,
};

export default function FilterArtist({ visible, onClickOutside, triggerRef, selectedTypes = [], onTypesChange, selectedMisc = [], onMiscChange, selectedCountries = [], onCountriesChange, countryData = [], selectedGenres = [], onGenresChange, genreData = [], debutStartYear, debutEndYear, onDebutStartYearChange = () => {}, onDebutEndYearChange = () => {}, birthStartYear, birthEndYear, onBirthStartYearChange = () => {}, onBirthEndYearChange = () => {}, memberCountMin, memberCountMax, onMemberCountMinChange = () => {}, onMemberCountMaxChange = () => {} }: Readonly<Props>) {
    if (!visible) {
        return null;
    }

    return <FilterArtistContent onClickOutside={onClickOutside} triggerRef={triggerRef} selectedTypes={selectedTypes} onTypesChange={onTypesChange} selectedMisc={selectedMisc} onMiscChange={onMiscChange} selectedCountries={selectedCountries} onCountriesChange={onCountriesChange} countryData={countryData} selectedGenres={selectedGenres} onGenresChange={onGenresChange} genreData={genreData} debutStartYear={debutStartYear} debutEndYear={debutEndYear} onDebutStartYearChange={onDebutStartYearChange} onDebutEndYearChange={onDebutEndYearChange} birthStartYear={birthStartYear} birthEndYear={birthEndYear} onBirthStartYearChange={onBirthStartYearChange} onBirthEndYearChange={onBirthEndYearChange} memberCountMin={memberCountMin} memberCountMax={memberCountMax} onMemberCountMinChange={onMemberCountMinChange} onMemberCountMaxChange={onMemberCountMaxChange} />;
}

// Helper functions for styling
const getTypeButtonStyles = (isSelected: boolean) => ({
    textColor: isSelected ? "#F3FDFB" : "#051411",
    backgroundColor: isSelected ? "#6D7FD9" : "#E5F4F8",
});

const getMiscButtonStyles = (isSelected: boolean, misc?: MiscFilterValue) => {
    if (isSelected) {
        if (misc === 'deceased') {
            return {
                textColor: "#F3FDFB",
                backgroundColor: "#6B5C7D",
                iconColor: "#F3FDFB",
            };
        }
        if (misc === 'disbanded') {
            return {
                textColor: "#F3FDFB",
                backgroundColor: "#B85555",
                iconColor: "#F3FDFB",
            };
        }
        if (misc === 'grammy2026nominee') {
            return {
                textColor: "#F3FDFB",
                backgroundColor: "#C9A961",
                iconColor: "#F3FDFB",
            };
        }
        if (misc === 'grammy2026winner') {
            return {
                textColor: "#F3FDFB",
                backgroundColor: "#D4AF37",
                iconColor: "#F3FDFB",
            };
        }
    }
    return {
        textColor: "#051411",
        backgroundColor: "#E5F4F8",
        iconColor: undefined,
    };
};

const getContainerStyles = (isCentered: boolean, padding: number, screenWidth: number): React.CSSProperties => {
    // For non-centered (wide screen) mode
    if (!isCentered) {
        // Between 960px and 992px, calculate width to match navbar padding
        if (screenWidth >= 960 && screenWidth < 992) {
            const calculatedWidth = screenWidth - (padding * 2);
            return {
                position: "absolute",
                top: "calc(100% + 8px)",
                left: "auto",
                right: 0,
                transform: "none",
                width: `${calculatedWidth}px`,
                minWidth: "auto",
                maxWidth: "none",
                maxHeight: "80vh",
            };
        }
        
        // 992px and above, use fixed 800px width
        return {
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "auto",
            right: 0,
            transform: "none",
            width: "100%",
            minWidth: "800px",
            maxWidth: "none",
            maxHeight: "80vh",
        };
    }
    
    // Centered popup mode (narrow screens) - center to screen height below navbar (64px)
    return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, calc(-50% + 48px))",
        width: `calc(100vw - ${padding * 2}px)`,
        minWidth: "452px",
        maxWidth: "959px",
        maxHeight: "calc(80vh - 64px)",
    };
};

// Helper hook for managing dropdown states
function useDropdownState() {
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [openYearPicker, setOpenYearPicker] = useState<'debutStart' | 'debutEnd' | 'birthStart' | 'birthEnd' | null>(null);

    const closeAllDropdowns = () => {
        setIsTypeDropdownOpen(false);
        setIsCountryDropdownOpen(false);
        setIsGenreDropdownOpen(false);
    };

    const openTypeDropdown = () => {
        setOpenYearPicker(null);
        setIsCountryDropdownOpen(false);
        setIsGenreDropdownOpen(false);
        setIsTypeDropdownOpen((prev) => !prev);
    };

    const openCountryDropdown = () => {
        setOpenYearPicker(null);
        setIsTypeDropdownOpen(false);
        setIsGenreDropdownOpen(false);
        setIsCountryDropdownOpen((prev) => !prev);
    };

    const openGenreDropdown = () => {
        setOpenYearPicker(null);
        setIsTypeDropdownOpen(false);
        setIsCountryDropdownOpen(false);
        setIsGenreDropdownOpen((prev) => !prev);
    };

    return {
        isTypeDropdownOpen,
        isCountryDropdownOpen,
        isGenreDropdownOpen,
        openYearPicker,
        setOpenYearPicker,
        closeAllDropdowns,
        openTypeDropdown,
        openCountryDropdown,
        openGenreDropdown,
        closeTypeDropdown: () => setIsTypeDropdownOpen(false),
        closeCountryDropdown: () => setIsCountryDropdownOpen(false),
        closeGenreDropdown: () => setIsGenreDropdownOpen(false),
    };
}

// Helper hook for managing filter handlers
function useFilterHandlers(props: {
    selectedTypes: ArtistTypeValue[];
    onTypesChange?: (types: ArtistTypeValue[]) => void;
    selectedCountries: string[];
    onCountriesChange?: (countries: string[]) => void;
    selectedGenres: string[];
    onGenresChange?: (genres: string[]) => void;
    selectedMisc: MiscFilterValue[];
    onMiscChange?: (misc: MiscFilterValue[]) => void;
}) {
    const toggleItem = <T,>(items: T[], item: T, onChange?: (items: T[]) => void) => {
        const newItems = items.includes(item) 
            ? items.filter((value) => value !== item) 
            : [...items, item];
        onChange?.(newItems);
    };

    const removeItem = <T,>(items: T[], item: T, onChange?: (items: T[]) => void) => {
        onChange?.(items.filter((value) => value !== item));
    };

    return {
        handleToggleType: (type: ArtistTypeValue) => toggleItem(props.selectedTypes, type, props.onTypesChange),
        handleRemoveType: (type: ArtistTypeValue) => removeItem(props.selectedTypes, type, props.onTypesChange),
        handleToggleCountry: (code: string) => toggleItem(props.selectedCountries, code, props.onCountriesChange),
        handleRemoveCountry: (code: string) => removeItem(props.selectedCountries, code, props.onCountriesChange),
        handleToggleGenre: (genre: string) => toggleItem(props.selectedGenres, genre, props.onGenresChange),
        handleRemoveGenre: (genre: string) => removeItem(props.selectedGenres, genre, props.onGenresChange),
        handleToggleMisc: (misc: MiscFilterValue) => toggleItem(props.selectedMisc, misc, props.onMiscChange),
        handleRemoveMisc: (misc: MiscFilterValue) => removeItem(props.selectedMisc, misc, props.onMiscChange),
    };
}

// Helper to check if any filters are active
function hasActiveFilters(filters: {
    selectedTypes: ArtistTypeValue[];
    selectedMisc: MiscFilterValue[];
    selectedCountries: string[];
    selectedGenres: string[];
    debutStartYear: number | null | undefined;
    debutEndYear: number | null | undefined;
    birthStartYear: number | null | undefined;
    birthEndYear: number | null | undefined;
    memberCountMin: number | null | undefined;
    memberCountMax: number | null | undefined;
}): boolean {
    const { selectedTypes, selectedMisc, selectedCountries, selectedGenres, 
            debutStartYear, debutEndYear, birthStartYear, birthEndYear, memberCountMin, memberCountMax } = filters;
    
    if (selectedTypes.length > 0 || selectedMisc.length > 0 || selectedCountries.length > 0 || selectedGenres.length > 0) {
        return true;
    }
    
    const hasDebutRange = debutStartYear !== null && debutStartYear !== undefined && 
                          debutEndYear !== null && debutEndYear !== undefined;
    const hasBirthRange = birthStartYear !== null && birthStartYear !== undefined && 
                          birthEndYear !== null && birthEndYear !== undefined;
    const hasMemberCount = memberCountMin !== null && memberCountMin !== undefined && 
                           memberCountMax !== null && memberCountMax !== undefined;
    
    return hasDebutRange || hasBirthRange || hasMemberCount;
}

// Helper to check if a year range is valid
function isValidYearRange(startYear: number | null | undefined, endYear: number | null | undefined): boolean {
    return startYear !== null && startYear !== undefined && 
           endYear !== null && endYear !== undefined && 
           startYear <= endYear;
}

// Helper to format year range label
function formatYearRangeLabel(startYear: number, endYear: number, suffix: string): string {
    const range = startYear === endYear ? `${startYear}` : `${startYear}-${endYear}`;
    return suffix ? `${range} ${suffix}` : range;
}

// Helper to get icon color based on year value
function getYearIconColor(year: number | null | undefined): string {
    return year !== null && year !== undefined ? "#F3FDFB" : "#051411";
}

// Helper to check if a member count range is valid
function isValidMemberCountRange(min: number | null | undefined, max: number | null | undefined): boolean {
    return min !== null && min !== undefined && 
           max !== null && max !== undefined && 
           min <= max;
}

// Helper to format member count range label
function formatMemberCountLabel(min: number, max: number): string {
    return min === max ? `${min} Members` : `${min}-${max} Members`;
}

// Member count input component
function MemberCountInput({ 
    value, 
    onChange, 
    placeholder, 
    min 
}: Readonly<{ 
    value: number | null | undefined; 
    onChange: (value: number | null) => void; 
    placeholder: string; 
    min?: number;
}>) {
    const isActive = value !== null && value !== undefined;
    const [isIncreaseHovered, setIsIncreaseHovered] = useState(false);
    const [isDecreaseHovered, setIsDecreaseHovered] = useState(false);
    
    const handleIncrease = () => {
        if (value === null || value === undefined) {
            onChange(min ?? 1);
        } else {
            onChange(value + 1);
        }
    };
    
    const handleDecrease = () => {
        if (value === null || value === undefined) {
            return;
        }
        if (value <= 1) {
            onChange(null);
        } else {
            onChange(value - 1);
        }
    };
    
    const iconColor = isActive ? "#F3FDFB" : "#051411";
    const increaseButtonBg = isIncreaseHovered ? "#6B5C7D" : "transparent";
    const decreaseButtonBg = isDecreaseHovered ? "#6B5C7D" : "transparent";
    const increaseIconColor = isIncreaseHovered ? "#F3FDFB" : iconColor;
    const decreaseIconColor = isDecreaseHovered ? "#F3FDFB" : iconColor;
    
    return (
        <div
            style={{
                display: "flex",
                width: "160px",
                height: "44px",
                borderRadius: "6px",
                background: isActive ? "#6B5C7D" : "#E5F4F8",
                alignItems: "center",
                boxSizing: "border-box",
                position: "relative",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    flex: 1,
                }}
            >
                <GroupIcon color={iconColor} />
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue === "") {
                            onChange(null);
                        } else {
                            const numValue = Number(inputValue);
                            if (!Number.isNaN(numValue) && numValue >= (min ?? 1)) {
                                onChange(numValue);
                            }
                        }
                    }}
                    style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: isActive ? "#F3FDFB" : "#051411",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontWeight: 550,
                    }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    gap: "1px",
                }}
            >
                <button
                    type="button"
                    onClick={handleIncrease}
                    onMouseEnter={() => setIsIncreaseHovered(true)}
                    onMouseLeave={() => setIsIncreaseHovered(false)}
                    style={{
                        background: increaseButtonBg,
                        border: "none",
                        cursor: "pointer",
                        padding: "3px 5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        transition: "background 0.2s ease",
                    }}
                >
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 0L7.4641 4.5H0.535898L4 0Z" fill={increaseIconColor} />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={handleDecrease}
                    onMouseEnter={() => setIsDecreaseHovered(true)}
                    onMouseLeave={() => setIsDecreaseHovered(false)}
                    style={{
                        background: decreaseButtonBg,
                        border: "none",
                        cursor: "pointer",
                        padding: "3px 5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottomLeftRadius: "4px",
                        borderBottomRightRadius: "4px",
                        transition: "background 0.2s ease",
                    }}
                >
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 5L0.535898 0.5L7.4641 0.5L4 5Z" fill={decreaseIconColor} />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function FilterArtistContent({ onClickOutside, triggerRef, selectedTypes = [], onTypesChange, selectedMisc = [], onMiscChange, selectedCountries = [], onCountriesChange, countryData = [], selectedGenres = [], onGenresChange, genreData = [], debutStartYear, debutEndYear, onDebutStartYearChange = () => {}, onDebutEndYearChange = () => {}, birthStartYear, birthEndYear, onBirthStartYearChange = () => {}, onBirthEndYearChange = () => {}, memberCountMin, memberCountMax, onMemberCountMinChange = () => {}, onMemberCountMaxChange = () => {} }: Readonly<FilterArtistContentProps>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const typeButtonRef = useRef<HTMLButtonElement | null>(null);
    const countryButtonRef = useRef<HTMLButtonElement | null>(null);
    const genreButtonRef = useRef<HTMLButtonElement | null>(null);
    const [isCenteredPopup, setIsCenteredPopup] = useState(false);
    const [horizontalPadding, setHorizontalPadding] = useState(24);
    const [screenWidth, setScreenWidth] = useState(1024);

    // Check if Grammy filters should be shown (only until March 31, 2026)
    const showGrammyFilters = new Date() <= new Date('2026-03-31T23:59:59');

    const dropdownState = useDropdownState();
    const handlers = useFilterHandlers({
        selectedTypes, onTypesChange,
        selectedCountries, onCountriesChange,
        selectedGenres, onGenresChange,
        selectedMisc, onMiscChange
    });

    const getCountryInfo = (code: string) => countryData.find((c) => c.code === code);
    const getGenreInfo = (value: string) => genreData.find((g) => g.value === value);

    useEffect(() => {
        const checkScreenWidth = () => {
            if (globalThis.window === undefined) return;
            const width = globalThis.window.innerWidth;
            setScreenWidth(width);
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
            dropdownState.closeAllDropdowns();
            onClickOutside?.();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [onClickOutside, triggerRef, dropdownState]);

    const containerStyles = getContainerStyles(isCenteredPopup, horizontalPadding, screenWidth);
    const typeButtonStyles = getTypeButtonStyles(selectedTypes.length > 0);
    const countryButtonStyles = getTypeButtonStyles(selectedCountries.length > 0);
    const genreButtonStyles = getTypeButtonStyles(selectedGenres.length > 0);
    const deceasedStyles = getMiscButtonStyles(selectedMisc.includes('deceased'), 'deceased');
    const disbandedStyles = getMiscButtonStyles(selectedMisc.includes('disbanded'), 'disbanded');
    const grammy2026NomineeStyles = getMiscButtonStyles(selectedMisc.includes('grammy2026nominee'), 'grammy2026nominee');
    const grammy2026WinnerStyles = getMiscButtonStyles(selectedMisc.includes('grammy2026winner'), 'grammy2026winner');

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
            <style>{`
                .filter-popup-container,
                .filter-popup-container *,
                .filter-popup-container::before,
                .filter-popup-container::after,
                .filter-popup-container *::before,
                .filter-popup-container *::after {
                    border-top-color: transparent !important;
                    border-bottom-color: transparent !important;
                    border-left-color: transparent !important;
                    border-right-color: transparent !important;
                }
                
                .filter-popup-container {
                    overflow: hidden !important;
                }
                
                .filter-popup-container::before,
                .filter-popup-container::after {
                    display: none !important;
                    content: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
            `}</style>
            <div
                ref={containerRef}
                className="filter-popup-container"
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
                    maxHeight: screenWidth <= 653 ? "calc(80vh - 64px - 76px)" : "calc(80vh - 64px - 32px)",
                    overflowY: "auto",
                    overflowX: "visible",
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
                    {hasActiveFilters({ selectedTypes, selectedMisc, selectedCountries, selectedGenres, debutStartYear, debutEndYear, birthStartYear, birthEndYear, memberCountMin, memberCountMax }) && (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                    gap: "12px",
                                    width: "100%",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "#6D7FD9",
                                            fontFamily: "Inter",
                                            fontSize: "14px",
                                            fontWeight: 550,
                                            textTransform: "uppercase",
                                            margin: 0,
                                        }}
                                    >
                                        Seleted Filters
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onTypesChange?.([]);
                                            onMiscChange?.([]);
                                            onCountriesChange?.([]);
                                            onGenresChange?.([]);
                                            onDebutStartYearChange?.(null);
                                            onDebutEndYearChange?.(null);
                                            onBirthStartYearChange?.(null);
                                            onBirthEndYearChange?.(null);
                                            onMemberCountMinChange?.(null);
                                            onMemberCountMaxChange?.(null);
                                        }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#A84545",
                                            fontFamily: "Inter",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            padding: "4px 8px",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        Clear All
                                    </button>
                                </div>
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
                                    {selectedTypes.map((type) => {
                                        const typeColors = getTypeColors(type, true);
                                        return (
                                            <CategoryButton
                                                key={type}
                                                label={typeValueToLabel[type]}
                                                textColor={typeColors.textColor}
                                                backgroundColor={typeColors.backgroundColor}
                                                icon={type === 'solo' ? <PersonIcon color={typeColors.textColor} /> : <GroupIcon color={typeColors.textColor} />}
                                                showCloseIcon={true}
                                                onClick={() => handlers.handleRemoveType(type)}
                                            />
                                        );
                                    })}
                                    {selectedMisc.map((misc) => {
                                        let label = '';
                                        let backgroundColor = '';
                                        let icon = null;
                                        
                                        if (misc === 'deceased') {
                                            label = 'Deceased';
                                            backgroundColor = '#6B5C7D';
                                            icon = <SkullIcon color="#F3FDFB" />;
                                        } else if (misc === 'disbanded') {
                                            label = 'Disbanded';
                                            backgroundColor = '#B85555';
                                            icon = <BrokenHeartIcon color="#F3FDFB" />;
                                        } else if (misc === 'grammy2026nominee') {
                                            label = '2026 GRAMMYs Nominee';
                                            backgroundColor = '#C9A961';
                                            icon = <GrammyIcon color="#F3FDFB" />;
                                        } else if (misc === 'grammy2026winner') {
                                            label = '2026 GRAMMYs Winner';
                                            backgroundColor = '#D4AF37';
                                            icon = <GrammyIcon color="#F3FDFB" />;
                                        }
                                        
                                        return (
                                            <CategoryButton
                                                key={misc}
                                                label={label}
                                                textColor="#F3FDFB"
                                                backgroundColor={backgroundColor}
                                                icon={icon}
                                                showCloseIcon={true}
                                                onClick={() => handlers.handleRemoveMisc(misc)}
                                            />
                                        );
                                    })}
                                    {selectedCountries.map((countryCode) => {
                                        const country = getCountryInfo(countryCode);
                                        if (!country) return null;
                                        return (
                                            <CategoryButton
                                                key={countryCode}
                                                label={country.name}
                                                textColor="#F3FDFB"
                                                backgroundColor={country.accentColor}
                                                icon={
                                                    <span style={{ fontSize: "20px", lineHeight: 1 }}>
                                                        {country.emoji}
                                                    </span>
                                                }
                                                showCloseIcon={true}
                                                onClick={() => handlers.handleRemoveCountry(countryCode)}
                                            />
                                        );
                                    })}
                                    {selectedGenres.map((genreValue) => {
                                        const genre = getGenreInfo(genreValue);
                                        if (!genre) return null;
                                        
                                        const accentColor = GENRE_COLORS[genreValue] || '#8A9AAA';
                                        const backgroundColor = getSelectedGenreBackground(accentColor);
                                        const IconComponent = genreIcons[genreValue];
                                        
                                        return (
                                            <CategoryButton
                                                key={genreValue}
                                                label={genre.label}
                                                textColor="#F3FDFB"
                                                backgroundColor={backgroundColor}
                                                icon={IconComponent ? <IconComponent color="#F3FDFB" size={20} /> : <MusicNoteIcon color="#F3FDFB" />}
                                                showCloseIcon={true}
                                                onClick={() => handlers.handleRemoveGenre(genreValue)}
                                            />
                                        );
                                    })}
                                    {isValidYearRange(debutStartYear, debutEndYear) && (
                                        <CategoryButton
                                            key="debut-year"
                                            label={formatYearRangeLabel(debutStartYear!, debutEndYear!, "Debut")}
                                            textColor="#F3FDFB"
                                            backgroundColor="#3A6B6F"
                                            icon={<CalendarClock color="#F3FDFB" size={20} />}
                                            showCloseIcon={true}
                                            onClick={() => {
                                                onDebutStartYearChange?.(null);
                                                onDebutEndYearChange?.(null);
                                            }}
                                        />
                                    )}
                                    {isValidYearRange(birthStartYear, birthEndYear) && (
                                        <CategoryButton
                                            key="birth-year"
                                            label={`Born ${formatYearRangeLabel(birthStartYear!, birthEndYear!, "")}`}
                                            textColor="#F3FDFB"
                                            backgroundColor="#947428"
                                            icon={<GiftIcon color="#F3FDFB" size={20} />}
                                            showCloseIcon={true}
                                            onClick={() => {
                                                onBirthStartYearChange?.(null);
                                                onBirthEndYearChange?.(null);
                                            }}
                                        />
                                    )}
                                    {isValidMemberCountRange(memberCountMin, memberCountMax) && (
                                        <CategoryButton
                                            key="member-count"
                                            label={formatMemberCountLabel(memberCountMin!, memberCountMax!)}
                                            textColor="#F3FDFB"
                                            backgroundColor="#6B5C7D"
                                            icon={<GroupIcon color="#F3FDFB" />}
                                            showCloseIcon={true}
                                            onClick={() => {
                                                onMemberCountMinChange?.(null);
                                                onMemberCountMaxChange?.(null);
                                            }}
                                        />
                                    )}
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
                        </>
                    )}
                    <div
                        style={{
                            display: "flex",
                            overflow: "visible",
                            flexDirection: "column",
                            alignItems: "flex-start",
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
                                Filter By General Attributes
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    alignItems: "center",
                                    alignContent: "center",
                                    gap: "16px",
                                    flexWrap: screenWidth <= 653 ? "wrap" : "nowrap",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "16px",
                                        width: screenWidth <= 653 ? "100%" : "auto",
                                        flexWrap: screenWidth <= 653 ? "wrap" : "nowrap",
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
                                            width="178px"
                                            chevronDirection={screenWidth < 960 ? 'right' : 'down'}
                                            onClick={dropdownState.openTypeDropdown}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "calc(100% + 8px)",
                                                left: 0,
                                                zIndex: 99999,
                                            }}
                                        >
                                            <FilterArtistType
                                                selectedTypes={selectedTypes}
                                                visible={dropdownState.isTypeDropdownOpen}
                                                onToggleType={handlers.handleToggleType}
                                                onClickOutside={dropdownState.closeTypeDropdown}
                                                triggerRef={typeButtonRef}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            position: "relative",
                                            display: "flex",
                                        }}
                                    >
                                        <Dropdown 
                                            ref={countryButtonRef}
                                            icon={selectedCountries.length > 0 ? <GlobeIcon color="#F3FDFB" /> : <GlobeIcon />}
                                            iconSize={32}
                                            textColor={countryButtonStyles.textColor}
                                            backgroundColor={countryButtonStyles.backgroundColor}
                                            label="Country"
                                            alwaysShowLabel={true}
                                            chevronDirection={screenWidth < 960 ? 'right' : 'down'}
                                            onClick={dropdownState.openCountryDropdown}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "calc(100% + 8px)",
                                                left: 0,
                                                zIndex: 99999,
                                            }}
                                        >
                                            <FilterCountries
                                                selectedCountries={selectedCountries}
                                                visible={dropdownState.isCountryDropdownOpen}
                                                onToggleCountry={handlers.handleToggleCountry}
                                                onClickOutside={dropdownState.closeCountryDropdown}
                                                triggerRef={countryButtonRef}
                                                countries={countryData}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            position: "relative",
                                            display: "flex",
                                        }}
                                    >
                                        <Dropdown 
                                            ref={genreButtonRef}
                                            icon={selectedGenres.length > 0 ? <MusicNoteIcon color="#F3FDFB" /> : <MusicNoteIcon />}
                                            iconSize={34}
                                            textColor={genreButtonStyles.textColor}
                                            backgroundColor={genreButtonStyles.backgroundColor}
                                            label="Genre"
                                            alwaysShowLabel={true}
                                            chevronDirection={screenWidth < 960 ? 'right' : 'down'}
                                            onClick={dropdownState.openGenreDropdown}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "calc(100% + 8px)",
                                                left: 0,
                                                zIndex: 99999,
                                            }}
                                        >
                                            <FilterGenres
                                                selectedGenres={selectedGenres}
                                                visible={dropdownState.isGenreDropdownOpen}
                                                onToggleGenre={handlers.handleToggleGenre}
                                                onClickOutside={dropdownState.closeGenreDropdown}
                                                triggerRef={genreButtonRef}
                                                genres={genreData}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                gap: "48px",
                                flexWrap: "wrap",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                    gap: "12px",
                                    flex: "1 1 0",
                                    minWidth: screenWidth <= 839 ? "100%" : "250px",
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
                                        flexWrap: "nowrap",
                                    }}
                                >
                                    <YearPicker
                                        selectedYear={debutStartYear}
                                        onChange={onDebutStartYearChange}
                                        label="Start"
                                        minYear={1900}
                                        maxYear={new Date().getFullYear()}
                                        isOpen={dropdownState.openYearPicker === 'debutStart'}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                dropdownState.closeAllDropdowns();
                                            }
                                            dropdownState.setOpenYearPicker(open ? 'debutStart' : null);
                                        }}
                                        activeColor="#3A6B6F"
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
                                    <YearPicker
                                        selectedYear={debutEndYear}
                                        onChange={onDebutEndYearChange}
                                        label="End"
                                        minYear={debutStartYear || 1900}
                                        maxYear={new Date().getFullYear()}
                                        isOpen={dropdownState.openYearPicker === 'debutEnd'}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                dropdownState.closeAllDropdowns();
                                            }
                                            dropdownState.setOpenYearPicker(open ? 'debutEnd' : null);
                                        }}
                                        activeColor="#3A6B6F"
                                    />
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                    gap: "12px",
                                    flex: "1 1 0",
                                    minWidth: screenWidth <= 839 ? "100%" : "250px",
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
                                    Filter By Birth Year Range
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        alignItems: "center",
                                        alignContent: "center",
                                        gap: "16px",
                                        flexWrap: "nowrap",
                                    }}
                                >
                                    <YearPicker
                                        selectedYear={birthStartYear}
                                        onChange={onBirthStartYearChange}
                                        label="Start"
                                        minYear={1900}
                                        maxYear={new Date().getFullYear()}
                                        isOpen={dropdownState.openYearPicker === 'birthStart'}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                dropdownState.closeAllDropdowns();
                                            }
                                            dropdownState.setOpenYearPicker(open ? 'birthStart' : null);
                                        }}
                                        activeColor="#947428"
                                        icon={<GiftIcon color={getYearIconColor(birthStartYear)} size={32} />}
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
                                    <YearPicker
                                        selectedYear={birthEndYear}
                                        onChange={onBirthEndYearChange}
                                        label="End"
                                        minYear={birthStartYear || 1900}
                                        maxYear={new Date().getFullYear()}
                                        isOpen={dropdownState.openYearPicker === 'birthEnd'}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                dropdownState.closeAllDropdowns();
                                            }
                                            dropdownState.setOpenYearPicker(open ? 'birthEnd' : null);
                                        }}
                                        activeColor="#947428"
                                        icon={<GiftIcon color={getYearIconColor(birthEndYear)} size={32} />}
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
                                gap: "12px",
                                width: "100%",
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
                                Filter By Member Count Range
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    alignContent: "center",
                                    gap: "16px",
                                    flexWrap: "nowrap",
                                }}
                            >
                                <MemberCountInput
                                    value={memberCountMin}
                                    onChange={onMemberCountMinChange}
                                    placeholder="Min"
                                    min={1}
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
                                <MemberCountInput
                                    value={memberCountMax}
                                    onChange={onMemberCountMaxChange}
                                    placeholder="Max"
                                    min={memberCountMin ?? 1}
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
                                    onClick={() => handlers.handleToggleMisc('deceased')}
                                />
                                <CategoryButton
                                    label="Disbanded"
                                    textColor={disbandedStyles.textColor}
                                    backgroundColor={disbandedStyles.backgroundColor}
                                    icon={<BrokenHeartIcon color={disbandedStyles.iconColor} />}
                                    onClick={() => handlers.handleToggleMisc('disbanded')}
                                />
                                {showGrammyFilters && (
                                    <>
                                        <CategoryButton
                                            label="2026 GRAMMYs Nominee"
                                            textColor={grammy2026NomineeStyles.textColor}
                                            backgroundColor={grammy2026NomineeStyles.backgroundColor}
                                            icon={<GrammyIcon color={grammy2026NomineeStyles.iconColor} />}
                                            onClick={() => handlers.handleToggleMisc('grammy2026nominee')}
                                        />
                                        <CategoryButton
                                            label="2026 GRAMMYs Winner"
                                            textColor={grammy2026WinnerStyles.textColor}
                                            backgroundColor={grammy2026WinnerStyles.backgroundColor}
                                            icon={<GrammyIcon color={grammy2026WinnerStyles.iconColor} />}
                                            onClick={() => handlers.handleToggleMisc('grammy2026winner')}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
