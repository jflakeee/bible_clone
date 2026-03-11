import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearch } from '@/hooks/useSearch';

// Mock @/lib/client-api
const mockFetchSearch = jest.fn();
jest.mock('@/lib/client-api', () => ({
  fetchSearch: (...args: unknown[]) => mockFetchSearch(...args),
}));

describe('useSearch', () => {
  beforeEach(() => {
    mockFetchSearch.mockReset();
  });

  it('initializes with empty results, no loading, no error', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('does not fetch when query is empty or whitespace', async () => {
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('');
    });

    expect(mockFetchSearch).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
  });

  it('does not fetch when query is only spaces', async () => {
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('   ');
    });

    expect(mockFetchSearch).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
  });

  it('executes search and returns results', async () => {
    const mockResults = [
      {
        version: 'krv',
        bookName: '창세기',
        chapter: 1,
        verse: 1,
        text: '태초에 하나님이 천지를 창조하시니라',
        highlight: '태초에 <mark>하나님</mark>이 천지를 창조하시니라',
      },
    ];

    mockFetchSearch.mockResolvedValueOnce({ results: mockResults });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('하나님');
    });

    expect(mockFetchSearch).toHaveBeenCalledTimes(1);
    expect(mockFetchSearch).toHaveBeenCalledWith({
      q: '하나님',
      version: 'krv',
      testament: 'all',
    });
    expect(result.current.results).toEqual(mockResults);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('passes version and testament parameters', async () => {
    mockFetchSearch.mockResolvedValueOnce({ results: [] });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('love', 'kjv', 'nt');
    });

    expect(mockFetchSearch).toHaveBeenCalledWith({
      q: 'love',
      version: 'kjv',
      testament: 'nt',
    });
  });

  it('uses default version=krv and testament=all', async () => {
    mockFetchSearch.mockResolvedValueOnce({ results: [] });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(mockFetchSearch).toHaveBeenCalledWith({
      q: 'test',
      version: 'krv',
      testament: 'all',
    });
  });

  it('sets loading to true during search', async () => {
    let resolvePromise: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetchSearch.mockReturnValueOnce(fetchPromise);

    const { result } = renderHook(() => useSearch());

    let searchPromise: Promise<void>;
    act(() => {
      searchPromise = result.current.search('test');
    });

    // Loading should be true while waiting
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ results: [] });
      await searchPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('sets error when fetch fails with network error', async () => {
    mockFetchSearch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('sets error when fetchSearch throws', async () => {
    mockFetchSearch.mockRejectedValueOnce(new Error('Search failed'));

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('Search failed');
    expect(result.current.loading).toBe(false);
  });

  it('clears error on new successful search', async () => {
    // First search fails
    mockFetchSearch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('Network error');

    // Second search succeeds
    mockFetchSearch.mockResolvedValueOnce({ results: [] });

    await act(async () => {
      await result.current.search('test2');
    });

    expect(result.current.error).toBeNull();
  });

  it('clears results when search is called with empty query', async () => {
    // First populate results
    mockFetchSearch.mockResolvedValueOnce({
      results: [{ version: 'krv', bookName: '창세기', chapter: 1, verse: 1, text: 'test', highlight: 'test' }],
    });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.results).toHaveLength(1);

    // Clear with empty query
    await act(async () => {
      await result.current.search('');
    });

    expect(result.current.results).toEqual([]);
  });

  it('handles response with no results field gracefully', async () => {
    mockFetchSearch.mockResolvedValueOnce({});

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.results).toEqual([]);
  });

  it('handles non-Error thrown values', async () => {
    mockFetchSearch.mockRejectedValueOnce('string error');

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('Search failed');
  });
});
