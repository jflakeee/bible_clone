'use client';

import { useState, useCallback } from 'react';
import { VerseWord } from '@/types/bible';

interface OriginalTextState {
  verses: VerseWord[][];
  loading: boolean;
  error: string | null;
  language: 'hebrew' | 'greek' | null;
}

export function useOriginalText() {
  const [state, setState] = useState<OriginalTextState>({
    verses: [],
    loading: false,
    error: null,
    language: null,
  });

  const fetchOriginalText = useCallback(async (book: number, chapter: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(
        `/api/bible/original/${encodeURIComponent(book)}/${encodeURIComponent(chapter)}`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to fetch original text (${res.status})`);
      }
      const data = await res.json();
      setState({
        verses: data.verses || [],
        loading: false,
        error: null,
        language: data.language || null,
      });
    } catch (err) {
      setState({
        verses: [],
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load original text',
        language: null,
      });
    }
  }, []);

  const clear = useCallback(() => {
    setState({ verses: [], loading: false, error: null, language: null });
  }, []);

  return {
    ...state,
    fetchOriginalText,
    clear,
  };
}
