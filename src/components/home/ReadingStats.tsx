'use client';

import { useEffect, useState } from 'react';
import { useReadingHistoryStore } from '@/stores/readingHistoryStore';

// Total chapters in the Bible
const TOTAL_CHAPTERS = 1189;

export default function ReadingStats() {
  const { streakDays, totalVersesRead, recentChapters } = useReadingHistoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-200">
          읽기 통계
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="h-6 w-8 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Unique chapters read
  const uniqueChapters = new Set(
    recentChapters.map((c) => `${c.bookId}-${c.chapter}`)
  ).size;
  const progressPercent = Math.min(
    (uniqueChapters / TOTAL_CHAPTERS) * 100,
    100
  );

  // Verses read this month
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyChapters = recentChapters.filter((c) =>
    c.timestamp.startsWith(thisMonth)
  ).length;

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-200">
        읽기 통계
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {/* Streak */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-2xl font-bold text-orange-500">
            {streakDays}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            연속 일수
          </div>
        </div>

        {/* Total verses */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalVersesRead}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            읽은 절 수
          </div>
        </div>

        {/* Monthly */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {monthlyChapters}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            이번 달 장
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">성경 읽기 진도</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {uniqueChapters} / {TOTAL_CHAPTERS}장
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1 text-right text-xs text-gray-400 dark:text-gray-500">
          {progressPercent.toFixed(1)}%
        </div>
      </div>
    </section>
  );
}
