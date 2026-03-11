'use client';

import { useState, useCallback } from 'react';
import { VerseWord, StrongsEntry } from '@/types/bible';
import StrongsPopover from '@/components/bible/StrongsPopover';

interface OriginalTextViewProps {
  verses: VerseWord[][];
  language: 'hebrew' | 'greek';
  loading?: boolean;
  error?: string | null;
  /** Optional: Korean translation verses to show side-by-side */
  translationVerses?: { verse: number; text: string }[];
}

export default function OriginalTextView({
  verses,
  language,
  loading = false,
  error = null,
  translationVerses,
}: OriginalTextViewProps) {
  const [selectedStrongs, setSelectedStrongs] = useState<string | null>(null);
  const [strongsEntry, setStrongsEntry] = useState<StrongsEntry | null>(null);
  const [strongsLoading, setStrongsLoading] = useState(false);
  const [strongsError, setStrongsError] = useState<string | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const handleWordClick = useCallback(
    async (strongsNumber: string, event: React.MouseEvent) => {
      if (!strongsNumber) return;

      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setAnchorRect(rect);
      setSelectedStrongs(strongsNumber);
      setStrongsLoading(true);
      setStrongsError(null);
      setStrongsEntry(null);

      try {
        const res = await fetch(`/api/strongs/${encodeURIComponent(strongsNumber)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Not found');
        }
        const data: StrongsEntry = await res.json();
        setStrongsEntry(data);
      } catch (err) {
        setStrongsError(err instanceof Error ? err.message : 'Lookup failed');
      } finally {
        setStrongsLoading(false);
      }
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setSelectedStrongs(null);
    setStrongsEntry(null);
    setStrongsError(null);
    setAnchorRect(null);
  }, []);

  const isRtl = language === 'hebrew';
  const fontFamily =
    language === 'hebrew'
      ? '"SBL Hebrew", "Ezra SIL", "Noto Sans Hebrew", serif'
      : '"SBL Greek", "Gentium Plus", "Noto Serif", serif';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <span className="ml-3 text-gray-500 dark:text-gray-400">
          원어 데이터를 불러오는 중...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (verses.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-sm text-amber-700 dark:text-amber-400">
          이 장의 원어 데이터가 아직 준비되지 않았습니다.
        </p>
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
          {language === 'hebrew'
            ? '히브리어 구약 데이터는 창세기 1장, 시편 23편 등 주요 본문이 제공됩니다.'
            : '헬라어 신약 데이터는 OpenGNT 프로젝트에서 로드됩니다.'}
        </p>
      </div>
    );
  }

  const showSideBySide = translationVerses && translationVerses.length > 0;

  return (
    <div className="space-y-4">
      {/* Language indicator */}
      <div className="flex items-center gap-2">
        <span className="inline-block rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
          {language === 'hebrew' ? '히브리어 (Hebrew)' : '헬라어 (Greek)'}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          단어를 클릭하면 원어 사전을 볼 수 있습니다
        </span>
      </div>

      {/* Verses */}
      <div className="space-y-6">
        {verses.map((verseWords, verseIndex) => {
          if (verseWords.length === 0) return null;
          const verseNum = verseIndex + 1;
          const translationText = translationVerses?.find(
            (v) => v.verse === verseNum
          )?.text;

          return (
            <div
              key={verseIndex}
              className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${
                showSideBySide ? 'grid grid-cols-1 gap-4 lg:grid-cols-2' : ''
              }`}
            >
              {/* Original text column */}
              <div>
                {/* Verse number */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {verseNum}
                  </span>
                  <span className="text-xs text-gray-400">
                    {language === 'hebrew' ? 'Hebrew' : 'Greek'}
                  </span>
                </div>

                {/* Interlinear word display */}
                <div
                  className="flex flex-wrap gap-3"
                  style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                >
                  {verseWords.map((vw, wordIndex) => (
                    <button
                      key={wordIndex}
                      onClick={(e) =>
                        vw.strongsNumber
                          ? handleWordClick(vw.strongsNumber, e)
                          : undefined
                      }
                      className={`group flex flex-col items-center rounded-lg border px-2 py-1.5 transition-colors ${
                        vw.strongsNumber
                          ? 'cursor-pointer border-gray-200 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/30'
                          : 'cursor-default border-transparent'
                      } ${
                        selectedStrongs === vw.strongsNumber
                          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40'
                          : ''
                      }`}
                      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                      type="button"
                    >
                      {/* Original word */}
                      <span
                        className="text-lg leading-relaxed text-gray-900 dark:text-gray-100"
                        style={{ fontFamily }}
                      >
                        {vw.word}
                      </span>

                      {/* Transliteration */}
                      {vw.transliteration && (
                        <span
                          className="mt-0.5 text-xs italic text-gray-500 dark:text-gray-400"
                          style={{ direction: 'ltr' }}
                        >
                          {vw.transliteration}
                        </span>
                      )}

                      {/* Gloss (English meaning) */}
                      {vw.gloss && (
                        <span
                          className="mt-0.5 text-xs text-blue-600 dark:text-blue-400"
                          style={{ direction: 'ltr' }}
                        >
                          {vw.gloss}
                        </span>
                      )}

                      {/* Strong's number */}
                      {vw.strongsNumber && (
                        <span
                          className="mt-0.5 text-[10px] text-gray-400 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-blue-400"
                          style={{ direction: 'ltr' }}
                        >
                          {vw.strongsNumber}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Morphology row (collapsed by default) */}
                {verseWords.some((vw) => vw.morphology) && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      형태론 정보 보기
                    </summary>
                    <div
                      className="mt-1 flex flex-wrap gap-2"
                      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                    >
                      {verseWords.map(
                        (vw, wi) =>
                          vw.morphology && (
                            <span
                              key={wi}
                              className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                              style={{ direction: 'ltr' }}
                            >
                              {vw.word}: {vw.morphology}
                            </span>
                          )
                      )}
                    </div>
                  </details>
                )}
              </div>

              {/* Translation column (side-by-side mode) */}
              {showSideBySide && translationText && (
                <div className="border-t border-gray-200 pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0 dark:border-gray-700">
                  <div className="mb-2 text-xs text-gray-400">번역 (개역한글)</div>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    <span className="mr-1 text-xs font-bold text-gray-400">
                      {verseNum}
                    </span>
                    {translationText}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Strong's Popover */}
      {selectedStrongs && (
        <StrongsPopover
          entry={strongsEntry}
          loading={strongsLoading}
          error={strongsError}
          anchorRect={anchorRect}
          onClose={handleClosePopover}
        />
      )}
    </div>
  );
}
