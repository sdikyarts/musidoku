'use client';

import { useEffect, useState } from "react";
import ArtistSearch from "../components/search/artist";
import { ArtistGrid } from "./ArtistGrid";
import PaginationBar from "./PaginationBar";
import { calculateHorizontalPadding } from "@/lib/layout/padding";

export type Artist = {
  id: string;
  name: string;
  imageUrl?: string | null;
  debutYear?: number | null;
  type?: 'solo' | 'group' | 'unknown' | null;
  isDead?: boolean | null;
  isDisbanded?: boolean | null;
};

function calculatePageSize() {
  if (globalThis.window === undefined) return 24; // Default for SSR
  
  const screenWidth = globalThis.window.innerWidth;
  const padding = calculateHorizontalPadding(screenWidth);
  
  // Use smaller card size for narrow screens
  const cardWidth = screenWidth < 500 ? 160 : 200;
  const gap = 24;
  
  // Calculate how many cards fit in a row with current padding
  const availableWidth = screenWidth - (padding * 2);
  const cardsPerRow = Math.max(2, Math.floor((availableWidth + gap) / (cardWidth + gap))); // Minimum 2 cards
  
  // Number of rows = number of cards per row, with minimum of 4 rows for narrow screens
  let rowsPerPage;
  if (cardsPerRow >= 6) {
    rowsPerPage = 6; // 6 cards per row -> 6 rows -> 36 total
  } else if (cardsPerRow === 5) {
    rowsPerPage = 5; // 5 cards per row -> 5 rows -> 25 total
  } else if (cardsPerRow === 4) {
    rowsPerPage = 4; // 4 cards per row -> 4 rows -> 16 total
  } else if (cardsPerRow === 3) {
    rowsPerPage = 4; // 3 cards per row -> 4 rows -> 12 total
  } else {
    rowsPerPage = 4; // 2 cards per row -> 4 rows -> 8 total
  }
  
  const totalCards = cardsPerRow * rowsPerPage;
  
  return totalCards;
}

export default function ArtistsPageClient({ artists }: Readonly<{ artists: Artist[] }>) {
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [padding, setPadding] = useState<number | null>(null);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Array<'solo' | 'group'>>([]);
  const [selectedMisc, setSelectedMisc] = useState<Array<'deceased' | 'disbanded'>>([]);

  useEffect(() => {
    const updatePageSizeAndPadding = () => {
      const newPageSize = calculatePageSize();
      setPageSize(newPageSize);
      
      const newPadding = calculateHorizontalPadding();
      setPadding(newPadding);
      
      if (globalThis.window !== undefined) {
        setScreenWidth(globalThis.window.innerWidth);
      }
    };
    
    updatePageSizeAndPadding();
    globalThis.window.addEventListener('resize', updatePageSizeAndPadding);
    return () => globalThis.window.removeEventListener('resize', updatePageSizeAndPadding);
  }, []);
  
  // Don't render until we have calculated values
  if (pageSize === null || padding === null || screenWidth === null) {
    return null;
  }
  
  // Responsive title styling - keep single line with better font sizes
  const getTitleFontSize = () => {
    if (screenWidth >= 1280) return "42px";
    if (screenWidth >= 960) return "38px"; 
    if (screenWidth >= 799) return "34px";
    return "28px"; // Smaller for 798px and below
  };
  
  const titleFontSize = getTitleFontSize();
  const titleGap = screenWidth >= 799 ? "10px" : "6px";
  
  // Responsive container width - wider to prevent text wrapping
  const getTitleContainerWidth = () => {
    if (screenWidth >= 1280) return "70%"; // Wider to prevent wrapping at 1280px
    if (screenWidth >= 960) return "85%";  // Wider for medium screens
    if (screenWidth >= 640) return "90%";
    return "95%"; // Almost full width on very narrow screens
  };
  
  const titleContainerWidth = getTitleContainerWidth();
  
  // Responsive font sizes for body text (smaller on narrow screens)
  const getBodyFontSize = () => {
    if (screenWidth > 798) return "16px";
    return "14px"; // Smaller for 798px and below
  };
  
  const getBodyLineHeight = () => {
    if (screenWidth > 798) return "24px";
    return "20px"; // Proportionally smaller line height
  };
  
  const bodyFontSize = getBodyFontSize();
  const bodyLineHeight = getBodyLineHeight();
  
  // Simple spacing based on your exact specifications
  const getGridTopSpacing = () => {
    if (screenWidth < 500) {
      return "12px";
    }

    if (screenWidth >= 500 && screenWidth <= 720) {
      return "8px";
    }

    // 721px - 798px: 8px spacing
    if (screenWidth >= 721 && screenWidth <= 798) {
      return "-14px";
    }
    
    // 799px - 959px: 24px spacing
    if (screenWidth >= 799 && screenWidth < 960) {
      return "-10px";
    }
    
    // 960px - 1279px: two-liner, 16px spacing
    if (screenWidth >= 960 && screenWidth < 1280) {
      return "-5px";
    }
    
    // 1280px - 1572px: three-liner, 32px spacing
    if (screenWidth >= 1280 && screenWidth < 1303) {
      return "24px";
    }
    
    // 1573px+: 12px spacing
    return "0px";
  };
  
  const gridTopSpacing = getGridTopSpacing();

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          paddingTop: "96px",
          paddingLeft: `${padding}px`,
          paddingRight: `${padding}px`,
          alignSelf: "stretch",
          backgroundColor: "var(--Colors-Background-Secondary, #F3FDFB)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "48px",
            background:
              "linear-gradient(to bottom, rgba(243,253,251,1) 0%, rgba(243,253,251,0) 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            width: "100%",
            zIndex: 1,
          }}
        >
        <div
          style={{
            display: "flex",
            width: titleContainerWidth,
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--Spacings-Gaps-12px, 12px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: titleGap,
              flexDirection: "row", // Always horizontal
              flexWrap: "nowrap", // Prevent wrapping
            }}
          >
            <h1
              style={{
                color: "var(--Colors-Text-Primary, #051411)",
                fontFamily: "Inter",
                fontSize: titleFontSize,
                fontStyle: "normal",
                fontWeight: "800",
                lineHeight: "normal",
                textAlign: "center",
                margin: 0,
                whiteSpace: "nowrap", // Prevent text wrapping
              }}
            >
              MusiDoku
            </h1>
            <h1
              style={{
                background:
                  "linear-gradient(92deg, var(--Colors-Accent-Accent-1, #6D7FD9) 0.17%, var(--Colors-Primary-Primary-1, #3CC3BA) 100.17%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "Inter",
                fontSize: titleFontSize,
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "normal",
                textAlign: "center",
                margin: 0,
                whiteSpace: "nowrap", // Prevent text wrapping
              }}
            >
              Artists Roster
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              maxWidth: screenWidth >= 1303 ? "598.5px" : "100%",
            }}
          >
            <p
              style={{
                color: "var(--Colors-Text-Tertiary, #404B49)",
                fontFamily: "Inter",
                fontSize: bodyFontSize,
                fontStyle: "normal",
                fontWeight: "550",
                lineHeight: bodyLineHeight,
                textAlign: "center",
              }}
            >
              All artists you can pick within the MusiDoku gameplay. Collect all the
              artists in the roster! New artists will be added to Artists Roster
              periodically.
            </p>
          </div>
          </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
            boxSizing: "border-box",
          }}
        >
          <ArtistSearch artists={artists} selectedTypes={selectedTypes} onTypesChange={setSelectedTypes} selectedMisc={selectedMisc} onMiscChange={setSelectedMisc} />
          <PaginationBar artists={artists} pageSize={pageSize} selectedTypes={selectedTypes} selectedMisc={selectedMisc} />
        </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          paddingLeft: `${padding}px`,
          paddingRight: `${padding}px`,
          marginTop: gridTopSpacing,
          boxSizing: "border-box",
        }}
      >
        <ArtistGrid artists={artists} pageSize={pageSize} selectedTypes={selectedTypes} selectedMisc={selectedMisc} />
      </div>
    </>
  );
}