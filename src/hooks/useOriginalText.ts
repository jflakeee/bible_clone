'use client';

import { useState, useCallback } from 'react';
import { VerseWord } from '@/types/bible';
import { fetchOriginalText } from '@/lib/client-api';

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

  const fetchOriginal = useCallback(async (book: number, chapter: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchOriginalText(book, chapter);
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
    fetchOriginalText: fetchOriginal,
    clear,
  };
}
