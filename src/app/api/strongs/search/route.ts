import { NextRequest } from 'next/server';
import { searchStrongs } from '@/lib/strongs-api';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || !query.trim()) {
    return apiError('MISSING_QUERY', '검색어 파라미터 "q"가 필요합니다.', 400);
  }

  try {
    const results = await searchStrongs(query.trim(), 50);

    return apiSuccess(results, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error("Strong's search error:", error);
    return apiError('FETCH_FAILED', "Strong's 검색에 실패했습니다.", 500);
  }
}
