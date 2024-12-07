import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { LatLngBounds, latLng, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoJSON as GeoJSONType } from 'geojson';
import { transformToGeoJSON, calculateGeometryBounds } from '../../utils/geometryUtils';

interface GeometryMapProps {
  geometry: any;
  onClose: () => void;
}

export function GeometryMap({ geometry, onClose }: GeometryMapProps) {
  const [validGeometry, setValidGeometry] = useState<GeoJSONType | null>(null);
  const [bounds, setBounds] = useState<LatLngBounds>(latLngBounds([51.505, -0.09], [51.505, -0.09]));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Transform and validate the geometry
      const geoJsonData = transformToGeoJSON(geometry);
      if (!geoJsonData) {
        setError('Unable to process location data');
        return;
      }

      setValidGeometry(geoJsonData);

      // Calculate and set bounds
      const geometryBounds = calculateGeometryBounds(geoJsonData);
      if (geometryBounds) {
        const { minLat, maxLat, minLng, maxLng } = geometryBounds;
        // Add padding to bounds
        const latPadding = (maxLat - minLat) * 0.1;
        const lngPadding = (maxLng - minLng) * 0.1;
        setBounds(latLngBounds(
          latLng(minLat - latPadding, minLng - lngPadding),
          latLng(maxLat + latPadding, maxLng + lngPadding)
        ));
      } else {
        setError('Unable to determine location bounds');
      }
    } catch (error) {
      console.error('Error processing geometry:', error);
      setError('Unable to display location data');
    }
  }, [geometry]);

  if (error || !validGeometry) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
          <h3 className="text-lg font-semibold mb-4">Location Unavailable</h3>
          <p className="text-gray-600 mb-4">
            {error || 'The location data for this application is not available or invalid.'}
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] h-[600px] p-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold mb-4">Planning Application Location</h3>
        
        <div className="w-full h-[500px]">
          <MapContainer
            bounds={bounds}
            className="w-full h-full rounded-lg"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON 
              data={validGeometry}
              style={() => ({
                color: '#2563eb',
                weight: 2,
                fillColor: '#3b82f6',
                fillOpacity: 0.2
              })}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}