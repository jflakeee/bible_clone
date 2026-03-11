/**
 * Unit tests for Strong's API routes:
 *   - src/app/api/strongs/[number]/route.ts
 *   - src/app/api/strongs/search/route.ts
 *
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

// Mock strongs-api module
jest.mock('@/lib/strongs-api', () => ({
  getStrongsEntry: jest.fn(),
  searchStrongs: jest.fn(),
}));

import { getStrongsEntry } from '@/lib/strongs-api';
import { searchStrongs } from '@/lib/strongs-api';

const mockGetStrongsEntry = getStrongsEntry as jest.MockedFunction<
  typeof getStrongsEntry
>;
const mockSearchStrongs = searchStrongs as jest.MockedFunction<
  typeof searchStrongs
>;

// Import route handlers
import { GET as numberRoute } from '@/app/api/strongs/[number]/route';
import { GET as searchRoute } from '@/app/api/strongs/search/route';

const mockHebrewEntry = {
  number: 'H1',
  lemma: '\u05d0\u05b8\u05d1',
  transliteration: "'ab",
  pronunciation: 'awb',
  definition: 'a primitive word father',
  shortDefinition: 'chief, (fore-)father(-less)',
  language: 'hebrew' as const,
};

describe('GET /api/strongs/[number]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function callRoute(number: string) {
    const request = new NextRequest('http://localhost/api/strongs/' + number);
    return numberRoute(request, {
      params: Promise.resolve({ number }),
    });
  }

  // ─── Valid number ─────────────────────────────────────────────────

  it('should return entry data for valid Hebrew number', async () => {
    mockGetStrongsEntry.mockResolvedValue(mockHebrewEntry);

    const response = await callRoute('H1');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual(mockHebrewEntry);
  });

  it('should return entry data for lowercase number', async () => {
    mockGetStrongsEntry.mockResolvedValue(mockHebrewEntry);

    const response = await callRoute('h1');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual(mockHebrewEntry);
  });

  it('should return entry data for Greek number', async () => {
    const greekEntry = { ...mockHebrewEntry, number: 'G1', language: 'greek' as const };
    mockGetStrongsEntry.mockResolvedValue(greekEntry);

    const response = await callRoute('G1');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.number).toBe('G1');
  });

  it('should set Cache-Control header on successful response', async () => {
    mockGetStrongsEntry.mockResolvedValue(mockHebrewEntry);

    const response = await callRoute('H1');

    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=86400, s-maxage=86400'
    );
  });

  // ─── Invalid format ───────────────────────────────────────────────

  it('should return 400 for number without H/G prefix', async () => {
    const response = await callRoute('1234');
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_FORMAT');
  });

  it('should return 400 for non-H/G prefix', async () => {
    const response = await callRoute('X1234');
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_FORMAT');
  });

  it('should return 400 for H with no digits', async () => {
    const response = await callRoute('Habc');
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_FORMAT');
  });

  // ─── Not found ────────────────────────────────────────────────────

  it('should return 404 when entry is not found', async () => {
    mockGetStrongsEntry.mockResolvedValue(null);

    const response = await callRoute('H9999');
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  // ─── Internal error ───────────────────────────────────────────────

  it('should return 500 when getStrongsEntry throws', async () => {
    mockGetStrongsEntry.mockRejectedValue(new Error('Fetch failed'));

    const response = await callRoute('H1');
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('FETCH_FAILED');
  });
});

describe('GET /api/strongs/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function callSearch(queryString: string) {
    const request = new NextRequest(
      'http://localhost/api/strongs/search' + queryString
    );
    return searchRoute(request);
  }

  // ─── Successful search ────────────────────────────────────────────

  it('should return search results for valid query', async () => {
    const results = [mockHebrewEntry];
    mockSearchStrongs.mockResolvedValue(results);

    const response = await callSearch('?q=father');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual(results);
    expect(mockSearchStrongs).toHaveBeenCalledWith('father', 50);
  });

  it('should trim query parameter', async () => {
    mockSearchStrongs.mockResolvedValue([]);

    await callSearch('?q=%20love%20');

    expect(mockSearchStrongs).toHaveBeenCalledWith('love', 50);
  });

  it('should set Cache-Control header', async () => {
    mockSearchStrongs.mockResolvedValue([]);

    const response = await callSearch('?q=father');

    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=3600, s-maxage=3600'
    );
  });

  // ─── Missing / empty query ────────────────────────────────────────

  it('should return 400 when q parameter is missing', async () => {
    const response = await callSearch('');
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('MISSING_QUERY');
  });

  it('should return 400 when q parameter is empty', async () => {
    const response = await callSearch('?q=');
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('MISSING_QUERY');
  });

  it('should return 400 when q parameter is whitespace only', async () => {
    const response = await callSearch('?q=%20%20%20');
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('MISSING_QUERY');
  });

  // ─── Internal error ───────────────────────────────────────────────

  it('should return 500 when searchStrongs throws', async () => {
    mockSearchStrongs.mockRejectedValue(new Error('Fetch failed'));

    const response = await callSearch('?q=father');
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('FETCH_FAILED');
  });
});
