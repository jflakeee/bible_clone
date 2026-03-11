import { NextRequest } from 'next/server';
import { getChapter } from '@/lib/bible-api';
import { BIBLE_BOOKS } from '@/lib/constants';
import { SearchResult } from '@/types/bible';
import { apiSuccess } from '@/lib/api-utils';

const MAX_RESULTS = 50;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const version = searchParams.get('version') || 'krv';
  const testament = searchParams.get('testament') || 'all';

  if (!query.trim()) {
    return apiSuccess({ results: [] });
  }

  const queryLower = query.toLowerCase();

  // Filter books by testament
  let books = BIBLE_BOOKS;
  if (testament === 'ot') {
    books = books.filter((b) => b.testament === 'OT');
  } else if (testament === 'nt') {
    books = books.filter((b) => b.testament === 'NT');
  }

  const results: SearchResult[] = [];

  // Search through books and chapters
  // To keep it manageable, we search chapter by chapter and stop at MAX_RESULTS
  for (const book of books) {
    if (results.length >= MAX_RESULTS) break;

    for (let ch = 1; ch <= book.chapters; ch++) {
      if (results.length >= MAX_RESULTS) break;

      try {
        const chapterData = await getChapter(version, book.abbreviation, ch);
        const verses = chapterData.verses || [];

        for (const verse of verses) {
          if (results.length >= MAX_RESULTS) break;

          const textLower = verse.text.toLowerCase();
          if (textLower.includes(queryLower)) {
            // Create highlight: wrap matching text in <mark> tags
            const idx = textLower.indexOf(queryLower);
            const matchedText = verse.text.substring(idx, idx + query.length);
            const highlight = verse.text.replace(
              new RegExp(escapeRegExp(matchedText), 'gi'),
              `<mark>${matchedText}</mark>`
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
        // Skip chapters that fail to load
        continue;
      }
    }
  }

  return apiSuccess({ results });
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
