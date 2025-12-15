// app/api/artists/route.ts
import { parseArtistQuery } from "@/lib/artists/artist";
import { listArtists } from "@/lib/artists/repo";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const parsed = parseArtistQuery(new URL(req.url).searchParams);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const artists = await listArtists(parsed.value);
  return NextResponse.json(artists);
}
