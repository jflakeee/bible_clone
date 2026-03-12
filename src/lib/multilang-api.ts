// Multi-language Bible API service
// Extends bible-api.ts to support many more languages from bible.helloao.org

import { BIBLE_API_BASE as API_BASE } from '@/lib/constants';
import { getLanguageKo } from '@/lib/i18n';

export interface BibleTranslation {
  id: string;
  name: string;
  language: string;
  languageKo: string;
  languageCode: string;
  direction: 'ltr' | 'rtl';
}

export interface MultiLangChapterResponse {
  translation: { id: string; name: string };
  book: { id: string; name: string };
  chapter: number;
  verses: { number: number; text: string }[];
}

// Known RTL language codes
const RTL_LANGUAGES = new Set([
  'arb', 'ara', 'heb', 'fas', 'urd', 'prs', 'ps', 'yi', 'syr', 'div',
  'ar', 'he', 'fa', 'ur',
]);

function isRtlLanguage(languageCode: string): boolean {
  // Check both the full code and the first 2 chars
  return RTL_LANGUAGES.has(languageCode) || RTL_LANGUAGES.has(languageCode.substring(0, 2));
}

function extractLanguageCode(translationId: string): string {
  // Translation IDs are typically like "engKJV", "korHKJV", "araSVD"
  // Extract language prefix (first 3 lowercase chars typically)
  const match = translationId.match(/^([a-z]{2,3})/i);
  return match ? match[1].toLowerCase() : '';
}

// In-memory cache
let translationsCache: BibleTranslation[] | null = null;
let translationsCacheTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getAvailableTranslations(): Promise<BibleTranslation[]> {
  const now = Date.now();
  if (translationsCache && now - translationsCacheTime < CACHE_DURATION) {
    return translationsCache;
  }

  const res = await fetch(`${API_BASE}/available_translations.json`);

  if (!res.ok) {
    throw new Error(`Failed to fetch translations: ${res.status}`);
  }

  const data = await res.json();
  const rawTranslations = data.translations || data;

  const translations: BibleTranslation[] = rawTranslations.map(
    (t: { id?: string; name?: string; language?: string; [key: string]: unknown }) => {
      const id = t.id || '';
      const language = t.language || 'Unknown';
      const langCode = extractLanguageCode(id);

      return {
        id,
        name: t.name || id,
        language,
        languageKo: getLanguageKo(language),
        languageCode: langCode,
        direction: isRtlLanguage(langCode) ? 'rtl' as const : 'ltr' as const,
      };
    }
  );

  translationsCache = translations;
  translationsCacheTime = now;

  return translations;
}

export async function getTranslationsByLanguage(): Promise<Record<string, BibleTranslation[]>> {
  const translations = await getAvailableTranslations();
  const grouped: Record<string, BibleTranslation[]> = {};

  for (const t of translations) {
    const lang = t.language || 'Unknown';
    if (!grouped[lang]) {
      grouped[lang] = [];
    }
    grouped[lang].push(t);
  }

  // Sort each language's translations by name
  for (const lang of Object.keys(grouped)) {
    grouped[lang].sort((a, b) => a.name.localeCompare(b.name));
  }

  return grouped;
}

export async function getChapterInLanguage(
  translationId: string,
  book: string,
  chapter: number
): Promise<MultiLangChapterResponse> {
  const res = await fetch(`${API_BASE}/${translationId}/${book}/${chapter}.json`);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch ${translationId}/${book}/${chapter}: ${res.status}`
    );
  }

  const data = await res.json();
  return data as MultiLangChapterResponse;
}
