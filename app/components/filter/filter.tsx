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

type Props = {
    visible: boolean;
    onClickOutside?: () => void;
    triggerRef?: React.RefObject<HTMLElement | null>;
    selectedTypes?: ArtistTypeValue[];
    onTypesChange?: (types: ArtistTypeValue[]) => void;
    selectedMisc?: Array<'deceased' | 'disbanded'>;
    onMiscChange?: (misc: Array<'deceased' | 'disbanded'>) => void;
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

export default function FilterArtist({ visible, onClickOutside, triggerRef, selectedTypes = [], onTypesChange, selectedMisc = [], onMiscChange, selectedCountries = [], onCountriesChange, countryData = [], selectedGenres = [], onGenresChange, genreData = [], debutStartYear, debutEndYear, onDebutStartYearChange = () => {}, onDebutEndYearChange = () => {}, birthStartYear, birthEndYear, onBirthStartYearChange = () => {}, onBirthEndYearChange = () => {} }: Readonly<Props>) {
    if (!visible) {
        return null;
    }

    return <FilterArtistContent onClickOutside={onClickOutside} triggerRef={triggerRef} selectedTypes={selectedTypes} onTypesChange={onTypesChange} selectedMisc={selectedMisc} onMiscChange={onMiscChange} selectedCountries={selectedCountries} onCountriesChange={onCountriesChange} countryData={countryData} selectedGenres={selectedGenres} onGenresChange={onGenresChange} genreData={genreData} debutStartYear={debutStartYear} debutEndYear={debutEndYear} onDebutStartYearChange={onDebutStartYearChange} onDebutEndYearChange={onDebutEndYearChange} birthStartYear={birthStartYear} birthEndYear={birthEndYear} onBirthStartYearChange={onBirthStartYearChange} onBirthEndYearChange={onBirthEndYearChange} />;
}

// Helper functions for styling
const getTypeButtonStyles = (isSelected: boolean) => ({
    textColor: isSelected ? "#F3FDFB" : "#051411",
    backgroundColor: isSelected ? "#6D7FD9" : "#E5F4F8",
});

const getMiscButtonStyles = (isSelected: boolean, misc?: 'deceased' | 'disbanded') => {
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
    }
    return {
        textColor: "#051411",
        backgroundColor: "#E5F4F8",
        iconColor: undefined,
    };
};

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

function FilterArtistContent({ onClickOutside, triggerRef, selectedTypes = [], onTypesChange, selectedMisc = [], onMiscChange, selectedCountries = [], onCountriesChange, countryData = [], selectedGenres = [], onGenresChange, genreData = [], debutStartYear, debutEndYear, onDebutStartYearChange = () => {}, onDebutEndYearChange = () => {}, birthStartYear, birthEndYear, onBirthStartYearChange = () => {}, onBirthEndYearChange = () => {} }: Readonly<FilterArtistContentProps>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const typeButtonRef = useRef<HTMLButtonElement | null>(null);
    const countryButtonRef = useRef<HTMLButtonElement | null>(null);
    const genreButtonRef = useRef<HTMLButtonElement | null>(null);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [openYearPicker, setOpenYearPicker] = useState<'debutStart' | 'debutEnd' | 'birthStart' | 'birthEnd' | null>(null);
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

    const handleToggleCountry = (countryCode: string) => {
        const newCountries = selectedCountries.includes(countryCode)
            ? selectedCountries.filter((code) => code !== countryCode)
            : [...selectedCountries, countryCode];
        onCountriesChange?.(newCountries);
    };

    const handleRemoveCountry = (countryCode: string) => {
        const newCountries = selectedCountries.filter((code) => code !== countryCode);
        onCountriesChange?.(newCountries);
    };

    const handleToggleGenre = (genre: string) => {
        const newGenres = selectedGenres.includes(genre)
            ? selectedGenres.filter((g) => g !== genre)
            : [...selectedGenres, genre];
        onGenresChange?.(newGenres);
    };

    const handleRemoveGenre = (genre: string) => {
        const newGenres = selectedGenres.filter((g) => g !== genre);
        onGenresChange?.(newGenres);
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

    const closeCountryDropdown = () => {
        setIsCountryDropdownOpen(false);
    };

    const closeGenreDropdown = () => {
        setIsGenreDropdownOpen(false);
    };
    
    const handleOpenTypeDropdown = () => {
        setOpenYearPicker(null);
        setIsCountryDropdownOpen(false);
        setIsGenreDropdownOpen(false);
        setIsTypeDropdownOpen((prev) => !prev);
    };
    
    const handleOpenCountryDropdown = () => {
        setOpenYearPicker(null);
        setIsTypeDropdownOpen(false);
        setIsGenreDropdownOpen(false);
        setIsCountryDropdownOpen((prev) => !prev);
    };
    
    const handleOpenGenreDropdown = () => {
        setOpenYearPicker(null);
        setIsTypeDropdownOpen(false);
        setIsCountryDropdownOpen(false);
        setIsGenreDropdownOpen((prev) => !prev);
    };

    const getCountryInfo = (code: string) => {
        return countryData.find((c) => c.code === code);
    };

    const getGenreInfo = (value: string) => {
        return genreData.find((g) => g.value === value);
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
            setIsCountryDropdownOpen(false);
            setIsGenreDropdownOpen(false);
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
    const countryButtonStyles = getTypeButtonStyles(selectedCountries.length > 0);
    const genreButtonStyles = getTypeButtonStyles(selectedGenres.length > 0);
    const deceasedStyles = getMiscButtonStyles(selectedMisc.includes('deceased'), 'deceased');
    const disbandedStyles = getMiscButtonStyles(selectedMisc.includes('disbanded'), 'disbanded');

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
                    maxHeight: isCenteredPopup ? "min(60vh, 600px)" : "558.5px",
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
                    {(selectedTypes.length > 0 || selectedMisc.length > 0 || selectedCountries.length > 0 || selectedGenres.length > 0 || (debutStartYear !== null && debutStartYear !== undefined && debutEndYear !== null && debutEndYear !== undefined) || (birthStartYear !== null && birthStartYear !== undefined && birthEndYear !== null && birthEndYear !== undefined)) && (
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
                                                onClick={() => handleRemoveType(type)}
                                            />
                                        );
                                    })}
                                    {selectedMisc.map((misc) => (
                                        <CategoryButton
                                            key={misc}
                                            label={misc === 'deceased' ? 'Deceased' : 'Disbanded'}
                                            textColor="#F3FDFB"
                                            backgroundColor={misc === 'deceased' ? '#6B5C7D' : '#B85555'}
                                            icon={misc === 'deceased' ? <SkullIcon color="#F3FDFB" /> : <BrokenHeartIcon color="#F3FDFB" />}
                                            showCloseIcon={true}
                                            onClick={() => handleRemoveMisc(misc)}
                                        />
                                    ))}
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
                                                onClick={() => handleRemoveCountry(countryCode)}
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
                                                onClick={() => handleRemoveGenre(genreValue)}
                                            />
                                        );
                                    })}
                                    {debutStartYear !== null && debutStartYear !== undefined && debutEndYear !== null && debutEndYear !== undefined && debutStartYear <= debutEndYear && (
                                        <CategoryButton
                                            key="debut-year"
                                            label={debutStartYear === debutEndYear ? `${debutStartYear} Debut` : `${debutStartYear}-${debutEndYear} Debut`}
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
                                    {birthStartYear !== null && birthStartYear !== undefined && birthEndYear !== null && birthEndYear !== undefined && birthStartYear <= birthEndYear && (
                                        <CategoryButton
                                            key="birth-year"
                                            label={birthStartYear === birthEndYear ? `Born ${birthStartYear}` : `Born ${birthStartYear}-${birthEndYear}`}
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
                                            onClick={handleOpenTypeDropdown}
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
                                                visible={isTypeDropdownOpen}
                                                onToggleType={handleToggleType}
                                                onClickOutside={closeTypeDropdown}
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
                                            onClick={handleOpenCountryDropdown}
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
                                                visible={isCountryDropdownOpen}
                                                onToggleCountry={handleToggleCountry}
                                                onClickOutside={closeCountryDropdown}
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
                                            onClick={handleOpenGenreDropdown}
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
                                                visible={isGenreDropdownOpen}
                                                onToggleGenre={handleToggleGenre}
                                                onClickOutside={closeGenreDropdown}
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
                                justifyContent: "space-between",
                                gap: "24px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                    gap: "12px",
                                    flex: "1 1 auto",
                                    minWidth: "300px",
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
                                    <YearPicker
                                        selectedYear={debutStartYear}
                                        onChange={onDebutStartYearChange}
                                        label="Start Year"
                                        minYear={1900}
                                        maxYear={new Date().getFullYear()}
                                        isOpen={openYearPicker === 'debutStart'}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                setIsTypeDropdownOpen(false);
                                                setIsCountryDropdownOpen(false);
                                                setIsGenreDropdownOpen(false);
                                            }
                                            setOpenYearPicker(open ? 'debutStart' : null);
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
                                        label="End Year"
                                        minYear={debutStartYear || 1900}
                                        maxYear={new Date().getFullYear()}
                                        isOpen={openYearPicker === 'debutEnd'}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                setIsTypeDropdownOpen(false);
                                                setIsCountryDropdownOpen(false);
                                                setIsGenreDropdownOpen(false);
                                            }
                                            setOpenYearPicker(open ? 'debutEnd' : null);
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
                                    flex: "1 1 auto",
                                    minWidth: "300px",
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
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <YearPicker
                                        selectedYear={birthStartYear}
                                        onChange={onBirthStartYearChange}
                                        label="Start Year"
                                        minYear={1900}
                                        maxYear={new Date().getFullYear()}
                                        isOpen={openYearPicker === 'birthStart'}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                setIsTypeDropdownOpen(false);
                                                setIsCountryDropdownOpen(false);
                                                setIsGenreDropdownOpen(false);
                                            }
                                            setOpenYearPicker(open ? 'birthStart' : null);
                                        }}
                                        activeColor="#947428"
                                        icon={<GiftIcon color={birthStartYear !== null && birthStartYear !== undefined ? "#F3FDFB" : "#051411"} size={32} />}
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
                                        label="End Year"
                                        minYear={birthStartYear || 1900}
                                        maxYear={new Date().getFullYear()}
                                        isOpen={openYearPicker === 'birthEnd'}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                setIsTypeDropdownOpen(false);
                                                setIsCountryDropdownOpen(false);
                                                setIsGenreDropdownOpen(false);
                                            }
                                            setOpenYearPicker(open ? 'birthEnd' : null);
                                        }}
                                        activeColor="#947428"
                                        icon={<GiftIcon color={birthEndYear !== null && birthEndYear !== undefined ? "#F3FDFB" : "#051411"} size={32} />}
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
