import { create } from 'zustand';

interface BibleState {
  currentVersion: string;
  currentBook: number;
  currentChapter: number;
  setVersion: (version: string) => void;
  setBook: (bookId: number) => void;
  setChapter: (chapter: number) => void;
}

export const useBibleStore = create<BibleState>((set) => ({
  currentVersion: 'krv',
  currentBook: 1,
  currentChapter: 1,
  setVersion: (version) => set({ currentVersion: version }),
  setBook: (bookId) => set({ currentBook: bookId }),
  setChapter: (chapter) => set({ currentChapter: chapter }),
}));
