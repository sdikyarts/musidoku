'use client';

import React, { useEffect, useState } from "react";
import ChoicePill from "../pills/choice";
import ChooseHeader from "./chooseheader";
import DropdownContainer from "../shared/DropdownContainer";
import { getLighterBackground, getDarkerText } from "@/lib/artists/country-colors";
import SearchIcon from "../icons/SearchIcon";

type CountryOption = {
    code: string;
    name: string;
    emoji: string;
    accentColor: string;
};

export type { CountryOption };

type Props = {
    selectedCountries: string[];
    visible: boolean;
    onToggleCountry: (countryCode: string) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClickOutside?: () => void;
    triggerRef?: React.RefObject<HTMLElement | null>;
    countries: CountryOption[];
};

export default function FilterCountries({
    selectedCountries,
    visible,
    onToggleCountry,
    onClickOutside,
    triggerRef,
    countries,
}: Readonly<Props>) {
    const [screenWidth, setScreenWidth] = useState(
        globalThis.window === undefined ? 1024 : globalThis.window.innerWidth
    );
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DropdownContainer
            visible={visible}
            onClickOutside={onClickOutside}
            triggerRef={triggerRef}
            minWidth="400px"
            centeredPopup={isCenteredPopup}
        >
            <ChooseHeader choose="Country" />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    background: "#E5F4F8",
                    borderRadius: "6px",
                    marginBottom: "12px",
                }}
            >
                <SearchIcon color="#6D7FD9" />
                <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#051411",
                        fontFamily: "Inter",
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                />
            </div>
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
                {filteredCountries.map((country) => {
                    const isSelected = selectedCountries.includes(country.code);
                    const backgroundColor = isSelected 
                        ? country.accentColor 
                        : getLighterBackground(country.accentColor);
                    const textColor = isSelected 
                        ? "#F3FDFB" 
                        : getDarkerText(country.accentColor);
                    
                    return (
                        <li key={country.code} style={{ listStyle: "none" }}>
                            <ChoicePill
                                label={country.name}
                                icon={
                                    <span style={{ fontSize: "20px", lineHeight: 1 }}>
                                        {country.emoji}
                                    </span>
                                }
                                selectedIcon={
                                    <span style={{ fontSize: "20px", lineHeight: 1 }}>
                                        {country.emoji}
                                    </span>
                                }
                                selected={isSelected}
                                backgroundColor={backgroundColor}
                                selectedBackgroundColor={country.accentColor}
                                textColor={textColor}
                                selectedTextColor="#F3FDFB"
                                onClick={() => onToggleCountry(country.code)}
                            />
                        </li>
                    );
                })}
            </div>
        </DropdownContainer>
    );
}
