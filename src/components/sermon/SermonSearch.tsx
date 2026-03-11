'use client';

import { useState, useCallback } from 'react';

interface SermonSearchProps {
  onSearch: (query: string, tag?: string, verse?: string) => void;
  allTags: string[];
  loading?: boolean;
}

const POPULAR_TAGS = [
  '사랑',
  '믿음',
  '소망',
  '구원',
  '기도',
  '은혜',
  '회개',
  '감사',
  '평안',
  '성령',
];

export default function SermonSearch({
  onSearch,
  allTags,
  loading = false,
}: SermonSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [verseRef, setVerseRef] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch(
      query,
      selectedTag || undefined,
      verseRef || undefined,
    );
  }, [query, selectedTag, verseRef, onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch],
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      const newTag = selectedTag === tag ? null : tag;
      setSelectedTag(newTag);
      onSearch(query, newTag || undefined, verseRef || undefined);
    },
    [selectedTag, query, verseRef, onSearch],
  );

  const displayTags = showAllTags ? allTags : POPULAR_TAGS;

  return (
    <div className="space-y-4">
      {/* Search inputs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="설교 검색 (제목, 내용, 설교자...)"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <svg
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="relative sm:w-48">
          <input
            type="text"
            value={verseRef}
            onChange={(e) => setVerseRef(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="구절 (예: Jhn 3:16)"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>

      {/* Tag filters */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            태그 필터
          </span>
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            {showAllTags ? '인기 태그만 보기' : '모든 태그 보기'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                selectedTag === tag
                  ? 'bg-purple-600 text-white dark:bg-purple-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
