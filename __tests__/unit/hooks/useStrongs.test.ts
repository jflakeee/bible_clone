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

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useStrongs', () => {
  beforeEach(() => {
    mockFetch.mockReset();
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

    mockFetch.mockReturnValue(pending);

    const { result } = renderHook(() => useStrongs());

    act(() => {
      result.current.lookup('H1');
    });

    expect(result.current.loading).toBe(true);

    // Resolve to clean up
    await act(async () => {
      resolveResponse!({
        ok: true,
        json: () => Promise.resolve(mockEntry),
      });
    });
  });

  it('should set entry data after successful lookup', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEntry),
    });

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.entry).toEqual(mockEntry);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should call fetch with encoded Strong\'s number', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEntry),
    });

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/strongs/H1');
  });

  // ─── Lookup - Error (HTTP error) ──────────────────────────────────

  it('should set error when API returns non-ok response with error body', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Entry not found' }),
    });

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H9999');
    });

    expect(result.current.entry).toBeNull();
    expect(result.current.error).toBe('Entry not found');
    expect(result.current.loading).toBe(false);
  });

  it('should set fallback error message when API response has no error field', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H9999');
    });

    expect(result.current.error).toBe('Not found');
  });

  it('should set fallback error when response JSON parsing fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.reject(new Error('JSON parse error')),
    });

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H9999');
    });

    expect(result.current.error).toBe('Not found');
  });

  // ─── Lookup - Network Error ───────────────────────────────────────

  it('should set error on network failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.entry).toBeNull();
    expect(result.current.error).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });

  it('should set generic error for non-Error thrown objects', async () => {
    mockFetch.mockRejectedValue('some string error');

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.error).toBe('Lookup failed');
  });

  // ─── Loading state transitions ────────────────────────────────────

  it('should set loading false after successful lookup', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEntry),
    });

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.loading).toBe(false);
  });

  it('should set loading false after failed lookup', async () => {
    mockFetch.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.loading).toBe(false);
  });

  // ─── Clear ────────────────────────────────────────────────────────

  it('should clear entry and error when clear is called', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockEntry),
    });

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
    mockFetch.mockRejectedValue(new Error('fail'));

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
    mockFetch.mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useStrongs());

    await act(async () => {
      await result.current.lookup('H9999');
    });
    expect(result.current.error).toBe('fail');

    // Second lookup succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEntry),
    });

    await act(async () => {
      await result.current.lookup('H1');
    });

    expect(result.current.error).toBeNull();
    expect(result.current.entry).toEqual(mockEntry);
  });
});
