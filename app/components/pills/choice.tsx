import React, { useEffect, useState } from "react";
import PersonIcon from "../icons/Person";

const placeholderColor = "var(--Colors-Search-Bar-Placeholder, #6D7FD9)";

type PillProps = {
    icon?: React.ReactNode;
    selectedIcon?: React.ReactNode;
    label?: string;
    selected?: boolean;
    textColor?: string;
    selectedTextColor?: string;
    backgroundColor?: string;
    selectedBackgroundColor?: string;
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
    onFocus?: React.FocusEventHandler<HTMLButtonElement>;
    onBlur?: React.FocusEventHandler<HTMLButtonElement>;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const ChoicePill = React.forwardRef<HTMLButtonElement, PillProps>(function ChoicePill(
    props: Readonly<PillProps>,
    ref,
) {
    const {
        icon,
        selectedIcon,
        label = "Pill",
        selected = false,
        textColor = placeholderColor,
        selectedTextColor = "#F3FDFB",
        backgroundColor = "var(--Colors-Search-Bar-Fill, #C2D4ED)",
        selectedBackgroundColor = "#6D7FD9",
        onMouseEnter,
        onMouseLeave,
        onFocus,
        onBlur,
        onClick,
    } = props;

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

    const resolvedTextColor = selected ? selectedTextColor : textColor;
    const resolvedBackground = selected ? selectedBackgroundColor : backgroundColor;
    const resolvedIcon = (selected ? selectedIcon ?? icon : icon) ?? <PersonIcon color={resolvedTextColor} />;
    
    // Use larger sizing on narrow screens (< 960px) to match artist individual pages
    const isNarrowScreen = screenWidth < 960;
    const padding = isNarrowScreen ? "9px" : "8px";

    return (
        <button
            type="button"
            ref={ref}
            aria-label={label}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
            onBlur={onBlur}
            onClick={onClick}
            style={{
                display: "flex",
                padding,
                alignItems: "center",
                gap: "6px",
                borderRadius: "5px",
                color: resolvedTextColor,
                background: resolvedBackground,
                cursor: "pointer",
                userSelect: "none",
                border: "none",
                outlineOffset: 2,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}
            >
                {resolvedIcon}
                <p
                    style={{
                        color: resolvedTextColor,
                        fontSize: "14px",
                        fontWeight: 600,
                    }}
                >
                    {label}
                </p>
            </div>
        </button>
    );
});

export default ChoicePill;
