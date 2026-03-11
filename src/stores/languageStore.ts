import { create } from 'zustand';
import type { Locale } from '@/lib/i18n';

interface LanguageState {
  locale: Locale;
  favoriteTranslations: string[];
  recentTranslations: string[];
  setLocale: (locale: Locale) => void;
  addFavorite: (translationId: string) => void;
  removeFavorite: (translationId: string) => void;
  isFavorite: (translationId: string) => boolean;
  addRecent: (translationId: string) => void;
  clearRecents: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'bible-language-store';
const MAX_RECENTS = 20;

function loadFromStorage(): Partial<LanguageState> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        locale: parsed.locale || 'ko',
        favoriteTranslations: parsed.favoriteTranslations || [],
        recentTranslations: parsed.recentTranslations || [],
      };
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveToStorage(state: {
  locale: Locale;
  favoriteTranslations: string[];
  recentTranslations: string[];
}) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        locale: state.locale,
        favoriteTranslations: state.favoriteTranslations,
        recentTranslations: state.recentTranslations,
      })
    );
  } catch {
    // ignore storage errors
  }
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  locale: 'ko',
  favoriteTranslations: [],
  recentTranslations: [],

  setLocale: (locale) => {
    set({ locale });
    const state = get();
    saveToStorage(state);
  },

  addFavorite: (translationId) => {
    const state = get();
    if (state.favoriteTranslations.includes(translationId)) return;
    const updated = [...state.favoriteTranslations, translationId];
    set({ favoriteTranslations: updated });
    saveToStorage({ ...state, favoriteTranslations: updated });
  },

  removeFavorite: (translationId) => {
    const state = get();
    const updated = state.favoriteTranslations.filter((id) => id !== translationId);
    set({ favoriteTranslations: updated });
    saveToStorage({ ...state, favoriteTranslations: updated });
  },

  isFavorite: (translationId) => {
    return get().favoriteTranslations.includes(translationId);
  },

  addRecent: (translationId) => {
    const state = get();
    const filtered = state.recentTranslations.filter((id) => id !== translationId);
    const updated = [translationId, ...filtered].slice(0, MAX_RECENTS);
    set({ recentTranslations: updated });
    saveToStorage({ ...state, recentTranslations: updated });
  },

  clearRecents: () => {
    const state = get();
    set({ recentTranslations: [] });
    saveToStorage({ ...state, recentTranslations: [] });
  },

  hydrate: () => {
    const stored = loadFromStorage();
    if (stored.locale || stored.favoriteTranslations || stored.recentTranslations) {
      set({
        locale: stored.locale || 'ko',
        favoriteTranslations: stored.favoriteTranslations || [],
        recentTranslations: stored.recentTranslations || [],
      });
    }
  },
}));
