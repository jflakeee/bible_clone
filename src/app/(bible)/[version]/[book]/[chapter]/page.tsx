import { notFound } from 'next/navigation';
import { BIBLE_BOOKS } from '@/lib/constants';
import { getChapter, getTranslationId } from '@/lib/bible-api';
import BibleViewer from '@/components/bible/BibleViewer';
import ChapterNavigation from '@/components/bible/ChapterNavigation';
import VersionSelector from '@/components/bible/VersionSelector';
import BibleActionBar from '@/components/bible/BibleActionBar';
import ChapterVisitTracker from '@/components/bible/ChapterVisitTracker';

interface PageProps {
  params: Promise<{
    version: string;
    book: string;
    chapter: string;
  }>;
}

export default async function BibleChapterPage({ params }: PageProps) {
  const { version, book, chapter } = await params;
  const bookId = parseInt(book, 10);
  const chapterNum = parseInt(chapter, 10);

  const bookInfo = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!bookInfo || isNaN(chapterNum) || chapterNum < 1 || chapterNum > bookInfo.chapters) {
    notFound();
  }

  let verses: { verse: number; text: string }[] = [];
  let fetchError = false;

  try {
    const data = await getChapter(version, bookInfo.name, chapterNum);
    verses = (data.verses || []).map((v) => ({
      verse: v.number,
      text: v.text,
    }));
  } catch (error) {
    console.error('Failed to load chapter:', error);
    fetchError = true;
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
        {fetchError ? (
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
      <ChapterVisitTracker
        version={version}
        bookId={bookId}
        bookName={bookInfo.nameKo}
        chapter={chapterNum}
        versesCount={verses.length}
      />

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

export async function generateMetadata({ params }: PageProps) {
  const { version, book, chapter } = await params;
  const bookId = parseInt(book, 10);
  const bookInfo = BIBLE_BOOKS.find((b) => b.id === bookId);
  const bookName = bookInfo?.nameKo || '성경';
  return {
    title: `${bookName} ${chapter}장 - 성경 읽기`,
    description: `${bookName} ${chapter}장 (${version.toUpperCase()})`,
  };
}
