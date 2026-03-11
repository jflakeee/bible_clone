'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useReadingHistoryStore } from '@/stores/readingHistoryStore';

function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return new Date(timestamp).toLocaleDateString('ko-KR');
}

export default function RecentReads() {
  const { recentChapters } = useReadingHistoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-200">
          최근 읽은 말씀
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[160px] animate-pulse rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recentChapters.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-200">
          최근 읽은 말씀
        </h2>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-900">
          <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            아직 읽은 기록이 없습니다
          </p>
          <Link
            href="/krv/1/1"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            창세기부터 시작하기 &rarr;
          </Link>
        </div>
      </section>
    );
  }

  const recent = recentChapters.slice(0, 5);

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-200">
        최근 읽은 말씀
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recent.map((ch, idx) => (
          <Link
            key={`${ch.version}-${ch.bookId}-${ch.chapter}-${idx}`}
            href={`/${ch.version}/${ch.bookId}/${ch.chapter}`}
            className="group min-w-[160px] flex-shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600 dark:hover:bg-blue-950"
          >
            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-400">
              {ch.bookName} {ch.chapter}장
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {ch.version.toUpperCase()}
            </div>
            <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {timeAgo(ch.timestamp)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
