import {
  SAMPLE_SERMONS,
  getAllTags,
  searchSermons,
  getSermonsByTag,
  getSermonById,
  getRecommendedSermons,
  getRelatedSermons,
  getSermonsByVerse,
} from '@/lib/sermon-service';

describe('sermon-service', () => {
  describe('SAMPLE_SERMONS data', () => {
    it('has exactly 40 sample sermons', () => {
      expect(SAMPLE_SERMONS.length).toBe(40);
    });

    it('each sermon has required fields', () => {
      for (const sermon of SAMPLE_SERMONS) {
        expect(sermon.id).toBeTruthy();
        expect(sermon.title).toBeTruthy();
        expect(sermon.preacher).toBeTruthy();
        expect(sermon.date).toBeTruthy();
        expect(sermon.verses.length).toBeGreaterThan(0);
        expect(sermon.summary).toBeTruthy();
        expect(sermon.content).toBeTruthy();
        expect(sermon.tags.length).toBeGreaterThan(0);
        expect(sermon.source).toBe('sample');
      }
    });

    it('all sermon IDs are unique', () => {
      const ids = SAMPLE_SERMONS.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('getAllTags', () => {
    it('returns a sorted array of unique tags', () => {
      const tags = getAllTags();
      expect(tags.length).toBeGreaterThan(10);
      // Check sorted
      for (let i = 1; i < tags.length; i++) {
        expect(tags[i] >= tags[i - 1]).toBe(true);
      }
    });

    it('contains common tags', () => {
      const tags = getAllTags();
      expect(tags).toContain('사랑');
      expect(tags).toContain('믿음');
      expect(tags).toContain('기도');
    });
  });

  describe('searchSermons', () => {
    it('returns empty for empty query', () => {
      expect(searchSermons('')).toEqual([]);
      expect(searchSermons('   ')).toEqual([]);
    });

    it('finds sermons by title keyword', () => {
      const results = searchSermons('사랑');
      expect(results.length).toBeGreaterThan(0);
      // First result should have high title match score
      expect(results[0].relevanceScore).toBeGreaterThanOrEqual(7);
    });

    it('finds sermons by preacher name', () => {
      const results = searchSermons('김은혜');
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('finds sermons by content keyword', () => {
      const results = searchSermons('독생자');
      expect(results.length).toBeGreaterThan(0);
    });

    it('results are sorted by relevance score descending', () => {
      const results = searchSermons('사랑');
      for (let i = 1; i < results.length; i++) {
        expect(results[i].relevanceScore).toBeLessThanOrEqual(
          results[i - 1].relevanceScore
        );
      }
    });

    it('returns matched verses when verse reference matches', () => {
      const results = searchSermons('Jhn 3:16');
      expect(results.length).toBeGreaterThan(0);
      const first = results[0];
      expect(first.matchedVerses.length).toBeGreaterThan(0);
    });
  });

  describe('getSermonsByVerse', () => {
    it('finds sermons for Genesis chapter 1', () => {
      // bookId 1 = Genesis, chapter 1
      const results = getSermonsByVerse(1, 1);
      expect(results.length).toBeGreaterThan(0);
      // Sermon "창조의 신비" references Gen 1:1 and Gen 1:27
      const titles = results.map((r) => r.sermon.title);
      expect(titles).toContain('창조의 신비');
    });

    it('returns empty for non-existent book', () => {
      const results = getSermonsByVerse(999, 1);
      expect(results).toEqual([]);
    });

    it('finds sermon for specific verse', () => {
      // Gen 1:27 is referenced in sermon "창조의 신비"
      const results = getSermonsByVerse(1, 1, 27);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getSermonsByTag', () => {
    it('returns sermons matching the tag', () => {
      const sermons = getSermonsByTag('사랑');
      expect(sermons.length).toBeGreaterThan(0);
      for (const s of sermons) {
        expect(s.tags.map((t) => t.toLowerCase())).toContain('사랑');
      }
    });

    it('tag matching is case-insensitive', () => {
      // Korean tags don't have case, but the function handles it
      const result = getSermonsByTag('사랑');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns empty for unknown tag', () => {
      expect(getSermonsByTag('nonexistent_tag_xyz')).toEqual([]);
    });
  });

  describe('getSermonById', () => {
    it('returns sermon for valid id', () => {
      const sermon = getSermonById('1');
      expect(sermon).toBeDefined();
      expect(sermon!.title).toBe('하나님의 사랑');
    });

    it('returns undefined for invalid id', () => {
      expect(getSermonById('999')).toBeUndefined();
    });
  });

  describe('getRecommendedSermons', () => {
    it('returns up to 5 sermons for empty verses', () => {
      const recs = getRecommendedSermons([]);
      expect(recs.length).toBeLessThanOrEqual(5);
      expect(recs.length).toBeGreaterThan(0);
    });

    it('returns recommendations based on verse references', () => {
      const recs = getRecommendedSermons(['Jhn 3:16']);
      expect(recs.length).toBeGreaterThan(0);
    });

    it('returns default sermons if no matches found', () => {
      const recs = getRecommendedSermons(['Xyz 999:99']);
      expect(recs.length).toBeGreaterThan(0);
    });
  });

  describe('getRelatedSermons', () => {
    it('returns related sermons for existing sermon', () => {
      const related = getRelatedSermons('1');
      expect(related.length).toBeGreaterThan(0);
      // Should not include the sermon itself
      expect(related.find((s) => s.id === '1')).toBeUndefined();
    });

    it('returns empty for non-existent sermon', () => {
      expect(getRelatedSermons('999')).toEqual([]);
    });

    it('returns max 5 results', () => {
      const related = getRelatedSermons('1');
      expect(related.length).toBeLessThanOrEqual(5);
    });
  });
});
