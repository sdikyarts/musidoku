import ArtistsPageClient from "./ArtistsPageClient";
import type { Metadata } from "next";
import { listArtists } from "@/lib/artists/repo";

export const metadata: Metadata = {
  title: "Artists Roster",
};

export default async function ArtistsPage() {
  // Fetch all artists from database (you may want to add pagination here)
  const dbArtists = await listArtists({ limit: 10000, offset: 0 });
  
  // Map database artists to the format expected by the client component
  const artists = dbArtists.map((artist) => ({
    id: artist.spotify_id,
    name: artist.scraper_name,
    imageUrl: artist.scraper_image_url ?? null,
    debutYear: artist.debut_year ?? null,
    type: artist.parsed_artist_type as 'solo' | 'group' | 'unknown' | null,
    isDead: artist.is_dead ?? false,
    isDisbanded: artist.is_disbanded ?? false,
  }));

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
