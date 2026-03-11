'use client';

import { useState, useEffect, useMemo } from 'react';
import type { BibleTranslation } from '@/lib/multilang-api';
import { useLanguageStore } from '@/stores/languageStore';
import { t } from '@/lib/i18n';

interface TranslationBrowserProps {
  translations: Record<string, BibleTranslation[]>;
  selectedIds: string[];
  maxSelections?: number;
  onSelect: (translation: BibleTranslation) => void;
  onDeselect: (translationId: string) => void;
}

export default function TranslationBrowser({
  translations,
  selectedIds,
  maxSelections = 5,
  onSelect,
  onDeselect,
}: TranslationBrowserProps) {
  const { locale, favoriteTranslations, addFavorite, removeFavorite, hydrate } =
    useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLanguages, setExpandedLanguages] = useState<Set<string>>(new Set());

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Sort languages: favorites first, then alphabetical
  const sortedLanguages = useMemo(() => {
    const langs = Object.keys(translations).sort((a, b) => a.localeCompare(b));
    return langs;
  }, [translations]);

  // Filter languages and translations by search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return sortedLanguages;

    const query = searchQuery.toLowerCase();
    return sortedLanguages.filter((lang) => {
      // Match language name
      if (lang.toLowerCase().includes(query)) return true;
      // Check if any translation in this language matches
      const langTranslations = translations[lang] || [];
      return langTranslations.some(
        (tr) =>
          tr.name.toLowerCase().includes(query) ||
          tr.id.toLowerCase().includes(query) ||
          tr.languageKo.toLowerCase().includes(query)
      );
    });
  }, [sortedLanguages, searchQuery, translations]);

  const toggleLanguage = (lang: string) => {
    setExpandedLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) {
        next.delete(lang);
      } else {
        next.add(lang);
      }
      return next;
    });
  };

  const handleToggleSelect = (tr: BibleTranslation) => {
    if (selectedIds.includes(tr.id)) {
      onDeselect(tr.id);
    } else if (selectedIds.length < maxSelections) {
      onSelect(tr);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, translationId: string) => {
    e.stopPropagation();
    if (favoriteTranslations.includes(translationId)) {
      removeFavorite(translationId);
    } else {
      addFavorite(translationId);
    }
  };

  // Favorite translations section
  const favoriteItems = useMemo(() => {
    const allTranslations = Object.values(translations).flat();
    return favoriteTranslations
      .map((id) => allTranslations.find((tr) => tr.id === id))
      .filter((tr): tr is BibleTranslation => tr !== undefined);
  }, [favoriteTranslations, translations]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchLanguage', locale)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            &#x2715;
          </button>
        )}
      </div>

      {/* Selection info */}
      {selectedIds.length > 0 && (
        <div className="text-sm text-gray-500">
          {t('selectedTranslations', locale)}: {selectedIds.length}/{maxSelections}
        </div>
      )}

      {/* Favorites section */}
      {favoriteItems.length > 0 && !searchQuery && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">
            {t('favorites', locale)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {favoriteItems.map((tr) => (
              <button
                key={tr.id}
                onClick={() => handleToggleSelect(tr)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
                  selectedIds.includes(tr.id)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {tr.direction === 'rtl' && (
                  <span className="text-[10px] text-orange-500 font-mono">RTL</span>
                )}
                <span>{tr.name}</span>
                <span className="text-[10px] opacity-60">({tr.language})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Languages list */}
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
        {filteredLanguages.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            {t('noResults', locale)}
          </div>
        ) : (
          filteredLanguages.map((lang) => {
            const langTranslations = translations[lang] || [];
            const isExpanded = expandedLanguages.has(lang);
            const koName = langTranslations[0]?.languageKo || lang;

            return (
              <div key={lang}>
                {/* Language header */}
                <button
                  onClick={() => toggleLanguage(lang)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    >
                      &#9654;
                    </span>
                    <span className="font-medium text-gray-900">{lang}</span>
                    {koName !== lang && (
                      <span className="text-sm text-gray-500">({koName})</span>
                    )}
                    {langTranslations[0]?.direction === 'rtl' && (
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-mono">
                        RTL
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {langTranslations.length} {t('translationsCount', locale)}
                  </span>
                </button>

                {/* Translation list */}
                {isExpanded && (
                  <div className="bg-gray-50 px-4 py-2 space-y-1">
                    {langTranslations.map((tr) => (
                      <div
                        key={tr.id}
                        className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white transition-colors"
                      >
                        <button
                          onClick={() => handleToggleSelect(tr)}
                          disabled={
                            !selectedIds.includes(tr.id) &&
                            selectedIds.length >= maxSelections
                          }
                          className={`flex-1 text-left text-sm transition-colors ${
                            selectedIds.includes(tr.id)
                              ? 'text-blue-700 font-medium'
                              : selectedIds.length >= maxSelections
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:text-blue-600'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                                selectedIds.includes(tr.id)
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedIds.includes(tr.id) && '\u2713'}
                            </span>
                            <span>{tr.name}</span>
                            <span className="text-xs text-gray-400">({tr.id})</span>
                          </span>
                        </button>
                        <button
                          onClick={(e) => handleToggleFavorite(e, tr.id)}
                          className="text-lg px-1 hover:scale-110 transition-transform"
                          title={
                            favoriteTranslations.includes(tr.id)
                              ? t('removeFromFavorites', locale)
                              : t('addToFavorites', locale)
                          }
                        >
                          {favoriteTranslations.includes(tr.id) ? (
                            <span className="text-amber-500">&#9733;</span>
                          ) : (
                            <span className="text-gray-300 hover:text-amber-400">&#9734;</span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
