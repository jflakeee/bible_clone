'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { BIBLE_BOOKS } from '@/lib/constants';
import { useOriginalText } from '@/hooks/useOriginalText';
import OriginalTextView from '@/components/study/OriginalTextView';
import { fetchBibleChapter } from '@/lib/client-api';

export default function OriginalTextPage() {
  const [bookId, setBookId] = useState(1); // Default: Genesis
  const [chapter, setChapter] = useState(1);
  const [showTranslation, setShowTranslation] = useState(true);
  const [translationVerses, setTranslationVerses] = useState<
    { verse: number; text: string }[]
  >([]);
  const [translationLoading, setTranslationLoading] = useState(false);

  const { verses, loading, error, language, fetchOriginalText } =
    useOriginalText();

  const selectedBook = useMemo(
    () => BIBLE_BOOKS.find((b) => b.id === bookId),
    [bookId]
  );

  const maxChapters = selectedBook?.chapters ?? 1;
  const testament = selectedBook?.testament ?? 'OT';

  // Fetch original text when book/chapter changes
  const loadData = useCallback(() => {
    fetchOriginalText(bookId, chapter);
  }, [bookId, chapter, fetchOriginalText]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fetch Korean translation for side-by-side view
  useEffect(() => {
    if (!showTranslation) {
      setTranslationVerses([]);
      return;
    }

    let cancelled = false;
    setTranslationLoading(true);

    (async () => {
      try {
        const data = await fetchBibleChapter('krv', bookId, chapter);
        if (!cancelled) {
          setTranslationVerses(data.verses);
        }
      } catch {
        if (!cancelled) setTranslationVerses([]);
      } finally {
        if (!cancelled) setTranslationLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookId, chapter, showTranslation]);

  // Reset chapter to 1 when book changes
  const handleBookChange = useCallback(
    (newBookId: number) => {
      setBookId(newBookId);
      if (chapter > (BIBLE_BOOKS.find((b) => b.id === newBookId)?.chapters ?? 1)) {
        setChapter(1);
      }
    },
    [chapter]
  );

  // Navigation
  const goToPrevChapter = useCallback(() => {
    if (chapter > 1) {
      setChapter((c) => c - 1);
    } else {
      // Go to previous book's last chapter
      const prevBook = BIBLE_BOOKS.find((b) => b.id === bookId - 1);
      if (prevBook) {
        setBookId(prevBook.id);
        setChapter(prevBook.chapters);
      }
    }
  }, [chapter, bookId]);

  const goToNextChapter = useCallback(() => {
    if (chapter < maxChapters) {
      setChapter((c) => c + 1);
    } else {
      // Go to next book's first chapter
      const nextBook = BIBLE_BOOKS.find((b) => b.id === bookId + 1);
      if (nextBook) {
        setBookId(nextBook.id);
        setChapter(1);
      }
    }
  }, [chapter, maxChapters, bookId]);

  const otBooks = BIBLE_BOOKS.filter((b) => b.testament === 'OT');
  const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === 'NT');

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          원어 성경
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          히브리어/헬라어 원문을 단어별 분석과 함께 볼 수 있습니다
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-end gap-4">
          {/* Book selector */}
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="book-select"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              책 (Book)
            </label>
            <select
              id="book-select"
              value={bookId}
              onChange={(e) => handleBookChange(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <optgroup label="구약 (Old Testament) - 히브리어">
                {otBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameKo} ({b.name})
                  </option>
                ))}
              </optgroup>
              <optgroup label="신약 (New Testament) - 헬라어">
                {ntBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nameKo} ({b.name})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Chapter selector */}
          <div className="w-28">
            <label
              htmlFor="chapter-select"
              className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              장 (Chapter)
            </label>
            <select
              id="chapter-select"
              value={chapter}
              onChange={(e) => setChapter(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              {Array.from({ length: maxChapters }, (_, i) => i + 1).map((c) => (
                <option key={c} value={c}>
                  {c}장
                </option>
              ))}
            </select>
          </div>

          {/* Side-by-side toggle */}
          <div className="flex items-center gap-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={showTranslation}
                onChange={(e) => setShowTranslation(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-600" />
            </label>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              번역 병행
            </span>
          </div>
        </div>

        {/* Current language indicator */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              testament === 'OT' ? 'bg-amber-500' : 'bg-blue-500'
            }`}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {testament === 'OT'
              ? '구약 - 히브리어 (Hebrew, RTL)'
              : '신약 - 헬라어 (Greek, LTR)'}
          </span>
        </div>
      </div>

      {/* Chapter title */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {selectedBook?.nameKo} {chapter}장
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrevChapter}
            disabled={bookId === 1 && chapter === 1}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            type="button"
          >
            ← 이전
          </button>
          <button
            onClick={goToNextChapter}
            disabled={bookId === 66 && chapter === maxChapters}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            type="button"
          >
            다음 →
          </button>
        </div>
      </div>

      {/* Original text display */}
      <OriginalTextView
        verses={verses}
        language={language || (testament === 'OT' ? 'hebrew' : 'greek')}
        loading={loading || translationLoading}
        error={error}
        translationVerses={showTranslation ? translationVerses : undefined}
      />
    </div>
  );
}
