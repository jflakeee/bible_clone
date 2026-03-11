'use client';

import { useCallback, useMemo } from 'react';
import { useVocabularyStore } from '@/stores/vocabularyStore';
import { VocabularyItem, SortOption } from '@/types/vocabulary';
import { StrongsEntry } from '@/types/bible';

export function useVocabulary() {
  const store = useVocabularyStore();

  const isInVocabulary = useCallback(
    (strongsNumber: string) => {
      return store.items.some((item) => item.strongsNumber === strongsNumber);
    },
    [store.items]
  );

  const getItem = useCallback(
    (strongsNumber: string) => {
      return store.items.find((item) => item.strongsNumber === strongsNumber);
    },
    [store.items]
  );

  const addFromStrongs = useCallback(
    (entry: StrongsEntry) => {
      if (isInVocabulary(entry.number)) return;

      const item: VocabularyItem = {
        id: crypto.randomUUID(),
        strongsNumber: entry.number,
        lemma: entry.lemma,
        transliteration: entry.transliteration,
        definition: entry.definition,
        shortDefinition: entry.shortDefinition,
        language: entry.language,
        notes: '',
        createdAt: new Date().toISOString(),
        reviewCount: 0,
        lastReviewedAt: null,
        mastered: false,
      };

      store.addItem(item);
    },
    [isInVocabulary, store]
  );

  const removeByStrongsNumber = useCallback(
    (strongsNumber: string) => {
      const item = store.items.find(
        (i) => i.strongsNumber === strongsNumber
      );
      if (item) {
        store.removeItem(item.id);
      }
    },
    [store]
  );

  const toggleByStrongsNumber = useCallback(
    (entry: StrongsEntry) => {
      if (isInVocabulary(entry.number)) {
        removeByStrongsNumber(entry.number);
      } else {
        addFromStrongs(entry);
      }
    },
    [isInVocabulary, removeByStrongsNumber, addFromStrongs]
  );

  const stats = useMemo(() => {
    const total = store.items.length;
    const hebrew = store.items.filter((i) => i.language === 'hebrew').length;
    const greek = store.items.filter((i) => i.language === 'greek').length;
    const mastered = store.items.filter((i) => i.mastered).length;
    const learning = total - mastered;
    return { total, hebrew, greek, mastered, learning };
  }, [store.items]);

  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateItem: store.updateItem,
    sortBy: store.sortBy as (option: SortOption) => void,
    getByLanguage: store.getByLanguage,
    incrementReview: store.incrementReview,
    isInVocabulary,
    getItem,
    addFromStrongs,
    removeByStrongsNumber,
    toggleByStrongsNumber,
    stats,
  };
}
