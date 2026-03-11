import { getTranslationsByLanguage } from '@/lib/multilang-api';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET() {
  try {
    const translationsByLanguage = await getTranslationsByLanguage();

    return apiSuccess(
      { translations: translationsByLanguage },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return apiError('FETCH_FAILED', message, 500);
  }
}
