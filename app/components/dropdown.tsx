import React, { forwardRef, useEffect, useState } from "react";
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
  alwaysShowLabel?: boolean; // When true, always show label regardless of screen size
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
  alwaysShowLabel = false,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onClick,
}: Readonly<DropdownProps>, ref) {
  const [screenWidth, setScreenWidth] = useState(
    globalThis.window === undefined ? 1024 : globalThis.window.innerWidth
  );

  useEffect(() => {
    // If alwaysShowLabel is true, don't track screen width
    if (alwaysShowLabel) {
      return;
    }

    const checkScreenWidth = () => {
      if (globalThis.window === undefined) return;
      setScreenWidth(globalThis.window.innerWidth);
    };
    
    checkScreenWidth();
    globalThis.window.addEventListener('resize', checkScreenWidth);
    return () => globalThis.window.removeEventListener('resize', checkScreenWidth);
  }, [alwaysShowLabel]);

  // Compute isNarrowScreen based on alwaysShowLabel and screenWidth
  const isNarrowScreen = !alwaysShowLabel && screenWidth <= 959;

  const hasActiveFilters = false; // TODO: replace with real filter state when filters are implemented
  const resolvedTextColor = textColor ?? placeholderColor;
  const resolvedBackgroundColor =
    backgroundColor ?? "var(--Colors-Search-Bar-Fill, #C2D4ED)";
  const resolvedArrowColor = arrowColor ?? resolvedTextColor;
  const getIconSize = () => {
    if (iconSize !== undefined) return iconSize;
    return isNarrowScreen ? 24 : 36;
  };

  const cloneIconWithProps = (element: React.ReactElement<{ color?: string; size?: number }>) => {
    const iconProps = element.props;
    const nextProps: { color?: string; size?: number } = {};

    if (!iconProps.color) {
      nextProps.color = resolvedTextColor;
    }

    if (iconProps.size === undefined) {
      nextProps.size = getIconSize();
    } else if (iconSize !== undefined) {
      nextProps.size = iconSize;
    }

    return Object.keys(nextProps).length > 0
      ? React.cloneElement(element, nextProps)
      : element;
  };

  const iconElement = (() => {
    if (!icon) {
      return <SearchIcon color={resolvedTextColor} size={getIconSize()} />;
    }

    if (React.isValidElement(icon)) {
      return cloneIconWithProps(icon as React.ReactElement<{ color?: string; size?: number }>);
    }

    return icon;
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
        width: isNarrowScreen ? "44px" : "fit-content", // Fixed width for icon-only mode
        height: "44px",
        padding: "10px 16px",
        borderRadius: "6px",
        background: resolvedBackgroundColor,
        justifyContent: isNarrowScreen ? "center" : "space-between", // Center icon when narrow
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
          width: isNarrowScreen ? "auto" : "100%",
          alignContent: "center",
        }}
      >
        {iconElement}
        {!isNarrowScreen && (
          <p
            style={{
              color: resolvedTextColor,
              fontFamily: "Inter",
              fontSize: globalThis.window && globalThis.window.innerWidth <= 798 ? "15px" : "16px",
              fontStyle: "normal",
              fontWeight: "550",
              lineHeight: "normal",
              width: "100%",
            }}
          >
            {label}
          </p>
        )}
      </div>
      {!isNarrowScreen && (
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
      )}
    </button>
  );
});

export default Dropdown;
