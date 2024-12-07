import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import type { GeometryFilter, GeometryRelationType } from '../../types/api';
import { lookupPostcode } from '../../services/postcodeApi';

interface LocationFilterProps {
  value: GeometryFilter;
  onChange: (value: GeometryFilter) => void;
}

export function LocationFilter({ value, onChange }: LocationFilterProps) {
  const [postcode, setPostcode] = useState('');
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const geometryRelations: GeometryRelationType[] = [
    'within', 'equals', 'disjoint', 'intersects', 'touches',
    'contains', 'covers', 'coveredby', 'overlaps', 'crosses'
  ];

  const handlePostcodeLookup = async () => {
    if (!postcode.trim()) {
      setPostcodeError('Please enter a postcode');
      return;
    }

    setIsLoading(true);
    setPostcodeError(null);

    try {
      const location = await lookupPostcode(postcode);
      onChange({
        ...value,
        latitude: location.latitude,
        longitude: location.longitude
      });
      setPostcodeError(null);
    } catch (error) {
      setPostcodeError(error instanceof Error ? error.message : 'Failed to lookup postcode');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-700 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Location
      </h3>
      
      {/* Postcode Search */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-600">Search by Postcode</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border rounded"
            placeholder="Enter UK postcode"
          />
          <button
            type="button"
            onClick={handlePostcodeLookup}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Looking up...
              </>
            ) : (
              'Lookup'
            )}
          </button>
        </div>
        {postcodeError && (
          <p className="text-sm text-red-600">{postcodeError}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm text-gray-600">Longitude</label>
          <input
            type="number"
            step="any"
            value={value.longitude || ''}
            onChange={(e) => onChange({ ...value, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-full px-2 py-1 text-sm border rounded"
            placeholder="-0.1276"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Latitude</label>
          <input
            type="number"
            step="any"
            value={value.latitude || ''}
            onChange={(e) => onChange({ ...value, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-full px-2 py-1 text-sm border rounded"
            placeholder="51.5074"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600">Geometry Relation</label>
        <select
          value={value.geometry_relation || 'within'}
          onChange={(e) => onChange({ ...value, geometry_relation: e.target.value as GeometryRelationType })}
          className="w-full px-2 py-1 text-sm border rounded"
        >
          {geometryRelations.map((relation) => (
            <option key={relation} value={relation}>
              {relation.charAt(0).toUpperCase() + relation.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}