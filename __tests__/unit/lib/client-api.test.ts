import {
  fetchBibleChapter,
  fetchBibleCompare,
  fetchBibleVersions,
  fetchBibleTranslations,
  fetchOriginalText,
  fetchSearch,
  fetchStrongsEntry,
  fetchStrongsSearch,
  fetchMapPlaces,
  fetchProperNouns,
  fetchSermons,
  fetchSermonById,
  fetchSermonRecommendations,
} from '@/lib/client-api';

// ── Mocks ──

jest.mock('@/lib/bible-api', () => ({
  getChapter: jest.fn(),
  getTranslationId: jest.fn((v: string) => v),
  getBookApiId: jest.fn((b: string) => b),
}));

jest.mock('@/lib/multilang-api', () => ({
  getTranslationsByLanguage: jest.fn(),
}));

jest.mock('@/lib/original-text-api', () => ({
  getOriginalText: jest.fn(),
  getLanguageForBook: jest.fn((id: number) => (id >= 40 ? 'greek' : 'hebrew')),
}));

jest.mock('@/lib/strongs-api', () => ({
  getStrongsEntry: jest.fn(),
  searchStrongs: jest.fn(),
}));

// map-data, proper-nouns, sermon-service are NOT mocked — they are pure local data modules

import { getChapter } from '@/lib/bible-api';
import { getTranslationsByLanguage } from '@/lib/multilang-api';
import { getOriginalText } from '@/lib/original-text-api';
import { getStrongsEntry, searchStrongs } from '@/lib/strongs-api';
import { SUPPORTED_VERSIONS } from '@/lib/constants';
import { BIBLICAL_PLACES } from '@/lib/map-data';
import { PROPER_NOUNS } from '@/lib/proper-nouns';
import { SAMPLE_SERMONS } from '@/lib/sermon-service';

const mockGetChapter = getChapter as jest.MockedFunction<typeof getChapter>;
const mockGetTranslationsByLanguage = getTranslationsByLanguage as jest.MockedFunction<typeof getTranslationsByLanguage>;
const mockGetOriginalText = getOriginalText as jest.MockedFunction<typeof getOriginalText>;
const mockGetStrongsEntry = getStrongsEntry as jest.MockedFunction<typeof getStrongsEntry>;
const mockSearchStrongs = searchStrongs as jest.MockedFunction<typeof searchStrongs>;

beforeEach(() => {
  jest.clearAllMocks();
});

// ========================
// fetchBibleChapter
// ========================

describe('fetchBibleChapter', () => {
  it('returns verses for a valid book', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: 'In the beginning God created the heavens and the earth.' },
        { number: 2, text: 'And the earth was without form.' },
      ],
    } as any);

    const result = await fetchBibleChapter('krv', 1, 1);

    expect(mockGetChapter).toHaveBeenCalledWith('krv', 'Genesis', 1);
    expect(result.version).toBe('krv');
    expect(result.bookId).toBe(1);
    expect(result.bookName).toBe('창세기');
    expect(result.chapter).toBe(1);
    expect(result.verses).toHaveLength(2);
    expect(result.verses[0]).toEqual({ verse: 1, text: 'In the beginning God created the heavens and the earth.' });
  });

  it('throws for invalid book id', async () => {
    await expect(fetchBibleChapter('krv', 999, 1)).rejects.toThrow('해당 책을 찾을 수 없습니다.');
  });

  it('returns empty verses when API returns no verses', async () => {
    mockGetChapter.mockResolvedValue({ verses: [] } as any);

    const result = await fetchBibleChapter('krv', 1, 1);
    expect(result.verses).toEqual([]);
  });
});

// ========================
// fetchBibleCompare
// ========================

describe('fetchBibleCompare', () => {
  it('returns CompareResult[] for multiple versions', async () => {
    mockGetChapter.mockImplementation(async (version: string) => {
      if (version === 'krv') {
        return { verses: [{ number: 1, text: '태초에 하나님이 천지를 창조하시니라' }] } as any;
      }
      return { verses: [{ number: 1, text: 'In the beginning God created the heaven and the earth.' }] } as any;
    });

    const result = await fetchBibleCompare({
      book: 1,
      chapter: 1,
      verseStart: 1,
      verseEnd: 1,
      versions: ['krv', 'kjv'],
    });

    expect(result.results).toHaveLength(1);
    expect(result.results[0].verse).toBe(1);
    expect(result.results[0].versions).toHaveLength(2);
    expect(result.results[0].versions[0].abbreviation).toBe('krv');
    expect(result.results[0].versions[1].abbreviation).toBe('kjv');
  });

  it('throws for invalid book id', async () => {
    await expect(
      fetchBibleCompare({ book: 999, chapter: 1, verseStart: 1, verseEnd: 1, versions: ['krv'] }),
    ).rejects.toThrow('유효하지 않은 책 ID입니다.');
  });

  it('throws when no valid versions provided', async () => {
    await expect(
      fetchBibleCompare({ book: 1, chapter: 1, verseStart: 1, verseEnd: 1, versions: ['invalid'] }),
    ).rejects.toThrow('유효한 번역본이 지정되지 않았습니다.');
  });

  it('handles API errors gracefully per version', async () => {
    mockGetChapter.mockImplementation(async (version: string) => {
      if (version === 'krv') throw new Error('API error');
      return { verses: [{ number: 1, text: 'Test' }] } as any;
    });

    const result = await fetchBibleCompare({
      book: 1,
      chapter: 1,
      verseStart: 1,
      verseEnd: 1,
      versions: ['krv', 'kjv'],
    });

    expect(result.results[0].versions[0].text).toBe('');
    expect(result.results[0].versions[1].text).toBe('Test');
  });
});

// ========================
// fetchBibleVersions
// ========================

describe('fetchBibleVersions', () => {
  it('returns SUPPORTED_VERSIONS', () => {
    const result = fetchBibleVersions();
    expect(result.versions).toBe(SUPPORTED_VERSIONS);
    expect(result.versions.length).toBeGreaterThanOrEqual(3);
  });
});

// ========================
// fetchBibleTranslations
// ========================

describe('fetchBibleTranslations', () => {
  it('returns translations grouped by language', async () => {
    const mockTranslations = {
      Korean: [{ id: 'krv', name: '개역한글', language: 'Korean' }],
      English: [{ id: 'kjv', name: 'KJV', language: 'English' }],
    };
    mockGetTranslationsByLanguage.mockResolvedValue(mockTranslations);

    const result = await fetchBibleTranslations();
    expect(result.translations).toEqual(mockTranslations);
    expect(mockGetTranslationsByLanguage).toHaveBeenCalledTimes(1);
  });
});

// ========================
// fetchOriginalText
// ========================

describe('fetchOriginalText', () => {
  it('returns original text with language for OT book', async () => {
    const mockVerses = [[{ word: 'בְּרֵאשִׁית', strongsNumber: 'H7225', gloss: 'In the beginning' }]];
    mockGetOriginalText.mockResolvedValue(mockVerses);

    const result = await fetchOriginalText(1, 1);

    expect(result.book).toBe(1);
    expect(result.chapter).toBe(1);
    expect(result.language).toBe('hebrew');
    expect(result.verses).toBe(mockVerses);
  });

  it('returns greek for NT book', async () => {
    mockGetOriginalText.mockResolvedValue([]);

    const result = await fetchOriginalText(40, 1);
    expect(result.language).toBe('greek');
  });

  it('throws for invalid book number', async () => {
    await expect(fetchOriginalText(0, 1)).rejects.toThrow('유효하지 않은 책 번호입니다.');
    await expect(fetchOriginalText(67, 1)).rejects.toThrow('유효하지 않은 책 번호입니다.');
  });

  it('throws for invalid chapter number', async () => {
    await expect(fetchOriginalText(1, 0)).rejects.toThrow('유효하지 않은 장 번호입니다.');
  });
});

// ========================
// fetchSearch
// ========================

describe('fetchSearch', () => {
  it('returns matching verses with highlights', async () => {
    mockGetChapter.mockResolvedValue({
      verses: [
        { number: 1, text: 'God created the heavens and the earth.' },
        { number: 2, text: 'The earth was formless.' },
      ],
    } as any);

    const result = await fetchSearch({ q: 'earth' });

    // Should find verses containing "earth"
    const earthResults = result.results.filter((r) => r.text.toLowerCase().includes('earth'));
    expect(earthResults.length).toBeGreaterThan(0);
    expect(earthResults[0].highlight).toContain('<mark>');
  });

  it('returns empty results for empty query', async () => {
    const result = await fetchSearch({ q: '' });
    expect(result.results).toEqual([]);
  });

  it('returns empty results for whitespace query', async () => {
    const result = await fetchSearch({ q: '   ' });
    expect(result.results).toEqual([]);
  });
});

// ========================
// fetchStrongsEntry
// ========================

describe('fetchStrongsEntry', () => {
  it('returns a strongs entry for valid number', async () => {
    const mockEntry = {
      number: 'H7225',
      lemma: 'רֵאשִׁית',
      transliteration: 'reshith',
      pronunciation: 'ray-sheeth',
      definition: 'beginning, chief',
      shortDefinition: 'beginning',
      language: 'hebrew' as const,
    };
    mockGetStrongsEntry.mockResolvedValue(mockEntry);

    const result = await fetchStrongsEntry('H7225');
    expect(result).toEqual(mockEntry);
    expect(mockGetStrongsEntry).toHaveBeenCalledWith('H7225');
  });

  it('throws for invalid strongs number format', async () => {
    await expect(fetchStrongsEntry('invalid')).rejects.toThrow("유효하지 않은 Strong's 번호입니다.");
    await expect(fetchStrongsEntry('X123')).rejects.toThrow("유효하지 않은 Strong's 번호입니다.");
  });

  it('returns null when entry not found', async () => {
    mockGetStrongsEntry.mockResolvedValue(null);
    const result = await fetchStrongsEntry('H9999');
    expect(result).toBeNull();
  });
});

// ========================
// fetchStrongsSearch
// ========================

describe('fetchStrongsSearch', () => {
  it('returns matching strongs entries', async () => {
    const mockResults = [
      { number: 'H7225', lemma: 'רֵאשִׁית', transliteration: 'reshith', pronunciation: '', definition: 'beginning', shortDefinition: 'beginning', language: 'hebrew' as const },
    ];
    mockSearchStrongs.mockResolvedValue(mockResults);

    const result = await fetchStrongsSearch('beginning');
    expect(result).toEqual(mockResults);
    expect(mockSearchStrongs).toHaveBeenCalledWith('beginning', 50);
  });

  it('throws for empty query', async () => {
    await expect(fetchStrongsSearch('')).rejects.toThrow('검색어가 필요합니다.');
    await expect(fetchStrongsSearch('   ')).rejects.toThrow('검색어가 필요합니다.');
  });
});

// ========================
// fetchMapPlaces
// ========================

describe('fetchMapPlaces', () => {
  it('returns all places without params', () => {
    const result = fetchMapPlaces();
    expect(result).toEqual(BIBLICAL_PLACES);
    expect(result.length).toBeGreaterThan(0);
  });

  it('filters by type', () => {
    const result = fetchMapPlaces({ type: 'city' });
    expect(result.every((p) => p.type === 'city')).toBe(true);
  });

  it('returns all places when type is "all"', () => {
    const result = fetchMapPlaces({ type: 'all' });
    expect(result).toEqual(BIBLICAL_PLACES);
  });

  it('filters by search query', () => {
    const result = fetchMapPlaces({ q: 'jerusalem' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((p) => p.name.toLowerCase().includes('jerusalem'))).toBe(true);
  });
});

// ========================
// fetchProperNouns
// ========================

describe('fetchProperNouns', () => {
  it('returns all proper nouns without params', () => {
    const result = fetchProperNouns();
    expect(result.total).toBe(PROPER_NOUNS.length);
    expect(result.items).toEqual(PROPER_NOUNS);
  });

  it('filters by type', () => {
    const result = fetchProperNouns({ type: 'person' });
    expect(result.items.every((n) => n.type === 'person')).toBe(true);
    expect(result.total).toBe(result.items.length);
  });

  it('filters by search query', () => {
    const result = fetchProperNouns({ q: 'Abraham' });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.total).toBe(result.items.length);
  });

  it('filters by both type and query', () => {
    const result = fetchProperNouns({ type: 'person', q: 'Adam' });
    expect(result.items.every((n) => n.type === 'person')).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);
  });
});

// ========================
// fetchSermons
// ========================

describe('fetchSermons', () => {
  it('returns all sermons without params', () => {
    const result = fetchSermons();
    expect(result.results.length).toBe(SAMPLE_SERMONS.length);
    expect(result.tags.length).toBeGreaterThan(0);
    expect(result.total).toBe(SAMPLE_SERMONS.length);
  });

  it('searches sermons by query', () => {
    const result = fetchSermons({ q: '사랑' });
    expect(result.results.length).toBeGreaterThan(0);
  });

  it('filters sermons by tag', () => {
    const sampleTag = SAMPLE_SERMONS[0].tags[0];
    const result = fetchSermons({ tag: sampleTag });
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results.every((r) => r.sermon.tags.includes(sampleTag))).toBe(true);
  });
});

// ========================
// fetchSermonById
// ========================

describe('fetchSermonById', () => {
  it('returns sermon and related sermons', () => {
    const result = fetchSermonById('1');
    expect(result.sermon).toBeDefined();
    expect(result.sermon.id).toBe('1');
    expect(result.related).toBeDefined();
    expect(Array.isArray(result.related)).toBe(true);
  });

  it('throws for non-existent sermon', () => {
    expect(() => fetchSermonById('nonexistent')).toThrow('설교를 찾을 수 없습니다.');
  });
});

// ========================
// fetchSermonRecommendations
// ========================

describe('fetchSermonRecommendations', () => {
  it('returns recommendations for given verses', () => {
    const result = fetchSermonRecommendations(['Gen 1:1', 'John 3:16']);
    expect(result.sermons).toBeDefined();
    expect(Array.isArray(result.sermons)).toBe(true);
    expect(result.total).toBe(result.sermons.length);
  });

  it('returns default recommendations for empty verses', () => {
    const result = fetchSermonRecommendations([]);
    expect(result.sermons.length).toBeGreaterThan(0);
    expect(result.total).toBe(result.sermons.length);
  });
});
