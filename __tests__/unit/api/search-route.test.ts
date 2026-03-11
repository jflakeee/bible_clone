/**
 * @jest-environment node
 */

/**
 * Tests for /api/search route handler.
 *
 * We mock:
 *  - @/lib/bible-api (getChapter)
 *  - @/lib/constants (BIBLE_BOOKS) — trimmed to 2 books for speed
 *  - @/lib/api-utils (apiSuccess) — returns plain JSON-like objects
 */

import { NextRequest } from 'next/server';

// Mock getChapter
const mockGetChapter = jest.fn();
jest.mock('@/lib/bible-api', () => ({
  getChapter: (...args: unknown[]) => mockGetChapter(...args),
}));

// Provide a small set of books for testing
jest.mock('@/lib/constants', () => ({
  BIBLE_BOOKS: [
    { id: 1, name: 'Genesis', nameKo: '창세기', abbreviation: 'Gen', testament: 'OT', chapters: 2 },
    { id: 40, name: 'Matthew', nameKo: '마태복음', abbreviation: 'Mat', testament: 'NT', chapters: 2 },
  ],
}));

// Mock apiSuccess to return a simple object we can inspect
jest.mock('@/lib/api-utils', () => ({
  apiSuccess: (data: unknown) => {
    return {
      _body: data,
      json: async () => data,
    };
  },
}));

// Import after mocks are set up
import { GET } from '@/app/api/search/route';

function makeRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost/api/search');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return new NextRequest(url);
}

describe('GET /api/search', () => {
  beforeEach(() => {
    mockGetChapter.mockReset();
  });

  it('returns empty results for empty query', async () => {
    const response = await GET(makeRequest({ q: '' }));
    const body = await response.json();

    expect(body.results).toEqual([]);
    expect(mockGetChapter).not.toHaveBeenCalled();
  });

  it('returns empty results for whitespace-only query', async () => {
    const response = await GET(makeRequest({ q: '   ' }));
    const body = await response.json();

    expect(body.results).toEqual([]);
    expect(mockGetChapter).not.toHaveBeenCalled();
  });

  it('returns empty results when no q parameter', async () => {
    const response = await GET(makeRequest({}));
    const body = await response.json();

    expect(body.results).toEqual([]);
  });

  it('returns matching results for a valid query', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: '태초에 하나님이 천지를 창조하시니라' },
        { number: 2, text: '땅이 혼돈하고 공허하며' },
      ],
    });

    const response = await GET(makeRequest({ q: '하나님' }));
    const body = await response.json();

    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results[0].bookName).toBe('창세기');
    expect(body.results[0].chapter).toBe(1);
    expect(body.results[0].verse).toBe(1);
    expect(body.results[0].text).toContain('하나님');
    expect(body.results[0].highlight).toContain('<mark>');
  });

  it('highlights matching text with mark tags', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: '태초에 하나님이 천지를 창조하시니라' },
      ],
    });

    const response = await GET(makeRequest({ q: '하나님' }));
    const body = await response.json();

    expect(body.results[0].highlight).toContain('<mark>하나님</mark>');
  });

  it('performs case-insensitive search', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: 'In the beginning God created the heavens' },
      ],
    });

    const response = await GET(makeRequest({ q: 'god', version: 'kjv' }));
    const body = await response.json();

    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results[0].highlight).toContain('<mark>');
  });

  it('filters by OT testament', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: 'matching text here' },
      ],
    });

    const response = await GET(makeRequest({ q: 'matching', testament: 'ot' }));
    const body = await response.json();

    // Should only search OT books (Genesis in our mock)
    // All results should be from 창세기
    for (const result of body.results) {
      expect(result.bookName).toBe('창세기');
    }
  });

  it('filters by NT testament', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: 'matching text here' },
      ],
    });

    const response = await GET(makeRequest({ q: 'matching', testament: 'nt' }));
    const body = await response.json();

    // Should only search NT books (Matthew in our mock)
    for (const result of body.results) {
      expect(result.bookName).toBe('마태복음');
    }
  });

  it('searches all testaments by default', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: 'matching text here' },
      ],
    });

    const response = await GET(makeRequest({ q: 'matching' }));
    const body = await response.json();

    const bookNames = body.results.map((r: { bookName: string }) => r.bookName);
    expect(bookNames).toContain('창세기');
    expect(bookNames).toContain('마태복음');
  });

  it('uses default version krv when not specified', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: 'test text' },
      ],
    });

    const response = await GET(makeRequest({ q: 'test' }));
    const body = await response.json();

    if (body.results.length > 0) {
      expect(body.results[0].version).toBe('krv');
    }
    // getChapter should have been called with 'krv' as first arg
    expect(mockGetChapter).toHaveBeenCalledWith('krv', expect.any(String), expect.any(Number));
  });

  it('passes specified version to getChapter', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: 'test text' },
      ],
    });

    await GET(makeRequest({ q: 'test', version: 'kjv' }));

    expect(mockGetChapter).toHaveBeenCalledWith('kjv', expect.any(String), expect.any(Number));
  });

  it('limits results to MAX_RESULTS (50)', async () => {
    // Return many verses per chapter
    mockGetChapter.mockResolvedValue({
      verses: Array.from({ length: 30 }, (_, i) => ({
        number: i + 1,
        text: 'matching text in every verse',
      })),
    });

    const response = await GET(makeRequest({ q: 'matching' }));
    const body = await response.json();

    expect(body.results.length).toBeLessThanOrEqual(50);
  });

  it('skips chapters that fail to load', async () => {
    // First chapter fails, second succeeds
    mockGetChapter
      .mockRejectedValueOnce(new Error('Failed to load'))
      .mockResolvedValue({
        verses: [
          { number: 1, text: 'test match here' },
        ],
      });

    const response = await GET(makeRequest({ q: 'test' }));
    const body = await response.json();

    // Should still have results from other chapters
    expect(body.results.length).toBeGreaterThan(0);
  });

  it('handles chapters with no verses', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [],
    });

    const response = await GET(makeRequest({ q: 'test' }));
    const body = await response.json();

    expect(body.results).toEqual([]);
  });

  it('handles chapters with undefined verses', async () => {
    mockGetChapter.mockResolvedValue({});

    const response = await GET(makeRequest({ q: 'test' }));
    const body = await response.json();

    expect(body.results).toEqual([]);
  });

  it('sets correct version in result objects', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: 'test verse text' },
      ],
    });

    const response = await GET(makeRequest({ q: 'test', version: 'web' }));
    const body = await response.json();

    for (const result of body.results) {
      expect(result.version).toBe('web');
    }
  });
});
