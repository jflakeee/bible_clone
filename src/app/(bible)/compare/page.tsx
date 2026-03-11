'use client';

import { useState, useEffect, useCallback } from 'react';
import { BIBLE_BOOKS, SUPPORTED_VERSIONS } from '@/lib/constants';
import { CompareResult } from '@/types/bible';
import CompareView from '@/components/bible/CompareView';

export default function ComparePage() {
  const [bookId, setBookId] = useState(1);
  const [chapter, setChapter] = useState(1);
  const [verseStart, setVerseStart] = useState(1);
  const [verseEnd, setVerseEnd] = useState(5);
  const [selectedVersions, setSelectedVersions] = useState<string[]>(['krv', 'kjv']);
  const [results, setResults] = useState<CompareResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBook = BIBLE_BOOKS.find((b) => b.id === bookId);
  const maxChapters = selectedBook?.chapters || 1;

  const fetchComparison = useCallback(async () => {
    if (selectedVersions.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        book: bookId.toString(),
        chapter: chapter.toString(),
        verseStart: verseStart.toString(),
        verseEnd: verseEnd.toString(),
        versions: selectedVersions.join(','),
      });
      const res = await fetch(`/api/bible/compare?${params}`);
      if (!res.ok) throw new Error('비교 데이터를 불러오지 못했습니다');
      const data = await res.json();
      setResults(data.data?.results || data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, [bookId, chapter, verseStart, verseEnd, selectedVersions]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  const handleVersionToggle = (versionId: string) => {
    setSelectedVersions((prev) => {
      if (prev.includes(versionId)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((v) => v !== versionId);
      }
      if (prev.length >= 3) return prev; // Max 3 versions
      return [...prev, versionId];
    });
  };

  const handleBookChange = (newBookId: number) => {
    setBookId(newBookId);
    setChapter(1);
    setVerseStart(1);
    setVerseEnd(5);
  };

  const handleChapterChange = (newChapter: number) => {
    setChapter(newChapter);
    setVerseStart(1);
    setVerseEnd(5);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">번역 비교</h1>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
        {/* Book and Chapter selection */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="book-select" className="text-sm text-gray-600 whitespace-nowrap">
              책:
            </label>
            <select
              id="book-select"
              value={bookId}
              onChange={(e) => handleBookChange(parseInt(e.target.value, 10))}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BIBLE_BOOKS.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.nameKo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="chapter-select" className="text-sm text-gray-600 whitespace-nowrap">
              장:
            </label>
            <select
              id="chapter-select"
              value={chapter}
              onChange={(e) => handleChapterChange(parseInt(e.target.value, 10))}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                <option key={ch} value={ch}>
                  {ch}장
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="verse-start" className="text-sm text-gray-600 whitespace-nowrap">
              절:
            </label>
            <input
              id="verse-start"
              type="number"
              min={1}
              value={verseStart}
              onChange={(e) => setVerseStart(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-400">~</span>
            <input
              id="verse-end"
              type="number"
              min={verseStart}
              value={verseEnd}
              onChange={(e) => setVerseEnd(Math.max(verseStart, parseInt(e.target.value, 10) || verseStart))}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Version selection */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">번역본:</span>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_VERSIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => handleVersionToggle(v.id)}
                className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
                  selectedVersions.includes(v.id)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedBook?.nameKo} {chapter}장 {verseStart}-{verseEnd}절
          </h2>
          <CompareView results={results} versions={selectedVersions} />
        </div>
      )}
    </div>
  );
}
