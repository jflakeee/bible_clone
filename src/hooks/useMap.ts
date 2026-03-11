'use client';

import { useState, useMemo, useCallback } from 'react';
import { BiblicalPlace, BIBLICAL_PLACES } from '@/lib/map-data';
import { BIBLE_BOOKS } from '@/lib/constants';

export type PlaceTypeFilter = 'all' | 'city' | 'mountain' | 'river' | 'sea' | 'region' | 'other';
export type TestamentFilter = 'all' | 'OT' | 'NT';

export function useMap() {
  const [selectedPlace, setSelectedPlace] = useState<BiblicalPlace | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<PlaceTypeFilter>('all');
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>('all');

  const filteredPlaces = useMemo(() => {
    let places = BIBLICAL_PLACES;

    // Filter by search query (Korean name)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      places = places.filter(
        (p) =>
          p.nameKo.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      places = places.filter((p) => p.type === typeFilter);
    }

    // Filter by testament
    if (testamentFilter !== 'all') {
      places = places.filter((p) => {
        const otBookIds = BIBLE_BOOKS.filter((b) => b.testament === 'OT').map((b) => b.id);
        const ntBookIds = BIBLE_BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id);

        if (testamentFilter === 'OT') {
          return p.books.some((bookId) => otBookIds.includes(bookId));
        } else {
          return p.books.some((bookId) => ntBookIds.includes(bookId));
        }
      });
    }

    return places;
  }, [searchQuery, typeFilter, testamentFilter]);

  const getBookNames = useCallback((bookIds: number[]): string[] => {
    return bookIds
      .map((id) => {
        const book = BIBLE_BOOKS.find((b) => b.id === id);
        return book ? book.nameKo : '';
      })
      .filter(Boolean);
  }, []);

  const selectPlace = useCallback((place: BiblicalPlace | null) => {
    setSelectedPlace(place);
  }, []);

  return {
    selectedPlace,
    selectPlace,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    testamentFilter,
    setTestamentFilter,
    filteredPlaces,
    getBookNames,
  };
}
