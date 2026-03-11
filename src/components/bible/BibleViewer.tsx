'use client';

import { useState, useCallback } from 'react';
import TextHighlighter from './TextHighlighter';
import VerseActionMenu from './VerseActionMenu';

interface VerseData {
  verse: number;
  text: string;
}

interface BibleViewerProps {
  verses: VerseData[];
  bookName: string;
  chapter: number;
  version?: string;
  bookId?: number;
}

interface SelectedVerse {
  verse: number;
  text: string;
  anchorRect: DOMRect;
}

export default function BibleViewer({
  verses,
  bookName,
  chapter,
  version = 'krv',
  bookId = 1,
}: BibleViewerProps) {
  const [selectedVerse, setSelectedVerse] = useState<SelectedVerse | null>(null);

  const handleVerseClick = useCallback(
    (v: VerseData, e: React.MouseEvent<HTMLSpanElement>) => {
      // Don't open verse menu if clicking on a proper noun (handled by TextHighlighter)
      const target = e.target as HTMLElement;
      if (target.getAttribute('role') === 'button') return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setSelectedVerse({ verse: v.verse, text: v.text, anchorRect: rect });
    },
    []
  );

  const handleCloseMenu = useCallback(() => {
    setSelectedVerse(null);
  }, []);

  if (!verses || verses.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        해당 장의 내용을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <div className="space-y-1 leading-8">
          {verses.map((v) => (
            <span
              key={v.verse}
              className={`group inline cursor-pointer rounded transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-900/20 ${
                selectedVerse?.verse === v.verse
                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                  : ''
              }`}
              onClick={(e) => handleVerseClick(v, e)}
            >
              <sup className="mr-1 text-xs font-bold text-blue-500 dark:text-blue-400">
                {v.verse}
              </sup>
              <TextHighlighter
                text={v.text}
                language="ko"
                className="font-serif text-lg text-gray-800 dark:text-gray-200"
              />{' '}
            </span>
          ))}
        </div>
      </article>

      {/* Verse action menu */}
      {selectedVerse && (
        <VerseActionMenu
          bookName={bookName}
          bookId={bookId}
          chapter={chapter}
          verse={selectedVerse.verse}
          verseText={selectedVerse.text}
          version={version}
          anchorRect={selectedVerse.anchorRect}
          onClose={handleCloseMenu}
        />
      )}
    </div>
  );
}
