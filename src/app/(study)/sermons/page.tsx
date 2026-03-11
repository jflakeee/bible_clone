'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSermons } from '@/hooks/useSermons';
import SermonSearch from '@/components/sermon/SermonSearch';
import { SermonCardList } from '@/components/sermon/SermonCard';
import { getAllTags } from '@/lib/sermon-service';

export default function SermonsPage() {
  const { results, loading, error, search } = useSermons();
  const [allTags] = useState<string[]>(() => getAllTags());
  const [hasSearched, setHasSearched] = useState(false);

  // Load all sermons on initial render
  useEffect(() => {
    search('');
  }, [search]);

  const handleSearch = useCallback(
    (query: string, tag?: string, verse?: string) => {
      setHasSearched(true);
      search(query, tag, verse);
    },
    [search],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          설교 검색
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          키워드, 성경 구절, 태그로 관련 설교를 찾아보세요.
        </p>
      </div>

      <div className="mb-6">
        <SermonSearch
          onSearch={handleSearch}
          allTags={allTags}
          loading={loading}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {loading
            ? '검색 중...'
            : `${results.length}개의 설교${hasSearched ? ' 검색 결과' : ''}`}
        </span>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      ) : (
        <SermonCardList results={results} />
      )}
    </div>
  );
}
