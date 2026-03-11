/**
 * Tests for /api/bible/compare route handler
 * @jest-environment node
 */

import { GET } from '@/app/api/bible/compare/route';
import { NextRequest } from 'next/server';
import { getChapter } from '@/lib/bible-api';

// Mock bible-api
jest.mock('@/lib/bible-api', () => ({
  getChapter: jest.fn(),
}));

// Mock constants with a small subset
jest.mock('@/lib/constants', () => ({
  BIBLE_BOOKS: [
    { id: 1, name: 'Genesis', nameKo: '창세기', abbreviation: 'Gen', testament: 'OT', chapters: 50 },
    { id: 40, name: 'Matthew', nameKo: '마태복음', abbreviation: 'Mat', testament: 'NT', chapters: 28 },
  ],
  SUPPORTED_VERSIONS: [
    { id: 'krv', name: '개역한글', language: 'ko' },
    { id: 'kjv', name: 'King James Version', language: 'en' },
    { id: 'web', name: 'World English Bible', language: 'en' },
  ],
  VERSION_MAP: { krv: 'kor_old', kjv: 'eng_kjv', web: 'ENGWEBP' },
  BOOK_ID_MAP: { Genesis: 'GEN', Matthew: 'MAT' },
}));

// Mock api-utils
jest.mock('@/lib/api-utils', () => ({
  apiSuccess: jest.fn((data: unknown) => {
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
  apiError: jest.fn((code: string, message: string, status: number) => {
    return new Response(JSON.stringify({ error: { code, message } }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
}));

const mockedGetChapter = getChapter as jest.MockedFunction<typeof getChapter>;

function createRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost:3000/api/bible/compare');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url);
}

describe('GET /api/bible/compare', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns compare results for valid versions', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'GEN', name: 'Genesis' },
      chapter: 1,
      verses: [
        { number: 1, text: 'In the beginning...' },
        { number: 2, text: 'And the earth was...' },
        { number: 3, text: 'And God said...' },
      ],
    });

    const req = createRequest({
      book: '1',
      chapter: '1',
      verseStart: '1',
      verseEnd: '2',
      versions: 'krv,kjv',
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.results).toHaveLength(2);
    expect(body.data.results[0].verse).toBe(1);
    expect(body.data.results[0].versions).toHaveLength(2);
    expect(body.data.results[0].versions[0].abbreviation).toBe('krv');
    expect(body.data.results[1].verse).toBe(2);
  });

  it('returns error for invalid book ID', async () => {
    const req = createRequest({
      book: '999',
      chapter: '1',
      verseStart: '1',
      verseEnd: '1',
      versions: 'krv',
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_BOOK');
  });

  it('returns error for invalid version IDs', async () => {
    const req = createRequest({
      book: '1',
      chapter: '1',
      verseStart: '1',
      verseEnd: '1',
      versions: 'invalidA,invalidB',
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_VERSIONS');
  });

  it('filters out invalid versions but keeps valid ones', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'GEN', name: 'Genesis' },
      chapter: 1,
      verses: [{ number: 1, text: 'text here' }],
    });

    const req = createRequest({
      book: '1',
      chapter: '1',
      verseStart: '1',
      verseEnd: '1',
      versions: 'krv,invalidXYZ',
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    // Only the valid version (krv) should be in results
    expect(body.data.results[0].versions).toHaveLength(1);
    expect(body.data.results[0].versions[0].abbreviation).toBe('krv');
  });

  it('fetches all versions in parallel', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'GEN', name: 'Genesis' },
      chapter: 1,
      verses: [{ number: 1, text: 'verse text' }],
    });

    const req = createRequest({
      book: '1',
      chapter: '1',
      verseStart: '1',
      verseEnd: '1',
      versions: 'krv,kjv,web',
    });

    await GET(req);

    // getChapter should be called once per valid version
    expect(mockedGetChapter).toHaveBeenCalledTimes(3);
  });

  it('handles fetch failure gracefully for individual versions', async () => {
    mockedGetChapter
      .mockResolvedValueOnce({
        translation: { id: 'BSB', name: 'BSB' },
        book: { id: 'GEN', name: 'Genesis' },
        chapter: 1,
        verses: [{ number: 1, text: 'KRV text' }],
      })
      .mockRejectedValueOnce(new Error('Network error'));

    const req = createRequest({
      book: '1',
      chapter: '1',
      verseStart: '1',
      verseEnd: '1',
      versions: 'krv,kjv',
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    // First version has text, second has empty text due to error
    expect(body.data.results[0].versions[0].text).toBe('KRV text');
    expect(body.data.results[0].versions[1].text).toBe('');
  });

  it('uses default parameters when not provided', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'GEN', name: 'Genesis' },
      chapter: 1,
      verses: [
        { number: 1, text: 'v1' },
        { number: 2, text: 'v2' },
        { number: 3, text: 'v3' },
        { number: 4, text: 'v4' },
        { number: 5, text: 'v5' },
      ],
    });

    // No params - should default to book=1, chapter=1, verseStart=1, verseEnd=5, versions=krv,kjv
    const req = createRequest({});
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.results).toHaveLength(5);
  });

  it('returns empty text for verses not found in API response', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'GEN', name: 'Genesis' },
      chapter: 1,
      verses: [{ number: 1, text: 'only verse 1' }],
    });

    const req = createRequest({
      book: '1',
      chapter: '1',
      verseStart: '1',
      verseEnd: '3',
      versions: 'krv',
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.results).toHaveLength(3);
    expect(body.data.results[0].versions[0].text).toBe('only verse 1');
    expect(body.data.results[1].versions[0].text).toBe('');
    expect(body.data.results[2].versions[0].text).toBe('');
  });
});
