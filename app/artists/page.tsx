import React from "react";
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import ArtistSearch from "../components/search/artist";
import { ArtistGrid } from "./ArtistGrid";
import PaginationBar from "./PaginationBar";

export const dynamic = "force-dynamic";

type Artist = {
  id: string;
  name: string;
  imageUrl?: string | null;
  debutYear?: number | null;
};

type CsvRow = {
  spotify_id: string;
  scraper_name: string;
  scraper_image_url?: string;
  chartmasters_name?: string;
  debut_year?: string;
};

function loadArtists(): Artist[] {
  const csvPath = path.join(process.cwd(), "artist.csv");
  const raw = fs.readFileSync(csvPath, "utf8");
  const rows = parse<CsvRow>(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return rows.map((row) => ({
    id: row.spotify_id,
    name: row.scraper_name,
    imageUrl: row.scraper_image_url ?? null,
    debutYear:
      row.debut_year && Number.isFinite(Number(row.debut_year))
        ? Number(row.debut_year)
        : null,
  }));
}

export default function ArtistsPage() {
  const artists = loadArtists();

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        paddingLeft: "128px",
        paddingRight: "128px",
        paddingTop: "269px",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          paddingTop: "96px",
          paddingLeft: "224px",
          paddingRight: "224px",
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
            width: "60%",
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
              gap: "10px",
            }}
          >
            <h1
              style={{
                color: "var(--Colors-Text-Primary, #051411)",
                fontFamily: "Inter",
                fontSize: "42px",
                fontStyle: "normal",
                fontWeight: "800",
                lineHeight: "normal",
                textAlign: "center",
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
                fontSize: "42px",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "normal",
                textAlign: "center",
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
            }}
          >
            <p
              style={{
                color: "var(--Colors-Text-Tertiary, #404B49)",
                fontFamily: "Inter",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "550",
                lineHeight: "24px",
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
          }}
        >
          <ArtistSearch artists={artists} />
          <PaginationBar artists={artists} />
        </div>
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <ArtistGrid artists={artists} />
          </div>
        </div>
      </div>
    </main>
  );
}
