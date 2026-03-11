/**
 * Tests for /api/bible/[version]/[book]/[chapter] route handler
 * @jest-environment node
 */

import { GET } from '@/app/api/bible/[version]/[book]/[chapter]/route';
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
  ],
  VERSION_MAP: { krv: 'kor_old', kjv: 'eng_kjv', web: 'ENGWEBP' },
  BOOK_ID_MAP: { Genesis: 'GEN', Matthew: 'MAT' },
}));

// Mock api-utils
jest.mock('@/lib/api-utils', () => ({
  apiSuccess: jest.fn((data: unknown, init?: { status?: number; headers?: Record<string, string> }) => {
    return new Response(JSON.stringify({ data }), {
      status: init?.status ?? 200,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
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

function createParams(version: string, book: string, chapter: string) {
  return { params: Promise.resolve({ version, book, chapter }) };
}

function createRequest(): NextRequest {
  return new NextRequest(new URL('http://localhost:3000/api/bible/krv/1/1'));
}

describe('GET /api/bible/[version]/[book]/[chapter]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns verses for a valid version/book/chapter', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'GEN', name: 'Genesis' },
      chapter: 1,
      verses: [
        { number: 1, text: 'In the beginning God created the heavens and the earth.' },
        { number: 2, text: 'Now the earth was formless and void.' },
      ],
    });

    const res = await GET(createRequest(), createParams('krv', '1', '1'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.version).toBe('krv');
    expect(body.data.bookId).toBe(1);
    expect(body.data.bookName).toBe('창세기');
    expect(body.data.chapter).toBe(1);
    expect(body.data.verses).toHaveLength(2);
    expect(body.data.verses[0]).toEqual({
      verse: 1,
      text: 'In the beginning God created the heavens and the earth.',
    });
  });

  it('returns 404 for an invalid book ID', async () => {
    const res = await GET(createRequest(), createParams('krv', '999', '1'));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error.code).toBe('BOOK_NOT_FOUND');
  });

  it('returns 400 for an invalid chapter number (0)', async () => {
    const res = await GET(createRequest(), createParams('krv', '1', '0'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_CHAPTER');
  });

  it('returns 400 for a non-numeric chapter', async () => {
    const res = await GET(createRequest(), createParams('krv', '1', 'abc'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_CHAPTER');
  });

  it('returns 400 for a negative chapter number', async () => {
    const res = await GET(createRequest(), createParams('krv', '1', '-1'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_CHAPTER');
  });

  it('returns 404 for a non-numeric book ID', async () => {
    const res = await GET(createRequest(), createParams('krv', 'abc', '1'));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error.code).toBe('BOOK_NOT_FOUND');
  });

  it('sets Cache-Control header on success', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'GEN', name: 'Genesis' },
      chapter: 1,
      verses: [{ number: 1, text: 'text' }],
    });

    const res = await GET(createRequest(), createParams('krv', '1', '1'));

    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');
  });

  it('returns 500 when bible API fetch fails', async () => {
    mockedGetChapter.mockRejectedValue(new Error('Network error'));

    const res = await GET(createRequest(), createParams('krv', '1', '1'));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe('FETCH_FAILED');
  });

  it('handles empty verses from API', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'GEN', name: 'Genesis' },
      chapter: 1,
      verses: [],
    });

    const res = await GET(createRequest(), createParams('krv', '1', '1'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.verses).toEqual([]);
  });

  it('handles undefined verses from API gracefully', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'GEN', name: 'Genesis' },
      chapter: 1,
    } as never);

    const res = await GET(createRequest(), createParams('krv', '1', '1'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.verses).toEqual([]);
  });

  it('calls getChapter with correct arguments', async () => {
    mockedGetChapter.mockResolvedValue({
      translation: { id: 'BSB', name: 'BSB' },
      book: { id: 'MAT', name: 'Matthew' },
      chapter: 5,
      verses: [{ number: 1, text: 'text' }],
    });

    await GET(createRequest(), createParams('kjv', '40', '5'));

    expect(mockedGetChapter).toHaveBeenCalledWith('kjv', 'Matthew', 5);
  });
});
