'use client';

import Link from 'next/link';
import { Sermon, SermonSearchResult } from '@/types/sermon';

interface SermonCardProps {
  sermon: Sermon;
  relevanceScore?: number;
  matchedVerses?: string[];
  compact?: boolean;
}

export default function SermonCard({
  sermon,
  relevanceScore,
  matchedVerses,
  compact = false,
}: SermonCardProps) {
  return (
    <Link href={`/sermons/${sermon.id}`}>
      <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {sermon.title}
          </h3>
          {relevanceScore !== undefined && (
            <span className="ml-2 flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {Math.min(Math.round(relevanceScore * 10), 100)}%
            </span>
          )}
        </div>

        <div className="mb-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>{sermon.preacher}</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>{sermon.date}</span>
        </div>

        {!compact && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {sermon.summary}
          </p>
        )}

        <div className="mb-2 flex flex-wrap gap-1.5">
          {sermon.verses.map((verse) => (
            <span
              key={verse}
              className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                matchedVerses?.includes(verse)
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {verse}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {sermon.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

interface SermonCardListProps {
  results: SermonSearchResult[];
}

export function SermonCardList({ results }: SermonCardListProps) {
  if (results.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      {results.map((result) => (
        <SermonCard
          key={result.sermon.id}
          sermon={result.sermon}
          relevanceScore={result.relevanceScore}
          matchedVerses={result.matchedVerses}
        />
      ))}
    </div>
  );
}
