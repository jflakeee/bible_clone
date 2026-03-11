'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useBookmarkStore, COLORS } from '@/stores/bookmarkStore';
import { BIBLE_BOOKS, SUPPORTED_VERSIONS } from '@/lib/constants';
import { Bookmark } from '@/types/bookmark';

type SortMode = 'date' | 'bible';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, updateBookmark } = useBookmarkStore();
  const [filterColor, setFilterColor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('date');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  const filtered = useMemo(() => {
    let result = [...bookmarks];

    if (filterColor) {
      result = result.filter((b) => b.color === filterColor);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.note.toLowerCase().includes(q) ||
          b.verseRef.toLowerCase().includes(q) ||
          b.text.toLowerCase().includes(q)
      );
    }

    if (sortMode === 'date') {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      result.sort((a, b) => {
        if (a.bookId !== b.bookId) return a.bookId - b.bookId;
        if (a.chapter !== b.chapter) return a.chapter - b.chapter;
        return a.verse - b.verse;
      });
    }

    return result;
  }, [bookmarks, filterColor, searchQuery, sortMode]);

  // Group by book
  const grouped = useMemo(() => {
    const groups: Record<string, Bookmark[]> = {};
    for (const b of filtered) {
      const bookInfo = BIBLE_BOOKS.find((bk) => bk.id === b.bookId);
      const key = bookInfo?.nameKo || `Book ${b.bookId}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(b);
    }
    return groups;
  }, [filtered]);

  const handleStartEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditNote(bookmark.note);
  };

  const handleSaveEdit = (id: string) => {
    updateBookmark(id, { note: editNote });
    setEditingId(null);
    setEditNote('');
  };

  const getVersionPath = (version: string) => {
    const v = SUPPORTED_VERSIONS.find((sv) => sv.id === version);
    return v ? v.id : 'krv';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          북마크
        </h1>

        {/* Controls */}
        <div className="mb-6 space-y-3">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="북마크 검색 (메모, 구절, 본문)..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
          />

          <div className="flex flex-wrap items-center gap-3">
            {/* Color filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">색상:</span>
              <button
                onClick={() => setFilterColor(null)}
                className={`rounded-full border-2 px-2 py-0.5 text-xs transition ${
                  filterColor === null
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-600 dark:text-gray-400'
                }`}
              >
                전체
              </button>
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setFilterColor(filterColor === color ? null : color)}
                  className="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: filterColor === color ? '#1d4ed8' : 'transparent',
                  }}
                  aria-label={`색상 필터 ${color}`}
                />
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">정렬:</span>
              <button
                onClick={() => setSortMode('date')}
                className={`rounded-md px-2 py-0.5 text-xs transition ${
                  sortMode === 'date'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                날짜순
              </button>
              <button
                onClick={() => setSortMode('bible')}
                className={`rounded-md px-2 py-0.5 text-xs transition ${
                  sortMode === 'bible'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                성경순
              </button>
            </div>
          </div>
        </div>

        {/* Bookmark count */}
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          총 {filtered.length}개의 북마크
        </p>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <svg
              className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {bookmarks.length === 0
                ? '아직 북마크가 없습니다. 성경을 읽으며 구절을 북마크해 보세요.'
                : '검색 결과가 없습니다.'}
            </p>
          </div>
        )}

        {/* Grouped bookmarks */}
        {Object.entries(grouped).map(([bookName, items]) => (
          <div key={bookName} className="mb-6">
            <h2 className="mb-2 border-b border-gray-200 pb-1 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300">
              {bookName}
            </h2>
            <div className="space-y-2">
              {items.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="group rounded-lg border border-gray-200 bg-white p-3 transition hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start gap-3">
                    {/* Color indicator */}
                    <div
                      className="mt-1 h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: bookmark.color }}
                    />

                    <div className="min-w-0 flex-1">
                      {/* Verse ref + actions */}
                      <div className="mb-1 flex items-center justify-between">
                        <Link
                          href={`/${getVersionPath(bookmark.version)}/${bookmark.bookId}/${bookmark.chapter}`}
                          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {bookmark.verseRef}
                        </Link>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => handleStartEdit(bookmark)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            title="메모 편집"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeBookmark(bookmark.id)}
                            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
                            title="삭제"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Verse text */}
                      <p className="mb-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {bookmark.text}
                      </p>

                      {/* Note */}
                      {editingId === bookmark.id ? (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            placeholder="메모 입력..."
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(bookmark.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveEdit(bookmark.id)}
                            className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                          >
                            저장
                          </button>
                        </div>
                      ) : (
                        bookmark.note && (
                          <p className="text-xs italic text-gray-500 dark:text-gray-400">
                            {bookmark.note}
                          </p>
                        )
                      )}

                      {/* Date */}
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {new Date(bookmark.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
