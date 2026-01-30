// app/api/heavy-task/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { db } from '@/lib/db';
import { mockArtists, expectValidResponse } from './test-utils';

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
  },
}));

describe('GET /api/heavy-task', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return similar artists with metadata', async () => {
    // Mock database response - return array directly
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockResolvedValue(mockArtists),
    } as unknown as ReturnType<typeof db.select>);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expectValidResponse(data, false);
  });
});
