/**
 * Tests for /api/bible/versions route handler
 * @jest-environment node
 */

import { GET } from '@/app/api/bible/versions/route';

// Mock constants
jest.mock('@/lib/constants', () => ({
  SUPPORTED_VERSIONS: [
    { id: 'krv', name: '개역한글', language: 'ko' },
    { id: 'kjv', name: 'King James Version', language: 'en' },
    { id: 'web', name: 'World English Bible', language: 'en' },
  ],
}));

// Mock api-utils
jest.mock('@/lib/api-utils', () => ({
  apiSuccess: jest.fn((data: unknown, init?: { status?: number; headers?: Record<string, string> }) => {
    return new Response(JSON.stringify({ data }), {
      status: init?.status ?? 200,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
  }),
}));

describe('GET /api/bible/versions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a list of available versions', async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.versions).toHaveLength(3);
  });

  it('includes version id, name, and language for each entry', async () => {
    const res = await GET();
    const body = await res.json();

    const first = body.data.versions[0];
    expect(first).toEqual({ id: 'krv', name: '개역한글', language: 'ko' });
  });

  it('includes Korean version', async () => {
    const res = await GET();
    const body = await res.json();

    const koVersions = body.data.versions.filter((v: { language: string }) => v.language === 'ko');
    expect(koVersions).toHaveLength(1);
    expect(koVersions[0].id).toBe('krv');
  });

  it('includes English versions', async () => {
    const res = await GET();
    const body = await res.json();

    const enVersions = body.data.versions.filter((v: { language: string }) => v.language === 'en');
    expect(enVersions).toHaveLength(2);
  });

  it('sets long cache headers', async () => {
    const res = await GET();

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=86400, s-maxage=86400');
  });
});
