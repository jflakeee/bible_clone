import { renderHook, act } from '@testing-library/react';
import { useSermons } from '@/hooks/useSermons';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockResults = [
  {
    sermon: {
      id: '1',
      title: 'Test Sermon',
      preacher: 'Pastor Kim',
      date: '2024-01-01',
      verses: ['Gen 1:1'],
      summary: 'Summary',
      content: 'Content',
      tags: ['faith'],
      source: 'church',
    },
    relevanceScore: 0.9,
    matchedVerses: ['Gen 1:1'],
  },
];

describe('useSermons', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useSermons());
    expect(result.current.results).toEqual([]);
    expect(result.current.sermon).toBeNull();
    expect(result.current.recommendations).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('search fetches results', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.search('faith');
    });

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/sermons?q=faith'));
    expect(result.current.results).toEqual(mockResults);
    expect(result.current.loading).toBe(false);
  });

  it('search passes tag and verse params', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.search('query', 'tag1', 'Gen 1:1');
    });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('q=query');
    expect(calledUrl).toContain('tag=tag1');
    expect(calledUrl).toContain('verse=Gen+1%3A1');
  });

  it('search handles error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('검색 중 오류가 발생했습니다');
    expect(result.current.results).toEqual([]);
  });

  it('search handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network down'));

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('Network down');
  });

  it('getById fetches a sermon', async () => {
    const mockSermon = { id: '1', title: 'Test', preacher: 'Kim' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sermon: mockSermon }),
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getById('1');
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/sermons/1');
    expect(result.current.sermon).toEqual(mockSermon);
  });

  it('getById handles error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getById('999');
    });

    expect(result.current.error).toBe('설교를 찾을 수 없습니다');
    expect(result.current.sermon).toBeNull();
  });

  it('getByVerse calls search with verse param', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getByVerse('Gen 1:1');
    });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('verse=Gen+1%3A1');
  });

  it('getByTag calls search with tag param', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getByTag('faith');
    });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('tag=faith');
  });

  it('getRecommendations fetches recommendations', async () => {
    const mockSermons = [{ id: '1', title: 'Rec Sermon' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sermons: mockSermons }),
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getRecommendations(['Gen 1:1', 'John 3:16']);
    });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('verses=Gen+1%3A1%2CJohn+3%3A16');
    expect(result.current.recommendations).toEqual(mockSermons);
  });

  it('getRecommendations handles error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getRecommendations(['Gen 1:1']);
    });

    expect(result.current.error).toBe('추천 설교를 불러올 수 없습니다');
    expect(result.current.recommendations).toEqual([]);
  });
});
