import { renderHook, act } from '@testing-library/react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useVocabularyStore } from '@/stores/vocabularyStore';
import type { StrongsEntry } from '@/types/bible';
import type { VocabularyItem } from '@/types/vocabulary';

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: () => 'test-uuid-1234' },
});

const mockStrongsEntry: StrongsEntry = {
  number: 'H1234',
  lemma: 'אָב',
  transliteration: 'ab',
  pronunciation: 'awb',
  definition: 'father',
  shortDefinition: 'father',
  language: 'hebrew',
};

const mockItem: VocabularyItem = {
  id: 'item-1',
  strongsNumber: 'H1234',
  lemma: 'אָב',
  transliteration: 'ab',
  definition: 'father',
  shortDefinition: 'father',
  language: 'hebrew',
  notes: '',
  createdAt: '2024-01-01T00:00:00.000Z',
  reviewCount: 0,
  lastReviewedAt: null,
  mastered: false,
};

const mockItemGreek: VocabularyItem = {
  id: 'item-2',
  strongsNumber: 'G26',
  lemma: 'ἀγάπη',
  transliteration: 'agape',
  definition: 'love',
  shortDefinition: 'love',
  language: 'greek',
  notes: '',
  createdAt: '2024-01-02T00:00:00.000Z',
  reviewCount: 3,
  lastReviewedAt: '2024-01-05T00:00:00.000Z',
  mastered: true,
};

beforeEach(() => {
  useVocabularyStore.setState({ items: [] });
});

describe('useVocabulary', () => {
  it('returns empty items initially', () => {
    const { result } = renderHook(() => useVocabulary());
    expect(result.current.items).toEqual([]);
  });

  it('isInVocabulary returns false when item not present', () => {
    const { result } = renderHook(() => useVocabulary());
    expect(result.current.isInVocabulary('H9999')).toBe(false);
  });

  it('isInVocabulary returns true when item is present', () => {
    useVocabularyStore.setState({ items: [mockItem] });
    const { result } = renderHook(() => useVocabulary());
    expect(result.current.isInVocabulary('H1234')).toBe(true);
  });

  it('getItem returns undefined when not found', () => {
    const { result } = renderHook(() => useVocabulary());
    expect(result.current.getItem('H9999')).toBeUndefined();
  });

  it('getItem returns the item when found', () => {
    useVocabularyStore.setState({ items: [mockItem] });
    const { result } = renderHook(() => useVocabulary());
    expect(result.current.getItem('H1234')).toEqual(mockItem);
  });

  it('addFromStrongs adds a new item', () => {
    const { result } = renderHook(() => useVocabulary());
    act(() => {
      result.current.addFromStrongs(mockStrongsEntry);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].strongsNumber).toBe('H1234');
    expect(result.current.items[0].lemma).toBe('אָב');
  });

  it('addFromStrongs does not add duplicate', () => {
    useVocabularyStore.setState({ items: [mockItem] });
    const { result } = renderHook(() => useVocabulary());
    act(() => {
      result.current.addFromStrongs(mockStrongsEntry);
    });
    expect(result.current.items).toHaveLength(1);
  });

  it('removeByStrongsNumber removes existing item', () => {
    useVocabularyStore.setState({ items: [mockItem] });
    const { result } = renderHook(() => useVocabulary());
    act(() => {
      result.current.removeByStrongsNumber('H1234');
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('removeByStrongsNumber does nothing for non-existent item', () => {
    useVocabularyStore.setState({ items: [mockItem] });
    const { result } = renderHook(() => useVocabulary());
    act(() => {
      result.current.removeByStrongsNumber('H9999');
    });
    expect(result.current.items).toHaveLength(1);
  });

  it('toggleByStrongsNumber adds item when not present', () => {
    const { result } = renderHook(() => useVocabulary());
    act(() => {
      result.current.toggleByStrongsNumber(mockStrongsEntry);
    });
    expect(result.current.items).toHaveLength(1);
  });

  it('toggleByStrongsNumber removes item when present', () => {
    useVocabularyStore.setState({ items: [mockItem] });
    const { result } = renderHook(() => useVocabulary());
    act(() => {
      result.current.toggleByStrongsNumber(mockStrongsEntry);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('computes stats correctly', () => {
    useVocabularyStore.setState({ items: [mockItem, mockItemGreek] });
    const { result } = renderHook(() => useVocabulary());
    expect(result.current.stats).toEqual({
      total: 2,
      hebrew: 1,
      greek: 1,
      mastered: 1,
      learning: 1,
    });
  });

  it('computes stats with all zeros for empty list', () => {
    const { result } = renderHook(() => useVocabulary());
    expect(result.current.stats).toEqual({
      total: 0,
      hebrew: 0,
      greek: 0,
      mastered: 0,
      learning: 0,
    });
  });
});
