'use client';

import React, { useEffect, useState } from "react";
import ChoicePill from "../pills/choice";
import ChooseHeader from "./chooseheader";
import PersonIcon from "../icons/Person";
import GroupIcon from "../icons/Group";
import DropdownContainer from "../shared/DropdownContainer";
import { TYPE_OPTIONS, type ArtistTypeValue } from "../../artists/filter/typeOptions";
import { getTypeColors } from "@/lib/artists/type-colors";

type Props = {
    selectedTypes: ArtistTypeValue[];
    visible: boolean;
    onToggleType: (type: ArtistTypeValue) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClickOutside?: () => void;
    triggerRef?: React.RefObject<HTMLElement | null>;
};

export default function FilterArtistType({
    selectedTypes,
    visible,
    onToggleType,
    onClickOutside,
    triggerRef,
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
            centeredPopup={isCenteredPopup}
        >
            <ChooseHeader choose="Artist Type(s)" />
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    alignContent: "flex-start",
                    gap: "8px",
                    alignSelf: "stretch",
                    flexWrap: "wrap"
                }}
            >
                {TYPE_OPTIONS.map((option) => {
                    const isSelected = selectedTypes.includes(option.value as ArtistTypeValue);
                    const colors = getTypeColors(option.value as ArtistTypeValue, isSelected);
                    const iconColor = colors.textColor;
                    
                    return (
                        <li key={option.value}>
                            <ChoicePill
                                label={option.label}
                                icon={option.value === "solo" ? <PersonIcon color={iconColor} /> : <GroupIcon color={iconColor} />}
                                selectedIcon={option.value === "solo" ? <PersonIcon color={colors.textColor} /> : <GroupIcon color={colors.textColor} />}
                                selected={isSelected}
                                backgroundColor={colors.backgroundColor}
                                selectedBackgroundColor={colors.backgroundColor}
                                textColor={colors.textColor}
                                selectedTextColor={colors.textColor}
                                onClick={() => onToggleType(option.value as ArtistTypeValue)}
                            />
                        </li>
                    );
                })}
            </div>
        </DropdownContainer>
    );
}
