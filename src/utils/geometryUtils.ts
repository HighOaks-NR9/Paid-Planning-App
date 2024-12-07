import type { GeoJSON, Feature, FeatureCollection, Geometry } from 'geojson';

// Supported GeoJSON types
const VALID_GEOJSON_TYPES = [
  'Point', 'MultiPoint', 'LineString', 'MultiLineString',
  'Polygon', 'MultiPolygon', 'GeometryCollection', 'Feature',
  'FeatureCollection'
] as const;

type GeoJSONType = typeof VALID_GEOJSON_TYPES[number];

interface GeometryBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

function sanitizeCoordinate(coord: any): [number, number] | null {
  if (!Array.isArray(coord) || coord.length < 2) return null;
  const [lng, lat] = coord;
  if (typeof lng !== 'number' || typeof lat !== 'number') return null;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null;
  return [lng, lat];
}

export function isValidGeoJSON(geometry: any): boolean {
  try {
    if (!geometry || typeof geometry !== 'object') {
      return false;
    }

    // Handle string input
    if (typeof geometry === 'string') {
      try {
        geometry = JSON.parse(geometry);
      } catch {
        return false;
      }
    }

    // Handle Feature
    if (geometry.type === 'Feature') {
      return geometry.geometry && isValidGeoJSONGeometry(geometry.geometry);
    }

    // Handle FeatureCollection
    if (geometry.type === 'FeatureCollection') {
      return Array.isArray(geometry.features) && 
             geometry.features.length > 0 &&
             geometry.features.every(feature => 
               feature && typeof feature === 'object' && 
               feature.type === 'Feature' &&
               isValidGeoJSONGeometry(feature.geometry)
             );
    }

    return isValidGeoJSONGeometry(geometry);
  } catch (error) {
    console.error('GeoJSON validation error:', error);
    return false;
  }
}

function isValidGeoJSONGeometry(geometry: any): boolean {
  if (!geometry || typeof geometry !== 'object') {
    return false;
  }

  if (!VALID_GEOJSON_TYPES.includes(geometry.type as GeoJSONType)) {
    return false;
  }

  if (geometry.type === 'GeometryCollection') {
    return Array.isArray(geometry.geometries) && 
           geometry.geometries.length > 0 &&
           geometry.geometries.every(isValidGeoJSONGeometry);
  }

  if (!Array.isArray(geometry.coordinates)) {
    return false;
  }

  // Validate coordinates based on geometry type
  switch (geometry.type) {
    case 'Point':
      return sanitizeCoordinate(geometry.coordinates) !== null;
    case 'MultiPoint':
    case 'LineString':
      return geometry.coordinates.length > 0 &&
             geometry.coordinates.every(coord => sanitizeCoordinate(coord) !== null);
    case 'MultiLineString':
    case 'Polygon':
      return geometry.coordinates.length > 0 &&
             geometry.coordinates.every(line => 
               Array.isArray(line) && line.length > 0 &&
               line.every(coord => sanitizeCoordinate(coord) !== null)
             );
    case 'MultiPolygon':
      return geometry.coordinates.length > 0 &&
             geometry.coordinates.every(poly =>
               Array.isArray(poly) && poly.length > 0 &&
               poly.every(line =>
                 Array.isArray(line) && line.length > 0 &&
                 line.every(coord => sanitizeCoordinate(coord) !== null)
               )
             );
    default:
      return false;
  }
}

export function calculateGeometryBounds(geometry: any): GeometryBounds | null {
  try {
    const coords = extractCoordinates(geometry);
    if (!coords.length) return null;

    const validCoords = coords
      .map(coord => sanitizeCoordinate(coord))
      .filter((coord): coord is [number, number] => coord !== null);

    if (!validCoords.length) return null;

    return validCoords.reduce(
      (bounds, [lng, lat]) => ({
        minLat: Math.min(bounds.minLat, lat),
        maxLat: Math.max(bounds.maxLat, lat),
        minLng: Math.min(bounds.minLng, lng),
        maxLng: Math.max(bounds.maxLng, lng)
      }),
      {
        minLat: Infinity,
        maxLat: -Infinity,
        minLng: Infinity,
        maxLng: -Infinity
      }
    );
  } catch (error) {
    console.error('Error calculating bounds:', error);
    return null;
  }
}

function extractCoordinates(geometry: any): any[][] {
  if (!geometry) return [];

  // Handle string input
  if (typeof geometry === 'string') {
    try {
      geometry = JSON.parse(geometry);
    } catch {
      return [];
    }
  }

  // Handle Feature
  if (geometry.type === 'Feature') {
    return extractCoordinates(geometry.geometry);
  }

  // Handle FeatureCollection
  if (geometry.type === 'FeatureCollection') {
    return geometry.features.flatMap(feature => extractCoordinates(feature.geometry));
  }

  // Handle GeometryCollection
  if (geometry.type === 'GeometryCollection') {
    return geometry.geometries.flatMap(extractCoordinates);
  }

  // Handle basic geometry types
  if (!geometry.coordinates || !Array.isArray(geometry.coordinates)) return [];

  switch (geometry.type) {
    case 'Point':
      return [geometry.coordinates];
    case 'MultiPoint':
    case 'LineString':
      return geometry.coordinates;
    case 'MultiLineString':
    case 'Polygon':
      return geometry.coordinates.flat();
    case 'MultiPolygon':
      return geometry.coordinates.flat(2);
    default:
      return [];
  }
}

export function transformToGeoJSON(geometry: any): GeoJSON | null {
  try {
    // Handle string input
    if (typeof geometry === 'string') {
      try {
        geometry = JSON.parse(geometry);
      } catch {
        return null;
      }
    }

    // Handle null or undefined
    if (!geometry) return null;

    // Handle already valid GeoJSON
    if (isValidGeoJSON(geometry)) {
      if (geometry.type === 'Feature' || geometry.type === 'FeatureCollection') {
        return geometry as GeoJSON;
      }
      // Convert valid geometry to Feature
      return {
        type: 'Feature',
        properties: {},
        geometry: geometry as Geometry
      } as Feature;
    }

    // Try to convert WKT or other formats if needed
    // For now, return null for invalid formats
    return null;
  } catch (error) {
    console.error('Error transforming geometry:', error);
    return null;
  }
}