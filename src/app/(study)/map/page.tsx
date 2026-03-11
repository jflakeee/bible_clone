'use client';

import dynamic from 'next/dynamic';
import { useMap, PlaceTypeFilter, TestamentFilter } from '@/hooks/useMap';
import { BIBLE_BOOKS } from '@/lib/constants';
import type { BiblicalPlace } from '@/lib/map-data';

const MapViewer = dynamic(() => import('@/components/study/MapViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">지도를 불러오는 중...</p>
    </div>
  ),
});

const TYPE_LABELS: Record<PlaceTypeFilter, string> = {
  all: '전체',
  city: '도시',
  mountain: '산',
  river: '강',
  sea: '바다',
  region: '지역',
  other: '기타',
};

const TESTAMENT_LABELS: Record<TestamentFilter, string> = {
  all: '전체',
  OT: '구약',
  NT: '신약',
};

function getBookNames(bookIds: number[]): string[] {
  return bookIds
    .map((id) => {
      const book = BIBLE_BOOKS.find((b) => b.id === id);
      return book ? book.nameKo : '';
    })
    .filter(Boolean);
}

export default function MapPage() {
  const {
    selectedPlace,
    selectPlace,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    testamentFilter,
    setTestamentFilter,
    filteredPlaces,
  } = useMap();

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 shrink-0">
        <h1 className="text-xl font-bold text-gray-800 mb-3">성경 지도</h1>

        {/* Search */}
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="장소 검색..."
            className="border rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Type filter */}
          <div className="flex gap-1 flex-wrap">
            {(Object.keys(TYPE_LABELS) as PlaceTypeFilter[]).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                  typeFilter === type
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          {/* Testament filter */}
          <div className="flex gap-1">
            {(Object.keys(TESTAMENT_LABELS) as TestamentFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTestamentFilter(t)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                  testamentFilter === t
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {TESTAMENT_LABELS[t]}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400 ml-auto">
            {filteredPlaces.length}개 장소
          </span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 relative">
          <MapViewer
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={selectPlace}
          />
        </div>

        {/* Side panel */}
        <aside className="w-80 border-l bg-white overflow-y-auto shrink-0 hidden md:block">
          {selectedPlace ? (
            <PlaceDetail place={selectedPlace} onClose={() => selectPlace(null)} />
          ) : (
            <PlaceList places={filteredPlaces} onSelect={selectPlace} />
          )}
        </aside>
      </div>

      {/* Mobile bottom panel */}
      {selectedPlace && (
        <div className="md:hidden border-t bg-white p-4 max-h-60 overflow-y-auto shrink-0">
          <PlaceDetail place={selectedPlace} onClose={() => selectPlace(null)} />
        </div>
      )}
    </div>
  );
}

function PlaceDetail({ place, onClose }: { place: BiblicalPlace; onClose: () => void }) {
  const bookNames = getBookNames(place.books);
  const typeLabels: Record<string, string> = {
    city: '도시',
    mountain: '산',
    river: '강',
    sea: '바다',
    region: '지역',
    other: '기타',
  };

  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{place.nameKo}</h2>
          <p className="text-sm text-gray-500">{place.name}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="닫기"
        >
          &times;
        </button>
      </div>

      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 mb-3">
        {typeLabels[place.type] || place.type}
      </span>

      <p className="text-sm text-gray-700 mb-4">{place.descriptionKo}</p>
      <p className="text-xs text-gray-500 mb-4">{place.description}</p>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">관련 성경</h3>
        <div className="flex flex-wrap gap-1">
          {bookNames.map((name) => (
            <span
              key={name}
              className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        좌표: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
      </div>
    </div>
  );
}

function PlaceList({
  places,
  onSelect,
}: {
  places: BiblicalPlace[];
  onSelect: (place: BiblicalPlace) => void;
}) {
  const typeColors: Record<string, string> = {
    city: 'bg-red-100 text-red-700',
    mountain: 'bg-green-100 text-green-700',
    river: 'bg-blue-100 text-blue-700',
    sea: 'bg-cyan-100 text-cyan-700',
    region: 'bg-yellow-100 text-yellow-700',
    other: 'bg-purple-100 text-purple-700',
  };

  const typeLabels: Record<string, string> = {
    city: '도시',
    mountain: '산',
    river: '강',
    sea: '바다',
    region: '지역',
    other: '기타',
  };

  return (
    <div className="p-2">
      <h2 className="text-sm font-semibold text-gray-500 px-2 py-2">장소 목록</h2>
      <div className="space-y-0.5">
        {places.map((place) => (
          <button
            key={place.id}
            onClick={() => onSelect(place)}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-800">{place.nameKo}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded ${typeColors[place.type] || 'bg-gray-100 text-gray-600'}`}
              >
                {typeLabels[place.type] || place.type}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{place.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
