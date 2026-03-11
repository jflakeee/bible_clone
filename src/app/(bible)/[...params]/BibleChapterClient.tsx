'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BIBLE_BOOKS } from '@/lib/constants';
import { fetchBibleChapter } from '@/lib/client-api';
import BibleViewer from '@/components/bible/BibleViewer';
import ChapterNavigation from '@/components/bible/ChapterNavigation';
import VersionSelector from '@/components/bible/VersionSelector';
import BibleActionBar from '@/components/bible/BibleActionBar';
import ChapterVisitTracker from '@/components/bible/ChapterVisitTracker';

export default function BibleChapterClient() {
  const params = useParams();
  const slugParts = params.params as string[] | undefined;

  // Parse URL: /version/bookId/chapter
  const version = slugParts?.[0] || 'krv';
  const book = slugParts?.[1] || '1';
  const chapter = slugParts?.[2] || '1';

  const bookId = parseInt(book, 10);
  const chapterNum = parseInt(chapter, 10);

  const bookInfo = BIBLE_BOOKS.find((b) => b.id === bookId);

  const [verses, setVerses] = useState<{ verse: number; text: string }[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookInfo || isNaN(chapterNum) || chapterNum < 1 || chapterNum > bookInfo.chapters) {
      setFetchError(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setFetchError(false);

    (async () => {
      try {
        const data = await fetchBibleChapter(version, bookId, chapterNum);
        if (!cancelled) {
          setVerses(data.verses);
          setFetchError(false);
        }
      } catch (error) {
        console.error('Failed to load chapter:', error);
        if (!cancelled) {
          setFetchError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [version, bookId, chapterNum, bookInfo]);

  if (!bookInfo || isNaN(chapterNum) || chapterNum < 1) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center">
          <p className="text-red-500">페이지를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {bookInfo.nameKo} {chapterNum}장
          </h1>
          <VersionSelector
            currentVersion={version}
            bookId={bookId}
            chapter={chapterNum}
          />
        </div>

        {/* Top Navigation */}
        <ChapterNavigation
          version={version}
          bookId={bookId}
          chapter={chapterNum}
        />

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : fetchError ? (
          <div className="py-12 text-center text-red-500">
            성경 내용을 불러오는데 실패했습니다. 다시 시도해 주세요.
          </div>
        ) : (
          <div className="py-6 pb-28">
            <BibleViewer
              verses={verses}
              bookName={bookInfo.nameKo}
              chapter={chapterNum}
              version={version}
              bookId={bookId}
            />
          </div>
        )}

        {/* Bottom Navigation */}
        <ChapterNavigation
          version={version}
          bookId={bookId}
          chapter={chapterNum}
        />
      </div>

      {/* Track Visit */}
      {!loading && !fetchError && (
        <ChapterVisitTracker
          version={version}
          bookId={bookId}
          bookName={bookInfo.nameKo}
          chapter={chapterNum}
          versesCount={verses.length}
        />
      )}

      {/* Action Bar */}
      <BibleActionBar
        version={version}
        bookId={bookId}
        bookName={bookInfo.nameKo}
        chapter={chapterNum}
      />
    </div>
  );
}
