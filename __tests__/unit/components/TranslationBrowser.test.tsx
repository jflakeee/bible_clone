/**
 * Tests for TranslationBrowser component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TranslationBrowser from '@/components/bible/TranslationBrowser';
import type { BibleTranslation } from '@/lib/multilang-api';

// Mock the language store
const mockAddFavorite = jest.fn();
const mockRemoveFavorite = jest.fn();
const mockHydrate = jest.fn();

jest.mock('@/stores/languageStore', () => ({
  useLanguageStore: jest.fn(() => ({
    locale: 'ko' as const,
    favoriteTranslations: [] as string[],
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    hydrate: mockHydrate,
  })),
}));

// Mock i18n
jest.mock('@/lib/i18n', () => ({
  t: jest.fn((key: string) => {
    const map: Record<string, string> = {
      searchLanguage: '언어 검색...',
      selectedTranslations: '선택된 번역본',
      favorites: '즐겨찾기',
      noResults: '결과가 없습니다',
      translationsCount: '개 번역본',
      addToFavorites: '즐겨찾기 추가',
      removeFromFavorites: '즐겨찾기 제거',
    };
    return map[key] || key;
  }),
}));

const mockTranslations: Record<string, BibleTranslation[]> = {
  English: [
    {
      id: 'engKJV',
      name: 'King James Version',
      language: 'English',
      languageKo: '영어',
      languageCode: 'eng',
      direction: 'ltr',
    },
    {
      id: 'engWEB',
      name: 'World English Bible',
      language: 'English',
      languageKo: '영어',
      languageCode: 'eng',
      direction: 'ltr',
    },
  ],
  Korean: [
    {
      id: 'korHKJV',
      name: 'Korean HKJV',
      language: 'Korean',
      languageKo: '한국어',
      languageCode: 'kor',
      direction: 'ltr',
    },
  ],
  Arabic: [
    {
      id: 'araSVD',
      name: 'Arabic SVD',
      language: 'Arabic',
      languageKo: '아랍어',
      languageCode: 'ara',
      direction: 'rtl',
    },
  ],
};

const mockOnSelect = jest.fn();
const mockOnDeselect = jest.fn();

function renderBrowser(overrides: Partial<Parameters<typeof TranslationBrowser>[0]> = {}) {
  return render(
    <TranslationBrowser
      translations={mockTranslations}
      selectedIds={[]}
      maxSelections={5}
      onSelect={mockOnSelect}
      onDeselect={mockOnDeselect}
      {...overrides}
    />
  );
}

describe('TranslationBrowser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering language groups', () => {
    it('renders all language group headers', () => {
      renderBrowser();

      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Korean')).toBeInTheDocument();
      expect(screen.getByText('Arabic')).toBeInTheDocument();
    });

    it('shows translation count per language', () => {
      renderBrowser();

      // Each language shows "N 개 번역본" - use regex to match
      const counts = screen.getAllByText(/개 번역본/);
      expect(counts.length).toBe(3);
    });

    it('shows Korean name in parentheses', () => {
      renderBrowser();

      expect(screen.getByText('(영어)')).toBeInTheDocument();
      expect(screen.getByText('(한국어)')).toBeInTheDocument();
      expect(screen.getByText('(아랍어)')).toBeInTheDocument();
    });

    it('shows RTL badge for RTL languages', () => {
      renderBrowser();

      const rtlBadges = screen.getAllByText('RTL');
      expect(rtlBadges.length).toBeGreaterThanOrEqual(1);
    });

    it('expands a language group on click', () => {
      renderBrowser();

      // Click the English header to expand
      fireEvent.click(screen.getByText('English'));

      // Should now see translations
      expect(screen.getByText('King James Version')).toBeInTheDocument();
      expect(screen.getByText('World English Bible')).toBeInTheDocument();
    });

    it('collapses an expanded language group on second click', () => {
      renderBrowser();

      const englishHeader = screen.getByText('English');

      // Expand
      fireEvent.click(englishHeader);
      expect(screen.getByText('King James Version')).toBeInTheDocument();

      // Collapse
      fireEvent.click(englishHeader);
      expect(screen.queryByText('King James Version')).not.toBeInTheDocument();
    });
  });

  describe('search/filter translations', () => {
    it('renders search input', () => {
      renderBrowser();

      const input = screen.getByPlaceholderText('언어 검색...');
      expect(input).toBeInTheDocument();
    });

    it('filters languages by language name', async () => {
      const user = userEvent.setup();
      renderBrowser();

      const input = screen.getByPlaceholderText('언어 검색...');
      await user.type(input, 'English');

      // English should remain, others should be filtered out
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.queryByText('Korean')).not.toBeInTheDocument();
      expect(screen.queryByText('Arabic')).not.toBeInTheDocument();
    });

    it('filters by Korean language name', async () => {
      const user = userEvent.setup();
      renderBrowser();

      const input = screen.getByPlaceholderText('언어 검색...');
      await user.type(input, '한국어');

      expect(screen.getByText('Korean')).toBeInTheDocument();
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    it('filters by translation name', async () => {
      const user = userEvent.setup();
      renderBrowser();

      const input = screen.getByPlaceholderText('언어 검색...');
      await user.type(input, 'World English');

      // English group should show (has World English Bible translation)
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.queryByText('Korean')).not.toBeInTheDocument();
      expect(screen.queryByText('Arabic')).not.toBeInTheDocument();
    });

    it('filters by translation ID', async () => {
      const user = userEvent.setup();
      renderBrowser();

      const input = screen.getByPlaceholderText('언어 검색...');
      await user.type(input, 'araSVD');

      expect(screen.getByText('Arabic')).toBeInTheDocument();
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    it('shows no results message when nothing matches', async () => {
      const user = userEvent.setup();
      renderBrowser();

      const input = screen.getByPlaceholderText('언어 검색...');
      await user.type(input, 'xyznonexistent');

      expect(screen.getByText('결과가 없습니다')).toBeInTheDocument();
    });

    it('shows clear button when search has text', async () => {
      const user = userEvent.setup();
      renderBrowser();

      const input = screen.getByPlaceholderText('언어 검색...');
      await user.type(input, 'test');

      // The clear button has the "x" character
      const clearButton = screen.getByText('\u2715');
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('calls onSelect when clicking a translation', () => {
      renderBrowser();

      // Expand English
      fireEvent.click(screen.getByText('English'));

      // Click KJV translation
      fireEvent.click(screen.getByText('King James Version'));

      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'engKJV' })
      );
    });

    it('calls onDeselect when clicking a selected translation', () => {
      renderBrowser({ selectedIds: ['engKJV'] });

      // Expand English
      fireEvent.click(screen.getByText('English'));

      // Click already-selected KJV
      fireEvent.click(screen.getByText('King James Version'));

      expect(mockOnDeselect).toHaveBeenCalledWith('engKJV');
    });

    it('shows selected count when translations are selected', () => {
      renderBrowser({ selectedIds: ['engKJV', 'korHKJV'] });

      expect(screen.getByText(/선택된 번역본/)).toBeInTheDocument();
      expect(screen.getByText(/2\/5/)).toBeInTheDocument();
    });
  });

  describe('favorite toggle', () => {
    it('shows star buttons in expanded language group', () => {
      renderBrowser();

      fireEvent.click(screen.getByText('English'));

      // Star buttons should be present (empty stars since no favorites)
      const emptyStars = screen.getAllByText('\u2606'); // empty star
      expect(emptyStars.length).toBeGreaterThanOrEqual(1);
    });

    it('calls addFavorite when clicking empty star', () => {
      renderBrowser();

      fireEvent.click(screen.getByText('English'));

      // Click the first empty star (for engKJV)
      const emptyStars = screen.getAllByText('\u2606');
      fireEvent.click(emptyStars[0]);

      expect(mockAddFavorite).toHaveBeenCalled();
    });

    it('calls removeFavorite when clicking filled star', () => {
      // Mock favoriteTranslations to include engKJV
      const { useLanguageStore } = require('@/stores/languageStore');
      useLanguageStore.mockImplementation(() => ({
        locale: 'ko' as const,
        favoriteTranslations: ['engKJV'],
        addFavorite: mockAddFavorite,
        removeFavorite: mockRemoveFavorite,
        hydrate: mockHydrate,
      }));

      renderBrowser();

      fireEvent.click(screen.getByText('English'));

      // The filled star for engKJV
      const filledStar = screen.getByText('\u2605'); // filled star
      fireEvent.click(filledStar);

      expect(mockRemoveFavorite).toHaveBeenCalledWith('engKJV');
    });
  });

  describe('favorites section', () => {
    it('shows favorites section when there are favorites and no search query', () => {
      const { useLanguageStore } = require('@/stores/languageStore');
      useLanguageStore.mockImplementation(() => ({
        locale: 'ko' as const,
        favoriteTranslations: ['engKJV'],
        addFavorite: mockAddFavorite,
        removeFavorite: mockRemoveFavorite,
        hydrate: mockHydrate,
      }));

      renderBrowser();

      expect(screen.getByText('즐겨찾기')).toBeInTheDocument();
    });
  });

  describe('hydration', () => {
    it('calls hydrate on mount', () => {
      renderBrowser();
      expect(mockHydrate).toHaveBeenCalled();
    });
  });
});
