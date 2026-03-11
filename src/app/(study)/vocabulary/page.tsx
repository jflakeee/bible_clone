'use client';

import { useState, useMemo } from 'react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { SortOption } from '@/types/vocabulary';
import VocabularyCard from '@/components/study/VocabularyCard';
import VocabularyStats from '@/components/study/VocabularyStats';

type FilterOption = 'all' | 'hebrew' | 'greek' | 'mastered' | 'learning';

const sortLabels: Record<SortOption, string> = {
  newest: '최신순',
  oldest: '오래된순',
  alphabetical: '알파벳순',
  'review-count': '복습횟수순',
  language: '언어별',
};

const filterLabels: Record<FilterOption, string> = {
  all: '전체',
  hebrew: '히브리어',
  greek: '헬라어',
  mastered: '학습완료',
  learning: '미학습',
};

export default function VocabularyPage() {
  const { items, removeItem, updateItem, incrementReview, sortBy } =
    useVocabulary();
  const [currentSort, setCurrentSort] = useState<SortOption>('newest');
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('all');

  const handleSort = (option: SortOption) => {
    setCurrentSort(option);
    sortBy(option);
  };

  const filteredItems = useMemo(() => {
    switch (currentFilter) {
      case 'hebrew':
        return items.filter((item) => item.language === 'hebrew');
      case 'greek':
        return items.filter((item) => item.language === 'greek');
      case 'mastered':
        return items.filter((item) => item.mastered);
      case 'learning':
        return items.filter((item) => !item.mastered);
      default:
        return items;
    }
  }, [items, currentFilter]);

  const handleToggleMastered = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      updateItem(id, { mastered: !item.mastered });
    }
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    updateItem(id, { notes });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        단어장
      </h1>

      {/* Statistics */}
      <div className="mb-6">
        <VocabularyStats />
      </div>

      {/* Sort controls */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(sortLabels) as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => handleSort(option)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                currentSort === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {sortLabels[option]}
            </button>
          ))}
        </div>
      </div>

      {/* Filter controls */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(filterLabels) as FilterOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setCurrentFilter(option)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                currentFilter === option
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {filterLabels[option]}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary list */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-600 dark:bg-gray-800/50">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            저장된 단어가 없습니다.
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            성경을 읽으며 단어를 저장해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <VocabularyCard
              key={item.id}
              item={item}
              onDelete={removeItem}
              onToggleMastered={handleToggleMastered}
              onReview={incrementReview}
              onUpdateNotes={handleUpdateNotes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
