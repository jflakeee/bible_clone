'use client';

import { useState, useEffect, useCallback } from 'react';
import { BIBLE_BOOKS, BIBLE_API_BASE } from '@/lib/constants';
import { t } from '@/lib/i18n';
import { useLanguageStore } from '@/stores/languageStore';
import type { BibleTranslation, MultiLangChapterResponse } from '@/lib/multilang-api';
import TranslationBrowser from '@/components/bible/TranslationBrowser';
import { fetchBibleTranslations } from '@/lib/client-api';

interface CompareEntry {
  translation: BibleTranslation;
  data: MultiLangChapterResponse | null;
  loading: boolean;
  error: string | null;
}

export default function MultiLangPage() {
  const { locale, addRecent, hydrate } = useLanguageStore();
  const [bookId, setBookId] = useState(1);
  const [chapter, setChapter] = useState(1);
  const [verseStart, setVerseStart] = useState(1);
  const [verseEnd, setVerseEnd] = useState(5);
  const [translationsByLang, setTranslationsByLang] = useState<
    Record<string, BibleTranslation[]>
  >({});
  const [selectedTranslations, setSelectedTranslations] = useState<BibleTranslation[]>([]);
  const [compareEntries, setCompareEntries] = useState<CompareEntry[]>([]);
  const [loadingTranslations, setLoadingTranslations] = useState(true);
  const [showBrowser, setShowBrowser] = useState(true);

  const selectedBook = BIBLE_BOOKS.find((b) => b.id === bookId);
  const maxChapters = selectedBook?.chapters || 1;
  const bookAbbr = selectedBook?.abbreviation || 'Gen';

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Fetch available translations
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchBibleTranslations();
        setTranslationsByLang(data.translations || {});
      } catch {
        // Silently fail - user will see empty browser
      } finally {
        setLoadingTranslations(false);
      }
    }
    load();
  }, []);

  const handleSelect = useCallback(
    (tr: BibleTranslation) => {
      if (selectedTranslations.length >= 5) return;
      if (selectedTranslations.find((s) => s.id === tr.id)) return;
      setSelectedTranslations((prev) => [...prev, tr]);
      addRecent(tr.id);
    },
    [selectedTranslations, addRecent]
  );

  const handleDeselect = useCallback((translationId: string) => {
    setSelectedTranslations((prev) => prev.filter((s) => s.id !== translationId));
    setCompareEntries((prev) => prev.filter((e) => e.translation.id !== translationId));
  }, []);

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

  // Load comparison data for all selected translations
  const loadComparison = useCallback(async () => {
    if (selectedTranslations.length === 0) return;

    const entries: CompareEntry[] = selectedTranslations.map((tr) => ({
      translation: tr,
      data: null,
      loading: true,
      error: null,
    }));
    setCompareEntries([...entries]);
    setShowBrowser(false);

    // Fetch all in parallel
    const promises = selectedTranslations.map(async (tr, idx) => {
      try {
        const res = await fetch(
          `${BIBLE_API_BASE}/${tr.id}/${bookAbbr}/${chapter}.json`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: MultiLangChapterResponse = await res.json();
        entries[idx] = { ...entries[idx], data, loading: false };
      } catch (err) {
        entries[idx] = {
          ...entries[idx],
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load',
        };
      }
    });

    await Promise.all(promises);
    setCompareEntries([...entries]);
  }, [selectedTranslations, bookAbbr, chapter]);

  const selectedIds = selectedTranslations.map((s) => s.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('multiLanguage', locale)} {t('compareTranslations', locale)}
      </h1>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          {/* Book selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="ml-book-select" className="text-sm text-gray-600 whitespace-nowrap">
              {t('book', locale)}:
            </label>
            <select
              id="ml-book-select"
              value={bookId}
              onChange={(e) => handleBookChange(parseInt(e.target.value, 10))}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BIBLE_BOOKS.map((book) => (
                <option key={book.id} value={book.id}>
                  {locale === 'ko' ? book.nameKo : book.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="ml-chapter-select" className="text-sm text-gray-600 whitespace-nowrap">
              {t('chapter', locale)}:
            </label>
            <select
              id="ml-chapter-select"
              value={chapter}
              onChange={(e) => handleChapterChange(parseInt(e.target.value, 10))}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>

          {/* Verse range */}
          <div className="flex items-center gap-2">
            <label htmlFor="ml-verse-start" className="text-sm text-gray-600 whitespace-nowrap">
              {t('verse', locale)}:
            </label>
            <input
              id="ml-verse-start"
              type="number"
              min={1}
              value={verseStart}
              onChange={(e) =>
                setVerseStart(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-400">~</span>
            <input
              id="ml-verse-end"
              type="number"
              min={verseStart}
              value={verseEnd}
              onChange={(e) =>
                setVerseEnd(
                  Math.max(verseStart, parseInt(e.target.value, 10) || verseStart)
                )
              }
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Selected translations chips */}
        {selectedTranslations.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">
              {t('selectedTranslations', locale)}:
            </span>
            {selectedTranslations.map((tr) => (
              <span
                key={tr.id}
                className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full"
              >
                {tr.name}
                <button
                  onClick={() => handleDeselect(tr.id)}
                  className="hover:text-red-500 font-bold"
                >
                  &#x2715;
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                setSelectedTranslations([]);
                setCompareEntries([]);
              }}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              {t('clearSelection', locale)}
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowBrowser(!showBrowser)}
            className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300"
          >
            {showBrowser ? t('selectedTranslations', locale) : t('browseAll', locale)}
          </button>
          {selectedTranslations.length > 0 && (
            <button
              onClick={loadComparison}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('loadCompare', locale)}
            </button>
          )}
        </div>
      </div>

      {/* Translation Browser */}
      {showBrowser && (
        <div className="mb-6">
          {loadingTranslations ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <TranslationBrowser
              translations={translationsByLang}
              selectedIds={selectedIds}
              maxSelections={5}
              onSelect={handleSelect}
              onDeselect={handleDeselect}
            />
          )}
        </div>
      )}

      {/* Comparison Grid */}
      {compareEntries.length > 0 && !showBrowser && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {compareEntries.map((entry) => {
            const filteredVerses = entry.data?.verses?.filter(
              (v) => v.number >= verseStart && v.number <= verseEnd
            );

            return (
              <div
                key={entry.translation.id}
                className={`bg-white border border-gray-200 rounded-lg p-4 ${
                  entry.translation.direction === 'rtl' ? 'text-right' : 'text-left'
                }`}
                dir={entry.translation.direction}
              >
                {/* Translation header */}
                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {entry.translation.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {entry.translation.language}
                      {entry.translation.direction === 'rtl' && (
                        <span className="ml-1 text-orange-500 font-mono">RTL</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeselect(entry.translation.id)}
                    className="text-gray-400 hover:text-red-500 text-lg"
                  >
                    &#x2715;
                  </button>
                </div>

                {/* Content */}
                {entry.loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                ) : entry.error ? (
                  <div className="text-sm text-red-500 py-4">{entry.error}</div>
                ) : filteredVerses && filteredVerses.length > 0 ? (
                  <div className="space-y-2">
                    {filteredVerses.map((verse) => (
                      <p key={verse.number} className="text-sm text-gray-800 leading-relaxed">
                        <span className="font-semibold text-blue-600 mr-1">
                          {verse.number}
                        </span>
                        {verse.text}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 py-4">
                    {t('noResults', locale)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {compareEntries.length === 0 && !showBrowser && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">{t('selectTranslation', locale)}</p>
          <p className="text-sm">
            {t('maxTranslations', locale)}
          </p>
          <button
            onClick={() => setShowBrowser(true)}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 underline"
          >
            {t('browseAll', locale)}
          </button>
        </div>
      )}
    </div>
  );
}
