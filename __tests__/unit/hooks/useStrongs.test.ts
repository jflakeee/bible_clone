/**
 * Unit tests for src/hooks/useStrongs.ts
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useStrongs } from '@/hooks/useStrongs';
import { StrongsEntry } from '@/types/bible';

const mockEntry: StrongsEntry = {
  number: 'H1',
  lemma: '\u05d0\u05b8\u05d1',
  transliteration: "'ab",
  pronunciation: 'awb',
  definition: 'a primitive word father',
  shortDefinition: 'chief, (fore-)father(-less)',
  language: 'hebrew',
};

const mockFetchStrongsEntry = jest.fn();
jest.mock('@/lib/client-api', () => ({
  fetchStrongsEntry: (...args: unknown[]) => mockFetchStrongsEntry(...args),
}));

describe('useStrongs', () => {
  beforeEach(() => {
    mockFetchStrongsEntry.mockReset();
  });

  // ─── Initial State ────────────────────────────────────────────────

  it('should have null entry, false loading, and null error initially', () => {
    const { result } = renderHook(() => useStrongs());
    expect(result.current.entry).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // ─── Lookup - Success ─────────────────────────────────────────────

  it('should set loading to true during lookup', async () => {
    let resolveResponse: (value: unknown) => void;
    const pending = new Promise((resolve) => {
      resolveResponse = resolve;
    });

    mockFetchStrongsEntry.mockReturnValue(pending);

    const { result } = renderHook(() => useStrongs());

    act(() => {
      result.current.lookup('H1');
    });

    expect(result.current.loading).toBe(true);

    // Resolve to clean up
    await act(async () => {
      resolveResponse!(mockEntry);
    });
  });

  it('should set entry data after successful lookup', async () => {
    mockFetchStrongsEntry.mockResolvedValue(mockEntry);

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.entry).toEqual(mockEntry);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should call fetchStrongsEntry with the Strong\'s number', async () => {
    mockFetchStrongsEntry.mockResolvedValue(mockEntry);

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(mockFetchStrongsEntry).toHaveBeenCalledWith('H1');
  });

  // ─── Lookup - Error (null returned = not found) ──────────────────

  it('should set error when fetchStrongsEntry returns null', async () => {
    mockFetchStrongsEntry.mockResolvedValue(null);

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H9999');
    });

    expect(result.current.entry).toBeNull();
    expect(result.current.error).toBe('Not found');
    expect(result.current.loading).toBe(false);
  });

  // ─── Lookup - Network Error ───────────────────────────────────────

  it('should set error on network failure', async () => {
    mockFetchStrongsEntry.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.entry).toBeNull();
    expect(result.current.error).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });

  it('should set generic error for non-Error thrown objects', async () => {
    mockFetchStrongsEntry.mockRejectedValue('some string error');

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.error).toBe('Lookup failed');
  });

  // ─── Loading state transitions ────────────────────────────────────

  it('should set loading false after successful lookup', async () => {
    mockFetchStrongsEntry.mockResolvedValue(mockEntry);

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.loading).toBe(false);
  });

  it('should set loading false after failed lookup', async () => {
    mockFetchStrongsEntry.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.loading).toBe(false);
  });

  // ─── Clear ────────────────────────────────────────────────────────

  it('should clear entry and error when clear is called', async () => {
    mockFetchStrongsEntry.mockResolvedValue(mockEntry);

    const { result } = renderHook(() => useStrongs());

    // First, populate data
    await act(async () => {
      await result.current.lookup('H1');
    });
    expect(result.current.entry).not.toBeNull();

    // Clear
    act(() => {
      result.current.clear();
    });

    expect(result.current.entry).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should clear error state', async () => {
    mockFetchStrongsEntry.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });
    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clear();
    });

    expect(result.current.error).toBeNull();
  });

  // ─── Error reset on new lookup ────────────────────────────────────

  it('should clear previous error when starting a new lookup', async () => {
    // First lookup fails
    mockFetchStrongsEntry.mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H9999');
    });
    expect(result.current.error).toBe('fail');

    // Second lookup succeeds
    mockFetchStrongsEntry.mockResolvedValueOnce(mockEntry);

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.error).toBeNull();
    expect(result.current.entry).toEqual(mockEntry);
  });
});
