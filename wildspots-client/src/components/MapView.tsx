'use client';

import { useState, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''; // You'll need to set this in your .env.local file

interface Campsite {
  id: number;
  name: string;
  location: string;
  price: number;
  type: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  image: string;
  coordinates: [number, number];
}

interface MapViewProps {
  campsites: Campsite[];
}

export default function MapView({ campsites }: MapViewProps) {
  const [popupInfo, setPopupInfo] = useState<Campsite | null>(null);
  
  // Calculate the bounds that fit all markers
  const bounds = useMemo(() => {
    if (campsites.length === 0) return null;
    
    const lngs = campsites.map(site => site.coordinates[0]);
    const lats = campsites.map(site => site.coordinates[1]);
    
    return [
      [Math.min(...lngs), Math.min(...lats)], // Southwest coordinates
      [Math.max(...lngs), Math.max(...lats)]  // Northeast coordinates
    ] as [[number, number], [number, number]];
  }, [campsites]);

  // Default view state (will be overridden by bounds if available)
  const [viewState, setViewState] = useState({
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 3.5
  });

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Unavailable</h3>
          <p className="text-gray-600">Mapbox token is not configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        reuseMaps={true}
        style={{ width: '100%', height: '100%' }}
        bounds={bounds}
        padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        
        {campsites.map((campsite) => (
          <Marker
            key={campsite.id}
            longitude={campsite.coordinates[0]}
            latitude={campsite.coordinates[1]}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(campsite);
            }}
          >
            <div className="relative">
              <div className="bg-white rounded-full p-2 shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">${campsite.price}</span>
                </div>
              </div>
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.coordinates[0])}
            latitude={Number(popupInfo.coordinates[1])}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="mapboxgl-popup-content"
          >
            <div className="w-64">
              <div className="h-32 bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={popupInfo.image} 
                  alt={popupInfo.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900">{popupInfo.name}</h3>
                <p className="text-sm text-gray-600">{popupInfo.location}</p>
                <div className="mt-2 flex items-center">
                  <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm text-gray-600">{popupInfo.rating}</span>
                  <span className="mx-1 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{popupInfo.reviewCount} reviews</span>
                </div>
                <div className="mt-2">
                  <a
                    href={`/campsites/${popupInfo.id}`}
                    className="block w-full text-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
