'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Artist } from "./ArtistGrid";
import { ArtistPagination, filterArtists } from "./ArtistGrid";

type Props = {
  artists: Artist[];
  pageSize: number;
  selectedTypes?: Array<'solo' | 'group'>;
  selectedMisc?: Array<'deceased' | 'disbanded'>;
  selectedCountries?: string[];
  selectedGenres?: string[];
  debutStartYear?: number | null;
  debutEndYear?: number | null;
  birthStartYear?: number | null;
  birthEndYear?: number | null;
};

// Hides the pagination when scrolling down and reveals it when scrolling up
export default function PaginationBar({ artists, pageSize, selectedTypes, selectedMisc, selectedCountries, selectedGenres, debutStartYear, debutEndYear, birthStartYear, birthEndYear }: Readonly<Props>) {
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef<number>(0);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickingRef = useRef<boolean>(false);
  const searchParams = useSearchParams();
  const filteredTotal = filterArtists(artists, searchParams.get("q"), selectedTypes, selectedMisc, selectedCountries, selectedGenres, debutStartYear, debutEndYear, birthStartYear, birthEndYear).length;

  const clearIdleTimeout = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
  }, []);

  const setIdleTimeout = useCallback(() => {
    clearIdleTimeout();
    idleTimeoutRef.current = setTimeout(() => {
      setHidden(false);
    }, 200);
  }, [clearIdleTimeout]);

  const updateScrollState = useCallback((currentY: number, lastY: number) => {
    if (currentY <= 0) {
      setHidden(false);
    } else if (currentY > lastY) {
      setHidden(true);
    } else if (currentY < lastY) {
      setHidden(false);
    }
  }, []);

  const processScrollFrame = useCallback(() => {
    const currentY = globalThis.window.scrollY;
    const lastY = lastYRef.current;

    updateScrollState(currentY, lastY);
    setIdleTimeout();

    lastYRef.current = currentY;
    tickingRef.current = false;
  }, [updateScrollState, setIdleTimeout]);

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;
    globalThis.window.requestAnimationFrame(processScrollFrame);
  }, [processScrollFrame]);

  useEffect(() => {
    globalThis.window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      globalThis.window.removeEventListener("scroll", handleScroll);
      clearIdleTimeout();
    };
  }, [handleScroll, clearIdleTimeout]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        background: "#F3FDFB",
        alignSelf: "stretch",
        overflow: "hidden",
        maxHeight: hidden ? 0 : 120,
        paddingBottom: hidden ? 0 : 24,
        transform: hidden ? "translateY(-8px)" : "translateY(0)",
        opacity: hidden ? 0 : 1,
        transition:
          "max-height 200ms ease, padding-bottom 200ms ease, transform 180ms ease, opacity 180ms ease",
        pointerEvents: hidden ? "none" : "auto",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
      }}
    >
      <ArtistPagination totalArtists={filteredTotal} pageSize={pageSize} />
    </div>
  );
}
