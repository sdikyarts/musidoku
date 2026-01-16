'use client';

import React, { useEffect, useRef } from "react";
import ChoicePill from "../pills/choice";
import ChooseHeader from "./chooseheader";
import PersonIcon from "../icons/Person";
import GroupIcon from "../icons/Group";
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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const iconByType: Record<ArtistTypeValue, React.ReactNode> = {
        solo: <PersonIcon />,
        group: <GroupIcon />,
    };

    useEffect(() => {
        if (!visible) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!containerRef.current) return;
            if (event.target instanceof Node && (containerRef.current.contains(event.target) || triggerRef?.current?.contains(event.target))) {
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
        <div
            ref={containerRef}
            style={{
                display: "flex",
                width: "fit-content",
                minWidth: "256px",
                padding: "16px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "12px",
                borderRadius: "6px",
                background: "var(--Colors-Dropdown-Dropdown-Contents-Card, #E5F4F8)",
                boxShadow: "0 5px 4px 0 rgba(0, 0, 0, 0.15)",
            }}
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
        </div>
    );
}
