import React, { forwardRef } from "react";
import SearchIcon from "./icons/SearchIcon";
import ArrowDownIcon from "./icons/ArrowDown";

const placeholderColor = "var(--Colors-Search-Bar-Placeholder, #6D7FD9)";

type DropdownProps = {
  icon?: React.ReactNode;
  label?: string;
  textColor?: string;
  backgroundColor?: string;
  arrowColor?: string;
  iconSize?: number;
  arrowSize?: number;
  contentGap?: number | string;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(function Dropdown({
  icon,
  label = "Dropdown",
  textColor,
  backgroundColor,
  arrowColor,
  iconSize,
  arrowSize,
  contentGap = 8,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onClick,
}: Readonly<DropdownProps>, ref) {
  const hasActiveFilters = false; // TODO: replace with real filter state when filters are implemented
  const resolvedTextColor = textColor ?? placeholderColor;
  const resolvedBackgroundColor =
    backgroundColor ?? "var(--Colors-Search-Bar-Fill, #C2D4ED)";
  const resolvedArrowColor = arrowColor ?? resolvedTextColor;
  const resolvedIconSize = iconSize ?? 36;
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
      <SearchIcon
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
            width: "100%",
          }}
        >
          {label}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {hasActiveFilters && (
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              gap: "2px",
            }}
          >
            <div
              style={{
                backgroundColor: resolvedTextColor,
                borderRadius: "14px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                padding: "1px 8px",
              }}
            >
              <p
                style={{
                  color: resolvedBackgroundColor,
                  fontSize: "12px",
                  fontWeight: "800",
                }}
              >
                0
              </p>
            </div>
          </div>
        )}
        <ArrowDownIcon color={resolvedArrowColor} size={arrowSize} />
      </div>
    </button>
  );
});

export default Dropdown;
