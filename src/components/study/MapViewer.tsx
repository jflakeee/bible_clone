'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap as useLeafletMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BiblicalPlace } from '@/lib/map-data';
import { BIBLE_BOOKS } from '@/lib/constants';

// Fix default marker icon issue with Leaflet + Next.js bundler
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons by type
function createIcon(color: string, shape: 'circle' | 'triangle' | 'square' | 'diamond'): L.DivIcon {
  let svgPath: string;
  switch (shape) {
    case 'triangle':
      svgPath = '<polygon points="12,2 22,22 2,22" fill="' + color + '" stroke="#333" stroke-width="1"/>';
      break;
    case 'square':
      svgPath = '<rect x="3" y="3" width="18" height="18" fill="' + color + '" stroke="#333" stroke-width="1"/>';
      break;
    case 'diamond':
      svgPath = '<polygon points="12,2 22,12 12,22 2,12" fill="' + color + '" stroke="#333" stroke-width="1"/>';
      break;
    case 'circle':
    default:
      svgPath = '<circle cx="12" cy="12" r="10" fill="' + color + '" stroke="#333" stroke-width="1"/>';
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${svgPath}</svg>`;

  return L.divIcon({
    html: svg,
    className: 'custom-map-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

const ICONS: Record<BiblicalPlace['type'], L.DivIcon> = {
  city: createIcon('#e74c3c', 'circle'),
  mountain: createIcon('#27ae60', 'triangle'),
  river: createIcon('#3498db', 'diamond'),
  sea: createIcon('#2980b9', 'square'),
  region: createIcon('#f39c12', 'square'),
  other: createIcon('#9b59b6', 'circle'),
};

function getBookNames(bookIds: number[]): string[] {
  return bookIds
    .map((id) => {
      const book = BIBLE_BOOKS.find((b) => b.id === id);
      return book ? book.nameKo : '';
    })
    .filter(Boolean);
}

// Component to fly to a selected place
function FlyToPlace({ place }: { place: BiblicalPlace | null }) {
  const map = useLeafletMap();

  useEffect(() => {
    if (place) {
      map.flyTo([place.lat, place.lng], 10, { duration: 1.5 });
    }
  }, [place, map]);

  return null;
}

interface MapViewerProps {
  places: BiblicalPlace[];
  selectedPlace: BiblicalPlace | null;
  onSelectPlace: (place: BiblicalPlace | null) => void;
}

export default function MapViewer({ places, selectedPlace, onSelectPlace }: MapViewerProps) {
  return (
    <div className="w-full h-full relative">
      <style>{`
        .custom-map-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      <MapContainer
        center={[31.5, 35.0]}
        zoom={7}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToPlace place={selectedPlace} />
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={ICONS[place.type]}
            eventHandlers={{
              click: () => onSelectPlace(place),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-base mb-1">{place.nameKo}</h3>
                <p className="text-xs text-gray-500 mb-2">{place.name}</p>
                <p className="text-sm mb-2">{place.descriptionKo}</p>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">관련 성경:</span>{' '}
                  {getBookNames(place.books).slice(0, 5).join(', ')}
                  {place.books.length > 5 && ` 외 ${place.books.length - 5}권`}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
