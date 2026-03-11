'use client';

import { useState, useMemo } from 'react';
import { PROPER_NOUNS, type ProperNoun } from '@/lib/proper-nouns';
import ProperNounTooltip from '@/components/bible/ProperNounTooltip';

type NounType = ProperNoun['type'] | 'all';

const TYPE_LABELS: Record<NounType, string> = {
  all: '전체',
  person: '인물',
  place: '장소',
  object: '물건',
  title: '칭호',
  tribe: '지파',
  nation: '민족',
};

const TYPE_COLORS: Record<ProperNoun['type'], string> = {
  person: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  place: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  object: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  title: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  tribe: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  nation: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const FILTER_BUTTON_COLORS: Record<NounType, { active: string; inactive: string }> = {
  all: {
    active: 'bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  },
  person: {
    active: 'bg-blue-600 text-white border-blue-600',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  },
  place: {
    active: 'bg-green-600 text-white border-green-600',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:bg-green-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  },
  object: {
    active: 'bg-purple-600 text-white border-purple-600',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:bg-purple-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  },
  title: {
    active: 'bg-yellow-600 text-white border-yellow-600',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:bg-yellow-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  },
  tribe: {
    active: 'bg-orange-600 text-white border-orange-600',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:bg-orange-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  },
  nation: {
    active: 'bg-red-600 text-white border-red-600',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:bg-red-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  },
};

type ViewMode = 'grid' | 'list';

export default function ProperNounsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<NounType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedNoun, setSelectedNoun] = useState<ProperNoun | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const filteredNouns = useMemo(() => {
    let results = PROPER_NOUNS;

    if (typeFilter !== 'all') {
      results = results.filter((n) => n.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(
        (n) =>
          n.english.toLowerCase().includes(q) ||
          n.korean.includes(searchQuery.trim()) ||
          n.original.includes(searchQuery.trim())
      );
    }

    return results;
  }, [typeFilter, searchQuery]);

  const handleNounClick = (noun: ProperNoun, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setAnchorRect(rect);
    setSelectedNoun(noun);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          성경 고유명사
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          성경에 등장하는 주요 인물, 장소, 물건, 칭호, 지파, 민족을 찾아보세요.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-3">
        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름으로 검색... (한글/영어)"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-900"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-l-lg px-3 py-2 text-sm ${
                viewMode === 'grid'
                  ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300'
              }`}
              aria-label="Grid view"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-r-lg px-3 py-2 text-sm ${
                viewMode === 'list'
                  ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300'
              }`}
              aria-label="List view"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as NounType[]).map((type) => {
            const colors = FILTER_BUTTON_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  typeFilter === type ? colors.active : colors.inactive
                }`}
              >
                {TYPE_LABELS[type]}
              </button>
            );
          })}
          <span className="ml-auto self-center text-xs text-gray-400 dark:text-gray-500">
            {filteredNouns.length}개 항목
          </span>
        </div>
      </div>

      {/* Results */}
      {filteredNouns.length === 0 ? (
        <div className="py-20 text-center text-gray-400 dark:text-gray-500">
          <p className="text-lg">검색 결과가 없습니다.</p>
          <p className="mt-1 text-sm">다른 검색어나 필터를 시도해 보세요.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNouns.map((noun) => (
            <button
              key={noun.id}
              onClick={(e) => handleNounClick(noun, e)}
              className="rounded-xl border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                  {noun.korean}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[noun.type]}`}
                >
                  {TYPE_LABELS[noun.type]}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {noun.english}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-gray-400 dark:text-gray-500">
                {noun.descriptionKo}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
          {filteredNouns.map((noun) => (
            <button
              key={noun.id}
              onClick={(e) => handleNounClick(noun, e)}
              className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {noun.korean}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {noun.english}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500">
                  {noun.descriptionKo}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[noun.type]}`}
              >
                {TYPE_LABELS[noun.type]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Tooltip */}
      {selectedNoun && (
        <ProperNounTooltip
          noun={selectedNoun}
          anchorRect={anchorRect}
          onClose={() => {
            setSelectedNoun(null);
            setAnchorRect(null);
          }}
        />
      )}
    </div>
  );
}
