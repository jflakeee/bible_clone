import { NextRequest } from 'next/server';
import { getStrongsEntry } from '@/lib/strongs-api';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;

  if (!/^[HhGg]\d+$/.test(number)) {
    return apiError(
      'INVALID_FORMAT',
      "유효하지 않은 Strong's 번호입니다. H1234 또는 G5678 형식을 사용하세요.",
      400,
    );
  }

  try {
    const entry = await getStrongsEntry(number);

    if (!entry) {
      return apiError(
        'NOT_FOUND',
        `Strong's 항목 ${number.toUpperCase()}을(를) 찾을 수 없습니다.`,
        404,
      );
    }

    return apiSuccess(entry, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error("Strong's lookup error:", error);
    return apiError('FETCH_FAILED', "Strong's 데이터를 불러오는 데 실패했습니다.", 500);
  }
}
