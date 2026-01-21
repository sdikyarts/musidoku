import { getArtistBySpotifyId } from "@/lib/artists/repo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: { spotifyId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await getArtistBySpotifyId(params.spotifyId);
  
  if (!artist) {
    return {
      title: "Artist Not Found",
    };
  }

  return {
    title: artist.scraper_name,
  };
}

export default async function ArtistPage({ params }: Props) {
  const artist = await getArtistBySpotifyId(params.spotifyId);

  if (!artist) {
    notFound();
  }

  return (
    <div>
      <h1>{artist.scraper_name}</h1>
    </div>
  );
}
