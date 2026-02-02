'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PersonIcon from "@/app/components/icons/Person";
import GroupIcon from "@/app/components/icons/Group";
import ChevronLeftIcon from "@/app/components/icons/ChevronLeft";
import ChevronRightIcon from "@/app/components/icons/ChevronRight";
import { calculateNavbarHorizontalPadding } from "@/lib/layout/padding";
import { CountryKit } from "@andreasnicolaou/country-kit";
import { COUNTRY_COLORS } from "@/lib/flag-colors";
import { getLighterBackground, getDarkerText } from "@/lib/artists/country-colors";
import { getTypeColors, type ArtistType } from "@/lib/artists/type-colors";
import { formatGenre } from "@/lib/artists/formatters";
import { GENRE_COLORS, getGenreLighterBackground, getGenreDarkerText } from "@/lib/artists/genre-colors";
import Afrobeats from "@/app/components/icons/genres/afrobeats";
import Alternative from "@/app/components/icons/genres/alternative";
import Bollywood from "@/app/components/icons/genres/bollywood";
import Country from "@/app/components/icons/genres/country";
import Electronic from "@/app/components/icons/genres/electronic";
import HipHop from "@/app/components/icons/genres/hiphop";
import KPop from "@/app/components/icons/genres/kpop";
import Latin from "@/app/components/icons/genres/latin";
import Metal from "@/app/components/icons/genres/metal";
import Pop from "@/app/components/icons/genres/pop";
import RnB from "@/app/components/icons/genres/rnb";
import Reggae from "@/app/components/icons/genres/reggae";
import Rock from "@/app/components/icons/genres/rock";
import Soundtrack from "@/app/components/icons/genres/soundtrack";
import MusicNote from "@/app/components/icons/MusicNote";
import CalendarClock from "@/app/components/icons/CalendarClock";
import GiftIcon from "@/app/components/icons/Gift";
import SkullIcon from "@/app/components/icons/Skull";
import BrokenHeartIcon from "@/app/components/icons/BrokenHeart";

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
  const router = useRouter();
  const isNarrowScreen = screenWidth < 799;
  
  const handleNavigation = (artistId: string | null) => {
    if (!artistId) return;
    router.push(`/artists/${artistId}`, { scroll: false });
  };
  
  return (
    <div style={getPaginationContainerStyle(isAbsolute, isNarrowScreen)}>
      <button
        onClick={() => handleNavigation(prevArtistId)}
        disabled={!prevArtistId}
        style={{
          ...getPaginationLinkStyle(!!prevArtistId),
          cursor: prevArtistId ? 'pointer' : 'default',
          background: 'transparent',
          border: '1px solid #d1d5db',
        }}
      >
        <ChevronLeftIcon size={28} color="#051411" />
      </button>
      <span style={getPaginationTextStyle(screenWidth)}>
        {currentPosition} / {totalArtists}
      </span>
      <button
        onClick={() => handleNavigation(nextArtistId)}
        disabled={!nextArtistId}
        style={{
          ...getPaginationLinkStyle(!!nextArtistId),
          cursor: nextArtistId ? 'pointer' : 'default',
          background: 'transparent',
          border: '1px solid #d1d5db',
        }}
      >
        <ChevronRightIcon size={28} color="#051411" />
      </button>
    </div>
  );
}

function ArtistInfo({ artist, titleFontSize, pillSize }: Readonly<ArtistInfoProps>) {
  const isSolo = artist.parsed_artist_type === 'solo';
  const typeLabel = getArtistTypeLabel(artist.parsed_artist_type);
  
  // Get artist type colors (unselected style for display)
  const typeColors = getTypeColors(artist.parsed_artist_type as ArtistType, false);
  
  // Get country data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countryData = CountryKit.getCountryByCode(artist.country.toLowerCase() as any);
  const countryColor = COUNTRY_COLORS[artist.country] || '#8A9AAA';
  const countryBgColor = getLighterBackground(countryColor);
  const countryTextColor = getDarkerText(countryColor);

  // Get genre data
  const primaryGenreColor = GENRE_COLORS[artist.primary_genre] || '#8A9AAA';
  const primaryGenreBgColor = getGenreLighterBackground(primaryGenreColor);
  const primaryGenreTextColor = getGenreDarkerText(primaryGenreColor, artist.primary_genre);
  const PrimaryGenreIcon = genreIcons[artist.primary_genre];

  const secondaryGenreColor = artist.secondary_genre ? (GENRE_COLORS[artist.secondary_genre] || '#8A9AAA') : null;
  const secondaryGenreBgColor = artist.secondary_genre ? getGenreLighterBackground(secondaryGenreColor!) : null;
  const secondaryGenreTextColor = artist.secondary_genre ? getGenreDarkerText(secondaryGenreColor!, artist.secondary_genre) : null;
  const SecondaryGenreIcon = artist.secondary_genre ? genreIcons[artist.secondary_genre] : null;

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
            background: typeColors.backgroundColor,
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
            <div style={{ width: `${pillSize.iconSize}px`, height: `${pillSize.iconSize}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isSolo ? <PersonIcon color={typeColors.textColor} size={pillSize.iconSize} /> : <GroupIcon color={typeColors.textColor} size={pillSize.iconSize} />}
            </div>
            <p
              style={{
                color: typeColors.textColor,
                fontSize: pillSize.fontSize,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {typeLabel}
            </p>
          </div>
        </div>
        {countryData?.emoji && countryData?.name && (
          <div
            style={{
              display: "flex",
              padding: pillSize.padding,
              alignItems: "center",
              gap: pillSize.gap,
              borderRadius: pillSize.borderRadius,
              background: countryBgColor,
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
              <span style={{ fontSize: "20px", lineHeight: 1 }}>
                {countryData.emoji}
              </span>
              <p
                style={{
                  color: countryTextColor,
                  fontSize: pillSize.fontSize,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {countryData.name}
              </p>
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            padding: pillSize.padding,
            alignItems: "center",
            gap: pillSize.gap,
            borderRadius: pillSize.borderRadius,
            background: primaryGenreBgColor,
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
            <div style={{ width: `${pillSize.iconSize}px`, height: `${pillSize.iconSize}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {PrimaryGenreIcon ? <PrimaryGenreIcon color={primaryGenreTextColor} size={pillSize.iconSize} /> : <MusicNote color={primaryGenreTextColor} size={pillSize.iconSize} />}
            </div>
            <p
              style={{
                color: primaryGenreTextColor,
                fontSize: pillSize.fontSize,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {formatGenre(artist.primary_genre)}
            </p>
          </div>
        </div>
        {artist.secondary_genre && secondaryGenreBgColor && secondaryGenreTextColor && (
          <div
            style={{
              display: "flex",
              padding: pillSize.padding,
              alignItems: "center",
              gap: pillSize.gap,
              borderRadius: pillSize.borderRadius,
              background: secondaryGenreBgColor,
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
              <div style={{ width: `${pillSize.iconSize}px`, height: `${pillSize.iconSize}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {SecondaryGenreIcon ? <SecondaryGenreIcon color={secondaryGenreTextColor} size={pillSize.iconSize} /> : <MusicNote color={secondaryGenreTextColor} size={pillSize.iconSize} />}
              </div>
              <p
                style={{
                  color: secondaryGenreTextColor,
                  fontSize: pillSize.fontSize,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {formatGenre(artist.secondary_genre)}
              </p>
            </div>
          </div>
        )}
        {artist.debut_year && (
          <div
            style={{
              display: "flex",
              padding: pillSize.padding,
              alignItems: "center",
              gap: pillSize.gap,
              borderRadius: pillSize.borderRadius,
              background: "#C5DBDD",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
              <div style={{ width: `${pillSize.iconSize}px`, height: `${pillSize.iconSize}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarClock color="#3A6B6F" size={pillSize.iconSize} />
              </div>
              <p
                style={{
                  color: "#3A6B6F",
                  fontSize: pillSize.fontSize,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {artist.debut_year} Debut
              </p>
            </div>
          </div>
        )}
        {artist.birth_date && (
          <div
            style={{
              display: "flex",
              padding: pillSize.padding,
              alignItems: "center",
              gap: pillSize.gap,
              borderRadius: pillSize.borderRadius,
              background: "#D6C599",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
              <div style={{ width: `${pillSize.iconSize}px`, height: `${pillSize.iconSize}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GiftIcon color="#947428" size={pillSize.iconSize} />
              </div>
              <p
                style={{
                  color: "#947428",
                  fontSize: pillSize.fontSize,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Born {formatDate(artist.birth_date)}
              </p>
            </div>
          </div>
        )}
        {artist.death_date && (
          <div
            style={{
              display: "flex",
              padding: pillSize.padding,
              alignItems: "center",
              gap: pillSize.gap,
              borderRadius: pillSize.borderRadius,
              background: "#D5CDDF",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
              <div style={{ width: `${pillSize.iconSize}px`, height: `${pillSize.iconSize}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SkullIcon color="#6B5C7D" size={pillSize.iconSize} />
              </div>
              <p
                style={{
                  color: "#6B5C7D",
                  fontSize: pillSize.fontSize,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Died {formatDate(artist.death_date)}
              </p>
            </div>
          </div>
        )}
        {artist.disband_date && (
          <div
            style={{
              display: "flex",
              padding: pillSize.padding,
              alignItems: "center",
              gap: pillSize.gap,
              borderRadius: pillSize.borderRadius,
              background: "#EBCFC9",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
              <div style={{ width: `${pillSize.iconSize}px`, height: `${pillSize.iconSize}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BrokenHeartIcon color="#B85555" size={pillSize.iconSize} />
              </div>
              <p
                style={{
                  color: "#B85555",
                  fontSize: pillSize.fontSize,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Disbanded {formatDate(artist.disband_date)}
              </p>
            </div>
          </div>
        )}
        {(artist.member_count !== null && artist.member_count > 1) || (artist.parsed_artist_type === 'group' && artist.member_count === 1) ? (
          <div
            style={{
              display: "flex",
              padding: pillSize.padding,
              alignItems: "center",
              gap: pillSize.gap,
              borderRadius: pillSize.borderRadius,
              background: "#D5CDDF",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: pillSize.gap }}>
              <div style={{ width: `${pillSize.iconSize}px`, height: `${pillSize.iconSize}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GroupIcon color="#6B5C7D" size={pillSize.iconSize} />
              </div>
              <p
                style={{
                  color: "#6B5C7D",
                  fontSize: pillSize.fontSize,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {artist.member_count} {artist.member_count === 1 ? 'Member' : 'Members'}
              </p>
            </div>
          </div>
        ) : null}
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

// Helper function to format date (YYYY-MM-DD to readable format)
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

// Map genre values to their icons
const genreIcons: Record<string, React.ComponentType<{ color?: string; size?: number }>> = {
    'afrobeats': Afrobeats,
    'alternative': Alternative,
    'bollywood': Bollywood,
    'country': Country,
    'electronic': Electronic,
    'hip hop': HipHop,
    'k-pop': KPop,
    'latin': Latin,
    'metal': Metal,
    'pop': Pop,
    'r&b': RnB,
    'reggae': Reggae,
    'rock': Rock,
    'soundtrack': Soundtrack,
};

// Helper function to get pill sizing
function getPillSizing(screenWidth: number) {
    // Slightly smaller than current size for all screen widths
    return { padding: "9px", iconSize: 17, fontSize: "14px", gap: "6px", borderRadius: "5px" };
}

// Helper function to get title font size
function getTitleFontSize(screenWidth: number): string {
    if (screenWidth >= 1280) return "48px";
    if (screenWidth >= 960) return "42px";
    if (screenWidth >= 799) return "36px";
    if (screenWidth >= 640) return "32px";
    return "28px";
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
