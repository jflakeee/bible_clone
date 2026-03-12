'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAudio, type VerseForAudio } from '@/hooks/useAudio';
import EnhancedAudioPlayer from '@/components/audio/EnhancedAudioPlayer';
import type { VerseItem } from '@/components/audio/EnhancedAudioPlayer';
import AudioSettings from '@/components/audio/AudioSettings';
import type { Book } from '@/types/bible';
import { BIBLE_API_BASE } from '@/lib/constants';

interface AudioPageClientProps {
  books: Book[];
  versions: { id: string; name: string; language: string }[];
}

// Map version IDs to API translation IDs
const VERSION_MAP: Record<string, string> = {
  krv: 'KorHKJV',
  kjv: 'engKJV',
  web: 'engWEB',
};

// Map version IDs to TTS language codes
const VERSION_LANG_MAP: Record<string, string> = {
  krv: 'ko-KR',
  kjv: 'en-US',
  web: 'en-US',
};

export default function AudioPageClient({ books, versions }: AudioPageClientProps) {
  const [selectedVersion, setSelectedVersion] = useState('krv');
  const [selectedBookId, setSelectedBookId] = useState(1);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<VerseForAudio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const verseRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const {
    isPlaying,
    isPaused,
    speed,
    setSpeed,
    currentVerse,
    currentLang,
    setCurrentLang,
    playChapter,
    playFromVerse,
    pause,
    resume,
    stop,
  } = useAudio();

  const selectedBook = books.find(b => b.id === selectedBookId);
  const chapterCount = selectedBook?.chapters || 1;

  // Set default language based on version
  useEffect(() => {
    const lang = VERSION_LANG_MAP[selectedVersion] || 'ko-KR';
    setCurrentLang(lang);
  }, [selectedVersion, setCurrentLang]);

  // Fetch chapter verses
  const fetchVerses = useCallback(async () => {
    if (!selectedBook) return;

    setLoading(true);
    setError(null);
    stop();

    try {
      const translationId = VERSION_MAP[selectedVersion] || selectedVersion;
      const res = await fetch(
        `${BIBLE_API_BASE}/${translationId}/${selectedBook.abbreviation}/${selectedChapter}.json`
      );
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();

      const chapterVerses: VerseForAudio[] = (data.verses || []).map(
        (v: { number: number; text: string }) => ({
          verse: v.number,
          text: v.text,
        })
      );

      setVerses(chapterVerses);

      if (autoPlay && chapterVerses.length > 0) {
        const lang = VERSION_LANG_MAP[selectedVersion] || 'ko-KR';
        // Small delay to allow render
        setTimeout(() => playChapter(chapterVerses, lang), 300);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '내용을 불러올 수 없습니다.');
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBook, selectedVersion, selectedChapter, stop, autoPlay, playChapter]);

  useEffect(() => {
    fetchVerses();
  }, [fetchVerses]);

  // Auto-scroll to current verse
  useEffect(() => {
    if (currentVerse > 0) {
      const el = verseRefs.current.get(currentVerse);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentVerse]);

  const handleVerseClick = (verseNumber: number) => {
    if (verses.length === 0) return;
    const lang = currentLang || VERSION_LANG_MAP[selectedVersion] || 'ko-KR';
    playFromVerse(verses, verseNumber, lang);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      const lang = currentLang || VERSION_LANG_MAP[selectedVersion] || 'ko-KR';
      playChapter(verses, lang);
    }
  };

  // OT/NT grouping
  const otBooks = books.filter(b => b.testament === 'OT');
  const ntBooks = books.filter(b => b.testament === 'NT');

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Version selector */}
        <div>
          <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">번역본</label>
          <select
            value={selectedVersion}
            onChange={e => { setSelectedVersion(e.target.value); setSelectedChapter(1); }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            {versions.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Book selector */}
        <div>
          <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">책</label>
          <select
            value={selectedBookId}
            onChange={e => { setSelectedBookId(Number(e.target.value)); setSelectedChapter(1); }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            <optgroup label="구약">
              {otBooks.map(b => (
                <option key={b.id} value={b.id}>{b.nameKo}</option>
              ))}
            </optgroup>
            <optgroup label="신약">
              {ntBooks.map(b => (
                <option key={b.id} value={b.id}>{b.nameKo}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Chapter selector */}
        <div>
          <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">장</label>
          <select
            value={selectedChapter}
            onChange={e => setSelectedChapter(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            {Array.from({ length: chapterCount }, (_, i) => i + 1).map(ch => (
              <option key={ch} value={ch}>{ch}장</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audio Player */}
      <EnhancedAudioPlayer
        verses={verses.map((v): VerseItem => ({ verse: v.verse, text: v.text }))}
        bookName={selectedBook?.nameKo}
        chapter={selectedChapter}
      />

      {/* Audio Settings */}
      <AudioSettings
        speed={speed}
        onSpeedChange={setSpeed}
        language={currentLang || VERSION_LANG_MAP[selectedVersion] || 'ko-KR'}
        onLanguageChange={setCurrentLang}
        autoPlay={autoPlay}
        onAutoPlayChange={setAutoPlay}
      />

      {/* Verses display */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        {loading && (
          <div className="py-12 text-center text-gray-400">
            <svg className="mx-auto h-8 w-8 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="mt-2 text-sm">불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="py-12 text-center text-red-500">
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchVerses}
              className="mt-2 text-xs text-blue-500 hover:underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && verses.length === 0 && (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500">
            <p className="text-sm">표시할 내용이 없습니다.</p>
          </div>
        )}

        {!loading && !error && verses.length > 0 && (
          <div className="space-y-1 leading-8">
            {verses.map(v => (
              <div
                key={v.verse}
                ref={el => {
                  if (el) verseRefs.current.set(v.verse, el);
                }}
                onClick={() => handleVerseClick(v.verse)}
                className={`cursor-pointer rounded-md px-2 py-1 transition-colors
                  ${currentVerse === v.verse
                    ? 'bg-blue-50 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:ring-blue-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
              >
                <sup className="mr-1 text-xs font-bold text-blue-500 dark:text-blue-400">
                  {v.verse}
                </sup>
                <span className={`font-serif text-lg ${
                  currentVerse === v.verse
                    ? 'text-blue-800 dark:text-blue-200'
                    : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {v.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
        <p className="font-medium mb-1">사용법:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>재생 버튼을 눌러 장 전체를 음성으로 들을 수 있습니다.</li>
          <li>각 절을 클릭하면 해당 절부터 재생됩니다.</li>
          <li>속도 버튼으로 읽기 속도를 조절할 수 있습니다.</li>
          <li>음성 언어를 변경하여 다른 언어로 들을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
