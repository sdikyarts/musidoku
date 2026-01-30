// app/api/artists/genres/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { artists } from '@/db/schema/artists';

export async function GET() {
  try {
    // Get all distinct primary and secondary genres
    const result = await db
      .select({
        primary_genre: artists.primary_genre,
        secondary_genre: artists.secondary_genre,
      })
      .from(artists);

    // Collect all unique genres from both primary and secondary
    const genreSet = new Set<string>();
    
    for (const row of result) {
      if (row.primary_genre) {
        genreSet.add(row.primary_genre);
      }
      if (row.secondary_genre) {
        genreSet.add(row.secondary_genre);
      }
    }

    // Convert to array and sort alphabetically
    const genres = Array.from(genreSet).sort((a, b) => a.localeCompare(b));

    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}
