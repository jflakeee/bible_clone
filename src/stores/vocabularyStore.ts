import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VocabularyItem, SortOption } from '@/types/vocabulary';

interface VocabularyState {
  items: VocabularyItem[];
  addItem: (item: VocabularyItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<VocabularyItem>) => void;
  sortBy: (option: SortOption) => void;
  getByLanguage: (lang: 'hebrew' | 'greek') => VocabularyItem[];
  incrementReview: (id: string) => void;
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      sortBy: (option) =>
        set((state) => {
          const sorted = [...state.items];
          switch (option) {
            case 'newest':
              sorted.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
              break;
            case 'oldest':
              sorted.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              );
              break;
            case 'alphabetical':
              sorted.sort((a, b) => a.lemma.localeCompare(b.lemma));
              break;
            case 'review-count':
              sorted.sort((a, b) => b.reviewCount - a.reviewCount);
              break;
            case 'language':
              sorted.sort((a, b) => a.language.localeCompare(b.language));
              break;
          }
          return { items: sorted };
        }),

      getByLanguage: (lang) => {
        return get().items.filter((item) => item.language === lang);
      },

      incrementReview: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  reviewCount: item.reviewCount + 1,
                  lastReviewedAt: new Date().toISOString(),
                }
              : item
          ),
        })),
    }),
    {
      name: 'vocabulary-storage',
    }
  )
);
