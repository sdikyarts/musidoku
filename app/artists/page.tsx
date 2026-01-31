import ArtistsPageClient from "./ArtistsPageClient";
import type { Metadata } from "next";
import { listArtists } from "@/lib/artists/repo";
import { getCountries, getGenres } from "@/lib/artists/filters";
import { formatGenre } from "@/lib/artists/formatters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artists Roster",
};

export default async function ArtistsPage() {
  // Fetch all data server-side in parallel
  const [dbArtists, countries, genres] = await Promise.all([
    listArtists({ limit: 10000, offset: 0 }),
    getCountries(),
    getGenres(),
  ]);
  
  // Map database artists to the format expected by the client component
  const artists = dbArtists.map((artist) => ({
    id: artist.spotify_id,
    name: artist.scraper_name,
    imageUrl: artist.scraper_image_url ?? null,
    debutYear: artist.debut_year ?? null,
    type: artist.parsed_artist_type as 'solo' | 'group' | 'unknown' | null,
    isDead: artist.is_dead ?? false,
    isDisbanded: artist.is_disbanded ?? false,
    country: artist.country ?? null,
    primaryGenre: artist.primary_genre ?? null,
    secondaryGenre: artist.secondary_genre ?? null,
    birthDate: artist.birth_date ?? null,
  }));

  // Format genres for display
  const formattedGenres = genres.map(genre => ({
    value: genre,
    label: formatGenre(genre)
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
      <ArtistsPageClient 
        artists={artists} 
        countryData={countries}
        genreData={formattedGenres}
      />
    </main>
  );
}
