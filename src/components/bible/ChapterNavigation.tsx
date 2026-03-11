'use client';

import Link from 'next/link';
import { BIBLE_BOOKS } from '@/lib/constants';

interface ChapterNavigationProps {
  version: string;
  bookId: number;
  chapter: number;
}

export default function ChapterNavigation({
  version,
  bookId,
  chapter,
}: ChapterNavigationProps) {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) return null;

  const prevChapter = chapter > 1 ? chapter - 1 : null;
  const nextChapter = chapter < book.chapters ? chapter + 1 : null;

  // Previous book last chapter
  const prevBook = BIBLE_BOOKS.find((b) => b.id === bookId - 1);
  const nextBook = BIBLE_BOOKS.find((b) => b.id === bookId + 1);

  const prevLink = prevChapter
    ? `/${version}/${bookId}/${prevChapter}`
    : prevBook
    ? `/${version}/${prevBook.id}/${prevBook.chapters}`
    : null;

  const nextLink = nextChapter
    ? `/${version}/${bookId}/${nextChapter}`
    : nextBook
    ? `/${version}/${nextBook.id}/1`
    : null;

  return (
    <div className="flex items-center justify-between py-4">
      <div>
        {prevLink ? (
          <Link
            href={prevLink}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전
          </Link>
        ) : (
          <span />
        )}
      </div>

      <div className="text-center">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {book.nameKo} {chapter}장
        </span>
      </div>

      <div>
        {nextLink ? (
          <Link
            href={nextLink}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            다음
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
