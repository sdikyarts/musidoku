import React, { useEffect, useRef } from "react";

type Props = {
  visible: boolean;
  children: React.ReactNode;
  onClickOutside?: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  minWidth?: string;
};

export default function DropdownContainer({
  visible,
  children,
  onClickOutside,
  triggerRef,
  minWidth = "256px",
}: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
