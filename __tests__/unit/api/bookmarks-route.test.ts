/**
 * Tests for /api/bookmarks route handler
 * @jest-environment node
 */

import { GET } from '@/app/api/bookmarks/route';

describe('GET /api/bookmarks', () => {
  it('returns placeholder response with empty bookmarks', async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.bookmarks).toEqual([]);
    expect(body.message).toBeDefined();
    expect(body.message).toContain('client-side');
  });

  it('returns JSON content type', async () => {
    const res = await GET();

    expect(res.headers.get('content-type')).toContain('application/json');
  });

  it('message mentions Supabase integration', async () => {
    const res = await GET();
    const body = await res.json();

    expect(body.message).toContain('Supabase');
  });
});
