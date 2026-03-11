'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { ProperNoun } from '@/lib/proper-nouns';

const TYPE_LABELS: Record<ProperNoun['type'], string> = {
  person: '인물',
  place: '장소',
  object: '물건',
  title: '칭호',
  tribe: '지파',
  nation: '민족',
};

const TYPE_COLORS: Record<ProperNoun['type'], string> = {
  person: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  place: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  object: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  title: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  tribe: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  nation: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

interface ProperNounTooltipProps {
  noun: ProperNoun;
  anchorRect: DOMRect | null;
  onClose: () => void;
}

export default function ProperNounTooltip({
  noun,
  anchorRect,
  onClose,
}: ProperNounTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
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

  const style: React.CSSProperties = anchorRect
    ? {
        position: 'fixed',
        top: anchorRect.bottom + 8,
        left: Math.max(8, Math.min(anchorRect.left, (typeof window !== 'undefined' ? window.innerWidth : 800) - 340)),
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

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        style={style}
        className="w-[320px] max-w-[calc(100vw-16px)] rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[noun.type]}`}
              >
                {TYPE_LABELS[noun.type]}
              </span>
              {noun.strongsNumber && (
                <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {noun.strongsNumber}
                </span>
              )}
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

          {/* Names */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {noun.korean}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {noun.english}
            </p>
            <p
              className="mt-1 text-base text-gray-700 dark:text-gray-300"
              style={{
                fontFamily: noun.strongsNumber?.startsWith('H')
                  ? '"SBL Hebrew", "Ezra SIL", serif'
                  : '"SBL Greek", "Gentium Plus", serif',
                direction: noun.strongsNumber?.startsWith('H') ? 'rtl' : 'ltr',
              }}
            >
              {noun.original}
            </p>
          </div>

          {/* Divider */}
          <hr className="my-3 border-gray-200 dark:border-gray-600" />

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {noun.descriptionKo}
            </p>
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {noun.description}
            </p>
          </div>

          {/* Footer links */}
          <div className="mt-3 flex flex-wrap gap-2">
            {noun.strongsNumber && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Strong&apos;s {noun.strongsNumber}
              </span>
            )}
            {noun.type === 'place' && (
              <a
                href="/map"
                className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs text-green-700 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/70"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                지도 보기
              </a>
            )}
          </div>

          {/* Occurrences */}
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            성경 등장 약 {noun.occurrences}회
          </p>
        </div>
      </div>
    </>
  );
}
