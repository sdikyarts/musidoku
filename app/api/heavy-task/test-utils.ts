// app/api/heavy-task/test-utils.ts
// Shared test utilities for heavy-task endpoints

export const mockArtists = [
  {
    spotify_id: '1',
    scraper_name: 'Artist One',
    genres: 'pop,rock',
    primary_genre: 'pop',
  },
  {
    spotify_id: '2',
    scraper_name: 'Artist Two',
    genres: 'pop,electronic',
    primary_genre: 'pop',
  },
  {
    spotify_id: '3',
    scraper_name: 'Artist Three',
    genres: 'pop,rock',
    primary_genre: 'pop',
  },
];

export function expectValidResponse(data: unknown, optimized: boolean) {
  expect(data).toHaveProperty('target_artist');
  expect(data).toHaveProperty('similar_artists');
  expect(data).toHaveProperty('metadata');
  expect((data as { metadata: { optimized: boolean } }).metadata.optimized).toBe(optimized);
  expect(Array.isArray((data as { similar_artists: unknown[] }).similar_artists)).toBe(true);
}
