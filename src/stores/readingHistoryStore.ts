import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface ReadingHistoryState {
  recentChapters: RecentChapter[];
  dailyVerse: DailyVerse | null;
  streakDays: number;
  totalVersesRead: number;
  lastReadDate: string | null;

  addChapterVisit: (visit: Omit<RecentChapter, 'timestamp'>) => void;
  setDailyVerse: (verse: DailyVerse) => void;
  addVersesRead: (count: number) => void;
}

export const useReadingHistoryStore = create<ReadingHistoryState>()(
  persist(
    (set, get) => ({
      recentChapters: [],
      dailyVerse: null,
      streakDays: 0,
      totalVersesRead: 0,
      lastReadDate: null,

      addChapterVisit: (visit) =>
        set((state) => {
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          const newEntry: RecentChapter = {
            ...visit,
            timestamp: now.toISOString(),
          };

          // Remove duplicate if same chapter already in history
          const filtered = state.recentChapters.filter(
            (c) =>
              !(
                c.version === visit.version &&
                c.bookId === visit.bookId &&
                c.chapter === visit.chapter
              )
          );

          // Keep max 20 entries
          const updated = [newEntry, ...filtered].slice(0, 20);

          // Update streak
          let newStreak = state.streakDays;
          const lastDate = state.lastReadDate;

          if (lastDate !== today) {
            if (lastDate) {
              const yesterday = new Date(now);
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];
              if (lastDate === yesterdayStr) {
                newStreak = state.streakDays + 1;
              } else {
                newStreak = 1;
              }
            } else {
              newStreak = 1;
            }
          }

          return {
            recentChapters: updated,
            streakDays: newStreak,
            lastReadDate: today,
          };
        }),

      setDailyVerse: (verse) =>
        set({ dailyVerse: verse }),

      addVersesRead: (count) =>
        set((state) => ({
          totalVersesRead: state.totalVersesRead + count,
        })),
    }),
    {
      name: 'reading-history-storage',
    }
  )
);
