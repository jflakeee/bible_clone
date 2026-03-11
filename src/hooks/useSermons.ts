'use client';

import { useState, useCallback } from 'react';
import { Sermon, SermonSearchResult } from '@/types/sermon';

interface UseSermonsReturn {
  results: SermonSearchResult[];
  sermon: Sermon | null;
  recommendations: Sermon[];
  loading: boolean;
  error: string | null;
  search: (query: string, tag?: string, verse?: string) => Promise<void>;
  getById: (id: string) => Promise<void>;
  getByVerse: (verse: string) => Promise<void>;
  getByTag: (tag: string) => Promise<void>;
  getRecommendations: (verses: string[]) => Promise<void>;
}

export function useSermons(): UseSermonsReturn {
  const [results, setResults] = useState<SermonSearchResult[]>([]);
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [recommendations, setRecommendations] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string, tag?: string, verse?: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (tag) params.set('tag', tag);
        if (verse) params.set('verse', verse);

        const res = await fetch(`/api/sermons?${params.toString()}`);
        if (!res.ok) throw new Error('검색 중 오류가 발생했습니다');
        const data = await res.json();
        setResults(data.results);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다',
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sermons/${id}`);
      if (!res.ok) throw new Error('설교를 찾을 수 없습니다');
      const data = await res.json();
      setSermon(data.sermon);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다',
      );
      setSermon(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getByVerse = useCallback(
    async (verse: string) => {
      await search('', undefined, verse);
    },
    [search],
  );

  const getByTag = useCallback(
    async (tag: string) => {
      await search('', tag);
    },
    [search],
  );

  const getRecommendations = useCallback(async (verses: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('verses', verses.join(','));

      const res = await fetch(`/api/sermons/recommend?${params.toString()}`);
      if (!res.ok) throw new Error('추천 설교를 불러올 수 없습니다');
      const data = await res.json();
      setRecommendations(data.sermons);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다',
      );
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    sermon,
    recommendations,
    loading,
    error,
    search,
    getById,
    getByVerse,
    getByTag,
    getRecommendations,
  };
}
