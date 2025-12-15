// app/api/artists/[spotifyId]/route.ts
import { validateSpotifyId } from "@/lib/artists/artist";
import { getArtistBySpotifyId } from "@/lib/artists/repo";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { spotifyId: string } }) {
  const parsedId = validateSpotifyId(params.spotifyId);
  if (!parsedId.ok) {
    return NextResponse.json({ error: parsedId.error }, { status: 400 });
  }

  const artist = await getArtistBySpotifyId(parsedId.value);
  if (!artist) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(artist);
}
