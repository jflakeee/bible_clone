import { NextRequest } from 'next/server';
import { BIBLICAL_PLACES } from '@/lib/map-data';
import { BIBLE_BOOKS } from '@/lib/constants';
import { apiSuccess } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const testament = searchParams.get('testament');
  const query = searchParams.get('q');

  let places = BIBLICAL_PLACES;

  // Filter by type
  if (type && type !== 'all') {
    places = places.filter((p) => p.type === type);
  }

  // Filter by testament
  if (testament && testament !== 'all') {
    const bookIds = BIBLE_BOOKS
      .filter((b) => b.testament === testament)
      .map((b) => b.id);

    places = places.filter((p) =>
      p.books.some((bookId) => bookIds.includes(bookId))
    );
  }

  // Filter by search query
  if (query) {
    const q = query.toLowerCase();
    places = places.filter(
      (p) =>
        p.nameKo.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q)
    );
  }

  return apiSuccess(places);
}
