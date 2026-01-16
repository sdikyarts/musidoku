'use client';

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Artist } from "./ArtistGrid";
import { ArtistPagination, filterArtists } from "./ArtistGrid";

type Props = {
  artists: Artist[];
};

// Hides the pagination when scrolling down and reveals it when scrolling up
export default function PaginationBar({ artists }: Readonly<Props>) {
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const searchParams = useSearchParams();
  const filteredTotal = filterArtists(artists, searchParams.get("q")).length;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const lastY = lastYRef.current;

        if (currentY <= 0) {
          setHidden(false);
        } else if (currentY > lastY) {
          setHidden(true);
        } else if (currentY < lastY) {
          setHidden(false);
        }

        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current);
        }
        idleTimeoutRef.current = setTimeout(() => {
          setHidden(false);
        }, 200);

        lastYRef.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

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
      <ArtistPagination totalArtists={filteredTotal} />
    </div>
  );
}
