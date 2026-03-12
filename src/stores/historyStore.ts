import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReadingHistoryEntry, ReadingStats } from '@/types/history';
import { generateId } from '@/lib/generate-id';

export interface RecentChapter {
  version: string;
  bookId: number;
  bookName: string;
  chapter: number;
  timestamp: string;
}

export interface DailyVerse {
  verse: number;
  text: string;
  reference: string;
  date: string;
}

const MAX_HISTORY = 500;

interface HistoryState {
  history: ReadingHistoryEntry[];
  addHistory: (entry: Omit<ReadingHistoryEntry, 'id' | 'createdAt'>) => void;
  getRecentHistory: (limit: number) => ReadingHistoryEntry[];
  getHistoryByType: (actionType: ReadingHistoryEntry['actionType']) => ReadingHistoryEntry[];
  getReadingStats: () => ReadingStats;
  clearHistory: () => void;
  recentChapters: RecentChapter[];
  dailyVerse: DailyVerse | null;
  totalVersesRead: number;
  streakDays: number;
  lastReadDate: string | null;
  addChapterVisit: (visit: Omit<RecentChapter, 'timestamp'>) => void;
  setDailyVerse: (verse: DailyVerse) => void;
  addVersesRead: (count: number) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      recentChapters: [],
      dailyVerse: null,
      totalVersesRead: 0,
      streakDays: 0,
      lastReadDate: null,

      addHistory: (entry) =>
        set((state) => {
          const newEntry: ReadingHistoryEntry = {
            ...entry,
            id: generateId(),
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

      addChapterVisit: (visit) =>
        set((state) => {
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          const newEntry: RecentChapter = {
            ...visit,
            timestamp: now.toISOString(),
          };
          const filtered = state.recentChapters.filter(
            (c) =>
              !(c.version === visit.version && c.bookId === visit.bookId && c.chapter === visit.chapter)
          );
          const updated = [newEntry, ...filtered].slice(0, 20);
          let newStreak = state.streakDays;
          const lastDate = state.lastReadDate;
          if (lastDate !== today) {
            if (lastDate) {
              const yesterday = new Date(now);
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];
              newStreak = lastDate === yesterdayStr ? state.streakDays + 1 : 1;
            } else {
              newStreak = 1;
            }
          }
          return { recentChapters: updated, streakDays: newStreak, lastReadDate: today };
        }),

      setDailyVerse: (verse) => set({ dailyVerse: verse }),

      addVersesRead: (count) =>
        set((state) => ({ totalVersesRead: state.totalVersesRead + count })),
    }),
    {
      name: 'history-storage',
    }
  )
);
