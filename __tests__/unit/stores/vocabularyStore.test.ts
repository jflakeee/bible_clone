/**
 * Unit tests for src/stores/vocabularyStore.ts
 * Tests add/remove, localStorage persistence, duplicate prevention, sort/filter, review tracking.
 */

import { useVocabularyStore } from '@/stores/vocabularyStore';
import { VocabularyItem } from '@/types/vocabulary';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function makeItem(overrides: Partial<VocabularyItem> = {}): VocabularyItem {
  return {
    id: 'test-id-1',
    strongsNumber: 'H7225',
    lemma: 'בְּרֵאשִׁית',
    transliteration: "bere'shit",
    definition: 'beginning, first',
    shortDefinition: 'beginning',
    language: 'hebrew',
    notes: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    reviewCount: 0,
    lastReviewedAt: null,
    mastered: false,
    ...overrides,
  };
}

beforeEach(() => {
  // Reset store state
  useVocabularyStore.setState({ items: [] });
  localStorageMock.clear();
});

describe('vocabularyStore', () => {
  describe('addItem', () => {
    it('adds an item to the store', () => {
      const item = makeItem();
      useVocabularyStore.getState().addItem(item);

      const items = useVocabularyStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].strongsNumber).toBe('H7225');
    });

    it('adds multiple items', () => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'a', strongsNumber: 'H1' }));
      useVocabularyStore.getState().addItem(makeItem({ id: 'b', strongsNumber: 'G26' }));

      expect(useVocabularyStore.getState().items).toHaveLength(2);
    });

    it('allows duplicate Strong numbers (duplicate prevention is in useVocabulary hook)', () => {
      // The store itself does not prevent duplicates; that logic is in the hook
      const item1 = makeItem({ id: 'a' });
      const item2 = makeItem({ id: 'b' }); // same strongsNumber
      useVocabularyStore.getState().addItem(item1);
      useVocabularyStore.getState().addItem(item2);

      expect(useVocabularyStore.getState().items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('removes an item by id', () => {
      const item = makeItem({ id: 'remove-me' });
      useVocabularyStore.getState().addItem(item);
      expect(useVocabularyStore.getState().items).toHaveLength(1);

      useVocabularyStore.getState().removeItem('remove-me');
      expect(useVocabularyStore.getState().items).toHaveLength(0);
    });

    it('does nothing when removing non-existent id', () => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'keep-me' }));
      useVocabularyStore.getState().removeItem('non-existent');

      expect(useVocabularyStore.getState().items).toHaveLength(1);
    });

    it('only removes the specified item', () => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'a', strongsNumber: 'H1' }));
      useVocabularyStore.getState().addItem(makeItem({ id: 'b', strongsNumber: 'H2' }));
      useVocabularyStore.getState().addItem(makeItem({ id: 'c', strongsNumber: 'H3' }));

      useVocabularyStore.getState().removeItem('b');

      const items = useVocabularyStore.getState().items;
      expect(items).toHaveLength(2);
      expect(items.map(i => i.id)).toEqual(['a', 'c']);
    });
  });

  describe('updateItem', () => {
    it('updates the notes of an item', () => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'upd' }));
      useVocabularyStore.getState().updateItem('upd', { notes: 'New note' });

      expect(useVocabularyStore.getState().items[0].notes).toBe('New note');
    });

    it('updates mastered status', () => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'upd', mastered: false }));
      useVocabularyStore.getState().updateItem('upd', { mastered: true });

      expect(useVocabularyStore.getState().items[0].mastered).toBe(true);
    });

    it('does not affect other items', () => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'a', notes: 'A' }));
      useVocabularyStore.getState().addItem(makeItem({ id: 'b', notes: 'B' }));

      useVocabularyStore.getState().updateItem('a', { notes: 'Updated A' });

      const items = useVocabularyStore.getState().items;
      expect(items[0].notes).toBe('Updated A');
      expect(items[1].notes).toBe('B');
    });
  });

  describe('incrementReview', () => {
    it('increments the review count by 1', () => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'rev', reviewCount: 3 }));
      useVocabularyStore.getState().incrementReview('rev');

      expect(useVocabularyStore.getState().items[0].reviewCount).toBe(4);
    });

    it('sets lastReviewedAt to current time', () => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'rev', lastReviewedAt: null }));

      const before = new Date().toISOString();
      useVocabularyStore.getState().incrementReview('rev');
      const after = new Date().toISOString();

      const reviewed = useVocabularyStore.getState().items[0].lastReviewedAt;
      expect(reviewed).not.toBeNull();
      expect(reviewed! >= before).toBe(true);
      expect(reviewed! <= after).toBe(true);
    });

    it('does not affect other items', () => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'a', reviewCount: 5 }));
      useVocabularyStore.getState().addItem(makeItem({ id: 'b', reviewCount: 0 }));

      useVocabularyStore.getState().incrementReview('a');

      expect(useVocabularyStore.getState().items[0].reviewCount).toBe(6);
      expect(useVocabularyStore.getState().items[1].reviewCount).toBe(0);
    });
  });

  describe('sortBy', () => {
    beforeEach(() => {
      useVocabularyStore.getState().addItem(
        makeItem({ id: 'a', lemma: 'alpha', createdAt: '2026-01-03T00:00:00Z', reviewCount: 1, language: 'greek' })
      );
      useVocabularyStore.getState().addItem(
        makeItem({ id: 'b', lemma: 'bet', createdAt: '2026-01-01T00:00:00Z', reviewCount: 5, language: 'hebrew' })
      );
      useVocabularyStore.getState().addItem(
        makeItem({ id: 'c', lemma: 'gamma', createdAt: '2026-01-02T00:00:00Z', reviewCount: 3, language: 'greek' })
      );
    });

    it('sorts by newest first', () => {
      useVocabularyStore.getState().sortBy('newest');
      const ids = useVocabularyStore.getState().items.map(i => i.id);
      expect(ids).toEqual(['a', 'c', 'b']);
    });

    it('sorts by oldest first', () => {
      useVocabularyStore.getState().sortBy('oldest');
      const ids = useVocabularyStore.getState().items.map(i => i.id);
      expect(ids).toEqual(['b', 'c', 'a']);
    });

    it('sorts alphabetically by lemma', () => {
      useVocabularyStore.getState().sortBy('alphabetical');
      const lemmas = useVocabularyStore.getState().items.map(i => i.lemma);
      expect(lemmas).toEqual(['alpha', 'bet', 'gamma']);
    });

    it('sorts by review count (highest first)', () => {
      useVocabularyStore.getState().sortBy('review-count');
      const counts = useVocabularyStore.getState().items.map(i => i.reviewCount);
      expect(counts).toEqual([5, 3, 1]);
    });

    it('sorts by language', () => {
      useVocabularyStore.getState().sortBy('language');
      const langs = useVocabularyStore.getState().items.map(i => i.language);
      // 'greek' < 'hebrew' alphabetically
      expect(langs).toEqual(['greek', 'greek', 'hebrew']);
    });
  });

  describe('getByLanguage', () => {
    beforeEach(() => {
      useVocabularyStore.getState().addItem(makeItem({ id: 'h1', language: 'hebrew' }));
      useVocabularyStore.getState().addItem(makeItem({ id: 'g1', language: 'greek' }));
      useVocabularyStore.getState().addItem(makeItem({ id: 'h2', language: 'hebrew' }));
    });

    it('filters Hebrew items', () => {
      const hebrew = useVocabularyStore.getState().getByLanguage('hebrew');
      expect(hebrew).toHaveLength(2);
      expect(hebrew.every(i => i.language === 'hebrew')).toBe(true);
    });

    it('filters Greek items', () => {
      const greek = useVocabularyStore.getState().getByLanguage('greek');
      expect(greek).toHaveLength(1);
      expect(greek[0].id).toBe('g1');
    });

    it('returns empty array when no items match', () => {
      useVocabularyStore.setState({ items: [] });
      const result = useVocabularyStore.getState().getByLanguage('greek');
      expect(result).toEqual([]);
    });
  });

  describe('localStorage persistence', () => {
    it('store is configured with persist middleware using "vocabulary-storage" key', () => {
      // Zustand persist stores use the persist API
      // Verify that the store has the persist property (set by zustand/middleware/persist)
      const store = useVocabularyStore;
      // The persist middleware adds a persist object to the store
      expect((store as unknown as { persist: { getOptions: () => { name: string } } }).persist).toBeDefined();
      expect(
        (store as unknown as { persist: { getOptions: () => { name: string } } }).persist.getOptions().name
      ).toBe('vocabulary-storage');
    });
  });
});
