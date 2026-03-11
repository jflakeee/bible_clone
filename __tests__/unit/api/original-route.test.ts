/**
 * Tests for /api/bible/original/[book]/[chapter] route handler
 * @jest-environment node
 */

import { GET } from '@/app/api/bible/original/[book]/[chapter]/route';
import { NextRequest } from 'next/server';
import { getOriginalText, getLanguageForBook } from '@/lib/original-text-api';

// Mock original-text-api
jest.mock('@/lib/original-text-api', () => ({
  getOriginalText: jest.fn(),
  getLanguageForBook: jest.fn(),
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

const mockedGetOriginalText = getOriginalText as jest.MockedFunction<typeof getOriginalText>;
const mockedGetLanguageForBook = getLanguageForBook as jest.MockedFunction<typeof getLanguageForBook>;

function createRequest(): NextRequest {
  return new NextRequest(new URL('http://localhost:3000/api/bible/original/1/1'));
}

function createParams(book: string, chapter: string) {
  return { params: Promise.resolve({ book, chapter }) };
}

describe('GET /api/bible/original/[book]/[chapter]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns original text for an OT book (Hebrew)', async () => {
    const mockVerses = [[
      { word: 'בְּרֵאשִׁית', transliteration: 'bereshit', strongsNumber: 'H7225', morphology: '', gloss: 'In the beginning' },
    ]];
    mockedGetOriginalText.mockResolvedValue(mockVerses);
    mockedGetLanguageForBook.mockReturnValue('hebrew');

    const res = await GET(createRequest(), createParams('1', '1'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.book).toBe(1);
    expect(body.data.chapter).toBe(1);
    expect(body.data.language).toBe('hebrew');
    expect(body.data.verses).toEqual(mockVerses);
  });

  it('returns original text for an NT book (Greek)', async () => {
    const mockVerses = [[
      { word: 'Βίβλος', transliteration: 'Biblos', strongsNumber: 'G976', morphology: '', gloss: 'Book' },
    ]];
    mockedGetOriginalText.mockResolvedValue(mockVerses);
    mockedGetLanguageForBook.mockReturnValue('greek');

    const res = await GET(createRequest(), createParams('40', '1'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.book).toBe(40);
    expect(body.data.language).toBe('greek');
  });

  it('returns 400 for book number 0', async () => {
    const res = await GET(createRequest(), createParams('0', '1'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_BOOK');
  });

  it('returns 400 for book number greater than 66', async () => {
    const res = await GET(createRequest(), createParams('67', '1'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_BOOK');
  });

  it('returns 400 for non-numeric book', async () => {
    const res = await GET(createRequest(), createParams('abc', '1'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_BOOK');
  });

  it('returns 400 for invalid chapter (0)', async () => {
    const res = await GET(createRequest(), createParams('1', '0'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_CHAPTER');
  });

  it('returns 400 for non-numeric chapter', async () => {
    const res = await GET(createRequest(), createParams('1', 'xyz'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_CHAPTER');
  });

  it('returns 500 when original text fetch fails', async () => {
    mockedGetOriginalText.mockRejectedValue(new Error('fetch failed'));
    mockedGetLanguageForBook.mockReturnValue('hebrew');

    const res = await GET(createRequest(), createParams('1', '1'));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe('FETCH_FAILED');
  });

  it('sets long cache headers on success', async () => {
    mockedGetOriginalText.mockResolvedValue([]);
    mockedGetLanguageForBook.mockReturnValue('hebrew');

    const res = await GET(createRequest(), createParams('1', '1'));

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=86400, s-maxage=86400');
  });

  it('accepts boundary book numbers (1 and 66)', async () => {
    mockedGetOriginalText.mockResolvedValue([]);
    mockedGetLanguageForBook.mockReturnValue('hebrew');

    const res1 = await GET(createRequest(), createParams('1', '1'));
    expect(res1.status).toBe(200);

    mockedGetLanguageForBook.mockReturnValue('greek');
    const res66 = await GET(createRequest(), createParams('66', '1'));
    expect(res66.status).toBe(200);
  });
});
