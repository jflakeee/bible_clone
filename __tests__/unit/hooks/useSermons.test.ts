import { renderHook, act } from '@testing-library/react';
import { useSermons } from '@/hooks/useSermons';

// Mock @/lib/client-api
const mockFetchSermons = jest.fn();
const mockFetchSermonById = jest.fn();
const mockFetchSermonRecommendations = jest.fn();
jest.mock('@/lib/client-api', () => ({
  fetchSermons: (...args: unknown[]) => mockFetchSermons(...args),
  fetchSermonById: (...args: unknown[]) => mockFetchSermonById(...args),
  fetchSermonRecommendations: (...args: unknown[]) => mockFetchSermonRecommendations(...args),
}));

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
    mockFetchSermons.mockReset();
    mockFetchSermonById.mockReset();
    mockFetchSermonRecommendations.mockReset();
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
    // fetchSermons is called synchronously in the hook (no await)
    mockFetchSermons.mockReturnValue({ results: mockResults });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.search('faith');
    });

    expect(mockFetchSermons).toHaveBeenCalledWith({
      q: 'faith',
      tag: undefined,
      verse: undefined,
    });
    expect(result.current.results).toEqual(mockResults);
    expect(result.current.loading).toBe(false);
  });

  it('search passes tag and verse params', async () => {
    mockFetchSermons.mockReturnValue({ results: [] });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.search('query', 'tag1', 'Gen 1:1');
    });

    expect(mockFetchSermons).toHaveBeenCalledWith({
      q: 'query',
      tag: 'tag1',
      verse: 'Gen 1:1',
    });
  });

  it('search handles error', async () => {
    mockFetchSermons.mockImplementation(() => {
      throw new Error('알 수 없는 오류가 발생했습니다');
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('알 수 없는 오류가 발생했습니다');
    expect(result.current.results).toEqual([]);
  });

  it('search handles non-Error thrown value', async () => {
    mockFetchSermons.mockImplementation(() => {
      throw 'string error';
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('알 수 없는 오류가 발생했습니다');
  });

  it('getById fetches a sermon', async () => {
    const mockSermon = { id: '1', title: 'Test', preacher: 'Kim' };
    // fetchSermonById is called synchronously in the hook (no await)
    mockFetchSermonById.mockReturnValue({ sermon: mockSermon });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getById('1');
    });

    expect(mockFetchSermonById).toHaveBeenCalledWith('1');
    expect(result.current.sermon).toEqual(mockSermon);
  });

  it('getById handles error', async () => {
    mockFetchSermonById.mockImplementation(() => {
      throw new Error('설교를 찾을 수 없습니다');
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getById('999');
    });

    expect(result.current.error).toBe('설교를 찾을 수 없습니다');
    expect(result.current.sermon).toBeNull();
  });

  it('getByVerse calls search with verse param', async () => {
    mockFetchSermons.mockReturnValue({ results: [] });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getByVerse('Gen 1:1');
    });

    expect(mockFetchSermons).toHaveBeenCalledWith({
      q: '',
      tag: undefined,
      verse: 'Gen 1:1',
    });
  });

  it('getByTag calls search with tag param', async () => {
    mockFetchSermons.mockReturnValue({ results: [] });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getByTag('faith');
    });

    expect(mockFetchSermons).toHaveBeenCalledWith({
      q: '',
      tag: 'faith',
      verse: undefined,
    });
  });

  it('getRecommendations fetches recommendations', async () => {
    const mockSermons = [{ id: '1', title: 'Rec Sermon' }];
    // fetchSermonRecommendations is called synchronously in the hook (no await)
    mockFetchSermonRecommendations.mockReturnValue({ sermons: mockSermons });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getRecommendations(['Gen 1:1', 'John 3:16']);
    });

    expect(mockFetchSermonRecommendations).toHaveBeenCalledWith(['Gen 1:1', 'John 3:16']);
    expect(result.current.recommendations).toEqual(mockSermons);
  });

  it('getRecommendations handles error', async () => {
    mockFetchSermonRecommendations.mockImplementation(() => {
      throw new Error('추천 설교를 불러올 수 없습니다');
    });

    const { result } = renderHook(() => useSermons());

    await act(async () => {
      await result.current.getRecommendations(['Gen 1:1']);
    });

    expect(result.current.error).toBe('추천 설교를 불러올 수 없습니다');
    expect(result.current.recommendations).toEqual([]);
  });
});
