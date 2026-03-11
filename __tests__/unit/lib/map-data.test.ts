/**
 * Unit tests for src/lib/map-data.ts
 * Tests place names, coordinate validation, search/filter by category, place lookup.
 */

import { BIBLICAL_PLACES, BiblicalPlace } from '@/lib/map-data';

describe('map-data', () => {
  describe('place count', () => {
    it('has at least 60 place names', () => {
      expect(BIBLICAL_PLACES.length).toBeGreaterThanOrEqual(60);
    });

    it('all places have unique IDs', () => {
      const ids = BIBLICAL_PLACES.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('coordinate validation', () => {
    it('all places have valid latitude (-90 to 90)', () => {
      for (const place of BIBLICAL_PLACES) {
        expect(place.lat).toBeGreaterThanOrEqual(-90);
        expect(place.lat).toBeLessThanOrEqual(90);
      }
    });

    it('all places have valid longitude (-180 to 180)', () => {
      for (const place of BIBLICAL_PLACES) {
        expect(place.lng).toBeGreaterThanOrEqual(-180);
        expect(place.lng).toBeLessThanOrEqual(180);
      }
    });

    it('all places have non-zero coordinates', () => {
      for (const place of BIBLICAL_PLACES) {
        expect(place.lat).not.toBe(0);
        expect(place.lng).not.toBe(0);
      }
    });

    it('Jerusalem has approximately correct coordinates', () => {
      const jerusalem = BIBLICAL_PLACES.find(p => p.id === 'jerusalem');
      expect(jerusalem).toBeDefined();
      expect(jerusalem!.lat).toBeCloseTo(31.77, 1);
      expect(jerusalem!.lng).toBeCloseTo(35.21, 1);
    });
  });

  describe('data completeness', () => {
    it('all places have non-empty name', () => {
      for (const place of BIBLICAL_PLACES) {
        expect(place.name.length).toBeGreaterThan(0);
      }
    });

    it('all places have non-empty Korean name', () => {
      for (const place of BIBLICAL_PLACES) {
        expect(place.nameKo.length).toBeGreaterThan(0);
      }
    });

    it('all places have a description', () => {
      for (const place of BIBLICAL_PLACES) {
        expect(place.description.length).toBeGreaterThan(0);
      }
    });

    it('all places have a Korean description', () => {
      for (const place of BIBLICAL_PLACES) {
        expect(place.descriptionKo.length).toBeGreaterThan(0);
      }
    });

    it('all places have at least one related book', () => {
      for (const place of BIBLICAL_PLACES) {
        expect(place.books.length).toBeGreaterThan(0);
      }
    });

    it('all book IDs are valid (1-66)', () => {
      for (const place of BIBLICAL_PLACES) {
        for (const bookId of place.books) {
          expect(bookId).toBeGreaterThanOrEqual(1);
          expect(bookId).toBeLessThanOrEqual(66);
        }
      }
    });
  });

  describe('type categories', () => {
    const validTypes: BiblicalPlace['type'][] = ['city', 'mountain', 'river', 'sea', 'region', 'other'];

    it('all places have a valid type', () => {
      for (const place of BIBLICAL_PLACES) {
        expect(validTypes).toContain(place.type);
      }
    });

    it('has cities', () => {
      const cities = BIBLICAL_PLACES.filter(p => p.type === 'city');
      expect(cities.length).toBeGreaterThan(0);
    });

    it('has mountains', () => {
      const mountains = BIBLICAL_PLACES.filter(p => p.type === 'mountain');
      expect(mountains.length).toBeGreaterThan(0);
    });

    it('has rivers', () => {
      const rivers = BIBLICAL_PLACES.filter(p => p.type === 'river');
      expect(rivers.length).toBeGreaterThan(0);
    });

    it('has seas', () => {
      const seas = BIBLICAL_PLACES.filter(p => p.type === 'sea');
      expect(seas.length).toBeGreaterThan(0);
    });

    it('has regions', () => {
      const regions = BIBLICAL_PLACES.filter(p => p.type === 'region');
      expect(regions.length).toBeGreaterThan(0);
    });

    it('filter by city returns only cities', () => {
      const cities = BIBLICAL_PLACES.filter(p => p.type === 'city');
      expect(cities.every(p => p.type === 'city')).toBe(true);
      expect(cities.length).toBeGreaterThan(20); // should have many cities
    });

    it('filter by mountain returns known mountains', () => {
      const mountains = BIBLICAL_PLACES.filter(p => p.type === 'mountain');
      const names = mountains.map(m => m.id);
      expect(names).toContain('mount-sinai');
      expect(names).toContain('mount-olivet');
    });
  });

  describe('place lookup by name', () => {
    it('finds Jerusalem by ID', () => {
      const place = BIBLICAL_PLACES.find(p => p.id === 'jerusalem');
      expect(place).toBeDefined();
      expect(place!.nameKo).toBe('예루살렘');
    });

    it('finds Bethlehem by ID', () => {
      const place = BIBLICAL_PLACES.find(p => p.id === 'bethlehem');
      expect(place).toBeDefined();
      expect(place!.name).toBe('Bethlehem');
    });

    it('finds Sea of Galilee by ID', () => {
      const place = BIBLICAL_PLACES.find(p => p.id === 'sea-of-galilee');
      expect(place).toBeDefined();
      expect(place!.type).toBe('sea');
    });

    it('finds Jordan River by ID', () => {
      const place = BIBLICAL_PLACES.find(p => p.id === 'jordan-river');
      expect(place).toBeDefined();
      expect(place!.type).toBe('river');
    });

    it('finds Mount Sinai by ID', () => {
      const place = BIBLICAL_PLACES.find(p => p.id === 'mount-sinai');
      expect(place).toBeDefined();
      expect(place!.nameKo).toBe('시내산');
    });

    it('finds Garden of Eden by ID', () => {
      const place = BIBLICAL_PLACES.find(p => p.id === 'garden-of-eden');
      expect(place).toBeDefined();
      expect(place!.type).toBe('other');
    });

    it('finds Golgotha by ID', () => {
      const place = BIBLICAL_PLACES.find(p => p.id === 'golgotha');
      expect(place).toBeDefined();
      expect(place!.nameKo).toBe('골고다 (갈보리)');
    });

    it('search by Korean name works', () => {
      const results = BIBLICAL_PLACES.filter(p =>
        p.nameKo.includes('예루살렘')
      );
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('search by English name works', () => {
      const results = BIBLICAL_PLACES.filter(p =>
        p.name.toLowerCase().includes('rome')
      );
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('returns no results for nonexistent place', () => {
      const place = BIBLICAL_PLACES.find(p => p.id === 'atlantis');
      expect(place).toBeUndefined();
    });
  });

  describe('specific place data', () => {
    it('Jerusalem is associated with many books', () => {
      const jerusalem = BIBLICAL_PLACES.find(p => p.id === 'jerusalem');
      expect(jerusalem!.books.length).toBeGreaterThan(10);
    });

    it('Bethlehem is associated with Matthew and Luke (nativity)', () => {
      const bethlehem = BIBLICAL_PLACES.find(p => p.id === 'bethlehem');
      expect(bethlehem!.books).toContain(40); // Matthew
      expect(bethlehem!.books).toContain(42); // Luke
    });

    it('Red Sea is associated with Exodus', () => {
      const redSea = BIBLICAL_PLACES.find(p => p.id === 'red-sea');
      expect(redSea!.books).toContain(2); // Exodus
    });

    it('Patmos is associated with Revelation', () => {
      const patmos = BIBLICAL_PLACES.find(p => p.id === 'patmos');
      expect(patmos!.books).toContain(66); // Revelation
    });
  });
});
