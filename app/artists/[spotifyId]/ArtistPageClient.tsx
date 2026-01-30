'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import PersonIcon from "@/app/components/icons/Person";
import GroupIcon from "@/app/components/icons/Group";
import ChevronLeftIcon from "@/app/components/icons/ChevronLeft";
import ChevronRightIcon from "@/app/components/icons/ChevronRight";
import { calculateNavbarHorizontalPadding } from "@/lib/layout/padding";

type Artist = {
  scraper_name: string;
  scraper_image_url: string | null;
  parsed_artist_type: string;
  gender: string;
  country: string;
  birth_date: string | null;
  death_date: string | null;
  disband_date: string | null;
  debut_year: number | null;
  member_count: number | null;
  primary_genre: string;
  secondary_genre: string | null;
  is_dead: boolean | null;
  is_disbanded: boolean | null;
};

type PaginationProps = {
  prevArtistId: string | null;
  nextArtistId: string | null;
  currentPosition: number;
  totalArtists: number;
  screenWidth: number;
  isAbsolute?: boolean;
};

type ArtistInfoProps = {
  artist: Artist;
  titleFontSize: string;
  pillSize: ReturnType<typeof getPillSizing>;
};

// Style helper functions
function getPaginationContainerStyle(isAbsolute: boolean, isNarrowScreen: boolean) {
  const baseStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: isNarrowScreen && !isAbsolute ? "100%" : "224px",
    gap: "12px",
  };
  
  if (!isAbsolute) return baseStyle;
  
  return {
    ...baseStyle,
    position: "absolute" as const,
    bottom: "0",
  };
}

function getPaginationLinkStyle(isEnabled: boolean) {
  return {
    pointerEvents: isEnabled ? "auto" as const : "none" as const,
    opacity: isEnabled ? 1 : 0.4,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    color: "#051411",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function getPaginationTextStyle(screenWidth: number) {
  return {
    color: "#404B49",
    fontWeight: 550,
    fontSize: screenWidth < 799 ? "13px" : "14px",
  };
}

function ArtistPagination({ prevArtistId, nextArtistId, currentPosition, totalArtists, screenWidth, isAbsolute = false }: Readonly<PaginationProps>) {
  const isNarrowScreen = screenWidth < 799;
  
  return (
    <div style={getPaginationContainerStyle(isAbsolute, isNarrowScreen)}>
      <Link href={prevArtistId ? `/artists/${prevArtistId}` : "#"} style={getPaginationLinkStyle(!!prevArtistId)}>
        <ChevronLeftIcon size={28} color="#051411" />
      </Link>
      <span style={getPaginationTextStyle(screenWidth)}>
        {currentPosition} / {totalArtists}
      </span>
      <Link href={nextArtistId ? `/artists/${nextArtistId}` : "#"} style={getPaginationLinkStyle(!!nextArtistId)}>
        <ChevronRightIcon size={28} color="#051411" />
      </Link>
    </div>
  );
}

function ArtistInfo({ artist, titleFontSize, pillSize }: Readonly<ArtistInfoProps>) {
  const isSolo = artist.parsed_artist_type === 'solo';
  const typeLabel = getArtistTypeLabel(artist.parsed_artist_type);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: "flex-start",
        gap: '8px',
        width: '100%',
      }}
    >
      <h1
        style={{
          color: "var(--Colors-Text-Primary, #051411)",
          fontFamily: "Inter",
          fontSize: titleFontSize,
          fontStyle: "normal",
          fontWeight: "800",
          textAlign: "left",
          margin: 0,
          wordWrap: "break-word",
          overflowWrap: "break-word",
          width: "100%",
        }}
      >
        {artist.scraper_name}
      </h1>
      <div style={{ display: "flex", alignItems: "flex-start", gap: '8px', flexWrap: "wrap" }}>
        <div
          style={{
            display: "flex",
            padding: pillSize.padding,
            alignItems: "center",
            gap: pillSize.gap,
            borderRadius: pillSize.borderRadius,
            color: "#F3FDFB",
            background: "#6D7FD9",
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
            <div style={{ width: `${pillSize.iconSize}px`, height: `${pillSize.iconSize}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isSolo ? <PersonIcon color="#F3FDFB" size={pillSize.iconSize} /> : <GroupIcon color="#F3FDFB" size={pillSize.iconSize} />}
            </div>
            <p
              style={{
                color: "#F3FDFB",
                fontSize: pillSize.fontSize,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {typeLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get artist type label
function getArtistTypeLabel(artistType: string): string {
    if (artistType === 'solo') return 'Soloist';
    if (artistType === 'group') return 'Group';
    return 'Unknown';
}

// Helper function to get pill sizing
function getPillSizing(screenWidth: number) {
    if (screenWidth < 799) {
        return { padding: "8px", iconSize: 16, fontSize: "14px", gap: "6px", borderRadius: "5px" };
    }
    if (screenWidth <= 1080) {
        return { padding: "10px", iconSize: 18, fontSize: "15px", gap: "7px", borderRadius: "5.5px" };
    }
    return { padding: "12px", iconSize: 20, fontSize: "16px", gap: "8px", borderRadius: "6px" };
}

// Helper function to get title font size
function getTitleFontSize(screenWidth: number): string {
    if (screenWidth >= 1280) return "56px";
    if (screenWidth >= 960) return "48px";
    if (screenWidth >= 799) return "40px";
    if (screenWidth >= 640) return "40px";
    return "32px";
}

// Helper function to calculate image size
function calculateImageSize(screenWidth: number, padding: number, isWideScreen: boolean): number | null {
    if (!isWideScreen) {
        return null; // Will use width: 100% in the style
    }
    
    const availableWidth = screenWidth - (padding * 2) - 24 - 24;
    return Math.min(640, Math.floor(availableWidth * 0.5));
}

// Style calculation helpers
function getImageStyle(imageUrl: string | null, imageSize: number | null) {
  return {
    borderRadius: '8px',
    background: imageUrl ? `url(${imageUrl}) center / cover no-repeat` : 'lightgray',
    width: imageSize ? `${imageSize}px` : '100%',
    height: imageSize ? `${imageSize}px` : 'auto',
    aspectRatio: '1',
    flexShrink: 0,
  };
}

function getContentContainerStyle(isWideScreen: boolean, imageSize: number | null) {
  return {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: "flex-start" as const,
    justifyContent: "center" as const,
    flex: isWideScreen ? 1 : 'none',
    minWidth: isWideScreen && imageSize ? `${imageSize}px` : 'auto',
    minHeight: isWideScreen && imageSize ? `${imageSize}px` : 'auto',
    width: isWideScreen ? 'auto' : '100%',
    paddingLeft: isWideScreen ? '24px' : '0',
    paddingBottom: isWideScreen ? '60px' : '0',
    boxSizing: 'border-box' as const,
    position: 'relative' as const,
  };
}

function getMainContainerStyle(isWideScreen: boolean, padding: number) {
  return {
    display: 'flex',
    flexDirection: isWideScreen ? 'row' as const : 'column' as const,
    gap: '16px',
    alignItems: isWideScreen ? 'center' as const : 'flex-start' as const,
    justifyContent: 'center' as const,
    width: '100%',
    paddingLeft: isWideScreen ? `${padding}px` : '0',
    paddingRight: isWideScreen ? `${padding}px` : '0',
    boxSizing: 'border-box' as const,
  };
}

export default function ArtistPageClient({ artist, prevArtistId, nextArtistId, currentPosition, totalArtists }: Readonly<{ artist: Artist; prevArtistId: string | null; nextArtistId: string | null; currentPosition: number; totalArtists: number }>) {
    const [screenWidth, setScreenWidth] = useState<number | null>(null);
    const [padding, setPadding] = useState<number | null>(null);
    
    useEffect(() => {
        const updateDimensions = () => {
            if (globalThis.window !== undefined) {
                const width = globalThis.window.innerWidth;
                setScreenWidth(width);
                setPadding(calculateNavbarHorizontalPadding(width));
            }
        };
        
        updateDimensions();
        globalThis.window.addEventListener('resize', updateDimensions);
        return () => globalThis.window.removeEventListener('resize', updateDimensions);
    }, []);
    
    // Don't render until we have calculated values
    if (screenWidth === null || padding === null) {
        return null;
    }
    
    const isWideScreen = screenWidth >= 799;
    const pillSize = getPillSizing(screenWidth);
    const imageSize = calculateImageSize(screenWidth, padding, isWideScreen);
    const titleFontSize = getTitleFontSize(screenWidth);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "var(--Colors-Background-Secondary, #F3FDFB)",
                paddingTop: isWideScreen ? "72px" : "0px",
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: '1600px',
                    paddingBottom: '36px',
                    boxSizing: 'border-box',
                }}
            >
                {!isWideScreen && (
                    <ArtistPagination
                        prevArtistId={prevArtistId}
                        nextArtistId={nextArtistId}
                        currentPosition={currentPosition}
                        totalArtists={totalArtists}
                        screenWidth={screenWidth}
                    />
                )}
                <div style={getMainContainerStyle(isWideScreen, padding)}>
                <div style={getImageStyle(artist.scraper_image_url, imageSize)} />
                <div style={getContentContainerStyle(isWideScreen, imageSize)}>
                    <ArtistInfo
                        artist={artist}
                        titleFontSize={titleFontSize}
                        pillSize={pillSize}
                    />
                    {isWideScreen && (
                        <ArtistPagination
                            prevArtistId={prevArtistId}
                            nextArtistId={nextArtistId}
                            currentPosition={currentPosition}
                            totalArtists={totalArtists}
                            screenWidth={screenWidth}
                            isAbsolute={true}
                        />
                    )}
                </div>
                </div>
            </div>
        </div>
    );
}
