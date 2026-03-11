import { NextRequest } from 'next/server';
import { getOriginalText, getLanguageForBook } from '@/lib/original-text-api';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ book: string; chapter: string }> }
) {
  const { book: bookStr, chapter: chapterStr } = await params;

  const book = parseInt(bookStr, 10);
  const chapter = parseInt(chapterStr, 10);

  if (isNaN(book) || book < 1 || book > 66) {
    return apiError(
      'INVALID_BOOK',
      '유효하지 않은 책 번호입니다. 1~66 사이여야 합니다.',
      400,
    );
  }

  if (isNaN(chapter) || chapter < 1) {
    return apiError('INVALID_CHAPTER', '유효하지 않은 장 번호입니다.', 400);
  }

  try {
    const verses = await getOriginalText(book, chapter);
    const language = getLanguageForBook(book);

    return apiSuccess(
      { book, chapter, language, verses },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      },
    );
  } catch (error) {
    console.error('Original text fetch error:', error);
    return apiError('FETCH_FAILED', '원문 데이터를 불러오는 데 실패했습니다.', 500);
  }
}
