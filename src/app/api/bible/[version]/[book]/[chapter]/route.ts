import { NextRequest } from 'next/server';
import { getChapter } from '@/lib/bible-api';
import { BIBLE_BOOKS } from '@/lib/constants';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ version: string; book: string; chapter: string }> }
) {
  const { version, book, chapter } = await params;
  const chapterNum = parseInt(chapter, 10);

  if (isNaN(chapterNum) || chapterNum < 1) {
    return apiError('INVALID_CHAPTER', '유효하지 않은 장 번호입니다.', 400);
  }

  const bookId = parseInt(book, 10);
  const bookInfo = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!bookInfo) {
    return apiError('BOOK_NOT_FOUND', '해당 책을 찾을 수 없습니다.', 404);
  }

  try {
    const data = await getChapter(version, bookInfo.name, chapterNum);

    const verses = (data.verses || []).map((v) => ({
      verse: v.number,
      text: v.text,
    }));

    return apiSuccess(
      {
        version,
        bookId: bookInfo.id,
        bookName: bookInfo.nameKo,
        chapter: chapterNum,
        verses,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      },
    );
  } catch (error) {
    console.error('Bible API error:', error);
    return apiError('FETCH_FAILED', '성경 데이터를 불러오는 데 실패했습니다.', 500);
  }
}
