// app/api/heavy-task-optimized/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { db } from '@/lib/db';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

describe('GET /api/heavy-task-optimized', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return similar artists with optimized flag', async () => {
    // Mock artist data
    const mockTargetArtist = [
      {
        spotify_id: '1',
        scraper_name: 'Artist One',
        genres: 'pop,rock',
        primary_genre: 'pop',
      },
    ];

    const mockCandidates = [
      {
        spotify_id: '2',
        scraper_name: 'Artist Two',
        genres: 'pop,electronic',
      },
      {
        spotify_id: '3',
        scraper_name: 'Artist Three',
        genres: 'pop,rock',
      },
    ];

    // Mock database responses
    let callCount = 0;
    vi.mocked(db.select).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // First call: get random artist
        return {
          from: vi.fn().mockReturnThis(),
          orderBy: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue(mockTargetArtist),
        } as any;
      } else {
        // Second call: get candidates
        return {
          from: vi.fn().mockReturnThis(),
          where: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue(mockCandidates),
        } as any;
      }
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('target_artist');
    expect(data).toHaveProperty('similar_artists');
    expect(data).toHaveProperty('metadata');
    expect(data.metadata.optimized).toBe(true);
    expect(Array.isArray(data.similar_artists)).toBe(true);
  });

  it('should handle empty database gracefully', async () => {
    // Mock empty database
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    } as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
  });
});
