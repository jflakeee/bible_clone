/**
 * Unit tests for src/lib/strongs-api.ts
 *
 * Tests Strong's number parsing, Hebrew/Greek data fetching,
 * caching, error handling, and search functionality.
 */

// We need to reset module cache between tests so the in-memory
// hebrewCache / greekCache start fresh each time.

const SAMPLE_HEBREW_JS = `var strongsHebrewDictionary = {
  "H1": {
    "lemma": "\u05d0\u05b8\u05d1",
    "xlit": "'ab",
    "pron": "awb",
    "derivation": "a primitive word",
    "strongs_def": "father",
    "kjv_def": "chief, (fore-)father(-less)"
  },
  "H2": {
    "lemma": "\u05d0\u05b7\u05d1",
    "xlit": "'ab",
    "pron": "ab",
    "derivation": "(Aramaic) corresponding to H1",
    "strongs_def": "father",
    "kjv_def": "father"
  }
}`;

const SAMPLE_GREEK_JS = `var strongsGreekDictionary = {
  "G1": {
    "lemma": "\u0391",
    "translit": "A",
    "derivation": "of Hebrew origin",
    "strongs_def": "the first letter of the alphabet",
    "kjv_def": "Alpha"
  },
  "G26": {
    "lemma": "\u03b1\u0313\u03b3\u03b1\u0301\u03c0\u03b7",
    "translit": "agape",
    "derivation": "from G25",
    "strongs_def": "love, i.e. affection or benevolence",
    "kjv_def": "charity, dear, love"
  }
}`;

// Mock global fetch before importing the module
const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockFetchResponses() {
  mockFetch.mockImplementation((url: string) => {
    if (url.includes('hebrew')) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(SAMPLE_HEBREW_JS),
      });
    }
    if (url.includes('greek')) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(SAMPLE_GREEK_JS),
      });
    }
    return Promise.resolve({ ok: false, status: 404 });
  });
}

describe('strongs-api', () => {
  let getStrongsEntry: typeof import('@/lib/strongs-api').getStrongsEntry;
  let searchStrongs: typeof import('@/lib/strongs-api').searchStrongs;

  beforeEach(() => {
    jest.resetModules();
    mockFetch.mockReset();
    mockFetchResponses();
  });

  async function loadModule() {
    const mod = await import('@/lib/strongs-api');
    getStrongsEntry = mod.getStrongsEntry;
    searchStrongs = mod.searchStrongs;
    return mod;
  }

  // ─── Parsing / Number Format ───────────────────────────────────────

  describe('Strong\'s number parsing', () => {
    it('should accept uppercase Hebrew number H1', async () => {
      await loadModule();
      const entry = await getStrongsEntry('H1');
      expect(entry).not.toBeNull();
      expect(entry!.number).toBe('H1');
      expect(entry!.language).toBe('hebrew');
    });

    it('should accept lowercase and normalize to uppercase', async () => {
      await loadModule();
      const entry = await getStrongsEntry('h1');
      expect(entry).not.toBeNull();
      expect(entry!.number).toBe('H1');
    });

    it('should accept Greek numbers', async () => {
      await loadModule();
      const entry = await getStrongsEntry('G1');
      expect(entry).not.toBeNull();
      expect(entry!.number).toBe('G1');
      expect(entry!.language).toBe('greek');
    });

    it('should accept numbers with leading/trailing whitespace', async () => {
      await loadModule();
      const entry = await getStrongsEntry('  H1  ');
      expect(entry).not.toBeNull();
      expect(entry!.number).toBe('H1');
    });

    it('should return null for invalid format - no prefix', async () => {
      await loadModule();
      const entry = await getStrongsEntry('1234');
      expect(entry).toBeNull();
    });

    it('should return null for invalid format - wrong prefix', async () => {
      await loadModule();
      const entry = await getStrongsEntry('X1234');
      expect(entry).toBeNull();
    });

    it('should return null for empty string', async () => {
      await loadModule();
      const entry = await getStrongsEntry('');
      expect(entry).toBeNull();
    });

    it('should return null for invalid format - letters after number', async () => {
      await loadModule();
      const entry = await getStrongsEntry('H123abc');
      expect(entry).toBeNull();
    });

    it('should return null for number not in dictionary', async () => {
      await loadModule();
      const entry = await getStrongsEntry('H9999');
      expect(entry).toBeNull();
    });
  });

  // ─── Hebrew Data Fetching ─────────────────────────────────────────

  describe('Hebrew data fetching', () => {
    it('should fetch and parse Hebrew dictionary', async () => {
      await loadModule();
      const entry = await getStrongsEntry('H1');
      expect(entry).toEqual({
        number: 'H1',
        lemma: '\u05d0\u05b8\u05d1',
        transliteration: "'ab",
        pronunciation: 'awb',
        definition: 'a primitive word father',
        shortDefinition: 'chief, (fore-)father(-less)',
        language: 'hebrew',
      });
    });

    it('should use xlit field for Hebrew transliteration', async () => {
      await loadModule();
      const entry = await getStrongsEntry('H1');
      expect(entry!.transliteration).toBe("'ab");
    });

    it('should include pronunciation for Hebrew', async () => {
      await loadModule();
      const entry = await getStrongsEntry('H1');
      expect(entry!.pronunciation).toBe('awb');
    });
  });

  // ─── Greek Data Fetching ──────────────────────────────────────────

  describe('Greek data fetching', () => {
    it('should fetch and parse Greek dictionary', async () => {
      await loadModule();
      const entry = await getStrongsEntry('G1');
      expect(entry).toEqual({
        number: 'G1',
        lemma: '\u0391',
        transliteration: 'A',
        pronunciation: '',
        definition: 'of Hebrew origin the first letter of the alphabet',
        shortDefinition: 'Alpha',
        language: 'greek',
      });
    });

    it('should use translit field for Greek transliteration', async () => {
      await loadModule();
      const entry = await getStrongsEntry('G26');
      expect(entry!.transliteration).toBe('agape');
    });

    it('should have empty pronunciation for Greek entries', async () => {
      await loadModule();
      const entry = await getStrongsEntry('G1');
      expect(entry!.pronunciation).toBe('');
    });
  });

  // ─── Caching Logic ────────────────────────────────────────────────

  describe('cache logic', () => {
    it('should fetch Hebrew dictionary only once across multiple lookups', async () => {
      await loadModule();
      await getStrongsEntry('H1');
      await getStrongsEntry('H2');

      // fetch should have been called only once for Hebrew URL
      const hebrewCalls = mockFetch.mock.calls.filter((c: string[]) =>
        c[0].includes('hebrew')
      );
      expect(hebrewCalls).toHaveLength(1);
    });

    it('should fetch Greek dictionary only once across multiple lookups', async () => {
      await loadModule();
      await getStrongsEntry('G1');
      await getStrongsEntry('G26');

      const greekCalls = mockFetch.mock.calls.filter((c: string[]) =>
        c[0].includes('greek')
      );
      expect(greekCalls).toHaveLength(1);
    });

    it('should fetch both dictionaries independently', async () => {
      await loadModule();
      await getStrongsEntry('H1');
      await getStrongsEntry('G1');

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  // ─── Error Handling ───────────────────────────────────────────────

  describe('error handling', () => {
    it('should throw when Hebrew fetch fails', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('hebrew')) {
          return Promise.resolve({ ok: false, status: 500 });
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(SAMPLE_GREEK_JS),
        });
      });
      await loadModule();
      await expect(getStrongsEntry('H1')).rejects.toThrow(
        'Failed to fetch Hebrew dictionary: 500'
      );
    });

    it('should throw when Greek fetch fails', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('greek')) {
          return Promise.resolve({ ok: false, status: 503 });
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(SAMPLE_HEBREW_JS),
        });
      });
      await loadModule();
      await expect(getStrongsEntry('G1')).rejects.toThrow(
        'Failed to fetch Greek dictionary: 503'
      );
    });

    it('should throw when JS file cannot be parsed (no braces)', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('invalid content with no braces'),
        })
      );
      await loadModule();
      await expect(getStrongsEntry('H1')).rejects.toThrow(
        "Failed to parse Strong's dictionary JS file"
      );
    });

    it('should throw when JS file contains invalid JSON', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('var x = { invalid json }'),
        })
      );
      await loadModule();
      await expect(getStrongsEntry('H1')).rejects.toThrow();
    });
  });

  // ─── Search Functionality ─────────────────────────────────────────

  describe('searchStrongs', () => {
    it('should return empty array for empty query', async () => {
      await loadModule();
      const results = await searchStrongs('');
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace-only query', async () => {
      await loadModule();
      const results = await searchStrongs('   ');
      expect(results).toEqual([]);
    });

    it('should find entries by KJV definition keyword', async () => {
      await loadModule();
      const results = await searchStrongs('father');
      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(results.some((r) => r.number === 'H1')).toBe(true);
      expect(results.some((r) => r.number === 'H2')).toBe(true);
    });

    it('should find entries by strongs_def keyword', async () => {
      await loadModule();
      const results = await searchStrongs('love');
      expect(results.some((r) => r.number === 'G26')).toBe(true);
    });

    it('should find entries by transliteration', async () => {
      await loadModule();
      const results = await searchStrongs('agape');
      expect(results.some((r) => r.number === 'G26')).toBe(true);
    });

    it('should be case-insensitive', async () => {
      await loadModule();
      const results = await searchStrongs('FATHER');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('should respect the limit parameter', async () => {
      await loadModule();
      const results = await searchStrongs('father', 1);
      expect(results).toHaveLength(1);
    });

    it('should search across both Hebrew and Greek dictionaries', async () => {
      await loadModule();
      // 'Alpha' is in Greek, 'father' is in Hebrew
      const alphaResults = await searchStrongs('Alpha');
      const fatherResults = await searchStrongs('father');
      expect(alphaResults.some((r) => r.language === 'greek')).toBe(true);
      expect(fatherResults.some((r) => r.language === 'hebrew')).toBe(true);
    });

    it('should find entry by exact Strong\'s number', async () => {
      await loadModule();
      const results = await searchStrongs('H1');
      // key.toLowerCase() === q check
      expect(results.some((r) => r.number === 'H1')).toBe(true);
    });

    it('should return properly formatted StrongsEntry objects', async () => {
      await loadModule();
      const results = await searchStrongs('Alpha');
      const alpha = results.find((r) => r.number === 'G1');
      expect(alpha).toBeDefined();
      expect(alpha).toEqual({
        number: 'G1',
        lemma: '\u0391',
        transliteration: 'A',
        pronunciation: '',
        definition: 'of Hebrew origin the first letter of the alphabet',
        shortDefinition: 'Alpha',
        language: 'greek',
      });
    });
  });
});
