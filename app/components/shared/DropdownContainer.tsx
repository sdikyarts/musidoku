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
      if (
        event.target instanceof Node &&
        (containerRef.current.contains(event.target) ||
          triggerRef?.current?.contains(event.target))
      ) {
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
