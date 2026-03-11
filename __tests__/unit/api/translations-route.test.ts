/**
 * Tests for /api/bible/translations route handler
 * @jest-environment node
 */

import { GET } from '@/app/api/bible/translations/route';
import { getTranslationsByLanguage } from '@/lib/multilang-api';

// Mock multilang-api
jest.mock('@/lib/multilang-api', () => ({
  getTranslationsByLanguage: jest.fn(),
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

const mockedGetTranslationsByLanguage = getTranslationsByLanguage as jest.MockedFunction<typeof getTranslationsByLanguage>;

describe('GET /api/bible/translations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns translations grouped by language', async () => {
    mockedGetTranslationsByLanguage.mockResolvedValue({
      English: [
        { id: 'BSB', name: 'Berean Standard Bible', language: 'English', languageKo: '영어', languageCode: 'en', direction: 'ltr' },
      ],
      Korean: [
        { id: 'KRV', name: '개역한글', language: 'Korean', languageKo: '한국어', languageCode: 'ko', direction: 'ltr' },
      ],
    });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.translations).toBeDefined();
    expect(body.data.translations.English).toHaveLength(1);
    expect(body.data.translations.Korean).toHaveLength(1);
  });

  it('sets cache headers', async () => {
    mockedGetTranslationsByLanguage.mockResolvedValue({});

    const res = await GET();

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=86400, s-maxage=86400');
  });

  it('returns 500 when fetching translations fails', async () => {
    mockedGetTranslationsByLanguage.mockRejectedValue(new Error('API down'));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe('FETCH_FAILED');
    expect(body.error.message).toBe('API down');
  });

  it('returns error message from non-Error exceptions', async () => {
    mockedGetTranslationsByLanguage.mockRejectedValue('string error');

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe('FETCH_FAILED');
    expect(body.error.message).toBe('알 수 없는 오류가 발생했습니다.');
  });

  it('returns empty groups when no translations available', async () => {
    mockedGetTranslationsByLanguage.mockResolvedValue({});

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.translations).toEqual({});
  });
});
