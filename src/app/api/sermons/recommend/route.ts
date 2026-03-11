import { NextRequest } from 'next/server';
import { getRecommendedSermons } from '@/lib/sermon-service';
import { apiSuccess } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const versesParam = searchParams.get('verses') || '';

  const verses = versesParam
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  const sermons = getRecommendedSermons(verses);

  return apiSuccess({
    sermons,
    total: sermons.length,
  });
}
