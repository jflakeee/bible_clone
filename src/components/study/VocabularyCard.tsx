'use client';

import { useState } from 'react';
import { VocabularyItem } from '@/types/vocabulary';

interface VocabularyCardProps {
  item: VocabularyItem;
  onDelete: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onReview: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function VocabularyCard({
  item,
  onDelete,
  onToggleMastered,
  onReview,
  onUpdateNotes,
}: VocabularyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(item.notes);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveNotes = () => {
    onUpdateNotes(item.id, notesValue);
    setEditingNotes(false);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(item.id);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const isHebrew = item.language === 'hebrew';

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Front - always visible */}
      <button
        type="button"
        className="w-full cursor-pointer p-5 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Language badge */}
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                  isHebrew
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                }`}
              >
                {isHebrew ? '히브리어' : '헬라어'}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {item.strongsNumber}
              </span>
              {item.mastered && (
                <span className="inline-block rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
                  학습완료
                </span>
              )}
            </div>

            {/* Original word */}
            <p
              className="text-2xl font-light text-gray-900 dark:text-gray-100"
              style={{
                fontFamily: isHebrew
                  ? '"SBL Hebrew", "Ezra SIL", serif'
                  : '"SBL Greek", "Gentium Plus", serif',
                direction: isHebrew ? 'rtl' : 'ltr',
              }}
            >
              {item.lemma}
            </p>

            {/* Transliteration */}
            <p className="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
              {item.transliteration}
            </p>

            {/* Short definition */}
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {item.shortDefinition}
            </p>
          </div>

          {/* Review count */}
          <div className="ml-4 flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-400 dark:text-gray-500">
              {item.reviewCount}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">복습</span>
          </div>
        </div>
      </button>

      {/* Back/Expanded - full details */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 dark:border-gray-700">
          {/* Full definition */}
          <div className="mt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              정의
            </p>
            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {item.definition}
            </p>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                노트
              </p>
              {!editingNotes && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingNotes(true);
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  편집
                </button>
              )}
            </div>
            {editingNotes ? (
              <div onClick={(e) => e.stopPropagation()}>
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm text-gray-800 focus:border-blue-400 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  rows={3}
                  placeholder="메모를 입력하세요..."
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    className="rounded-md bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setNotesValue(item.notes);
                      setEditingNotes(false);
                    }}
                    className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.notes || '메모 없음'}
              </p>
            )}
          </div>

          {/* Last reviewed */}
          {item.lastReviewedAt && (
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              마지막 복습:{' '}
              {new Date(item.lastReviewedAt).toLocaleDateString('ko-KR')}
            </p>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReview(item.id);
              }}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              복습
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMastered(item.id);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                item.mastered
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {item.mastered ? '학습중으로 변경' : '학습완료'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                showDeleteConfirm
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
              }`}
            >
              {showDeleteConfirm ? '정말 삭제하시겠습니까?' : '삭제'}
            </button>
            {showDeleteConfirm && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                취소
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
