import { NextRequest } from 'next/server';
import { getChapter } from '@/lib/bible-api';
import { BIBLE_BOOKS, SUPPORTED_VERSIONS } from '@/lib/constants';
import { CompareResult } from '@/types/bible';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bookId = parseInt(searchParams.get('book') || '1', 10);
  const chapter = parseInt(searchParams.get('chapter') || '1', 10);
  const verseStart = parseInt(searchParams.get('verseStart') || '1', 10);
  const verseEnd = parseInt(searchParams.get('verseEnd') || '5', 10);
  const versionsParam = searchParams.get('versions') || 'krv,kjv';
  const versionIds = versionsParam.split(',').filter(Boolean);

  // Validate book
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) {
    return apiError('INVALID_BOOK', '유효하지 않은 책 ID입니다.', 400);
  }

  // Validate versions
  const validVersions = versionIds.filter((v) =>
    SUPPORTED_VERSIONS.some((sv) => sv.id === v)
  );
  if (validVersions.length === 0) {
    return apiError('INVALID_VERSIONS', '유효한 번역본이 지정되지 않았습니다.', 400);
  }

  try {
    // Fetch all versions in parallel
    const chapterResults = await Promise.all(
      validVersions.map(async (version) => {
        try {
          const data = await getChapter(version, book.name, chapter);
          return { version, verses: data.verses || [] };
        } catch {
          return { version, verses: [] };
        }
      })
    );

    // Build compare results for the requested verse range
    const results: CompareResult[] = [];
    for (let v = verseStart; v <= verseEnd; v++) {
      const versionTexts = validVersions.map((version) => {
        const chapterData = chapterResults.find((c) => c.version === version);
        const verse = chapterData?.verses.find(
          (vr) => vr.number === v
        );
        const versionInfo = SUPPORTED_VERSIONS.find((sv) => sv.id === version);
        return {
          abbreviation: versionInfo?.id || version,
          text: verse?.text || '',
        };
      });

      results.push({
        verse: v,
        versions: versionTexts,
      });
    }

    return apiSuccess({ results });
  } catch {
    return apiError('FETCH_FAILED', '비교 데이터를 불러오는 데 실패했습니다.', 500);
  }
}
