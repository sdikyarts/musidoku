// app/api/artists/genres/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

type MockSelectReturn = {
  from: ReturnType<typeof vi.fn>;
};

describe('GET /api/artists/genres', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return unique genres from primary and secondary genres', async () => {
    const mockData = [
      { primary_genre: 'pop', secondary_genre: 'rock' },
      { primary_genre: 'hip hop', secondary_genre: 'r&b' },
      { primary_genre: 'pop', secondary_genre: null },
      { primary_genre: 'rock', secondary_genre: 'alternative' },
    ];

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockResolvedValue(mockData),
    });

    vi.mocked(db.select).mockReturnValue(mockSelect() as MockSelectReturn);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(['alternative', 'hip hop', 'pop', 'r&b', 'rock']);
  });

  it('should handle empty results', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockResolvedValue([]),
    });

    vi.mocked(db.select).mockReturnValue(mockSelect() as MockSelectReturn);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should handle database errors', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockRejectedValue(new Error('Database error')),
    });

    vi.mocked(db.select).mockReturnValue(mockSelect() as MockSelectReturn);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to fetch genres' });
  });

  it('should filter out null secondary genres', async () => {
    const mockData = [
      { primary_genre: 'pop', secondary_genre: null },
      { primary_genre: 'rock', secondary_genre: null },
    ];

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockResolvedValue(mockData),
    });

    vi.mocked(db.select).mockReturnValue(mockSelect() as MockSelectReturn);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(['pop', 'rock']);
  });

  it('should return genres in alphabetical order', async () => {
    const mockData = [
      { primary_genre: 'rock', secondary_genre: 'alternative' },
      { primary_genre: 'hip hop', secondary_genre: 'pop' },
      { primary_genre: 'country', secondary_genre: 'metal' },
    ];

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockResolvedValue(mockData),
    });

    vi.mocked(db.select).mockReturnValue(mockSelect() as MockSelectReturn);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(['alternative', 'country', 'hip hop', 'metal', 'pop', 'rock']);
  });
});
