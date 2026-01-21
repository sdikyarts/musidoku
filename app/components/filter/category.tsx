import React from "react";
import PersonIcon from "../icons/Person";
import CloseSmallIcon from "../icons/CloseSmallIcon";

const placeholderColor = "var(--Colors-Search-Bar-Placeholder, #6D7FD9)";

type CategoryButtonProps = {
    icon?: React.ReactNode;
    label?: string;
    textColor?: string;
    backgroundColor?: string;
    iconSize?: number;
    contentGap?: number | string;
    showCloseIcon?: boolean;
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
    onFocus?: React.FocusEventHandler<HTMLButtonElement>;
    onBlur?: React.FocusEventHandler<HTMLButtonElement>;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CategoryButton = React.forwardRef<HTMLButtonElement, CategoryButtonProps>(function CategoryButton(
    {
        icon,
        label = "Category",
        textColor,
        backgroundColor,
        iconSize,
        contentGap = 8,
        showCloseIcon = false,
        onMouseEnter,
        onMouseLeave,
        onFocus,
        onBlur,
        onClick,
    }: Readonly<CategoryButtonProps>, ref) {
    const resolvedTextColor = textColor ?? placeholderColor;
    const resolvedBackgroundColor =
        backgroundColor ?? "var(--Colors-Search-Bar-Fill, #C2D4ED)";
    const resolvedIconSize = iconSize ?? 24;
    const iconElement = (() => {
        if (icon) {
            if (React.isValidElement(icon)) {
                const element = icon as React.ReactElement<{ color?: string; size?: number }>;
                const iconProps = element.props;
                const nextProps: { color?: string; size?: number } = {};

                if (!iconProps.color) {
                    nextProps.color = resolvedTextColor;
                }

                if (iconProps.size === undefined) {
                    nextProps.size = resolvedIconSize;
                }

                return Object.keys(nextProps).length > 0
                    ? React.cloneElement(element, nextProps)
                    : element;
            }
            return icon;
        }
        return (
            <PersonIcon
                color={resolvedTextColor}
                size={resolvedIconSize}
            />
        );
    })();

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
                width: "fit-content",
                height: "44px",
                padding: "10px 16px",
                borderRadius: "6px",
                background: resolvedBackgroundColor,
                justifyContent: "space-between",
                gap: "8px",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                border: "none",
                backgroundColor: resolvedBackgroundColor,
                color: resolvedTextColor,
                outlineOffset: 2,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: contentGap,
                    width: "100%",
                    alignContent: "center",
                }}
            >
                {iconElement}
                <p
                    style={{
                        color: resolvedTextColor,
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "550",
                        lineHeight: "normal",
                    }}
                >
                    {label}
                </p>
            </div>
            {showCloseIcon && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <CloseSmallIcon className="close-icon" />
                </div>
            )}
        </button>
    );
});

export default CategoryButton;
