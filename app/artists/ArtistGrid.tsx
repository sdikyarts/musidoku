'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ArtistCard from "../components/cards/ArtistCard";
import { parseSortParam, sortArtists } from "./sortOptions";
import { calculateHorizontalPadding } from "@/lib/layout/padding";

export type Artist = {
  id: string;
  name: string;
  imageUrl?: string | null;
  debutYear?: number | null;
  type?: 'solo' | 'group' | 'unknown' | null;
  isDead?: boolean | null;
  isDisbanded?: boolean | null;
  country?: string | null;
  primaryGenre?: string | null;
  secondaryGenre?: string | null;
  birthDate?: string | null;
};

function getPageInfo(artistsLength: number, pageParam: string | null, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(artistsLength / pageSize));
  const requestedPage = Number(pageParam ?? "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage >= 1
      ? Math.min(requestedPage, totalPages)
      : 1;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return {
    currentPage,
    totalPages,
    hasPrev,
    hasNext,
    startIndex: (currentPage - 1) * pageSize,
  };
}

export function filterArtists(
  artists: Artist[],
  queryParam: string | null,
  selectedTypes?: Array<'solo' | 'group'>,
  selectedMisc?: Array<'deceased' | 'disbanded'>,
  selectedCountries?: string[],
  selectedGenres?: string[],
  debutStartYear?: number | null,
  debutEndYear?: number | null,
  birthStartYear?: number | null,
  birthEndYear?: number | null,
): Artist[] {
  let filtered = artists;
  
  // Filter by search query
  const query = (queryParam ?? "").trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((artist) =>
      artist.name.toLowerCase().includes(query),
    );
  }
  
  // Filter by artist type
  if (selectedTypes && selectedTypes.length > 0) {
    filtered = filtered.filter((artist) => 
      artist.type && selectedTypes.includes(artist.type as 'solo' | 'group')
    );
  }
  
  // Filter by miscellaneous categories
  if (selectedMisc && selectedMisc.length > 0) {
    filtered = filtered.filter((artist) => {
      return selectedMisc.some((misc) => {
        if (misc === 'deceased') return artist.isDead === true;
        if (misc === 'disbanded') return artist.isDisbanded === true;
        return false;
      });
    });
  }
  
  // Filter by countries
  if (selectedCountries && selectedCountries.length > 0) {
    filtered = filtered.filter((artist) => 
      artist.country && selectedCountries.includes(artist.country)
    );
  }
  
  // Filter by genres (match primary or secondary genre)
  if (selectedGenres && selectedGenres.length > 0) {
    filtered = filtered.filter((artist) => 
      selectedGenres.some(genre => 
        artist.primaryGenre === genre || artist.secondaryGenre === genre
      )
    );
  }
  
  // Filter by debut year range
  if (debutStartYear !== null && debutStartYear !== undefined && debutEndYear !== null && debutEndYear !== undefined) {
    filtered = filtered.filter((artist) => 
      artist.debutYear !== null && 
      artist.debutYear !== undefined && 
      artist.debutYear >= debutStartYear && 
      artist.debutYear <= debutEndYear
    );
  }
  
  // Filter by birth year range (for solo artists only)
  if (birthStartYear !== null && birthStartYear !== undefined && birthEndYear !== null && birthEndYear !== undefined) {
    filtered = filtered.filter((artist) => {
      // Birth year filtering only applies to solo artists
      if (artist.type !== 'solo') {
        return false;
      }
      
      // Extract year from birth_date (format: YYYY-MM-DD)
      if (!artist.birthDate) {
        return false;
      }
      
      const birthYear = Number.parseInt(artist.birthDate.substring(0, 4), 10);
      if (Number.isNaN(birthYear)) {
        return false;
      }
      
      return birthYear >= birthStartYear && birthYear <= birthEndYear;
    });
  }
  
  return filtered;
}

export function ArtistPagination({
  totalArtists,
  pageSize,
}: Readonly<{ totalArtists: number; pageSize: number }>) {
  const searchParams = useSearchParams();
  const { currentPage, totalPages, hasPrev, hasNext } =
    getPageInfo(totalArtists, searchParams.get("page"), pageSize);
  const searchQuery = searchParams.get("q");
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateScreenWidth = () => {
      if (globalThis.window !== undefined) {
        setScreenWidth(globalThis.window.innerWidth);
      }
    };
    
    updateScreenWidth();
    globalThis.window.addEventListener('resize', updateScreenWidth);
    return () => globalThis.window.removeEventListener('resize', updateScreenWidth);
  }, []);

  const buildHref = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (pageNumber > 1) {
      params.set("page", pageNumber.toString());
    } else {
      params.delete("page");
    }

    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    return queryString ? `/artists?${queryString}` : "/artists";
  };

  const prevHref = hasPrev ? buildHref(currentPage - 1) : undefined;
  const nextHref = hasNext ? buildHref(currentPage + 1) : undefined;
  
  // Responsive font sizes
  const buttonFontSize = screenWidth && screenWidth < 799 ? "14px" : "16px";
  const pageFontSize = screenWidth && screenWidth < 799 ? "13px" : "14px";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        position: "sticky",
        top: "12px",
        backgroundColor: "var(--Colors-Background-Secondary, #F3FDFB)",
        gap: "12px",
      }}
    >
      <Link
        aria-disabled={!hasPrev}
        href={prevHref ?? "#"}
        style={{
          pointerEvents: hasPrev ? "auto" : "none",
          opacity: hasPrev ? 1 : 0.4,
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
          color: "#051411",
          textDecoration: "none",
          fontWeight: 550,
          fontSize: buttonFontSize,
        }}
      >
        Prev
      </Link>
      <span
        style={{
          color: "#404B49",
          fontWeight: 550,
          fontSize: pageFontSize,
        }}
      >
        Page {currentPage} of {totalPages}
      </span>
      <Link
        aria-disabled={!hasNext}
        href={nextHref ?? "#"}
        style={{
          pointerEvents: hasNext ? "auto" : "none",
          opacity: hasNext ? 1 : 0.4,
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
          color: "#051411",
          textDecoration: "none",
          fontWeight: 550,
          fontSize: buttonFontSize,
        }}
      >
        Next
      </Link>
    </div>
  );
}

export function ArtistGrid({ artists, pageSize, selectedTypes, selectedMisc, selectedCountries, selectedGenres, debutStartYear, debutEndYear, birthStartYear, birthEndYear }: Readonly<{ artists: Artist[]; pageSize: number; selectedTypes?: Array<'solo' | 'group'>; selectedMisc?: Array<'deceased' | 'disbanded'>; selectedCountries?: string[]; selectedGenres?: string[]; debutStartYear?: number | null; debutEndYear?: number | null; birthStartYear?: number | null; birthEndYear?: number | null }>) {
  const searchParams = useSearchParams();
  const [maxColumns, setMaxColumns] = useState<number | null>(null);
  const [cardSize, setCardSize] = useState<number>(200);
  
  const filteredArtists = filterArtists(artists, searchParams.get("q"), selectedTypes, selectedMisc, selectedCountries, selectedGenres, debutStartYear, debutEndYear, birthStartYear, birthEndYear);
  const sortedArtists = sortArtists(filteredArtists, parseSortParam(searchParams.get("sort")));
  const { startIndex } = getPageInfo(
    sortedArtists.length,
    searchParams.get("page"),
    pageSize,
  );
  const pageArtists = sortedArtists.slice(
    startIndex,
    startIndex + pageSize,
  );

  useEffect(() => {
    const calculateMaxColumns = () => {
      if (globalThis.window === undefined) return;
      
      const screenWidth = globalThis.window.innerWidth;
      
      // Use smaller card size for narrow screens
      const currentCardSize = screenWidth < 500 ? 160 : 200;
      setCardSize(currentCardSize);
      
      const gap = 24;
      
      // Calculate padding based on screen width (same logic as shared utility)
      const padding = calculateHorizontalPadding(screenWidth);
      
      // Calculate available width for the content area
      const availableWidth = screenWidth - (padding * 2);
      
      // Calculate how many cards can fit, minimum 2
      const maxCardsPerRow = Math.max(2, Math.floor((availableWidth + gap) / (currentCardSize + gap)));
      
      setMaxColumns(maxCardsPerRow);
    };
    
    calculateMaxColumns();
    globalThis.window.addEventListener('resize', calculateMaxColumns);
    return () => globalThis.window.removeEventListener('resize', calculateMaxColumns);
  }, []);

  // Don't render until we know the column count
  if (maxColumns === null) {
    return null;
  }

  return (
    <div 
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${maxColumns}, ${cardSize}px)`,
        gap: "24px",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {pageArtists.map((artist) => (
        <ArtistCard key={artist.id} id={artist.id} name={artist.name} imageUrl={artist.imageUrl} cardSize={cardSize} />
      ))}
    </div>
  );
}
