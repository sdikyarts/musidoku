// app/api/heavy-task/route.ts
// UNOPTIMIZED VERSION - Simulates a CPU-intensive artist analytics endpoint
import { db } from "@/lib/db";
import { artists } from "@/db/schema/artists";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Inefficient genre similarity calculation
 * This simulates a real-world scenario where we calculate similarity scores
 * between artists based on their genres using a naive O(n²) approach
 */
function calculateGenreSimilarity(artist1Genres: string, artist2Genres: string): number {
  const genres1 = artist1Genres.split(',').map(g => g.trim().toLowerCase());
  const genres2 = artist2Genres.split(',').map(g => g.trim().toLowerCase());
  
  let matchCount = 0;
  // INEFFICIENT: Nested loops instead of using Set
  for (const g1 of genres1) {
    for (const g2 of genres2) {
      if (g1 === g2) {
        matchCount++;
      }
    }
  }
  
  return matchCount / Math.max(genres1.length, genres2.length);
}

/**
 * Inefficient Levenshtein distance calculation
 * Used to find similar artist names - intentionally unoptimized
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  // INEFFICIENT: Creating full matrix without optimization
  const dp: number[][] = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }
  
  return dp[m][n];
}

/**
 * HEAVY TASK: Find similar artists based on genre and name similarity
 * This endpoint demonstrates common performance bottlenecks:
 * 1. Loading all data into memory
 * 2. O(n²) comparisons
 * 3. Inefficient string operations
 * 4. No caching or memoization
 */
export async function GET() {
  const startTime = Date.now();
  
  // Fetch all artists (potentially thousands of records)
  const allArtists = await db.select().from(artists);
  
  // Pick a random artist to find similar ones
  // Math.random() is safe here: demo/testing endpoint, not security-critical
  const targetIndex = Math.floor(Math.random() * allArtists.length); // NOSONAR S2245
  const targetArtist = allArtists[targetIndex];
  
  // INEFFICIENT: Compare target artist with ALL other artists
  const similarities = allArtists
    .filter(a => a.spotify_id !== targetArtist.spotify_id)
    .map(artist => {
      // Calculate genre similarity
      const genreSimilarity = calculateGenreSimilarity(
        targetArtist.genres,
        artist.genres
      );
      
      // Calculate name similarity
      const nameSimilarity = 1 - (
        levenshteinDistance(
          targetArtist.scraper_name.toLowerCase(),
          artist.scraper_name.toLowerCase()
        ) / Math.max(targetArtist.scraper_name.length, artist.scraper_name.length)
      );
      
      // Combined score
      const score = (genreSimilarity * 0.7) + (nameSimilarity * 0.3);
      
      return {
        spotify_id: artist.spotify_id,
        name: artist.scraper_name,
        genres: artist.genres,
        similarity_score: score,
      };
    })
    // INEFFICIENT: Sorting entire array
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, 10); // Top 10 similar artists
  
  const processingTime = Date.now() - startTime;
  
  return NextResponse.json({
    target_artist: {
      spotify_id: targetArtist.spotify_id,
      name: targetArtist.scraper_name,
      genres: targetArtist.genres,
    },
    similar_artists: similarities,
    metadata: {
      total_artists_compared: allArtists.length - 1,
      processing_time_ms: processingTime,
      optimized: false,
    },
  });
}
