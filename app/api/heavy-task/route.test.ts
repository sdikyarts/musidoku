// app/api/heavy-task/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { mockArtists, expectValidResponse, mockDbSelect } from './test-utils';

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
    mockDbSelect(mockArtists);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expectValidResponse(data, false);
  });
});
