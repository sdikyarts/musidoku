'use client';

import React, { useEffect, useState } from "react";
import ChoicePill from "../pills/choice";
import ChooseHeader from "./chooseheader";
import DropdownContainer from "../shared/DropdownContainer";
import { GENRE_COLORS, getGenreLighterBackground, getGenreDarkerText, getSelectedGenreBackground } from "@/lib/artists/genre-colors";
import Afrobeats from "../icons/genres/afrobeats";
import Alternative from "../icons/genres/alternative";
import Bollywood from "../icons/genres/bollywood";
import Country from "../icons/genres/country";
import Electronic from "../icons/genres/electronic";
import HipHop from "../icons/genres/hiphop";
import KPop from "../icons/genres/kpop";
import Latin from "../icons/genres/latin";
import Metal from "../icons/genres/metal";
import Pop from "../icons/genres/pop";
import RnB from "../icons/genres/rnb";
import Reggae from "../icons/genres/reggae";
import Rock from "../icons/genres/rock";
import Soundtrack from "../icons/genres/soundtrack";

type GenreOption = {
    value: string;
    label: string;
};

type Props = {
    selectedGenres: string[];
    visible: boolean;
    onToggleGenre: (genre: string) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClickOutside?: () => void;
    triggerRef?: React.RefObject<HTMLElement | null>;
    genres: GenreOption[];
};

export type { GenreOption };

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

export default function FilterGenres({
    selectedGenres,
    visible,
    onToggleGenre,
    onClickOutside,
    triggerRef,
    genres,
}: Readonly<Props>) {
    const [screenWidth, setScreenWidth] = useState(
        globalThis.window === undefined ? 1024 : globalThis.window.innerWidth
    );

    useEffect(() => {
        const checkScreenWidth = () => {
            if (globalThis.window === undefined) return;
            setScreenWidth(globalThis.window.innerWidth);
        };
        
        checkScreenWidth();
        globalThis.window.addEventListener('resize', checkScreenWidth);
        return () => globalThis.window.removeEventListener('resize', checkScreenWidth);
    }, []);

    const isCenteredPopup = screenWidth < 960;

    return (
        <DropdownContainer
            visible={visible}
            onClickOutside={onClickOutside}
            triggerRef={triggerRef}
            minWidth="320px"
            centeredPopup={isCenteredPopup}
        >
            <ChooseHeader choose="Genre(s)" />
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    alignContent: "flex-start",
                    gap: "8px",
                    alignSelf: "stretch",
                    flexWrap: "wrap",
                    maxHeight: "320px",
                    overflowY: "auto",
                    paddingRight: "4px",
                }}
            >
                {genres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre.value);
                    const accentColor = GENRE_COLORS[genre.value] || '#8A9AAA';
                    const backgroundColor = isSelected 
                        ? getSelectedGenreBackground(accentColor)
                        : getGenreLighterBackground(accentColor);
                    const textColor = isSelected 
                        ? "#F3FDFB"
                        : getGenreDarkerText(accentColor, genre.value);
                    
                    const IconComponent = genreIcons[genre.value];
                    
                    return (
                        <li key={genre.value} style={{ listStyle: "none" }}>
                            <ChoicePill
                                label={genre.label}
                                icon={IconComponent ? <IconComponent color={textColor} size={20} /> : null}
                                selectedIcon={IconComponent ? <IconComponent color={textColor} size={20} /> : null}
                                selected={isSelected}
                                backgroundColor={backgroundColor}
                                selectedBackgroundColor={backgroundColor}
                                textColor={textColor}
                                selectedTextColor={textColor}
                                onClick={() => onToggleGenre(genre.value)}
                            />
                        </li>
                    );
                })}
            </div>
        </DropdownContainer>
    );
}
