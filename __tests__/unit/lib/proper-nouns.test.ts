import {
  PROPER_NOUNS,
  findProperNouns,
  getProperNounById,
  getProperNounsByType,
  searchProperNouns,
  type ProperNoun,
} from '@/lib/proper-nouns';

describe('proper-nouns', () => {
  describe('PROPER_NOUNS data', () => {
    it('has at least 199 proper nouns', () => {
      expect(PROPER_NOUNS.length).toBeGreaterThanOrEqual(199);
    });

    it('each noun has required fields', () => {
      for (const noun of PROPER_NOUNS) {
        expect(noun.id).toBeTruthy();
        expect(noun.original).toBeTruthy();
        expect(noun.english).toBeTruthy();
        expect(noun.korean).toBeTruthy();
        expect(noun.type).toBeTruthy();
        expect(noun.description).toBeTruthy();
        expect(noun.descriptionKo).toBeTruthy();
        expect(typeof noun.occurrences).toBe('number');
      }
    });

    it('all IDs are unique', () => {
      const ids = PROPER_NOUNS.map((n) => n.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('contains all 6 types', () => {
      const types = new Set(PROPER_NOUNS.map((n) => n.type));
      expect(types).toContain('person');
      expect(types).toContain('place');
      expect(types).toContain('object');
      expect(types).toContain('title');
      expect(types).toContain('tribe');
      expect(types).toContain('nation');
      expect(types.size).toBe(6);
    });
  });

  describe('getProperNounById', () => {
    it('finds Adam', () => {
      const noun = getProperNounById('adam');
      expect(noun).toBeDefined();
      expect(noun!.english).toBe('Adam');
      expect(noun!.korean).toBe('아담');
      expect(noun!.type).toBe('person');
    });

    it('returns undefined for non-existent ID', () => {
      expect(getProperNounById('zzz_not_found')).toBeUndefined();
    });
  });

  describe('getProperNounsByType', () => {
    it('returns persons', () => {
      const persons = getProperNounsByType('person');
      expect(persons.length).toBeGreaterThan(30);
      for (const p of persons) {
        expect(p.type).toBe('person');
      }
    });

    it('returns places', () => {
      const places = getProperNounsByType('place');
      expect(places.length).toBeGreaterThan(10);
      for (const p of places) {
        expect(p.type).toBe('place');
      }
    });

    it('returns tribes', () => {
      const tribes = getProperNounsByType('tribe');
      expect(tribes.length).toBeGreaterThanOrEqual(12);
      for (const t of tribes) {
        expect(t.type).toBe('tribe');
      }
    });

    it('returns nations', () => {
      const nations = getProperNounsByType('nation');
      expect(nations.length).toBeGreaterThan(0);
      for (const n of nations) {
        expect(n.type).toBe('nation');
      }
    });

    it('returns objects', () => {
      const objects = getProperNounsByType('object');
      expect(objects.length).toBeGreaterThan(0);
      for (const o of objects) {
        expect(o.type).toBe('object');
      }
    });

    it('returns titles', () => {
      const titles = getProperNounsByType('title');
      expect(titles.length).toBeGreaterThan(0);
      for (const t of titles) {
        expect(t.type).toBe('title');
      }
    });
  });

  describe('searchProperNouns', () => {
    it('searches by English name', () => {
      const results = searchProperNouns('Abraham');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((n) => n.english === 'Abraham')).toBe(true);
    });

    it('searches by Korean name', () => {
      const results = searchProperNouns('아브라함');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((n) => n.korean === '아브라함')).toBe(true);
    });

    it('search is case-insensitive for English', () => {
      const upper = searchProperNouns('MOSES');
      const lower = searchProperNouns('moses');
      expect(upper.length).toBeGreaterThan(0);
      expect(upper.length).toBe(lower.length);
    });

    it('returns empty for no match', () => {
      expect(searchProperNouns('xyznonexistent')).toEqual([]);
    });

    it('partial match works', () => {
      const results = searchProperNouns('Abra');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('findProperNouns', () => {
    it('finds Korean proper nouns in text', () => {
      const text = '아브라함과 이삭이 함께 산에 올라갔습니다.';
      const matches = findProperNouns(text, 'ko');
      expect(matches.length).toBeGreaterThanOrEqual(2);
      const names = matches.map((m) => m.noun.korean);
      expect(names).toContain('아브라함');
      expect(names).toContain('이삭');
    });

    it('finds English proper nouns in text', () => {
      const text = 'Abraham and Isaac went up the mountain together.';
      const matches = findProperNouns(text, 'en');
      expect(matches.length).toBeGreaterThanOrEqual(2);
      const names = matches.map((m) => m.noun.english);
      expect(names).toContain('Abraham');
      expect(names).toContain('Isaac');
    });

    it('returns matches sorted by position', () => {
      const text = '이삭과 아브라함이 예루살렘에 갔다.';
      const matches = findProperNouns(text, 'ko');
      for (let i = 1; i < matches.length; i++) {
        expect(matches[i].start).toBeGreaterThan(matches[i - 1].start);
      }
    });

    it('match positions are correct', () => {
      const text = '아담은 첫 사람입니다.';
      const matches = findProperNouns(text, 'ko');
      expect(matches.length).toBeGreaterThanOrEqual(1);
      const adamMatch = matches.find((m) => m.noun.korean === '아담');
      expect(adamMatch).toBeDefined();
      expect(text.slice(adamMatch!.start, adamMatch!.end)).toBe('아담');
    });

    it('respects word boundaries for English', () => {
      const text = 'Adamant is not the same as Adam.';
      const matches = findProperNouns(text, 'en');
      const adamMatches = matches.filter((m) => m.noun.english === 'Adam');
      expect(adamMatches.length).toBe(1);
      // Should only match standalone "Adam", not "Adamant"
      expect(text.slice(adamMatches[0].start, adamMatches[0].end).toLowerCase()).toBe('adam');
      expect(adamMatches[0].start).toBeGreaterThan(0); // Not at the start (Adamant)
    });

    it('returns empty for text with no proper nouns', () => {
      const text = '오늘 날씨가 좋습니다.';
      const matches = findProperNouns(text, 'ko');
      expect(matches.length).toBe(0);
    });

    it('handles non-overlapping matches', () => {
      const text = '아브라함의 아들 이삭';
      const matches = findProperNouns(text, 'ko');
      // No overlapping positions
      for (let i = 1; i < matches.length; i++) {
        expect(matches[i].start).toBeGreaterThanOrEqual(matches[i - 1].end);
      }
    });
  });
});
