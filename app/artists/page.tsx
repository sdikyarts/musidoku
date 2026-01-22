import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import ArtistsPageClient from "./ArtistsPageClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artists Roster",
};

type Artist = {
  id: string;
  name: string;
  imageUrl?: string | null;
  debutYear?: number | null;
  type?: 'solo' | 'group' | 'unknown' | null;
};

type CsvRow = {
  spotify_id: string;
  scraper_name: string;
  scraper_image_url?: string;
  chartmasters_name?: string;
  debut_year?: string;
  parsed_artist_type?: string;
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
    type: (row.parsed_artist_type === 'solo' || row.parsed_artist_type === 'group' || row.parsed_artist_type === 'unknown')
      ? row.parsed_artist_type
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
      <ArtistsPageClient artists={artists} />
    </main>
  );
}
