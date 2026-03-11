'use client';

import { useVocabulary } from '@/hooks/useVocabulary';

export default function VocabularyStats() {
  const { stats } = useVocabulary();

  if (stats.total === 0) return null;

  const masteredPercent =
    stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        학습 통계
      </h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total */}
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.total}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">전체 단어</p>
        </div>

        {/* Hebrew */}
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.hebrew}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">히브리어</p>
        </div>

        {/* Greek */}
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.greek}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">헬라어</p>
        </div>

        {/* Mastered */}
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.mastered}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">학습완료</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            학습 진행률
          </span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {masteredPercent}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${masteredPercent}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {stats.mastered}/{stats.total} 단어 학습완료 &middot; {stats.learning}{' '}
          단어 학습중
        </p>
      </div>
    </div>
  );
}
