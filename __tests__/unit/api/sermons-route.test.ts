/**
 * Tests for /api/sermons, /api/sermons/[id], and /api/sermons/recommend route handlers
 * @jest-environment node
 */

import { GET as listSermons } from '@/app/api/sermons/route';
import { GET as getSermonById } from '@/app/api/sermons/[id]/route';
import { GET as recommendSermons } from '@/app/api/sermons/recommend/route';
import { NextRequest } from 'next/server';
import {
  searchSermons,
  getSermonsByTag,
  getAllTags,
  SAMPLE_SERMONS,
  getSermonById as getSermonByIdService,
  getRelatedSermons,
  getRecommendedSermons,
} from '@/lib/sermon-service';

const mockSermon1 = {
  id: '1',
  title: '하나님의 사랑',
  preacher: '김은혜 목사',
  date: '2024-01-07',
  verses: ['Jhn 3:16', 'Rom 8:38-39'],
  summary: '하나님의 무조건적인 사랑에 대한 설교',
  content: '설교 내용...',
  tags: ['사랑', '구원', '은혜'],
  source: 'sample',
};

const mockSermon2 = {
  id: '2',
  title: '창조의 신비',
  preacher: '박창조 목사',
  date: '2024-01-14',
  verses: ['Gen 1:1', 'Gen 1:27'],
  summary: '하나님의 창조 사역',
  content: '설교 내용...',
  tags: ['창조', '하나님의 능력'],
  source: 'sample',
};

// Mock sermon-service
jest.mock('@/lib/sermon-service', () => ({
  SAMPLE_SERMONS: [
    {
      id: '1', title: '하나님의 사랑', preacher: '김은혜 목사', date: '2024-01-07',
      verses: ['Jhn 3:16', 'Rom 8:38-39'], summary: '하나님의 무조건적인 사랑에 대한 설교',
      content: '설교 내용...', tags: ['사랑', '구원', '은혜'], source: 'sample',
    },
    {
      id: '2', title: '창조의 신비', preacher: '박창조 목사', date: '2024-01-14',
      verses: ['Gen 1:1', 'Gen 1:27'], summary: '하나님의 창조 사역',
      content: '설교 내용...', tags: ['창조', '하나님의 능력'], source: 'sample',
    },
  ],
  searchSermons: jest.fn(),
  getSermonsByTag: jest.fn(),
  getAllTags: jest.fn(),
  getSermonById: jest.fn(),
  getRelatedSermons: jest.fn(),
  getRecommendedSermons: jest.fn(),
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

const mockedSearchSermons = searchSermons as jest.MockedFunction<typeof searchSermons>;
const mockedGetSermonsByTag = getSermonsByTag as jest.MockedFunction<typeof getSermonsByTag>;
const mockedGetAllTags = getAllTags as jest.MockedFunction<typeof getAllTags>;
const mockedGetSermonByIdService = getSermonByIdService as jest.MockedFunction<typeof getSermonByIdService>;
const mockedGetRelatedSermons = getRelatedSermons as jest.MockedFunction<typeof getRelatedSermons>;
const mockedGetRecommendedSermons = getRecommendedSermons as jest.MockedFunction<typeof getRecommendedSermons>;

function createRequest(path: string, params: Record<string, string> = {}): NextRequest {
  const url = new URL(`http://localhost:3000${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new NextRequest(url);
}

describe('GET /api/sermons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAllTags.mockReturnValue(['사랑', '구원', '은혜', '창조', '하나님의 능력']);
  });

  it('returns all sermons when no search criteria provided', async () => {
    const req = createRequest('/api/sermons');
    const res = await listSermons(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.results).toHaveLength(2);
    expect(body.data.total).toBe(2);
    expect(body.data.tags).toBeDefined();
  });

  it('searches sermons by query', async () => {
    mockedSearchSermons.mockReturnValue([
      { sermon: mockSermon1, relevanceScore: 10, matchedVerses: ['Jhn 3:16'] },
    ]);

    const req = createRequest('/api/sermons', { q: '사랑' });
    const res = await listSermons(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockedSearchSermons).toHaveBeenCalledWith('사랑');
    expect(body.data.results).toHaveLength(1);
  });

  it('searches sermons by verse reference', async () => {
    mockedSearchSermons.mockReturnValue([
      { sermon: mockSermon2, relevanceScore: 8, matchedVerses: ['Gen 1:1'] },
    ]);

    const req = createRequest('/api/sermons', { verse: 'Gen 1:1' });
    const res = await listSermons(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockedSearchSermons).toHaveBeenCalledWith('Gen 1:1');
  });

  it('combines query and verse for search', async () => {
    mockedSearchSermons.mockReturnValue([]);

    const req = createRequest('/api/sermons', { q: '사랑', verse: 'Jhn 3:16' });
    const res = await listSermons(req);

    expect(mockedSearchSermons).toHaveBeenCalledWith('사랑 Jhn 3:16');
  });

  it('filters by tag', async () => {
    mockedGetSermonsByTag.mockReturnValue([mockSermon1]);

    const req = createRequest('/api/sermons', { tag: '사랑' });
    const res = await listSermons(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockedGetSermonsByTag).toHaveBeenCalledWith('사랑');
    expect(body.data.results).toHaveLength(1);
    expect(body.data.results[0].relevanceScore).toBe(7);
  });

  it('intersects search results with tag filter', async () => {
    mockedSearchSermons.mockReturnValue([
      { sermon: mockSermon1, relevanceScore: 10, matchedVerses: [] },
      { sermon: mockSermon2, relevanceScore: 8, matchedVerses: [] },
    ]);
    mockedGetSermonsByTag.mockReturnValue([mockSermon1]);

    const req = createRequest('/api/sermons', { q: '설교', tag: '사랑' });
    const res = await listSermons(req);
    const body = await res.json();

    expect(body.data.results).toHaveLength(1);
    expect(body.data.results[0].sermon.id).toBe('1');
  });

  it('includes all tags in response', async () => {
    const req = createRequest('/api/sermons');
    const res = await listSermons(req);
    const body = await res.json();

    expect(body.data.tags).toEqual(['사랑', '구원', '은혜', '창조', '하나님의 능력']);
  });
});

describe('GET /api/sermons/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns sermon by id with related sermons', async () => {
    mockedGetSermonByIdService.mockReturnValue(mockSermon1);
    mockedGetRelatedSermons.mockReturnValue([mockSermon2]);

    const req = createRequest('/api/sermons/1');
    const res = await getSermonById(req, { params: Promise.resolve({ id: '1' }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.sermon).toEqual(mockSermon1);
    expect(body.data.related).toHaveLength(1);
    expect(body.data.related[0].id).toBe('2');
  });

  it('returns 404 for non-existent sermon', async () => {
    mockedGetSermonByIdService.mockReturnValue(undefined);

    const req = createRequest('/api/sermons/999');
    const res = await getSermonById(req, { params: Promise.resolve({ id: '999' }) });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('calls getRelatedSermons with correct id', async () => {
    mockedGetSermonByIdService.mockReturnValue(mockSermon1);
    mockedGetRelatedSermons.mockReturnValue([]);

    const req = createRequest('/api/sermons/1');
    await getSermonById(req, { params: Promise.resolve({ id: '1' }) });

    expect(mockedGetRelatedSermons).toHaveBeenCalledWith('1');
  });
});

describe('GET /api/sermons/recommend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns recommended sermons based on verses', async () => {
    mockedGetRecommendedSermons.mockReturnValue([mockSermon1]);

    const req = createRequest('/api/sermons/recommend', { verses: 'Jhn 3:16,Rom 8:28' });
    const res = await recommendSermons(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockedGetRecommendedSermons).toHaveBeenCalledWith(['Jhn 3:16', 'Rom 8:28']);
    expect(body.data.sermons).toHaveLength(1);
    expect(body.data.total).toBe(1);
  });

  it('handles empty verses parameter', async () => {
    mockedGetRecommendedSermons.mockReturnValue([mockSermon1, mockSermon2]);

    const req = createRequest('/api/sermons/recommend');
    const res = await recommendSermons(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockedGetRecommendedSermons).toHaveBeenCalledWith([]);
    expect(body.data.sermons).toHaveLength(2);
  });

  it('trims whitespace from verse references', async () => {
    mockedGetRecommendedSermons.mockReturnValue([]);

    const req = createRequest('/api/sermons/recommend', { verses: ' Jhn 3:16 , Rom 8:28 ' });
    await recommendSermons(req);

    expect(mockedGetRecommendedSermons).toHaveBeenCalledWith(['Jhn 3:16', 'Rom 8:28']);
  });

  it('filters out empty verse strings', async () => {
    mockedGetRecommendedSermons.mockReturnValue([]);

    const req = createRequest('/api/sermons/recommend', { verses: 'Jhn 3:16,,,' });
    await recommendSermons(req);

    expect(mockedGetRecommendedSermons).toHaveBeenCalledWith(['Jhn 3:16']);
  });
});
