import React, { useEffect, useRef, useState } from "react";
import { calculateHorizontalPadding } from "@/lib/layout/padding";

type Props = {
  visible: boolean;
  children: React.ReactNode;
  onClickOutside?: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  minWidth?: string;
  centeredPopup?: boolean; // When true, opens as centered popup instead of dropdown
};

export default function DropdownContainer({
  visible,
  children,
  onClickOutside,
  triggerRef,
  minWidth = "256px",
  centeredPopup = false,
}: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [horizontalPadding, setHorizontalPadding] = useState(24);

  useEffect(() => {
    if (!centeredPopup) return;
    
    const checkScreenWidth = () => {
      if (globalThis.window === undefined) return;
      const width = globalThis.window.innerWidth;
      setHorizontalPadding(calculateHorizontalPadding(width));
    };
    
    checkScreenWidth();
    globalThis.window.addEventListener('resize', checkScreenWidth);
    return () => globalThis.window.removeEventListener('resize', checkScreenWidth);
  }, [centeredPopup]);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      
      const target = event.target as Node;
      
      // If clicking inside the dropdown container, don't close
      if (containerRef.current.contains(target)) {
        return;
      }
      
      // If clicking the trigger button, don't call onClickOutside
      // The trigger's onClick will handle the toggle
      if (triggerRef?.current?.contains(target)) {
        return;
      }
      
      // Otherwise, close the dropdown
      onClickOutside?.();
    };

    // Use mousedown/touchstart to catch the event before onClick
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

  if (centeredPopup) {
    return (
      <>
        <style>{`
          .dropdown-container-centered,
          .dropdown-container-centered *,
          .dropdown-container-centered::before,
          .dropdown-container-centered::after,
          .dropdown-container-centered *::before,
          .dropdown-container-centered *::after {
            border-top-color: transparent !important;
            border-bottom-color: transparent !important;
            border-left-color: transparent !important;
            border-right-color: transparent !important;
          }
          
          .dropdown-container-centered[data-popper-placement]::before,
          .dropdown-container-centered[data-popper-placement]::after {
            display: none !important;
            content: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
          }
          
          .dropdown-container-centered .react-datepicker__triangle,
          .dropdown-container-centered .react-datepicker-popper::before,
          .dropdown-container-centered .react-datepicker-popper::after {
            display: none !important;
            content: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
          }
        `}</style>
        <button
          type="button"
          aria-label="Close dropdown"
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
          onClick={onClickOutside}
        />
        <div
          ref={containerRef}
          className="dropdown-container-centered"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, calc(-50% + 48px))",
            display: "flex",
            width: `calc(100vw - ${horizontalPadding * 2}px)`,
            minWidth,
            maxWidth: "600px",
            padding: "16px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "12px",
            borderRadius: "6px",
            background: "var(--Colors-Dropdown-Dropdown-Contents-Card, #E5F4F8)",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.0875)",
            zIndex: 10002,
            border: "none",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        width: "fit-content",
        minWidth,
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
      {children}
    </div>
  );
}
