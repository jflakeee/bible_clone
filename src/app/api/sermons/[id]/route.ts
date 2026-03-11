import { NextRequest } from 'next/server';
import { getSermonById, getRelatedSermons } from '@/lib/sermon-service';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const sermon = getSermonById(id);

  if (!sermon) {
    return apiError('NOT_FOUND', '설교를 찾을 수 없습니다.', 404);
  }

  const related = getRelatedSermons(id);

  return apiSuccess({
    sermon,
    related,
  });
}
