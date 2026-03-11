import Link from 'next/link';
import { BIBLE_BOOKS, SUPPORTED_VERSIONS } from '@/lib/constants';
import DailyVerseCard from '@/components/home/DailyVerseCard';
import RecentReads from '@/components/home/RecentReads';
import ReadingStats from '@/components/home/ReadingStats';
import BookGrid from '@/components/home/BookGrid';

export default function HomePage() {
  const otBooks = BIBLE_BOOKS.filter((b) => b.testament === 'OT');
  const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === 'NT');
  const defaultVersion = SUPPORTED_VERSIONS[0].id;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20 md:pb-8">
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-8">
        {/* Daily Verse */}
        <DailyVerseCard />

        {/* Recent Reads */}
        <RecentReads />

        {/* Reading Stats */}
        <ReadingStats />

        {/* Book Grid */}
        <BookGrid
          otBooks={otBooks}
          ntBooks={ntBooks}
          defaultVersion={defaultVersion}
        />
      </div>
    </div>
  );
}
