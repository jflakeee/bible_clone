import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bookmark, BOOKMARK_COLORS } from '@/types/bookmark';

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  getBookmarksByChapter: (bookId: number, chapter: number) => Bookmark[];
  isBookmarked: (bookId: number, chapter: number, verse: number) => boolean;
  getBookmarkForVerse: (bookId: number, chapter: number, verse: number) => Bookmark | undefined;
}

export const COLORS = BOOKMARK_COLORS;

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            {
              ...bookmark,
              id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      updateBookmark: (id, updates) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      getBookmarksByChapter: (bookId, chapter) => {
        return get().bookmarks.filter(
          (b) => b.bookId === bookId && b.chapter === chapter
        );
      },

      isBookmarked: (bookId, chapter, verse) => {
        return get().bookmarks.some(
          (b) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
        );
      },

      getBookmarkForVerse: (bookId, chapter, verse) => {
        return get().bookmarks.find(
          (b) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
        );
      },
    }),
    {
      name: 'bookmark-storage',
    }
  )
);
