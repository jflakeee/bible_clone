/**
 * Tests for /api/proper-nouns route handler
 * @jest-environment node
 */

import { GET } from '@/app/api/proper-nouns/route';
import { NextRequest } from 'next/server';
import {
  PROPER_NOUNS,
  searchProperNouns,
  getProperNounsByType,
} from '@/lib/proper-nouns';

// Mock proper-nouns module
jest.mock('@/lib/proper-nouns', () => {
  const mockNouns = [
    { id: 'adam', original: 'אָדָם', english: 'Adam', korean: '아담', type: 'person', description: 'First man', descriptionKo: '최초의 사람', strongsNumber: 'H121', occurrences: 30 },
    { id: 'eve', original: 'חַוָּה', english: 'Eve', korean: '하와', type: 'person', description: 'First woman', descriptionKo: '최초의 여자', strongsNumber: 'H2332', occurrences: 4 },
    { id: 'jerusalem', original: 'יְרוּשָׁלַיִם', english: 'Jerusalem', korean: '예루살렘', type: 'place', description: 'Holy city', descriptionKo: '거룩한 도시', strongsNumber: 'H3389', occurrences: 811 },
    { id: 'ark-covenant', original: 'אֲרוֹן הַבְּרִית', english: 'Ark of the Covenant', korean: '언약궤', type: 'object', description: 'Sacred chest', descriptionKo: '거룩한 궤', strongsNumber: 'H727', occurrences: 48 },
    { id: 'israel-nation', original: 'יִשְׂרָאֵל', english: 'Israel', korean: '이스라엘', type: 'nation', description: 'Nation of Israel', descriptionKo: '이스라엘 민족', strongsNumber: 'H3478', occurrences: 2505 },
  ];

  return {
    PROPER_NOUNS: mockNouns,
    searchProperNouns: jest.fn((query: string) => {
      const q = query.toLowerCase();
      return mockNouns.filter(
        (n) =>
          n.english.toLowerCase().includes(q) ||
          n.korean.includes(q) ||
          n.original.includes(q)
      );
    }),
    getProperNounsByType: jest.fn((type: string) => {
      return mockNouns.filter((n) => n.type === type);
    }),
  };
});

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

function createRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/proper-nouns');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url);
}

describe('GET /api/proper-nouns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all proper nouns with no filters', async () => {
    const res = await GET(createRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.total).toBe(5);
    expect(body.data.items).toHaveLength(5);
  });

  it('filters by type=person', async () => {
    const res = await GET(createRequest({ type: 'person' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items).toHaveLength(2);
    expect(body.data.items.every((n: { type: string }) => n.type === 'person')).toBe(true);
    expect(getProperNounsByType).toHaveBeenCalledWith('person');
  });

  it('filters by type=place', async () => {
    const res = await GET(createRequest({ type: 'place' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].id).toBe('jerusalem');
  });

  it('filters by type=object', async () => {
    const res = await GET(createRequest({ type: 'object' }));
    const body = await res.json();

    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].id).toBe('ark-covenant');
  });

  it('filters by type=nation', async () => {
    const res = await GET(createRequest({ type: 'nation' }));
    const body = await res.json();

    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].id).toBe('israel-nation');
  });

  it('returns 400 for invalid type', async () => {
    const res = await GET(createRequest({ type: 'invalidtype' }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_TYPE');
  });

  it('searches by English name', async () => {
    const res = await GET(createRequest({ q: 'Adam' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(searchProperNouns).toHaveBeenCalledWith('Adam');
    expect(body.data.items.length).toBeGreaterThan(0);
    expect(body.data.items[0].id).toBe('adam');
  });

  it('searches by Korean name', async () => {
    const res = await GET(createRequest({ q: '예루살렘' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  it('returns empty for non-matching search', async () => {
    const res = await GET(createRequest({ q: 'nonexistent12345' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.total).toBe(0);
    expect(body.data.items).toHaveLength(0);
  });

  it('combines type and search filters (intersection)', async () => {
    const res = await GET(createRequest({ type: 'person', q: 'Adam' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].id).toBe('adam');
  });

  it('combines type and search filters with no overlap returns empty', async () => {
    const res = await GET(createRequest({ type: 'place', q: 'Adam' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.total).toBe(0);
  });

  it('total matches items length', async () => {
    const res = await GET(createRequest({ type: 'person' }));
    const body = await res.json();

    expect(body.data.total).toBe(body.data.items.length);
  });

  it('accepts all valid type values', async () => {
    const validTypes = ['person', 'place', 'object', 'title', 'tribe', 'nation'];
    for (const type of validTypes) {
      const res = await GET(createRequest({ type }));
      expect(res.status).toBe(200);
    }
  });
});
