import {
  getTranslationId,
  getBookApiId,
  getAvailableTranslations,
  getBooks,
  getChapter,
} from '@/lib/bible-api';
import { VERSION_MAP, BOOK_ID_MAP } from '@/lib/constants';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

// ─── getTranslationId ───

describe('getTranslationId', () => {
  it('maps "krv" to kor_old', () => {
    expect(getTranslationId('krv')).toBe('kor_old');
  });

  it('maps "kjv" to eng_kjv', () => {
    expect(getTranslationId('kjv')).toBe('eng_kjv');
  });

  it('maps "web" to ENGWEBP', () => {
    expect(getTranslationId('web')).toBe('ENGWEBP');
  });

  it('maps "bsb" to BSB', () => {
    expect(getTranslationId('bsb')).toBe('BSB');
  });

  it('is case-insensitive', () => {
    expect(getTranslationId('KRV')).toBe('kor_old');
    expect(getTranslationId('Web')).toBe('ENGWEBP');
  });

  it('returns the input as-is when no mapping exists', () => {
    expect(getTranslationId('unknown')).toBe('unknown');
  });
});

// ─── getBookApiId ───

describe('getBookApiId', () => {
  it('maps Genesis to GEN', () => {
    expect(getBookApiId('Genesis')).toBe('GEN');
  });

  it('maps Revelation to REV', () => {
    expect(getBookApiId('Revelation')).toBe('REV');
  });

  it('maps multi-word book names correctly', () => {
    expect(getBookApiId('1 Samuel')).toBe('1SA');
    expect(getBookApiId('Song of Solomon')).toBe('SNG');
    expect(getBookApiId('1 Corinthians')).toBe('1CO');
  });

  it('returns the input as-is when no mapping exists', () => {
    expect(getBookApiId('UnknownBook')).toBe('UnknownBook');
  });

  it('covers all 66 books', () => {
    expect(Object.keys(BOOK_ID_MAP)).toHaveLength(66);
  });
});

// ─── VERSION_MAP coverage ───

describe('VERSION_MAP', () => {
  it('contains the expected version keys', () => {
    expect(VERSION_MAP).toHaveProperty('krv');
    expect(VERSION_MAP).toHaveProperty('kjv');
    expect(VERSION_MAP).toHaveProperty('web');
    expect(VERSION_MAP).toHaveProperty('bsb');
  });
});

// ─── getAvailableTranslations ───

describe('getAvailableTranslations', () => {
  it('returns translations array from response', async () => {
    const translations = [{ id: 'BSB', name: 'Berean', language: 'en' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ translations }),
    });

    const result = await getAvailableTranslations();
    expect(result).toEqual(translations);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/available_translations.json')
    );
  });

  it('falls back to top-level array when translations key is missing', async () => {
    const data = [{ id: 'BSB', name: 'Berean', language: 'en' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });

    const result = await getAvailableTranslations();
    expect(result).toEqual(data);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(getAvailableTranslations()).rejects.toThrow(
      'Failed to fetch translations: 500'
    );
  });
});

// ─── getBooks ───

describe('getBooks', () => {
  it('fetches books for a given translation and returns them', async () => {
    const books = [{ id: 'GEN', name: 'Genesis' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ books }),
    });

    const result = await getBooks('krv');
    expect(result).toEqual(books);
    // krv maps to kor_old
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/kor_old/books.json')
    );
  });

  it('falls back to top-level array when books key is missing', async () => {
    const data = [{ id: 'GEN', name: 'Genesis' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });

    const result = await getBooks('web');
    expect(result).toEqual(data);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(getBooks('web')).rejects.toThrow('Failed to fetch books');
  });
});

// ─── getChapter ───

describe('getChapter', () => {
  it('constructs the correct API URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        chapter: {
          content: [
            { type: 'verse', number: 1, content: ['In the beginning'] },
          ],
        },
      }),
    });

    await getChapter('web', 'Genesis', 1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/ENGWEBP/GEN/1.json')
    );
  });

  it('parses helloao chapter.content format into verse objects', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        chapter: {
          content: [
            { type: 'verse', number: 1, content: ['In the beginning God created'] },
            { type: 'verse', number: 2, content: ['And the earth was'] },
          ],
        },
      }),
    });

    const result = await getChapter('bsb', 'Genesis', 1);
    expect(result.verses).toHaveLength(2);
    expect(result.verses[0]).toEqual({
      number: 1,
      text: 'In the beginning God created',
    });
    expect(result.verses[1]).toEqual({ number: 2, text: 'And the earth was' });
  });

  it('parses verse content with mixed string and object parts', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        chapter: {
          content: [
            {
              type: 'verse',
              number: 1,
              content: ['Hello ', { text: 'world' }, ' test'],
            },
          ],
        },
      }),
    });

    const result = await getChapter('bsb', 'Genesis', 1);
    expect(result.verses[0].text).toBe('Hello world test');
  });

  it('falls back to data.verses format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        verses: [
          { number: 1, text: 'Verse one' },
          { number: 2, text: 'Verse two' },
        ],
      }),
    });

    const result = await getChapter('bsb', 'Genesis', 1);
    expect(result.verses).toHaveLength(2);
    expect(result.verses[0].text).toBe('Verse one');
  });

  it('sorts verses by number', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        verses: [
          { number: 3, text: 'Three' },
          { number: 1, text: 'One' },
          { number: 2, text: 'Two' },
        ],
      }),
    });

    const result = await getChapter('bsb', 'Genesis', 1);
    expect(result.verses.map((v) => v.number)).toEqual([1, 2, 3]);
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(getChapter('web', 'Genesis', 99)).rejects.toThrow(
      'Failed to fetch'
    );
  });

  it('throws when response is not JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/html' },
      text: async () => '<html>Not found</html>',
    });

    await expect(getChapter('web', 'Genesis', 1)).rejects.toThrow(
      'Expected JSON'
    );
  });

  it('returns empty verses when chapter has no content', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({}),
    });

    const result = await getChapter('bsb', 'Genesis', 1);
    expect(result.verses).toEqual([]);
  });

  it('skips non-verse items in chapter content', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({
        chapter: {
          content: [
            { type: 'heading', content: 'Title' },
            { type: 'verse', number: 1, content: ['Text'] },
            { type: 'line_break' },
          ],
        },
      }),
    });

    const result = await getChapter('bsb', 'Genesis', 1);
    expect(result.verses).toHaveLength(1);
    expect(result.verses[0].number).toBe(1);
  });
});
