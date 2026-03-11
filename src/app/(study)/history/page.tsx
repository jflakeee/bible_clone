'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useHistoryStore } from '@/stores/historyStore';
import { ActionTypeFilter } from '@/types/history';

const ACTION_LABELS: Record<string, string> = {
  all: '전체',
  view_verse: '성경 읽기',
  search: '검색',
  lookup_word: '단어 조회',
  play_tts: 'TTS 재생',
  bookmark: '북마크',
  compare: '번역 비교',
};

const ACTION_ICONS: Record<string, string> = {
  view_verse: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  lookup_word: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
  play_tts: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
  bookmark: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  compare: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
};

export default function HistoryPage() {
  const { history, getReadingStats, clearHistory } = useHistoryStore();
  const [filter, setFilter] = useState<ActionTypeFilter>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const stats = useMemo(() => getReadingStats(), [history, getReadingStats]);

  const filtered = useMemo(() => {
    if (filter === 'all') return history;
    return history.filter((h) => h.actionType === filter);
  }, [history, filter]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const entry of filtered) {
      const date = entry.createdAt.split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    }
    return groups;
  }, [filtered]);

  // Monthly activity for heatmap (last 90 days)
  const monthlyActivity = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = history.filter((h) => h.createdAt.startsWith(dateStr)).length;
      days.push({ date: dateStr, count });
    }
    return days;
  }, [history]);

  // Most read books for bar chart
  const bookStats = useMemo(() => {
    const counts: Record<string, number> = {};
    history
      .filter((h) => h.actionType === 'view_verse')
      .forEach((h) => {
        const book = h.targetLabel.split(' ')[0];
        counts[book] = (counts[book] || 0) + 1;
      });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [history]);

  const maxBookCount = bookStats[0]?.[1] || 1;

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count <= 2) return 'bg-green-200 dark:bg-green-900';
    if (count <= 5) return 'bg-green-400 dark:bg-green-700';
    if (count <= 10) return 'bg-green-500 dark:bg-green-600';
    return 'bg-green-700 dark:bg-green-500';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return '오늘';
    if (dateStr === yesterday) return '어제';
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (isoStr: string) => {
    return new Date(isoStr).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    setShowConfirmClear(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            읽기 기록
          </h1>
          {history.length > 0 && (
            <div>
              {showConfirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">정말 삭제하시겠습니까?</span>
                  <button
                    onClick={handleClearHistory}
                    className="rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="rounded-md px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="rounded-md px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  기록 삭제
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats dashboard */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalViews}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">총 읽기</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.uniqueChapters}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">읽은 장</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.streakDays}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">연속 일수</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 truncate">
              {stats.mostReadBook}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">가장 많이 읽은 책</p>
          </div>
        </div>

        {/* Activity heatmap */}
        {history.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              최근 90일 활동
            </h2>
            <div className="overflow-x-auto">
              <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: 'fit-content' }}>
                {monthlyActivity.map((day) => (
                  <div
                    key={day.date}
                    className={`h-3 w-3 rounded-sm ${getHeatmapColor(day.count)}`}
                    title={`${day.date}: ${day.count}개 활동`}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <span>적음</span>
                <div className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
                <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
                <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-600" />
                <div className="h-3 w-3 rounded-sm bg-green-700 dark:bg-green-500" />
                <span>많음</span>
              </div>
            </div>
          </div>
        )}

        {/* Most read books bar chart */}
        {bookStats.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              가장 많이 읽은 책
            </h2>
            <div className="space-y-2">
              {bookStats.map(([book, count]) => (
                <div key={book} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-right text-xs text-gray-600 dark:text-gray-400">
                    {book}
                  </span>
                  <div className="flex-1">
                    <div
                      className="h-5 rounded-sm bg-blue-500 dark:bg-blue-600 transition-all"
                      style={{ width: `${(count / maxBookCount) * 100}%`, minWidth: '2px' }}
                    />
                  </div>
                  <span className="w-8 text-xs text-gray-500 dark:text-gray-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {(Object.keys(ACTION_LABELS) as ActionTypeFilter[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                filter === type
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {ACTION_LABELS[type]}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {history.length === 0
                ? '아직 기록이 없습니다. 성경을 읽기 시작해 보세요.'
                : '해당 유형의 기록이 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, entries]) => (
              <div key={date}>
                <h3 className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {formatDate(date)}
                </h3>
                <div className="space-y-1">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5 dark:border-gray-800 dark:bg-gray-900"
                    >
                      <span className="shrink-0 text-gray-400 dark:text-gray-500">
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
                            d={ACTION_ICONS[entry.actionType] || ACTION_ICONS.view_verse}
                          />
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-gray-800 dark:text-gray-200">
                          {entry.targetLabel}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {ACTION_LABELS[entry.actionType]} &middot; {formatTime(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
