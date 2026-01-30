import { getArtistBySpotifyId, getPreviousArtist, getNextArtist, getTotalArtistCount } from "@/lib/artists/repo";
import { formatRosterNumber } from "@/lib/artists/formatters";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArtistPageClient from "./ArtistPageClient";

type Props = {
  params: Promise<{ spotifyId: string }>;
};

export async function generateMetadata({ params }: Readonly<Props>): Promise<Metadata> {
  const { spotifyId } = await params;
  const artist = await getArtistBySpotifyId(spotifyId);
  
  if (!artist) {
    return {
      title: "Artist Not Found",
    };
  }

  return {
    title: artist.scraper_name,
  };
}

export default async function ArtistPage({ params }: Readonly<Props>) {
  const { spotifyId } = await params;
  const artist = await getArtistBySpotifyId(spotifyId);

  if (!artist) {
    notFound();
  }

  const rosterOrder = artist.roster_order ?? 0;
  const prevArtist = await getPreviousArtist(rosterOrder);
  const nextArtist = await getNextArtist(rosterOrder);
  const totalArtists = await getTotalArtistCount();

  return (
    <ArtistPageClient 
      artist={artist} 
      prevArtistId={prevArtist?.spotify_id ?? null}
      nextArtistId={nextArtist?.spotify_id ?? null}
      currentPosition={formatRosterNumber(artist.roster_order)}
      totalArtists={totalArtists}
    />
  );
}
