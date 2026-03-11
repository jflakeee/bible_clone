import { renderHook, act } from '@testing-library/react';
import { useOriginalText } from '@/hooks/useOriginalText';

// Mock @/lib/client-api
const mockFetchOriginalText = jest.fn();
jest.mock('@/lib/client-api', () => ({
  fetchOriginalText: (...args: unknown[]) => mockFetchOriginalText(...args),
}));

describe('useOriginalText', () => {
  beforeEach(() => {
    mockFetchOriginalText.mockReset();
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
    mockFetchOriginalText.mockResolvedValueOnce(mockData);

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
    mockFetchOriginalText.mockReturnValueOnce(pending);

    const { result } = renderHook(() => useOriginalText());

    let fetchPromise: Promise<void>;
    act(() => {
      fetchPromise = result.current.fetchOriginalText(1, 1);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ verses: [], language: null });
      await fetchPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('handles error from fetchOriginalText', async () => {
    mockFetchOriginalText.mockRejectedValueOnce(new Error('Book not found'));

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(99, 1);
    });

    expect(result.current.error).toBe('Book not found');
    expect(result.current.verses).toEqual([]);
    expect(result.current.language).toBeNull();
  });

  it('handles network error', async () => {
    mockFetchOriginalText.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(1, 1);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.verses).toEqual([]);
  });

  it('handles non-Error thrown value', async () => {
    mockFetchOriginalText.mockRejectedValueOnce('string error');

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(1, 1);
    });

    expect(result.current.error).toBe('Failed to load original text');
  });

  it('clear resets state', async () => {
    mockFetchOriginalText.mockResolvedValueOnce({
      verses: [[{ word: 'test' }]],
      language: 'greek',
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

  it('calls fetchOriginalText with book and chapter', async () => {
    mockFetchOriginalText.mockResolvedValueOnce({ verses: [], language: null });

    const { result } = renderHook(() => useOriginalText());

    await act(async () => {
      await result.current.fetchOriginalText(1, 1);
    });

    expect(mockFetchOriginalText).toHaveBeenCalledWith(1, 1);
  });
});
