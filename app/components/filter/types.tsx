'use client';

import React from "react";
import ChoicePill from "../pills/choice";
import ChooseHeader from "./chooseheader";
import PersonIcon from "../icons/Person";
import GroupIcon from "../icons/Group";
import DropdownContainer from "../shared/DropdownContainer";
import { TYPE_OPTIONS, type ArtistTypeValue } from "../../artists/filter/typeOptions";

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
    const iconByType: Record<ArtistTypeValue, React.ReactNode> = {
        solo: <PersonIcon />,
        group: <GroupIcon />,
    };

    return (
        <DropdownContainer
            visible={visible}
            onClickOutside={onClickOutside}
            triggerRef={triggerRef}
        >
            <ChooseHeader choose="Artist Type(s)" />
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    alignContent: "flex-start",
                    gap: "8px",
                    alignSelf: "stretch",
                    flexWrap: "wrap",
                }}
            >
                {TYPE_OPTIONS.map((option) => (
                    <li key={option.value}>
                        <ChoicePill
                            label={option.label}
                            icon={iconByType[option.value as ArtistTypeValue]}
                            selected={selectedTypes.includes(option.value as ArtistTypeValue)}
                            onClick={() => onToggleType(option.value as ArtistTypeValue)}
                        />
                    </li>
                ))}
            </div>
        </DropdownContainer>
    );
}
