import { renderHook, act } from '@testing-library/react';
import { useOriginalText } from '@/hooks/useOriginalText';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useOriginalText', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useOriginalText());
    expect(result.current.verses).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.language).toBeNull();
  });

  it('fetches original text successfully', async () => {
    const mockData = {
      verses: [[{ word: 'בְּרֵאשִׁ֖ית', strongsNumber: 'H7225' }]],
      language: 'hebrew',
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(1, 1);
    });

    expect(result.current.verses).toEqual(mockData.verses);
    expect(result.current.language).toBe('hebrew');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets loading true during fetch', async () => {
    let resolvePromise: (v: unknown) => void;
    const pending = new Promise((resolve) => { resolvePromise = resolve; });
    mockFetch.mockReturnValueOnce(pending);

    const { result } = renderHook(() => useOriginalText());

    let fetchPromise: Promise<void>;
    act(() => {
      fetchPromise = result.current.fetchOriginalText(1, 1);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ ok: true, json: async () => ({ verses: [], language: null }) });
      await fetchPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('handles fetch error with error message from response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Book not found' }),
    });

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(99, 1);
    });

    expect(result.current.error).toBe('Book not found');
    expect(result.current.verses).toEqual([]);
    expect(result.current.language).toBeNull();
  });

  it('handles fetch error with status code when no error message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(1, 1);
    });

    expect(result.current.error).toBe('Failed to fetch original text (500)');
  });

  it('handles network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(1, 1);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.verses).toEqual([]);
  });

  it('handles non-Error thrown value', async () => {
    mockFetch.mockRejectedValueOnce('string error');

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(1, 1);
    });

    expect(result.current.error).toBe('Failed to load original text');
  });

  it('handles json parse failure on error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => { throw new Error('parse error'); },
    });

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(1, 1);
    });

    expect(result.current.error).toBe('Failed to fetch original text (500)');
  });

  it('clear resets state', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ verses: [[{ word: 'test' }]], language: 'greek' }),
    });

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(40, 1);
    });

    expect(result.current.verses).toHaveLength(1);

    act(() => {
      result.current.clear();
    });

    expect(result.current.verses).toEqual([]);
    expect(result.current.language).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('encodes book and chapter in URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ verses: [], language: null }),
    });

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(1, 1);
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/bible/original/1/1');
  });
});
