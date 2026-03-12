'use client';

import { useEffect } from 'react';
import { useHistoryStore } from '@/stores/historyStore';

interface Props {
  version: string;
  bookId: number;
  bookName: string;
  chapter: number;
  versesCount: number;
}

export default function ChapterVisitTracker({
  version,
  bookId,
  bookName,
  chapter,
  versesCount,
}: Props) {
  const { addChapterVisit, addVersesRead } = useHistoryStore();
  const addHistory = useHistoryStore((s) => s.addHistory);

  useEffect(() => {
    addChapterVisit({ version, bookId, bookName, chapter });
    if (versesCount > 0) {
      addVersesRead(versesCount);
    }
    // Track in the detailed history store
    addHistory({
      actionType: 'view_verse',
      targetType: 'chapter',
      targetId: `${bookId}-${chapter}-${version}`,
      targetLabel: `${bookName} ${chapter}장`,
      metadata: { bookId, chapter, version },
    });
  }, [version, bookId, bookName, chapter, versesCount, addChapterVisit, addVersesRead, addHistory]);

  return null;
}
