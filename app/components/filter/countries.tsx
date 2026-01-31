'use client';

import React from "react";
import ChoicePill from "../pills/choice";
import ChooseHeader from "./chooseheader";
import DropdownContainer from "../shared/DropdownContainer";
import { getLighterBackground, getDarkerText } from "@/lib/artists/country-colors";

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
    return (
        <DropdownContainer
            visible={visible}
            onClickOutside={onClickOutside}
            triggerRef={triggerRef}
            minWidth="400px"
        >
            <ChooseHeader choose="Country" />
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
                {countries.map((country) => {
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
