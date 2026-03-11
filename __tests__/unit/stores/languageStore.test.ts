/**
 * Tests for languageStore.ts (Zustand store)
 */

import { useLanguageStore } from '@/stores/languageStore';
import { act } from '@testing-library/react';

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
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('languageStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    localStorageMock.clear();
    jest.clearAllMocks();

    // Reset the zustand store to initial state
    act(() => {
      useLanguageStore.setState({
        locale: 'ko',
        favoriteTranslations: [],
        recentTranslations: [],
      });
    });
  });

  describe('initial state', () => {
    it('has Korean as default locale', () => {
      const state = useLanguageStore.getState();
      expect(state.locale).toBe('ko');
    });

    it('has empty favorite translations', () => {
      const state = useLanguageStore.getState();
      expect(state.favoriteTranslations).toEqual([]);
    });

    it('has empty recent translations', () => {
      const state = useLanguageStore.getState();
      expect(state.recentTranslations).toEqual([]);
    });
  });

  describe('setLocale', () => {
    it('changes locale to English', () => {
      act(() => {
        useLanguageStore.getState().setLocale('en');
      });

      expect(useLanguageStore.getState().locale).toBe('en');
    });

    it('changes locale back to Korean', () => {
      act(() => {
        useLanguageStore.getState().setLocale('en');
      });
      act(() => {
        useLanguageStore.getState().setLocale('ko');
      });

      expect(useLanguageStore.getState().locale).toBe('ko');
    });

    it('persists locale to localStorage', () => {
      act(() => {
        useLanguageStore.getState().setLocale('en');
      });

      expect(localStorageMock.setItem).toHaveBeenCalled();
      const stored = JSON.parse(
        localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1][1]
      );
      expect(stored.locale).toBe('en');
    });
  });

  describe('favorites management', () => {
    it('adds a translation to favorites', () => {
      act(() => {
        useLanguageStore.getState().addFavorite('engKJV');
      });

      expect(useLanguageStore.getState().favoriteTranslations).toContain('engKJV');
    });

    it('does not add duplicate favorites', () => {
      act(() => {
        useLanguageStore.getState().addFavorite('engKJV');
      });
      act(() => {
        useLanguageStore.getState().addFavorite('engKJV');
      });

      expect(useLanguageStore.getState().favoriteTranslations).toEqual(['engKJV']);
    });

    it('removes a translation from favorites', () => {
      act(() => {
        useLanguageStore.getState().addFavorite('engKJV');
        useLanguageStore.getState().addFavorite('korHKJV');
      });
      act(() => {
        useLanguageStore.getState().removeFavorite('engKJV');
      });

      expect(useLanguageStore.getState().favoriteTranslations).toEqual(['korHKJV']);
    });

    it('isFavorite returns true for favorited translations', () => {
      act(() => {
        useLanguageStore.getState().addFavorite('engKJV');
      });

      expect(useLanguageStore.getState().isFavorite('engKJV')).toBe(true);
      expect(useLanguageStore.getState().isFavorite('korHKJV')).toBe(false);
    });

    it('persists favorites to localStorage', () => {
      act(() => {
        useLanguageStore.getState().addFavorite('engKJV');
      });

      expect(localStorageMock.setItem).toHaveBeenCalled();
      const lastCall = localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1];
      const stored = JSON.parse(lastCall[1]);
      expect(stored.favoriteTranslations).toContain('engKJV');
    });

    it('manages multiple favorites', () => {
      act(() => {
        useLanguageStore.getState().addFavorite('engKJV');
        useLanguageStore.getState().addFavorite('korHKJV');
        useLanguageStore.getState().addFavorite('fraLSG');
      });

      const favs = useLanguageStore.getState().favoriteTranslations;
      expect(favs).toHaveLength(3);
      expect(favs).toEqual(['engKJV', 'korHKJV', 'fraLSG']);
    });
  });

  describe('recently used tracking', () => {
    it('adds a translation to recents', () => {
      act(() => {
        useLanguageStore.getState().addRecent('engKJV');
      });

      expect(useLanguageStore.getState().recentTranslations).toContain('engKJV');
    });

    it('puts most recently used first', () => {
      act(() => {
        useLanguageStore.getState().addRecent('engKJV');
      });
      act(() => {
        useLanguageStore.getState().addRecent('korHKJV');
      });

      const recents = useLanguageStore.getState().recentTranslations;
      expect(recents[0]).toBe('korHKJV');
      expect(recents[1]).toBe('engKJV');
    });

    it('moves duplicate to front instead of adding again', () => {
      act(() => {
        useLanguageStore.getState().addRecent('engKJV');
        useLanguageStore.getState().addRecent('korHKJV');
      });
      act(() => {
        useLanguageStore.getState().addRecent('engKJV');
      });

      const recents = useLanguageStore.getState().recentTranslations;
      expect(recents).toEqual(['engKJV', 'korHKJV']);
    });

    it('limits recents to 20 items', () => {
      act(() => {
        for (let i = 0; i < 25; i++) {
          useLanguageStore.getState().addRecent(`trans_${i}`);
        }
      });

      expect(useLanguageStore.getState().recentTranslations).toHaveLength(20);
      // Most recent should be first
      expect(useLanguageStore.getState().recentTranslations[0]).toBe('trans_24');
    });

    it('clears all recents', () => {
      act(() => {
        useLanguageStore.getState().addRecent('engKJV');
        useLanguageStore.getState().addRecent('korHKJV');
      });
      act(() => {
        useLanguageStore.getState().clearRecents();
      });

      expect(useLanguageStore.getState().recentTranslations).toEqual([]);
    });

    it('persists recents to localStorage', () => {
      act(() => {
        useLanguageStore.getState().addRecent('engKJV');
      });

      expect(localStorageMock.setItem).toHaveBeenCalled();
      const lastCall = localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1];
      const stored = JSON.parse(lastCall[1]);
      expect(stored.recentTranslations).toContain('engKJV');
    });
  });

  describe('hydrate', () => {
    it('loads state from localStorage', () => {
      localStorageMock.setItem(
        'bible-language-store',
        JSON.stringify({
          locale: 'en',
          favoriteTranslations: ['engKJV'],
          recentTranslations: ['korHKJV'],
        })
      );

      act(() => {
        useLanguageStore.getState().hydrate();
      });

      const state = useLanguageStore.getState();
      expect(state.locale).toBe('en');
      expect(state.favoriteTranslations).toEqual(['engKJV']);
      expect(state.recentTranslations).toEqual(['korHKJV']);
    });

    it('handles missing localStorage data gracefully', () => {
      localStorageMock.clear();

      act(() => {
        useLanguageStore.getState().hydrate();
      });

      const state = useLanguageStore.getState();
      expect(state.locale).toBe('ko');
      expect(state.favoriteTranslations).toEqual([]);
      expect(state.recentTranslations).toEqual([]);
    });

    it('handles corrupt localStorage data gracefully', () => {
      localStorageMock.setItem('bible-language-store', 'not valid json{{{');

      // Should not throw
      act(() => {
        useLanguageStore.getState().hydrate();
      });

      const state = useLanguageStore.getState();
      expect(state.locale).toBe('ko');
    });
  });
});
