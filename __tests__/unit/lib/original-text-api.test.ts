/**
 * Unit tests for src/lib/original-text-api.ts
 * Tests OpenGNT TSV parsing, Hebrew sample data, and error handling.
 */

// We need to mock fetch and the constants before importing
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { getOriginalText, getOriginalLanguage } from '@/lib/original-text-api';

// Reset module-level cache between tests
beforeEach(() => {
  jest.resetModules();
  mockFetch.mockReset();
});

describe('original-text-api', () => {
  describe('getOriginalLanguage', () => {
    it('returns "hebrew" for OT books (id 1-39)', () => {
      expect(getOriginalLanguage(1)).toBe('hebrew'); // Genesis
      expect(getOriginalLanguage(19)).toBe('hebrew'); // Psalms
      expect(getOriginalLanguage(39)).toBe('hebrew'); // Malachi
    });

    it('returns "greek" for NT books (id 40-66)', () => {
      expect(getOriginalLanguage(40)).toBe('greek'); // Matthew
      expect(getOriginalLanguage(43)).toBe('greek'); // John
      expect(getOriginalLanguage(66)).toBe('greek'); // Revelation
    });

    it('returns "hebrew" for invalid/unknown book ID (defaults to non-NT)', () => {
      // Books not found still return hebrew as the default (non-NT path)
      expect(getOriginalLanguage(999)).toBe('hebrew');
    });
  });

  describe('getOriginalText - Hebrew sample data', () => {
    it('returns Genesis 1:1 sample data with 7 words', async () => {
      const verses = await getOriginalText(1, 1);
      expect(verses.length).toBeGreaterThanOrEqual(3); // Gen 1:1-3
      // First verse (Gen 1:1) should have 7 Hebrew words
      expect(verses[0]).toHaveLength(7);
    });

    it('has correct Hebrew words for Genesis 1:1', async () => {
      const verses = await getOriginalText(1, 1);
      const gen1_1 = verses[0];

      expect(gen1_1[0].word).toBe('בְּרֵאשִׁ֖ית');
      expect(gen1_1[0].strongsNumber).toBe('H7225');
      expect(gen1_1[0].transliteration).toBe("bere'shit");
      expect(gen1_1[0].gloss).toBe('In the beginning');
      expect(gen1_1[0].morphology).toBe('Prep-b | N-fs');
    });

    it('includes elohim (God) in Genesis 1:1', async () => {
      const verses = await getOriginalText(1, 1);
      const elohim = verses[0].find(w => w.strongsNumber === 'H430');
      expect(elohim).toBeDefined();
      expect(elohim!.word).toBe('אֱלֹהִ֑ים');
      expect(elohim!.gloss).toBe('God');
    });

    it('returns Psalm 23 sample data', async () => {
      const verses = await getOriginalText(19, 23);
      expect(verses.length).toBeGreaterThanOrEqual(3); // Psalm 23:1-3
      // Psalm 23:1 should have 6 words
      expect(verses[0]).toHaveLength(6);
    });

    it('has Yahweh in Psalm 23:1', async () => {
      const verses = await getOriginalText(19, 23);
      const yahweh = verses[0].find(w => w.strongsNumber === 'H3068');
      expect(yahweh).toBeDefined();
      expect(yahweh!.transliteration).toBe('Yahweh');
      expect(yahweh!.gloss).toBe('The LORD');
    });

    it('returns empty array for OT chapters without sample data', async () => {
      const verses = await getOriginalText(1, 50); // Genesis 50 - no sample
      expect(verses).toEqual([]);
    });

    it('returns empty array for invalid book ID', async () => {
      const verses = await getOriginalText(999, 1);
      expect(verses).toEqual([]);
    });
  });

  describe('getOriginalText - Greek NT (OpenGNT)', () => {
    const sampleTsv = [
      '〔Book｜Chapter｜Verse〕\tOrderID\tOGNTsort\t〔OGNT〕\t〔lexeme｜Strong｜morph〕\t〔transliteration〕\t〔gloss〕',
      '〔40｜1｜1〕\t1\t1\t〔Βίβλος〕\t〔βίβλος｜976｜N-NSF〕\t〔Biblos〕\t〔book〕',
      '〔40｜1｜1〕\t2\t2\t〔γενέσεως〕\t〔γένεσις｜1078｜N-GSF〕\t〔geneseos〕\t〔genealogy〕',
      '〔40｜1｜2〕\t3\t3\t〔Ἀβραὰμ〕\t〔Ἀβραάμ｜11｜N-NSM〕\t〔Abraam〕\t〔Abraham〕',
    ].join('\n');

    it('parses OpenGNT TSV and returns verse words for Matthew 1:1', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => sampleTsv,
      });

      // Re-import to get fresh module (cache cleared)
      const mod = await import('@/lib/original-text-api');
      const verses = await mod.getOriginalText(40, 1);

      expect(verses.length).toBeGreaterThanOrEqual(1);
      // Verse 1 should have 2 words from our sample
      expect(verses[0].length).toBe(2);
      expect(verses[0][0].word).toBe('Βίβλος');
      expect(verses[0][0].strongsNumber).toBe('G976');
      expect(verses[0][0].transliteration).toBe('Biblos');
      expect(verses[0][0].gloss).toBe('book');
    });

    it('skips header and comment lines', async () => {
      const tsvWithHeaderAndComments = [
        '〔Book｜Chapter｜Verse〕\theader...',
        '# This is a comment',
        '',
        '〔40｜1｜1〕\t1\t1\t〔Βίβλος〕\t〔βίβλος｜976｜N-NSF〕\t〔Biblos〕\t〔book〕',
      ].join('\n');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => tsvWithHeaderAndComments,
      });

      const mod = await import('@/lib/original-text-api');
      const verses = await mod.getOriginalText(40, 1);
      expect(verses.length).toBe(1);
      expect(verses[0][0].word).toBe('Βίβλος');
    });

    it('returns empty array when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const mod = await import('@/lib/original-text-api');
      const verses = await mod.getOriginalText(40, 1);
      expect(verses).toEqual([]);
    });

    it('returns empty array when fetch throws network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const mod = await import('@/lib/original-text-api');
      const verses = await mod.getOriginalText(40, 1);
      expect(verses).toEqual([]);
    });

    it('prepends G to Strong numbers for Greek', async () => {
      const tsv = '〔43｜1｜1〕\t1\t1\t〔λόγος〕\t〔λόγος｜3056｜N-NSM〕\t〔logos〕\t〔word〕\n';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => tsv,
      });

      const mod = await import('@/lib/original-text-api');
      const verses = await mod.getOriginalText(43, 1);
      expect(verses[0][0].strongsNumber).toBe('G3056');
    });

    it('handles malformed TSV rows gracefully', async () => {
      const tsv = [
        '〔40｜1｜1〕\t1\t1\t〔Βίβλος〕\t〔βίβλος｜976｜N-NSF〕\t〔Biblos〕\t〔book〕',
        'this is not a valid row',
        'too\tfew\tcolumns',
      ].join('\n');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => tsv,
      });

      const mod = await import('@/lib/original-text-api');
      const verses = await mod.getOriginalText(40, 1);
      // Should still have the valid row
      expect(verses[0].length).toBe(1);
    });
  });
});
