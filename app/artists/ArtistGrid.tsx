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
): Artist[] {
  const query = (queryParam ?? "").trim().toLowerCase();
  if (!query) return artists;

  return artists.filter((artist) =>
    artist.name.toLowerCase().includes(query),
  );
}

export function ArtistPagination({
  totalArtists,
  pageSize,
}: Readonly<{ totalArtists: number; pageSize: number }>) {
  const searchParams = useSearchParams();
  const { currentPage, totalPages, hasPrev, hasNext } =
    getPageInfo(totalArtists, searchParams.get("page"), pageSize);
  const searchQuery = searchParams.get("q");

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
        }}
      >
        Prev
      </Link>
      <span
        style={{
          color: "#404B49",
          fontWeight: 550,
          fontSize: "14px",
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
        }}
      >
        Next
      </Link>
    </div>
  );
}

export function ArtistGrid({ artists, pageSize }: Readonly<{ artists: Artist[]; pageSize: number }>) {
  const searchParams = useSearchParams();
  const [maxColumns, setMaxColumns] = useState(5);
  
  const filteredArtists = filterArtists(artists, searchParams.get("q"));
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
      const cardWidth = 200;
      const gap = 24;
      
      // Calculate padding based on screen width (same logic as shared utility)
      const padding = calculateHorizontalPadding(screenWidth);
      
      // Calculate available width for the content area
      const availableWidth = screenWidth - (padding * 2);
      
      // Calculate how many cards can fit, minimum 2
      const maxCardsPerRow = Math.max(2, Math.floor((availableWidth + gap) / (cardWidth + gap)));
      
      setMaxColumns(maxCardsPerRow);
    };
    
    calculateMaxColumns();
    globalThis.window.addEventListener('resize', calculateMaxColumns);
    return () => globalThis.window.removeEventListener('resize', calculateMaxColumns);
  }, []);

  return (
    <div 
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${maxColumns}, 200px)`,
        gap: "24px",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {pageArtists.map((artist) => (
        <ArtistCard key={artist.id} name={artist.name} imageUrl={artist.imageUrl} />
      ))}
    </div>
  );
}
