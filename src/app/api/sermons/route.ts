import { NextRequest } from 'next/server';
import {
  searchSermons,
  getSermonsByTag,
  getAllTags,
  SAMPLE_SERMONS,
} from '@/lib/sermon-service';
import { SermonSearchResult } from '@/types/sermon';
import { apiSuccess } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const tag = searchParams.get('tag') || '';
  const verse = searchParams.get('verse') || '';

  let results: SermonSearchResult[] = [];

  if (query || verse) {
    // Combine query and verse for search
    const searchTerm = [query, verse].filter(Boolean).join(' ');
    results = searchSermons(searchTerm);
  }

  // Filter by tag if specified
  if (tag) {
    const tagSermons = getSermonsByTag(tag);
    const tagSermonIds = new Set(tagSermons.map((s) => s.id));

    if (results.length > 0) {
      // Intersect with existing results
      results = results.filter((r) => tagSermonIds.has(r.sermon.id));
    } else {
      // Tag-only search
      results = tagSermons.map((sermon) => ({
        sermon,
        relevanceScore: 7,
        matchedVerses: [],
      }));
    }
  }

  // If no search criteria, return all sermons
  if (!query && !tag && !verse) {
    results = SAMPLE_SERMONS.map((sermon) => ({
      sermon,
      relevanceScore: 0,
      matchedVerses: [],
    }));
  }

  return apiSuccess({
    results,
    tags: getAllTags(),
    total: results.length,
  });
}
