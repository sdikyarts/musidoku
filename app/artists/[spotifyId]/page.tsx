import { getArtistBySpotifyId } from "@/lib/artists/repo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ spotifyId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function ArtistPage({ params }: Props) {
  const { spotifyId } = await params;
  const artist = await getArtistBySpotifyId(spotifyId);

  if (!artist) {
    notFound();
  }

  return (
    <div>
    </div>
  );
}
