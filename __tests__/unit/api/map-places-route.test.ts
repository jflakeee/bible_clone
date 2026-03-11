/**
 * Tests for /api/map/places route handler
 * @jest-environment node
 */

import { GET } from '@/app/api/map/places/route';
import { NextRequest } from 'next/server';

// Mock map-data
jest.mock('@/lib/map-data', () => ({
  BIBLICAL_PLACES: [
    {
      id: 'jerusalem',
      name: 'Jerusalem',
      nameKo: '예루살렘',
      lat: 31.7683,
      lng: 35.2137,
      description: 'Holy city',
      descriptionKo: '거룩한 도시',
      books: [6, 9, 40, 44],
      type: 'city',
    },
    {
      id: 'sinai',
      name: 'Mount Sinai',
      nameKo: '시내산',
      lat: 28.5394,
      lng: 33.9753,
      description: 'Where the Law was given',
      descriptionKo: '율법이 주어진 곳',
      books: [2, 3, 4],
      type: 'mountain',
    },
    {
      id: 'jordan',
      name: 'Jordan River',
      nameKo: '요단강',
      lat: 31.7594,
      lng: 35.5285,
      description: 'Where Jesus was baptized',
      descriptionKo: '예수님이 세례를 받으신 강',
      books: [6, 40, 41],
      type: 'river',
    },
    {
      id: 'bethlehem',
      name: 'Bethlehem',
      nameKo: '베들레헴',
      lat: 31.7054,
      lng: 35.2024,
      description: 'Birthplace of Jesus',
      descriptionKo: '예수님 탄생지',
      books: [1, 8, 40, 42],
      type: 'city',
    },
  ],
}));

// Mock constants
jest.mock('@/lib/constants', () => ({
  BIBLE_BOOKS: [
    { id: 1, name: 'Genesis', nameKo: '창세기', abbreviation: 'Gen', testament: 'OT', chapters: 50 },
    { id: 2, name: 'Exodus', nameKo: '출애굽기', abbreviation: 'Exo', testament: 'OT', chapters: 40 },
    { id: 3, name: 'Leviticus', nameKo: '레위기', abbreviation: 'Lev', testament: 'OT', chapters: 27 },
    { id: 4, name: 'Numbers', nameKo: '민수기', abbreviation: 'Num', testament: 'OT', chapters: 36 },
    { id: 6, name: 'Joshua', nameKo: '여호수아', abbreviation: 'Jos', testament: 'OT', chapters: 24 },
    { id: 8, name: 'Ruth', nameKo: '룻기', abbreviation: 'Rut', testament: 'OT', chapters: 4 },
    { id: 9, name: '1 Samuel', nameKo: '사무엘상', abbreviation: '1Sa', testament: 'OT', chapters: 31 },
    { id: 40, name: 'Matthew', nameKo: '마태복음', abbreviation: 'Mat', testament: 'NT', chapters: 28 },
    { id: 41, name: 'Mark', nameKo: '마가복음', abbreviation: 'Mrk', testament: 'NT', chapters: 16 },
    { id: 42, name: 'Luke', nameKo: '누가복음', abbreviation: 'Luk', testament: 'NT', chapters: 24 },
    { id: 44, name: 'Acts', nameKo: '사도행전', abbreviation: 'Act', testament: 'NT', chapters: 28 },
  ],
}));

// Mock api-utils
jest.mock('@/lib/api-utils', () => ({
  apiSuccess: jest.fn((data: unknown) => {
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
}));

function createRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/map/places');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url);
}

describe('GET /api/map/places', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all places when no filters applied', async () => {
    const res = await GET(createRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(4);
  });

  it('filters by type (city)', async () => {
    const res = await GET(createRequest({ type: 'city' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(2);
    expect(body.data.every((p: { type: string }) => p.type === 'city')).toBe(true);
  });

  it('filters by type (mountain)', async () => {
    const res = await GET(createRequest({ type: 'mountain' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe('sinai');
  });

  it('filters by type (river)', async () => {
    const res = await GET(createRequest({ type: 'river' }));
    const body = await res.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe('jordan');
  });

  it('returns all places when type is "all"', async () => {
    const res = await GET(createRequest({ type: 'all' }));
    const body = await res.json();

    expect(body.data).toHaveLength(4);
  });

  it('filters by testament (OT)', async () => {
    const res = await GET(createRequest({ testament: 'OT' }));
    const body = await res.json();

    // All 4 places have at least one OT book
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('filters by testament (NT)', async () => {
    const res = await GET(createRequest({ testament: 'NT' }));
    const body = await res.json();

    // jerusalem (40,44), jordan (40,41), bethlehem (40,42) have NT books
    // sinai only has OT books (2,3,4)
    expect(body.data).toHaveLength(3);
    const ids = body.data.map((p: { id: string }) => p.id);
    expect(ids).not.toContain('sinai');
  });

  it('returns all places when testament is "all"', async () => {
    const res = await GET(createRequest({ testament: 'all' }));
    const body = await res.json();

    expect(body.data).toHaveLength(4);
  });

  it('searches by English name', async () => {
    const res = await GET(createRequest({ q: 'jerusalem' }));
    const body = await res.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe('jerusalem');
  });

  it('searches by Korean name', async () => {
    const res = await GET(createRequest({ q: '예루살렘' }));
    const body = await res.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe('jerusalem');
  });

  it('search is case-insensitive', async () => {
    const res = await GET(createRequest({ q: 'JORDAN' }));
    const body = await res.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe('jordan');
  });

  it('returns empty array for non-matching search', async () => {
    const res = await GET(createRequest({ q: 'nonexistent' }));
    const body = await res.json();

    expect(body.data).toHaveLength(0);
  });

  it('combines type and search filters', async () => {
    const res = await GET(createRequest({ type: 'city', q: 'beth' }));
    const body = await res.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe('bethlehem');
  });

  it('combines testament and type filters', async () => {
    const res = await GET(createRequest({ testament: 'NT', type: 'river' }));
    const body = await res.json();

    // jordan river has NT book references (40, 41)
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe('jordan');
  });
});
