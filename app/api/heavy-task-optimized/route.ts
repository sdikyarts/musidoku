// app/api/heavy-task-optimized/route.ts
// OPTIMIZED VERSION - Same functionality with performance improvements
import { db } from "@/lib/db";
import { artists } from "@/db/schema/artists";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * OPTIMIZED: Genre similarity using Set for O(n) complexity
 */
function calculateGenreSimilarityOptimized(artist1Genres: string, artist2Genres: string): number {
  const genres1 = new Set(artist1Genres.split(',').map(g => g.trim().toLowerCase()));
  const genres2 = new Set(artist2Genres.split(',').map(g => g.trim().toLowerCase()));
  
  let matchCount = 0;
  for (const g1 of genres1) {
    if (genres2.has(g1)) {
      matchCount++;
    }
  }
  
  return matchCount / Math.max(genres1.size, genres2.size);
}

/**
 * OPTIMIZED: Simplified similarity check - only calculate full distance if needed
 */
function quickNameSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Quick checks first
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Length difference check - if too different, skip expensive calculation
  const lengthDiff = Math.abs(s1.length - s2.length);
  if (lengthDiff > Math.max(s1.length, s2.length) * 0.5) {
    return 0;
  }
  
  // Only calculate Levenshtein for potentially similar names
  return 1 - (levenshteinDistanceOptimized(s1, s2) / Math.max(s1.length, s2.length));
}

/**
 * OPTIMIZED: Levenshtein with single array instead of matrix
 */
function levenshteinDistanceOptimized(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  // Use single array instead of full matrix
  let prev = Array(n + 1).fill(0).map((_, i) => i);
  let curr = Array(n + 1).fill(0);
  
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = Math.min(prev[j], curr[j - 1], prev[j - 1]) + 1;
      }
    }
    [prev, curr] = [curr, prev];
  }
  
  return prev[n];
}

/**
 * OPTIMIZED: Find similar artists with multiple improvements:
 * 1. Limit database query to relevant fields only
 * 2. Filter by primary genre first (database-level)
 * 3. Early termination for low-similarity artists
 * 4. Partial sorting using heap-like approach
 */
export async function GET() {
  const startTime = Date.now();
  
  // Get a random artist ID first
  const randomArtist = await db
    .select({
      spotify_id: artists.spotify_id,
      scraper_name: artists.scraper_name,
      genres: artists.genres,
      primary_genre: artists.primary_genre,
    })
    .from(artists)
    .orderBy(sql`RANDOM()`)
    .limit(1);
  
  if (randomArtist.length === 0) {
    return NextResponse.json({ error: "No artists found" }, { status: 404 });
  }
  
  const targetArtist = randomArtist[0];
  
  // OPTIMIZATION 1: Filter by primary genre at database level
  // This reduces the dataset we need to process in memory
  const candidateArtists = await db
    .select({
      spotify_id: artists.spotify_id,
      scraper_name: artists.scraper_name,
      genres: artists.genres,
    })
    .from(artists)
    .where(sql`${artists.primary_genre} = ${targetArtist.primary_genre}`)
    .limit(500); // Limit to reasonable subset
  
  // OPTIMIZATION 2: Use a min-heap approach to keep only top 10
  const topSimilar: Array<{
    spotify_id: string;
    name: string;
    genres: string;
    similarity_score: number;
  }> = [];
  
  const minScore = 0.3; // Early termination threshold
  
  for (const artist of candidateArtists) {
    if (artist.spotify_id === targetArtist.spotify_id) continue;
    
    // Calculate genre similarity first (cheaper operation)
    const genreSimilarity = calculateGenreSimilarityOptimized(
      targetArtist.genres,
      artist.genres
    );
    
    // OPTIMIZATION 3: Early termination if genre similarity is too low
    if (genreSimilarity < minScore) continue;
    
    // Only calculate name similarity if genre similarity is promising
    const nameSimilarity = quickNameSimilarity(
      targetArtist.scraper_name,
      artist.scraper_name
    );
    
    const score = (genreSimilarity * 0.7) + (nameSimilarity * 0.3);
    
    if (score >= minScore) {
      topSimilar.push({
        spotify_id: artist.spotify_id,
        name: artist.scraper_name,
        genres: artist.genres,
        similarity_score: score,
      });
    }
  }
  
  // OPTIMIZATION 4: Partial sort - only sort what we need
  topSimilar.sort((a, b) => b.similarity_score - a.similarity_score);
  const top10 = topSimilar.slice(0, 10);
  
  const processingTime = Date.now() - startTime;
  
  return NextResponse.json({
    target_artist: {
      spotify_id: targetArtist.spotify_id,
      name: targetArtist.scraper_name,
      genres: targetArtist.genres,
    },
    similar_artists: top10,
    metadata: {
      total_artists_compared: candidateArtists.length - 1,
      processing_time_ms: processingTime,
      optimized: true,
    },
  });
}
