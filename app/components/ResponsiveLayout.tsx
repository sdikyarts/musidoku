'use client';

import { useEffect, useState } from "react";
import { calculateHorizontalPadding } from "@/lib/layout/padding";

export default function ResponsiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [padding, setPadding] = useState(224);

  useEffect(() => {
    const updatePadding = () => {
      const newPadding = calculateHorizontalPadding();
      setPadding(newPadding);
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  return (
    <>
      <div style={{ padding: `96px ${padding}px 36px ${padding}px` }}>
        {children}
      </div>
      <div 
        style={{
          display: "flex",
          width: "100%",
          padding: `24px ${padding}px 48px ${padding}px`,
          background: "var(--Colors-Background-Background, #F3FDFB)",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          justifyContent: "center",
          boxSizing: "border-box"
        }}
      >
        <p
          style={{
            color: "var(--Colors-Text-Quarternary, #7F8D8B)",
            fontFamily: "Inter",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: "550",
            lineHeight: "normal",
            textAlign: "center"
          }}
        >
          made by: lorem ipsum
        </p>
      </div>
    </>
  );
}
