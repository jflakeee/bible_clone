import { VERSION_MAP, BOOK_ID_MAP } from '@/lib/constants';

const API_BASE = process.env.NEXT_PUBLIC_BIBLE_API_BASE || 'https://bible.helloao.org/api';

export function getTranslationId(version: string): string {
  return VERSION_MAP[version.toLowerCase()] || version;
}

export function getBookApiId(bookName: string): string {
  return BOOK_ID_MAP[bookName] || bookName;
}

export interface ApiTranslation {
  id: string;
  name: string;
  language: string;
  shortName?: string;
  [key: string]: unknown;
}

export interface ApiBook {
  id: string;
  name: string;
  commonName?: string;
  numberOfChapters?: number;
  [key: string]: unknown;
}

export interface ParsedVerse {
  number: number;
  text: string;
}

export interface ApiChapterResponse {
  translation: { id: string; name: string; [key: string]: unknown };
  book: { id: string; name: string; [key: string]: unknown };
  chapter: number;
  verses: ParsedVerse[];
  [key: string]: unknown;
}

export async function getAvailableTranslations(): Promise<ApiTranslation[]> {
  const res = await fetch(`${API_BASE}/available_translations.json`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch translations: ${res.status}`);
  }
  const data = await res.json();
  return data.translations || data;
}

export async function getBooks(translationId: string): Promise<ApiBook[]> {
  const tid = getTranslationId(translationId);
  const res = await fetch(`${API_BASE}/${tid}/books.json`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch books for ${tid}: ${res.status}`);
  }
  const data = await res.json();
  return data.books || data;
}

// Parse the helloao API chapter content format into simple verse objects
function parseChapterContent(data: Record<string, unknown>): ParsedVerse[] {
  const verses: ParsedVerse[] = [];

  // helloao format: { chapter: { content: [ { type: "verse", number: 1, content: [...] }, ... ] } }
  const chapterObj = data.chapter as Record<string, unknown> | undefined;
  if (chapterObj && typeof chapterObj === 'object') {
    const content = chapterObj.content;
    if (Array.isArray(content)) {
      for (const item of content) {
        if (item && typeof item === 'object' && 'type' in item && item.type === 'verse') {
          const verseNum = (item as Record<string, unknown>).number as number;
          const verseContent = (item as Record<string, unknown>).content;
          let text = '';
          if (Array.isArray(verseContent)) {
            text = verseContent
              .map((part: unknown) => {
                if (typeof part === 'string') return part;
                if (part && typeof part === 'object' && 'text' in (part as Record<string, unknown>)) {
                  return (part as Record<string, string>).text;
                }
                return '';
              })
              .join('');
          } else if (typeof verseContent === 'string') {
            text = verseContent;
          }
          if (verseNum && text) {
            verses.push({ number: verseNum, text: text.trim() });
          }
        }
      }
    }
  }

  // Fallback: try data.verses format
  if (verses.length === 0 && Array.isArray(data.verses)) {
    for (const v of data.verses as Array<{ number: number; text: string }>) {
      verses.push({ number: v.number, text: v.text });
    }
  }

  return verses.sort((a, b) => a.number - b.number);
}

export async function getChapter(
  translationId: string,
  book: string,
  chapter: number
): Promise<ApiChapterResponse> {
  const tid = getTranslationId(translationId);
  const bookId = getBookApiId(book);
  const url = `${API_BASE}/${tid}/${bookId}/${chapter}.json`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${tid}/${bookId}/${chapter}: ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('json')) {
    const text = await res.text();
    throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
  }

  const data = await res.json();
  const verses = parseChapterContent(data as Record<string, unknown>);

  return {
    ...data,
    verses,
  } as ApiChapterResponse;
}
