'use client';

import { useState, useRef, useEffect } from 'react';
import { useBookmarkStore, COLORS } from '@/stores/bookmarkStore';

interface BookmarkButtonProps {
  bookId: number;
  chapter: number;
  verse: number;
  verseRef: string;
  version: string;
  text: string;
}

export default function BookmarkButton({
  bookId,
  chapter,
  verse,
  verseRef,
  version,
  text,
}: BookmarkButtonProps) {
  const { isBookmarked, getBookmarkForVerse, addBookmark, removeBookmark, updateBookmark } =
    useBookmarkStore();

  const [showPopover, setShowPopover] = useState(false);
  const [note, setNote] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const bookmarked = isBookmarked(bookId, chapter, verse);
  const existingBookmark = getBookmarkForVerse(bookId, chapter, verse);

  useEffect(() => {
    if (existingBookmark) {
      setNote(existingBookmark.note);
      setSelectedColor(existingBookmark.color);
    }
  }, [existingBookmark]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false);
      }
    }
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopover]);

  const handleToggle = () => {
    if (bookmarked && existingBookmark) {
      removeBookmark(existingBookmark.id);
      setShowPopover(false);
    } else {
      setShowPopover(true);
    }
  };

  const handleSave = () => {
    if (bookmarked && existingBookmark) {
      updateBookmark(existingBookmark.id, { color: selectedColor, note });
    } else {
      addBookmark({
        verseRef,
        version,
        bookId,
        chapter,
        verse,
        text,
        color: selectedColor,
        note,
      });
    }
    setShowPopover(false);
  };

  return (
    <span className="relative inline-block">
      <button
        onClick={handleToggle}
        className="ml-1 inline-flex items-center opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
        style={bookmarked && existingBookmark ? { color: existingBookmark.color, opacity: 1 } : {}}
        title={bookmarked ? '북마크 삭제' : '북마크 추가'}
        aria-label={bookmarked ? '북마크 삭제' : '북마크 추가'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={bookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      </button>

      {showPopover && (
        <div
          ref={popoverRef}
          className="absolute left-0 top-6 z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            색상 선택
          </div>
          <div className="mb-3 flex gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: selectedColor === color ? '#1d4ed8' : 'transparent',
                }}
                aria-label={`색상 ${color}`}
              />
            ))}
          </div>
          <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            메모 (선택사항)
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="메모를 입력하세요..."
            className="mb-3 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowPopover(false)}
              className="rounded-md px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
            >
              {bookmarked ? '수정' : '저장'}
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
