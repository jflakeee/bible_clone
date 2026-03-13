/**
 * Client-side API service
 *
 * Replaces all /api/ server routes with direct client-side calls
 * to external APIs and local static data.
 */

import { BIBLE_BOOKS, SUPPORTED_VERSIONS } from '@/lib/constants';
import { getChapter, getTranslationId, getBookApiId } from '@/lib/bible-api';
import { getTranslationsByLanguage } from '@/lib/multilang-api';
import { getOriginalText, getOriginalLanguage } from '@/lib/original-text-api';
import { getStrongsEntry, searchStrongs } from '@/lib/strongs-api';
import { BIBLICAL_PLACES } from '@/lib/map-data';
import {
  PROPER_NOUNS,
  searchProperNouns,
  getProperNounsByType,
  type ProperNoun,
} from '@/lib/proper-nouns';
import {
  searchSermons,
  getSermonsByTag,
  getSermonById,
  getRelatedSermons,
  getRecommendedSermons,
  getAllTags,
  SAMPLE_SERMONS,
} from '@/lib/sermon-service';
import type { CompareResult, SearchResult, StrongsEntry } from '@/types/bible';
import type { SermonSearchResult } from '@/types/sermon';

// ========================
// Bible Chapter
// ========================

export async function fetchBibleChapter(
  version: string,
  bookId: number,
  chapter: number,
): Promise<{
  version: string;
  bookId: number;
  bookName: string;
  chapter: number;
  verses: { verse: number; text: string }[];
}> {
  const bookInfo = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!bookInfo) {
    throw new Error('해당 책을 찾을 수 없습니다.');
  }

  const data = await getChapter(version, bookInfo.name, chapter);
  const verses = (data.verses || []).map((v) => ({
    verse: v.number,
    text: v.text,
  }));

  return {
    version,
    bookId: bookInfo.id,
    bookName: bookInfo.nameKo,
    chapter,
    verses,
  };
}

// ========================
// Bible Compare
// ========================

export async function fetchBibleCompare(params: {
  book: number;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  versions: string[];
  includeOriginal?: boolean;
}): Promise<{ results: CompareResult[] }> {
  const { book: bookId, chapter, verseStart, verseEnd, versions: versionIds, includeOriginal } = params;

  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) {
    throw new Error('유효하지 않은 책 ID입니다.');
  }

  const validVersions = versionIds.filter((v) =>
    SUPPORTED_VERSIONS.some((sv) => sv.id === v),
  );
  if (validVersions.length === 0) {
    throw new Error('유효한 번역본이 지정되지 않았습니다.');
  }

  // Fetch translations and optionally original text in parallel
  const [chapterResults, originalVerses] = await Promise.all([
    Promise.all(
      validVersions.map(async (version) => {
        try {
          const data = await getChapter(version, book.name, chapter);
          return { version, verses: data.verses || [] };
        } catch {
          return { version, verses: [] };
        }
      }),
    ),
    includeOriginal
      ? getOriginalText(bookId, chapter).catch(() => [] as import('@/types/bible').VerseWord[][])
      : Promise.resolve([] as import('@/types/bible').VerseWord[][]),
  ]);

  const results: CompareResult[] = [];
  for (let v = verseStart; v <= verseEnd; v++) {
    const versionTexts = validVersions.map((version) => {
      const chapterData = chapterResults.find((c) => c.version === version);
      const verse = chapterData?.verses.find((vr) => vr.number === v);
      const versionInfo = SUPPORTED_VERSIONS.find((sv) => sv.id === version);
      return {
        abbreviation: versionInfo?.id || version,
        text: verse?.text || '',
      };
    });

    const result: CompareResult = {
      verse: v,
      versions: versionTexts,
    };

    // originalVerses is 0-indexed (verse 1 = index 0)
    if (includeOriginal && originalVerses.length > 0) {
      const words = originalVerses[v - 1];
      if (words && words.length > 0) {
        result.originalWords = words;
      }
    }

    results.push(result);
  }

  return { results };
}

// ========================
// Bible Versions
// ========================

export function fetchBibleVersions() {
  return { versions: SUPPORTED_VERSIONS };
}

// ========================
// Bible Translations (multilang)
// ========================

export async function fetchBibleTranslations() {
  const translations = await getTranslationsByLanguage();
  return { translations };
}

// ========================
// Original Text
// ========================

export async function fetchOriginalText(book: number, chapter: number) {
  if (isNaN(book) || book < 1 || book > 66) {
    throw new Error('유효하지 않은 책 번호입니다. 1~66 사이여야 합니다.');
  }

  if (isNaN(chapter) || chapter < 1) {
    throw new Error('유효하지 않은 장 번호입니다.');
  }

  const verses = await getOriginalText(book, chapter);
  const language = getOriginalLanguage(book);

  return { book, chapter, language, verses };
}

// ========================
// Search
// ========================

const MAX_SEARCH_RESULTS = 50;

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function fetchSearch(params: {
  q: string;
  version?: string;
  testament?: string;
}): Promise<{ results: SearchResult[] }> {
  const { q: query, version = 'krv', testament = 'all' } = params;

  if (!query.trim()) {
    return { results: [] };
  }

  const queryLower = query.toLowerCase();

  let books = BIBLE_BOOKS;
  if (testament === 'ot') {
    books = books.filter((b) => b.testament === 'OT');
  } else if (testament === 'nt') {
    books = books.filter((b) => b.testament === 'NT');
  }

  const results: SearchResult[] = [];

  for (const book of books) {
    if (results.length >= MAX_SEARCH_RESULTS) break;

    for (let ch = 1; ch <= book.chapters; ch++) {
      if (results.length >= MAX_SEARCH_RESULTS) break;

      try {
        const chapterData = await getChapter(version, book.abbreviation, ch);
        const verses = chapterData.verses || [];

        for (const verse of verses) {
          if (results.length >= MAX_SEARCH_RESULTS) break;

          const textLower = verse.text.toLowerCase();
          if (textLower.includes(queryLower)) {
            const idx = textLower.indexOf(queryLower);
            const matchedText = verse.text.substring(idx, idx + query.length);
            const highlight = verse.text.replace(
              new RegExp(escapeRegExp(matchedText), 'gi'),
              `<mark>${matchedText}</mark>`,
            );

            results.push({
              version,
              bookName: book.nameKo,
              chapter: ch,
              verse: verse.number,
              text: verse.text,
              highlight,
            });
          }
        }
      } catch {
        continue;
      }
    }
  }

  return { results };
}

// ========================
// Strong's
// ========================

export async function fetchStrongsEntry(number: string): Promise<StrongsEntry | null> {
  if (!/^[HhGg]\d+$/.test(number)) {
    throw new Error("유효하지 않은 Strong's 번호입니다. H1234 또는 G5678 형식을 사용하세요.");
  }

  return getStrongsEntry(number);
}

export async function fetchStrongsSearch(query: string): Promise<StrongsEntry[]> {
  if (!query || !query.trim()) {
    throw new Error('검색어가 필요합니다.');
  }

  return searchStrongs(query.trim(), 50);
}

// ========================
// Map Places
// ========================

export function fetchMapPlaces(params?: {
  type?: string;
  testament?: string;
  q?: string;
}) {
  let places = BIBLICAL_PLACES;

  if (params?.type && params.type !== 'all') {
    places = places.filter((p) => p.type === params.type);
  }

  if (params?.testament && params.testament !== 'all') {
    const bookIds = BIBLE_BOOKS
      .filter((b) => b.testament === params.testament)
      .map((b) => b.id);

    places = places.filter((p) =>
      p.books.some((bookId) => bookIds.includes(bookId)),
    );
  }

  if (params?.q) {
    const q = params.q.toLowerCase();
    places = places.filter(
      (p) =>
        p.nameKo.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q),
    );
  }

  return places;
}

// ========================
// Proper Nouns
// ========================

export function fetchProperNouns(params?: {
  type?: string;
  q?: string;
}): { total: number; items: ProperNoun[] } {
  let results: ProperNoun[] = PROPER_NOUNS;

  if (params?.type) {
    const validTypes = ['person', 'place', 'object', 'title', 'tribe', 'nation'];
    if (validTypes.includes(params.type)) {
      results = getProperNounsByType(params.type as ProperNoun['type']);
    }
  }

  if (params?.q) {
    const searchResults = searchProperNouns(params.q);
    if (params?.type) {
      const typeFilteredIds = new Set(results.map((r) => r.id));
      results = searchResults.filter((r) => typeFilteredIds.has(r.id));
    } else {
      results = searchResults;
    }
  }

  return {
    total: results.length,
    items: results,
  };
}

// ========================
// Sermons
// ========================

export function fetchSermons(params?: {
  q?: string;
  tag?: string;
  verse?: string;
}): {
  results: SermonSearchResult[];
  tags: string[];
  total: number;
} {
  const query = params?.q || '';
  const tag = params?.tag || '';
  const verse = params?.verse || '';

  let results: SermonSearchResult[] = [];

  if (query || verse) {
    const searchTerm = [query, verse].filter(Boolean).join(' ');
    results = searchSermons(searchTerm);
  }

  if (tag) {
    const tagSermons = getSermonsByTag(tag);
    const tagSermonIds = new Set(tagSermons.map((s) => s.id));

    if (results.length > 0) {
      results = results.filter((r) => tagSermonIds.has(r.sermon.id));
    } else {
      results = tagSermons.map((sermon) => ({
        sermon,
        relevanceScore: 7,
        matchedVerses: [],
      }));
    }
  }

  if (!query && !tag && !verse) {
    results = SAMPLE_SERMONS.map((sermon) => ({
      sermon,
      relevanceScore: 0,
      matchedVerses: [],
    }));
  }

  return {
    results,
    tags: getAllTags(),
    total: results.length,
  };
}

export function fetchSermonById(id: string) {
  const sermon = getSermonById(id);
  if (!sermon) {
    throw new Error('설교를 찾을 수 없습니다.');
  }

  const related = getRelatedSermons(id);
  return { sermon, related };
}

export function fetchSermonRecommendations(verses: string[]) {
  const sermons = getRecommendedSermons(verses);
  return { sermons, total: sermons.length };
}
