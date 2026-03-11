'use client';

import { useState, useCallback } from 'react';
import { StrongsEntry } from '@/types/bible';
import { fetchStrongsEntry } from '@/lib/client-api';

export function useStrongs() {
  const [entry, setEntry] = useState<StrongsEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (number: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStrongsEntry(number);
      if (!data) {
        throw new Error('Not found');
      }
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
