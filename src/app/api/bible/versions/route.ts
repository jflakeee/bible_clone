import { SUPPORTED_VERSIONS } from '@/lib/constants';
import { apiSuccess } from '@/lib/api-utils';

export async function GET() {
  return apiSuccess(
    { versions: SUPPORTED_VERSIONS },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    },
  );
}
