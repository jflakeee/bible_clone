'use client';

import Link from 'next/link';
import { SearchResult } from '@/types/bible';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}

export default function SearchResults({ results, loading, error }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>검색 중 오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {results.length}개의 결과를 찾았습니다
        {results.length >= 50 && ' (최대 50개)'}
      </p>
      <ul className="divide-y divide-gray-100">
        {results.map((result, index) => (
          <li key={`${result.bookName}-${result.chapter}-${result.verse}-${index}`}>
            <Link
              href={`/${result.version}/${result.chapter}?book=${encodeURIComponent(result.bookName)}`}
              className="block px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold text-blue-700">
                  {result.bookName} {result.chapter}:{result.verse}
                </span>
                <span className="text-xs text-gray-400 uppercase">
                  {result.version}
                </span>
              </div>
              <p
                className="text-sm text-gray-700 leading-relaxed [&_mark]:bg-yellow-200 [&_mark]:font-semibold [&_mark]:rounded-sm [&_mark]:px-0.5"
                dangerouslySetInnerHTML={{ __html: result.highlight }}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
