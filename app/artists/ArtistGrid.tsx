'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ArtistCard from "../components/cards/ArtistCard";
import { parseSortParam, sortArtists } from "./sortOptions";

export type Artist = {
  id: string;
  name: string;
  imageUrl?: string | null;
  debutYear?: number | null;
};

const PAGE_SIZE = 36;

function getPageInfo(artistsLength: number, pageParam: string | null) {
  const totalPages = Math.max(1, Math.ceil(artistsLength / PAGE_SIZE));
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
    startIndex: (currentPage - 1) * PAGE_SIZE,
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
}: Readonly<{ totalArtists: number }>) {
  const searchParams = useSearchParams();
  const { currentPage, totalPages, hasPrev, hasNext } =
    getPageInfo(totalArtists, searchParams.get("page"));
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

export function ArtistGrid({ artists }: Readonly<{ artists: Artist[] }>) {
  const searchParams = useSearchParams();
  const filteredArtists = filterArtists(artists, searchParams.get("q"));
  const sortedArtists = sortArtists(filteredArtists, parseSortParam(searchParams.get("sort")));
  const { startIndex } = getPageInfo(
    sortedArtists.length,
    searchParams.get("page"),
  );
  const pageArtists = sortedArtists.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  return (
    <div
      style={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        gap: "24px",
      }}
    >
      {pageArtists.map((artist) => (
        <ArtistCard key={artist.id} name={artist.name} imageUrl={artist.imageUrl} />
      ))}
    </div>
  );
}
