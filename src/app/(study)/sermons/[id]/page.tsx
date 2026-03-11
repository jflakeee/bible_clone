'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sermon } from '@/types/sermon';
import SermonCard from '@/components/sermon/SermonCard';

export default function SermonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [related, setRelated] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSermon() {
      setLoading(true);
      try {
        const res = await fetch(`/api/sermons/${id}`);
        if (!res.ok) throw new Error('설교를 찾을 수 없습니다');
        const data = await res.json();
        setSermon(data.sermon);
        setRelated(data.related || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '오류가 발생했습니다',
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchSermon();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
          <p className="mb-4 text-red-600 dark:text-red-400">
            {error || '설교를 찾을 수 없습니다'}
          </p>
          <button
            onClick={() => router.push('/sermons')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            설교 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => router.push('/sermons')}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        설교 목록
      </button>

      {/* Sermon header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {sermon.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">{sermon.preacher}</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>{sermon.date}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {sermon.tags.map((tag) => (
          <Link
            key={tag}
            href={`/sermons?tag=${encodeURIComponent(tag)}`}
            className="rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-600 transition-colors hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* Related verses */}
      <div className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          관련 구절
        </h2>
        <div className="flex flex-wrap gap-2">
          {sermon.verses.map((verse) => (
            <span
              key={verse}
              className="rounded bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            >
              {verse}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          요약
        </h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {sermon.summary}
        </p>
      </div>

      {/* Content */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          설교 내용
        </h2>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-200">
            {sermon.content}
          </p>
        </div>
      </div>

      {/* Related sermons */}
      {related.length > 0 && (
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            관련 설교
          </h2>
          <div className="space-y-3">
            {related.map((relatedSermon) => (
              <SermonCard
                key={relatedSermon.id}
                sermon={relatedSermon}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
