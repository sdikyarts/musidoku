'use client';

import React, { forwardRef, useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarClock from "../icons/CalendarClock";
import ArrowDownIcon from "../icons/ArrowDown";
import ChevronLeftIcon from "../icons/ChevronLeft";
import ChevronRightIcon from "../icons/ChevronRight";
import { calculateHorizontalPadding } from "@/lib/layout/padding";

type YearPickerProps = {
  selectedYear?: number | null;
  onChange: (year: number | null) => void;
  label?: string;
  minYear?: number;
  maxYear?: number;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  activeColor?: string;
  icon?: React.ReactNode;
};

const CustomInput = forwardRef<HTMLButtonElement, {
  value?: string;
  onClick?: () => void;
  label: string;
  isActive?: boolean;
  activeColor?: string;
  icon?: React.ReactNode;
  screenWidth?: number;
}>(function CustomInput({ value, onClick, label, isActive = false, activeColor = "#6D7FD9", icon, screenWidth = 1024 }, ref) {
  const displayText = value || label;
  const backgroundColor = isActive ? activeColor : "#E5F4F8";
  const textColor = isActive ? "#F3FDFB" : "#051411";
  const iconColor = isActive ? "#F3FDFB" : "#051411";
  const showChevronRight = screenWidth < 960;
  
  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      style={{
        display: "flex",
        width: "fit-content",
        height: "44px",
        padding: "10px 16px",
        borderRadius: "6px",
        background: backgroundColor,
        justifyContent: "space-between",
        gap: "8px",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        border: "none",
        backgroundColor: backgroundColor,
        color: textColor,
        outlineOffset: 2,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          alignContent: "center",
        }}
      >
        {icon || <CalendarClock size={32} color={iconColor} />}
        <p
          style={{
            color: textColor,
            fontFamily: "Inter",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: "550",
            lineHeight: "normal",
            width: "100%",
            margin: 0,
          }}
        >
          {displayText}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {showChevronRight ? (
          <ChevronRightIcon color={iconColor} size={20} />
        ) : (
          <ArrowDownIcon color={iconColor} />
        )}
      </div>
    </button>
  );
});

export default function YearPicker({
  selectedYear,
  onChange,
  label = "Select Year",
  minYear = 1900,
  isOpen: externalIsOpen,
  onOpenChange,
  activeColor = "#6D7FD9",
  icon,
}: Readonly<YearPickerProps>) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentYearRange, setCurrentYearRange] = useState<{ start: number; end: number } | null>(null);
  const [screenWidth, setScreenWidth] = useState(
    globalThis.window === undefined ? 1024 : globalThis.window.innerWidth
  );
  const [horizontalPadding, setHorizontalPadding] = useState(24);
  const observerRef = useRef<MutationObserver | null>(null);
  
  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen ?? internalIsOpen;
  
  const selectedDate = selectedYear ? new Date(selectedYear, 0, 1) : null;
  const currentYear = new Date().getFullYear();
  const isCenteredPopup = screenWidth < 960;

  useEffect(() => {
    const checkScreenWidth = () => {
      if (globalThis.window === undefined) return;
      const width = globalThis.window.innerWidth;
      setScreenWidth(width);
      setHorizontalPadding(calculateHorizontalPadding(width));
    };
    
    checkScreenWidth();
    globalThis.window.addEventListener('resize', checkScreenWidth);
    return () => globalThis.window.removeEventListener('resize', checkScreenWidth);
  }, []);

  const handleChange = (date: Date | null) => {
    if (date) {
      const clickedYear = date.getFullYear();
      // Don't allow future years
      if (clickedYear > currentYear) {
        return;
      }
      // If clicking the same year that's already selected, deselect it
      if (clickedYear === selectedYear) {
        onChange(null);
      } else {
        onChange(clickedYear);
      }
    } else {
      onChange(null);
    }
    // Don't close the picker - let user continue selecting
  };
  
  // Add click handler to detect clicks on already selected year
  useEffect(() => {
    if (!isOpen) return;
    
    const handleYearClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('react-datepicker__year-text')) {
        const yearText = target.textContent;
        if (yearText) {
          const clickedYear = Number.parseInt(yearText);
          // If clicking the already selected year, deselect it
          if (clickedYear === selectedYear) {
            onChange(null);
          }
        }
      }
    };
    
    document.addEventListener('click', handleYearClick);
    return () => document.removeEventListener('click', handleYearClick);
  }, [isOpen, selectedYear, onChange]);

  const updateYearRange = () => {
    const yearWrapper = document.querySelector('.year-picker-wrapper .react-datepicker__year-wrapper');
    if (yearWrapper) {
      const yearTexts = yearWrapper.querySelectorAll('.react-datepicker__year-text');
      if (yearTexts.length > 0) {
        const firstYear = Number.parseInt(yearTexts[0].textContent || '0');
        const lastYear = Number.parseInt(yearTexts[yearTexts.length - 1].textContent || '0');
        setCurrentYearRange({ start: firstYear, end: lastYear });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Initial update
      setTimeout(updateYearRange, 0);
      
      // Set up observer to watch for changes
      const yearWrapper = document.querySelector('.year-picker-wrapper .react-datepicker__year-wrapper');
      if (yearWrapper) {
        observerRef.current = new MutationObserver(updateYearRange);
        observerRef.current.observe(yearWrapper, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
      
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
    
    // Clean up observer when closed
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    
    return undefined;
  }, [isOpen]);

  return (
    <div style={{ position: "relative" }}>
      <style>{`
        .year-picker-wrapper .react-datepicker-popper {
          z-index: ${isCenteredPopup ? '10002' : '99999'} !important;
          ${isCenteredPopup ? `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, calc(-50% + 48px)) !important;
            width: calc(100vw - ${horizontalPadding * 2}px) !important;
            max-width: 600px !important;
          ` : ''}
        }
        
        .year-picker-wrapper .react-datepicker {
          font-family: Inter, sans-serif;
          background-color: #E5F4F8;
          border: none;
          border-radius: 6px;
          box-shadow: ${isCenteredPopup ? '0 12px 24px rgba(0, 0, 0, 0.0875)' : '0 5px 4px 0 rgba(0, 0, 0, 0.15)'};
          padding: 16px;
          z-index: ${isCenteredPopup ? '10002' : '99999'};
          ${isCenteredPopup ? 'width: 100% !important;' : ''}
        }
        
        .year-picker-wrapper .react-datepicker__header {
          background-color: #E5F4F8;
          border-bottom: none;
          padding: 0 0 16px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin: 0;
        }
        
        .year-picker-wrapper .react-datepicker__current-month {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #051411;
          font-size: 18px;
          font-weight: 700;
          margin: 0;
          padding: 0;
        }
        
        .year-picker-wrapper .react-datepicker__year {
          margin: 0;
          padding: 0;
        }
        
        .year-picker-wrapper .react-datepicker__year-wrapper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: ${isCenteredPopup ? '12px' : '8px'};
          max-width: ${isCenteredPopup ? '100%' : '280px'};
          margin: 0;
          padding: 0;
        }
        
        .year-picker-wrapper .react-datepicker__year-text {
          width: ${isCenteredPopup ? '100%' : '60px'};
          height: ${isCenteredPopup ? '68px' : '36px'};
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          background-color: #C2D4ED;
          color: #051411;
          font-size: ${isCenteredPopup ? '16px' : '14px'};
          font-weight: 550;
          cursor: pointer;
          margin: 0;
          line-height: ${isCenteredPopup ? '68px' : '36px'};
        }
        
        .year-picker-wrapper .react-datepicker__year-text:hover {
          background-color: #6D7FD9 !important;
          color: #F3FDFB !important;
          font-weight: 600;
        }
        
        .year-picker-wrapper .react-datepicker__year-text--selected {
          background-color: #6D7FD9 !important;
          color: #F3FDFB !important;
          font-weight: 600;
        }
        
        .year-picker-wrapper .react-datepicker__year-text--keyboard-selected:not(.react-datepicker__year-text--selected):not(.react-datepicker__year-text--today) {
          background-color: #C2D4ED !important;
          color: #051411 !important;
          font-weight: 550;
        }
        
        .year-picker-wrapper .react-datepicker__year-text--today:not(.react-datepicker__year-text--selected) {
          background-color: #3CC3BA !important;
          color: #F3FDFB !important;
          font-weight: 600;
        }
        
        .year-picker-wrapper .react-datepicker__year-text--disabled {
          background-color: #E5F4F8 !important;
          color: #8A9AAA !important;
          cursor: not-allowed !important;
          opacity: 0.5;
        }
        
        .year-picker-wrapper .react-datepicker__year-text--disabled:hover {
          background-color: #E5F4F8 !important;
          color: #8A9AAA !important;
          font-weight: 550 !important;
        }
        
        .year-picker-wrapper .react-datepicker__navigation {
          display: none;
        }
        
        .year-picker-wrapper .react-datepicker__year-dropdown-container {
          margin: 0;
        }
        
        .year-picker-wrapper .react-datepicker__triangle {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
        }
        
        .year-picker-wrapper .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle,
        .year-picker-wrapper .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
        }
        
        .year-picker-wrapper .react-datepicker-popper::before,
        .year-picker-wrapper .react-datepicker-popper::after,
        .year-picker-wrapper .react-datepicker::before,
        .year-picker-wrapper .react-datepicker::after {
          display: none !important;
          content: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
      
      <div className="year-picker-wrapper">
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          showYearPicker
          dateFormat="yyyy"
          yearItemNumber={12}
          minDate={new Date(minYear, 0, 1)}
          maxDate={new Date(currentYear, 11, 31)}
          filterDate={(date) => {
            // Only allow years up to current year
            return date.getFullYear() <= currentYear;
          }}
          customInput={<CustomInput label={label} isActive={selectedYear !== null && selectedYear !== undefined} activeColor={activeColor} icon={icon} screenWidth={screenWidth} />}
          open={isOpen}
          onInputClick={() => {
            if (onOpenChange) {
              onOpenChange(!isOpen);
            } else {
              setInternalIsOpen(!internalIsOpen);
            }
          }}
          onClickOutside={(event) => {
            // Check if the click is on the custom input button
            const target = event.target as HTMLElement;
            const customInput = document.querySelector('.year-picker-wrapper button');
            if (customInput?.contains(target)) {
              return; // Don't close if clicking the button
            }
            if (onOpenChange) {
              onOpenChange(false);
            } else {
              setInternalIsOpen(false);
            }
          }}
          popperPlacement={isCenteredPopup ? "bottom" : "bottom-start"}
          renderCustomHeader={({ decreaseYear, increaseYear }) => (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              gap: '12px',
            }}>
              <button
                type="button"
                onClick={() => {
                  decreaseYear();
                  setTimeout(updateYearRange, 0);
                }}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  color: '#051411',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ChevronLeftIcon size={28} color="#051411" />
              </button>
              <span style={{
                color: '#051411',
                fontWeight: 700,
                fontSize: '16px',
                whiteSpace: 'nowrap',
              }}>
                {currentYearRange ? `${currentYearRange.start} - ${currentYearRange.end}` : ''}
              </span>
              <button
                type="button"
                onClick={() => {
                  increaseYear();
                  setTimeout(updateYearRange, 0);
                }}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  color: '#051411',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ChevronRightIcon size={28} color="#051411" />
              </button>
            </div>
          )}
        />
      </div>
      {isCenteredPopup && isOpen && (
        <button
          type="button"
          aria-label="Close year picker"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 10001,
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          onClick={() => {
            if (onOpenChange) {
              onOpenChange(false);
            } else {
              setInternalIsOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
