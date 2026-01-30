'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { calculateHorizontalPadding } from "@/lib/layout/padding";

export default function ResponsiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [padding, setPadding] = useState(224);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const pathname = usePathname();
  
  // Check if we're on an individual artist page
  const isArtistPage = pathname?.startsWith('/artists/') && pathname !== '/artists';

  useEffect(() => {
    const updatePadding = () => {
      const width = globalThis.window.innerWidth;
      setScreenWidth(width);
      let newPadding = calculateHorizontalPadding();
      // Cap padding at 160px for individual artist pages
      if (isArtistPage && newPadding > 160) {
        newPadding = 160;
      }
      setPadding(newPadding);
    };

    updatePadding();
    globalThis.window.addEventListener('resize', updatePadding);
    return () => globalThis.window.removeEventListener('resize', updatePadding);
  }, [isArtistPage]);

  // Calculate top padding: 80px for narrow screens on artist page, otherwise 96px
  const topPadding = isArtistPage && screenWidth !== null && screenWidth < 799 ? '84px' : '96px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ padding: `${topPadding} ${padding}px 36px ${padding}px`, flex: '1' }}>
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
    </div>
  );
}
