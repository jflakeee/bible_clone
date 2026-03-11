'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useBookmarkStore, COLORS } from '@/stores/bookmarkStore';
import { useHistoryStore } from '@/stores/historyStore';

interface VerseActionMenuProps {
  bookName: string;
  bookId: number;
  chapter: number;
  verse: number;
  verseText: string;
  version: string;
  anchorRect: DOMRect | null;
  onClose: () => void;
}

export default function VerseActionMenu({
  bookName,
  bookId,
  chapter,
  verse,
  verseText,
  version,
  anchorRect,
  onClose,
}: VerseActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showBookmarkPanel, setShowBookmarkPanel] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [bookmarkColor, setBookmarkColor] = useState<string>(COLORS[0]);

  const { isBookmarked, getBookmarkForVerse, addBookmark, removeBookmark, updateBookmark } =
    useBookmarkStore();
  const addHistory = useHistoryStore((s) => s.addHistory);

  const bookmarked = isBookmarked(bookId, chapter, verse);
  const existingBookmark = getBookmarkForVerse(bookId, chapter, verse);

  useEffect(() => {
    if (existingBookmark) {
      setBookmarkNote(existingBookmark.note);
      setBookmarkColor(existingBookmark.color);
    }
  }, [existingBookmark]);

  const handleBookmarkToggle = useCallback(() => {
    if (bookmarked && existingBookmark) {
      removeBookmark(existingBookmark.id);
      onClose();
    } else {
      setShowBookmarkPanel(true);
    }
  }, [bookmarked, existingBookmark, removeBookmark, onClose]);

  const handleBookmarkSave = useCallback(() => {
    if (bookmarked && existingBookmark) {
      updateBookmark(existingBookmark.id, { color: bookmarkColor, note: bookmarkNote });
    } else {
      addBookmark({
        verseRef: `${bookName} ${chapter}:${verse}`,
        version,
        bookId,
        chapter,
        verse,
        text: verseText,
        color: bookmarkColor,
        note: bookmarkNote,
      });
      addHistory({
        actionType: 'bookmark',
        targetType: 'verse',
        targetId: `${bookId}-${chapter}-${verse}`,
        targetLabel: `${bookName} ${chapter}:${verse}`,
      });
    }
    setShowBookmarkPanel(false);
    onClose();
  }, [bookmarked, existingBookmark, bookmarkColor, bookmarkNote, addBookmark, updateBookmark, addHistory, bookName, bookId, chapter, verse, version, verseText, onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleKeyDown, handleClickOutside]);

  const handleCopy = useCallback(async () => {
    const text = `${bookName} ${chapter}:${verse} ${verseText}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    onClose();
  }, [bookName, chapter, verse, verseText, onClose]);

  const handleSpeak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(verseText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    onClose();
  }, [verseText, onClose]);

  const style: React.CSSProperties = anchorRect
    ? {
        position: 'fixed',
        top: Math.min(anchorRect.bottom + 8, (typeof window !== 'undefined' ? window.innerHeight : 600) - 320),
        left: Math.max(8, Math.min(anchorRect.left, (typeof window !== 'undefined' ? window.innerWidth : 400) - 240)),
        zIndex: 50,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
      };

  const actions = [
    {
      label: bookmarked ? '북마크 삭제' : '북마크 추가',
      icon: (
        <svg className="h-4 w-4" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      iconColor: bookmarked && existingBookmark ? existingBookmark.color : undefined,
      onClick: handleBookmarkToggle,
    },
    {
      label: '복사',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      onClick: handleCopy,
    },
    {
      label: '낭독',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
      onClick: handleSpeak,
    },
    {
      label: '비교',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      href: `/compare?book=${bookId}&chapter=${chapter}&verse=${verse}`,
    },
    {
      label: '원어 보기',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: `/original?book=${bookId}&chapter=${chapter}&verse=${verse}`,
    },
    {
      label: '설교 찾기',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
        </svg>
      ),
      href: `/sermons?book=${bookId}&chapter=${chapter}&verse=${verse}`,
    },
    {
      label: '지도',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: `/map?book=${bookId}&chapter=${chapter}`,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/10" onClick={onClose} />

      {/* Menu */}
      <div
        ref={menuRef}
        style={style}
        className="w-[220px] rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-4 py-2.5 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {bookName} {chapter}:{verse}
          </p>
        </div>

        {/* Actions or Bookmark Panel */}
        {showBookmarkPanel ? (
          <div className="p-4">
            <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              색상 선택
            </div>
            <div className="mb-3 flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setBookmarkColor(color)}
                  className="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: bookmarkColor === color ? '#1d4ed8' : 'transparent',
                  }}
                  aria-label={`색상 ${color}`}
                />
              ))}
            </div>
            <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              메모 (선택사항)
            </div>
            <textarea
              value={bookmarkNote}
              onChange={(e) => setBookmarkNote(e.target.value)}
              placeholder="메모를 입력하세요..."
              className="mb-3 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBookmarkPanel(false)}
                className="rounded-md px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                뒤로
              </button>
              <button
                onClick={handleBookmarkSave}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <div className="py-1">
            {actions.map((action) =>
              action.href ? (
                <Link
                  key={action.label}
                  href={action.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  <span className="text-gray-400 dark:text-gray-500">{action.icon}</span>
                  {action.label}
                </Link>
              ) : (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  <span
                    className="text-gray-400 dark:text-gray-500"
                    style={action.iconColor ? { color: action.iconColor } : {}}
                  >
                    {action.icon}
                  </span>
                  {action.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
