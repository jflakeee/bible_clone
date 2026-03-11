'use client';

import { useState, useCallback } from 'react';
import { StrongsEntry } from '@/types/bible';

export function useStrongs() {
  const [entry, setEntry] = useState<StrongsEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (number: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/strongs/${encodeURIComponent(number)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Not found');
      }
      const data: StrongsEntry = await res.json();
      setEntry(data);
    } catch (err) {
      setEntry(null);
      setError(err instanceof Error ? err.message : 'Lookup failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setEntry(null);
    setError(null);
  }, []);

  return { entry, loading, error, lookup, clear };
}
