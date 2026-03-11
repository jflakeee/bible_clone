import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearch } from '@/hooks/useSearch';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useSearch', () => {
  beforeEach(() => {
    mockFetch.mockReset();
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

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
  });

  it('does not fetch when query is only spaces', async () => {
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('   ');
    });

    expect(mockFetch).not.toHaveBeenCalled();
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('하나님');
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/search?q=%ED%95%98%EB%82%98%EB%8B%98&version=krv&testament=all')
    );
    expect(result.current.results).toEqual(mockResults);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('passes version and testament parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('love', 'kjv', 'nt');
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('version=kjv')
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('testament=nt')
    );
  });

  it('uses default version=krv and testament=all', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('version=krv');
    expect(calledUrl).toContain('testament=all');
  });

  it('sets loading to true during search', async () => {
    let resolvePromise: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValueOnce(fetchPromise);

    const { result } = renderHook(() => useSearch());

    let searchPromise: Promise<void>;
    act(() => {
      searchPromise = result.current.search('test');
    });

    // Loading should be true while waiting
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({
        ok: true,
        json: async () => ({ results: [] }),
      });
      await searchPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('sets error when fetch fails with network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('sets error when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('Search failed');
    expect(result.current.loading).toBe(false);
  });

  it('clears error on new successful search', async () => {
    // First search fails
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('Network error');

    // Second search succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    await act(async () => {
      await result.current.search('test2');
    });

    expect(result.current.error).toBeNull();
  });

  it('clears results when search is called with empty query', async () => {
    // First populate results
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [{ version: 'krv', bookName: '창세기', chapter: 1, verse: 1, text: 'test', highlight: 'test' }],
      }),
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
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.results).toEqual([]);
  });

  it('handles non-Error thrown values', async () => {
    mockFetch.mockRejectedValueOnce('string error');

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('test');
    });

    expect(result.current.error).toBe('Search failed');
  });
});
