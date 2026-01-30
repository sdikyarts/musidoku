// app/api/heavy-task-optimized/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { mockArtists, expectValidResponse, mockDbSelect } from '../heavy-task/test-utils';

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
    mockDbSelect(mockArtists);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expectValidResponse(data, true);
  });

  it('should handle empty database gracefully', async () => {
    mockDbSelect([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
  });
});
