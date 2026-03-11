'use client';

import { useEffect, useRef, useCallback } from 'react';
import { StrongsEntry } from '@/types/bible';

interface StrongsPopoverProps {
  entry: StrongsEntry | null;
  loading: boolean;
  error?: string | null;
  anchorRect?: DOMRect | null;
  onClose: () => void;
}

export default function StrongsPopover({
  entry,
  loading,
  error,
  anchorRect,
  onClose,
}: StrongsPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  // Close on click outside
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
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

  // Don't render if there's nothing to show
  if (!loading && !entry && !error) return null;

  // Calculate position relative to viewport
  const style: React.CSSProperties = anchorRect
    ? {
        position: 'fixed',
        top: anchorRect.bottom + 8,
        left: Math.max(8, Math.min(anchorRect.left, window.innerWidth - 380)),
        zIndex: 50,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
      };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/10" onClick={onClose} />

      {/* Popover card */}
      <div
        ref={popoverRef}
        style={style}
        className="w-[360px] max-w-[calc(100vw-16px)] rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
      >
        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-3 p-5">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading Strong&apos;s entry...
            </span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="p-5">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Entry content */}
        {!loading && entry && (
          <div className="p-5">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div>
                <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {entry.number}
                </span>
                <span className="ml-2 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {entry.language === 'hebrew' ? 'Hebrew' : 'Greek'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label="Close"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Lemma (original word) */}
            {entry.lemma && (
              <div className="mb-3">
                <p
                  className="text-2xl font-light"
                  style={{
                    fontFamily:
                      entry.language === 'hebrew'
                        ? '"SBL Hebrew", "Ezra SIL", serif'
                        : '"SBL Greek", "Gentium Plus", serif',
                    direction: entry.language === 'hebrew' ? 'rtl' : 'ltr',
                  }}
                >
                  {entry.lemma}
                </p>
              </div>
            )}

            {/* Transliteration & Pronunciation */}
            <div className="mb-3 space-y-1">
              {entry.transliteration && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    Transliteration:{' '}
                  </span>
                  <span className="italic">{entry.transliteration}</span>
                </p>
              )}
              {entry.pronunciation && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    Pronunciation:{' '}
                  </span>
                  <span className="italic">{entry.pronunciation}</span>
                </p>
              )}
            </div>

            {/* Divider */}
            <hr className="my-3 border-gray-200 dark:border-gray-600" />

            {/* Definition */}
            {entry.definition && (
              <div className="mb-2">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Definition
                </p>
                <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                  {entry.definition}
                </p>
              </div>
            )}

            {/* Short Definition (KJV) */}
            {entry.shortDefinition && (
              <div className="mt-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  KJV Usage
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {entry.shortDefinition}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
