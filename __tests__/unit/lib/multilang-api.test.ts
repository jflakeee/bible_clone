/**
 * Tests for multilang-api.ts
 */

// We need to reset the module cache between tests to clear the in-memory translations cache
let getAvailableTranslations: typeof import('@/lib/multilang-api').getAvailableTranslations;
let getTranslationsByLanguage: typeof import('@/lib/multilang-api').getTranslationsByLanguage;
let getChapterInLanguage: typeof import('@/lib/multilang-api').getChapterInLanguage;

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.resetModules();
  mockFetch.mockReset();
});

async function loadModule() {
  const mod = await import('@/lib/multilang-api');
  getAvailableTranslations = mod.getAvailableTranslations;
  getTranslationsByLanguage = mod.getTranslationsByLanguage;
  getChapterInLanguage = mod.getChapterInLanguage;
}

describe('multilang-api', () => {
  describe('getAvailableTranslations', () => {
    it('fetches and maps translations correctly', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'engKJV', name: 'King James Version', language: 'English' },
            { id: 'korHKJV', name: 'Korean HKJV', language: 'Korean' },
            { id: 'araSVD', name: 'Arabic SVD', language: 'Arabic' },
          ],
        }),
      });

      const translations = await getAvailableTranslations();

      expect(translations).toHaveLength(3);

      // Check English mapping
      const eng = translations.find((t) => t.id === 'engKJV');
      expect(eng).toBeDefined();
      expect(eng!.language).toBe('English');
      expect(eng!.languageKo).toBe('영어');
      expect(eng!.direction).toBe('ltr');

      // Check Korean mapping
      const kor = translations.find((t) => t.id === 'korHKJV');
      expect(kor).toBeDefined();
      expect(kor!.languageKo).toBe('한국어');

      // Check Arabic (RTL)
      const ara = translations.find((t) => t.id === 'araSVD');
      expect(ara).toBeDefined();
      expect(ara!.direction).toBe('rtl');
      expect(ara!.languageKo).toBe('아랍어');
    });

    it('throws on fetch failure', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getAvailableTranslations()).rejects.toThrow('Failed to fetch translations: 500');
    });

    it('uses cache on subsequent calls within cache duration', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'engKJV', name: 'KJV', language: 'English' },
          ],
        }),
      });

      const first = await getAvailableTranslations();
      const second = await getAvailableTranslations();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(first).toBe(second);
    });

    it('handles data without translations wrapper', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 'engKJV', name: 'KJV', language: 'English' },
        ],
      });

      const translations = await getAvailableTranslations();
      expect(translations).toHaveLength(1);
      expect(translations[0].id).toBe('engKJV');
    });

    it('handles missing fields gracefully', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'test123' }, // no name, no language
          ],
        }),
      });

      const translations = await getAvailableTranslations();
      expect(translations).toHaveLength(1);
      expect(translations[0].name).toBe('test123'); // falls back to id
      expect(translations[0].language).toBe('Unknown');
    });
  });

  describe('getTranslationsByLanguage', () => {
    it('groups translations by language', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'engKJV', name: 'King James Version', language: 'English' },
            { id: 'engWEB', name: 'World English Bible', language: 'English' },
            { id: 'korHKJV', name: 'Korean HKJV', language: 'Korean' },
            { id: 'fraLSG', name: 'Louis Segond', language: 'French' },
          ],
        }),
      });

      const grouped = await getTranslationsByLanguage();

      expect(Object.keys(grouped)).toContain('English');
      expect(Object.keys(grouped)).toContain('Korean');
      expect(Object.keys(grouped)).toContain('French');
      expect(grouped['English']).toHaveLength(2);
      expect(grouped['Korean']).toHaveLength(1);
    });

    it('sorts translations within each language by name', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'engWEB', name: 'World English Bible', language: 'English' },
            { id: 'engKJV', name: 'King James Version', language: 'English' },
            { id: 'engASV', name: 'American Standard Version', language: 'English' },
          ],
        }),
      });

      const grouped = await getTranslationsByLanguage();
      const names = grouped['English'].map((t) => t.name);

      expect(names).toEqual([
        'American Standard Version',
        'King James Version',
        'World English Bible',
      ]);
    });
  });

  describe('getChapterInLanguage', () => {
    it('fetches chapter data for a specific translation', async () => {
      await loadModule();

      const mockChapter = {
        translation: { id: 'engKJV', name: 'KJV' },
        book: { id: 'GEN', name: 'Genesis' },
        chapter: 1,
        verses: [
          { number: 1, text: 'In the beginning...' },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockChapter,
      });

      const result = await getChapterInLanguage('engKJV', 'GEN', 1);

      expect(result.translation.id).toBe('engKJV');
      expect(result.book.name).toBe('Genesis');
      expect(result.verses).toHaveLength(1);
      expect(result.verses[0].text).toBe('In the beginning...');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://bible.helloao.org/api/engKJV/GEN/1.json',
        expect.objectContaining({ next: { revalidate: 3600 } })
      );
    });

    it('throws on fetch failure', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(
        getChapterInLanguage('invalidTrans', 'GEN', 1)
      ).rejects.toThrow('Failed to fetch invalidTrans/GEN/1: 404');
    });
  });

  describe('RTL detection', () => {
    it('detects Hebrew as RTL', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'hebMod', name: 'Hebrew Modern', language: 'Hebrew' },
          ],
        }),
      });

      const translations = await getAvailableTranslations();
      expect(translations[0].direction).toBe('rtl');
    });

    it('detects Persian/Farsi as RTL', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'fasOPV', name: 'Persian OPV', language: 'Persian' },
          ],
        }),
      });

      const translations = await getAvailableTranslations();
      expect(translations[0].direction).toBe('rtl');
    });

    it('detects Spanish as LTR', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'spaRVR', name: 'Reina Valera', language: 'Spanish' },
          ],
        }),
      });

      const translations = await getAvailableTranslations();
      expect(translations[0].direction).toBe('ltr');
    });
  });

  describe('language Korean name mapping', () => {
    it('maps known languages to Korean names', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'jpnNIT', name: 'Japanese NIT', language: 'Japanese' },
            { id: 'zhsCUV', name: 'Chinese Union', language: 'Chinese' },
          ],
        }),
      });

      const translations = await getAvailableTranslations();
      expect(translations[0].languageKo).toBe('일본어');
      expect(translations[1].languageKo).toBe('중국어');
    });

    it('uses original name for unmapped languages', async () => {
      await loadModule();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          translations: [
            { id: 'xyzABC', name: 'Unknown Lang', language: 'Klingon' },
          ],
        }),
      });

      const translations = await getAvailableTranslations();
      expect(translations[0].languageKo).toBe('Klingon');
    });
  });
});
