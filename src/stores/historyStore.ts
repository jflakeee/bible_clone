import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReadingHistoryEntry, ReadingStats } from '@/types/history';

const MAX_HISTORY = 500;

interface HistoryState {
  history: ReadingHistoryEntry[];
  addHistory: (entry: Omit<ReadingHistoryEntry, 'id' | 'createdAt'>) => void;
  getRecentHistory: (limit: number) => ReadingHistoryEntry[];
  getHistoryByType: (actionType: ReadingHistoryEntry['actionType']) => ReadingHistoryEntry[];
  getReadingStats: () => ReadingStats;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addHistory: (entry) =>
        set((state) => {
          const newEntry: ReadingHistoryEntry = {
            ...entry,
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            createdAt: new Date().toISOString(),
          };
          const updated = [newEntry, ...state.history].slice(0, MAX_HISTORY);
          return { history: updated };
        }),

      getRecentHistory: (limit) => {
        return get().history.slice(0, limit);
      },

      getHistoryByType: (actionType) => {
        return get().history.filter((h) => h.actionType === actionType);
      },

      getReadingStats: () => {
        const { history } = get();

        // Total views (chapter views)
        const chapterViews = history.filter((h) => h.actionType === 'view_verse');
        const totalViews = chapterViews.length;

        // Unique chapters
        const uniqueChapterSet = new Set(
          chapterViews.map((h) => h.targetId)
        );
        const uniqueChapters = uniqueChapterSet.size;

        // Streak days
        const viewDates = new Set(
          chapterViews.map((h) => h.createdAt.split('T')[0])
        );
        const sortedDates = Array.from(viewDates).sort().reverse();
        let streakDays = 0;
        if (sortedDates.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          // Streak must include today or yesterday
          if (sortedDates[0] === today || sortedDates[0] === yesterday) {
            streakDays = 1;
            for (let i = 1; i < sortedDates.length; i++) {
              const prevDate = new Date(sortedDates[i - 1]);
              const currDate = new Date(sortedDates[i]);
              const diffDays = (prevDate.getTime() - currDate.getTime()) / 86400000;
              if (Math.round(diffDays) === 1) {
                streakDays++;
              } else {
                break;
              }
            }
          }
        }

        // Most read book
        const bookCounts: Record<string, number> = {};
        chapterViews.forEach((h) => {
          const bookName = h.targetLabel.split(' ')[0];
          bookCounts[bookName] = (bookCounts[bookName] || 0) + 1;
        });
        const mostReadBook = Object.entries(bookCounts).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] || '-';

        return { totalViews, uniqueChapters, streakDays, mostReadBook };
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'history-storage',
    }
  )
);
