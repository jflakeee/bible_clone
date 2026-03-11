import { NextRequest } from 'next/server';
import {
  PROPER_NOUNS,
  searchProperNouns,
  getProperNounsByType,
  type ProperNoun,
} from '@/lib/proper-nouns';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const typeParam = searchParams.get('type');
  const query = searchParams.get('q');

  let results: ProperNoun[] = PROPER_NOUNS;

  // Filter by type
  if (typeParam) {
    const validTypes = ['person', 'place', 'object', 'title', 'tribe', 'nation'];
    if (validTypes.includes(typeParam)) {
      results = getProperNounsByType(typeParam as ProperNoun['type']);
    } else {
      return apiError(
        'INVALID_TYPE',
        '유효하지 않은 유형입니다. person, place, object, title, tribe, nation 중 하나여야 합니다.',
        400,
      );
    }
  }

  // Search by query
  if (query) {
    const searchResults = searchProperNouns(query);
    if (typeParam) {
      // Intersect type filter with search results
      const typeFilteredIds = new Set(results.map((r) => r.id));
      results = searchResults.filter((r) => typeFilteredIds.has(r.id));
    } else {
      results = searchResults;
    }
  }

  return apiSuccess({
    total: results.length,
    items: results,
  });
}
