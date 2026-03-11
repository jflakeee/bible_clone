import { renderHook, act } from '@testing-library/react';
import { useMap } from '@/hooks/useMap';
import { BIBLICAL_PLACES } from '@/lib/map-data';
import { BIBLE_BOOKS } from '@/lib/constants';

describe('useMap', () => {
  it('initializes with no selected place', () => {
    const { result } = renderHook(() => useMap());
    expect(result.current.selectedPlace).toBeNull();
  });

  it('initializes with empty search query', () => {
    const { result } = renderHook(() => useMap());
    expect(result.current.searchQuery).toBe('');
  });

  it('initializes with "all" filters', () => {
    const { result } = renderHook(() => useMap());
    expect(result.current.typeFilter).toBe('all');
    expect(result.current.testamentFilter).toBe('all');
  });

  it('returns all places when no filter applied', () => {
    const { result } = renderHook(() => useMap());
    expect(result.current.filteredPlaces.length).toBe(BIBLICAL_PLACES.length);
  });

  it('selectPlace sets selected place', () => {
    const { result } = renderHook(() => useMap());
    const place = BIBLICAL_PLACES[0];
    act(() => {
      result.current.selectPlace(place);
    });
    expect(result.current.selectedPlace).toEqual(place);
  });

  it('selectPlace can set to null', () => {
    const { result } = renderHook(() => useMap());
    act(() => {
      result.current.selectPlace(BIBLICAL_PLACES[0]);
    });
    act(() => {
      result.current.selectPlace(null);
    });
    expect(result.current.selectedPlace).toBeNull();
  });

  it('filters by search query (Korean name)', () => {
    const { result } = renderHook(() => useMap());
    act(() => {
      result.current.setSearchQuery('예루살렘');
    });
    expect(result.current.filteredPlaces.length).toBeGreaterThanOrEqual(1);
    expect(result.current.filteredPlaces.every(
      (p) => p.nameKo.includes('예루살렘') || p.name.toLowerCase().includes('예루살렘')
    )).toBe(true);
  });

  it('filters by search query (English name)', () => {
    const { result } = renderHook(() => useMap());
    act(() => {
      result.current.setSearchQuery('Jerusalem');
    });
    expect(result.current.filteredPlaces.length).toBeGreaterThanOrEqual(1);
    expect(result.current.filteredPlaces.some(
      (p) => p.name.toLowerCase().includes('jerusalem')
    )).toBe(true);
  });

  it('returns empty for non-matching search', () => {
    const { result } = renderHook(() => useMap());
    act(() => {
      result.current.setSearchQuery('존재하지않는장소xyz');
    });
    expect(result.current.filteredPlaces).toHaveLength(0);
  });

  it('filters by type', () => {
    const { result } = renderHook(() => useMap());
    act(() => {
      result.current.setTypeFilter('mountain');
    });
    expect(result.current.filteredPlaces.every((p) => p.type === 'mountain')).toBe(true);
  });

  it('filters by OT testament', () => {
    const { result } = renderHook(() => useMap());
    act(() => {
      result.current.setTestamentFilter('OT');
    });
    const otBookIds = BIBLE_BOOKS.filter((b) => b.testament === 'OT').map((b) => b.id);
    result.current.filteredPlaces.forEach((p) => {
      expect(p.books.some((bookId) => otBookIds.includes(bookId))).toBe(true);
    });
  });

  it('filters by NT testament', () => {
    const { result } = renderHook(() => useMap());
    act(() => {
      result.current.setTestamentFilter('NT');
    });
    const ntBookIds = BIBLE_BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id);
    result.current.filteredPlaces.forEach((p) => {
      expect(p.books.some((bookId) => ntBookIds.includes(bookId))).toBe(true);
    });
  });

  it('getBookNames returns Korean book names', () => {
    const { result } = renderHook(() => useMap());
    const names = result.current.getBookNames([1, 40]);
    expect(names).toContain('창세기');
    expect(names).toContain('마태복음');
  });

  it('getBookNames filters out invalid book ids', () => {
    const { result } = renderHook(() => useMap());
    const names = result.current.getBookNames([1, 9999]);
    expect(names).toEqual(['창세기']);
  });

  it('combines search and type filter', () => {
    const { result } = renderHook(() => useMap());
    act(() => {
      result.current.setTypeFilter('city');
      result.current.setSearchQuery('예루살렘');
    });
    result.current.filteredPlaces.forEach((p) => {
      expect(p.type).toBe('city');
    });
  });
});
