import { Point } from './types';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const MAX_ELEMENTS_PER_REQUEST = 100; // Google's limit per request
const MAX_ORIGINS_PER_REQUEST = 25; // Conservative limit

/**
 * Check if Google Maps API is configured
 */
export function isGoogleMapsConfigured(): boolean {
  return GOOGLE_MAPS_API_KEY.length > 0;
}

/**
 * Get distance matrix using Google Maps Distance Matrix API
 */
export async function getGoogleDistanceMatrix(points: Point[]): Promise<number[][]> {
  if (!isGoogleMapsConfigured()) {
    throw new Error('Google Maps API key not configured');
  }

  const n = points.length;
  if (n === 0) return [];
  if (n === 1) return [[0]];

  console.log('🗺️ Using Google Maps Distance Matrix API for', n, 'locations');

  // Initialize matrix with zeros
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));

  // For small sets, make a single request
  if (n <= 10) {
    try {
      const result = await makeGoogleDistanceRequest(points, points, 0, 0);
      return result;
    } catch (error) {
      console.error('Google Maps API request failed:', error);
      throw error;
    }
  }

  // For larger sets, use chunked approach
  return getChunkedGoogleDistanceMatrix(points);
}

/**
 * Make a single Google Distance Matrix API request
 */
async function makeGoogleDistanceRequest(
  origins: Point[],
  destinations: Point[],
  originOffset: number = 0,
  destOffset: number = 0
): Promise<number[][]> {
  const originsStr = origins.map(p => `${p.lat},${p.lng}`).join('|');
  const destinationsStr = destinations.map(p => `${p.lat},${p.lng}`).join('|');

  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.searchParams.set('origins', originsStr);
  url.searchParams.set('destinations', destinationsStr);
  url.searchParams.set('mode', 'driving');
  url.searchParams.set('units', 'metric');
  url.searchParams.set('key', GOOGLE_MAPS_API_KEY);

  console.log('🗺️ Google Maps API request:', origins.length, 'origins ×', destinations.length, 'destinations');

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google Maps API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    // Parse the distance matrix
    const matrix: number[][] = [];
    for (let i = 0; i < data.rows.length; i++) {
      const row: number[] = [];
      const elements = data.rows[i].elements;
      
      for (let j = 0; j < elements.length; j++) {
        const element = elements[j];
        
        if (element.status === 'OK') {
          // Convert meters to kilometers
          const distanceKm = element.distance.value / 1000;
          row.push(distanceKm);
          
          // Log some sample distances
          if (i < 3 && j < 3 && i !== j) {
            console.log(`  ${origins[i].label} → ${destinations[j].label}: ${distanceKm.toFixed(1)}km (Google Maps)`);
          }
        } else {
          console.warn(`⚠️ Google Maps: No route found for ${i} → ${j} (${element.status})`);
          // Use straight-line distance as fallback
          const straightLine = calculateStraightLineDistance(origins[i], destinations[j]);
          row.push(straightLine * 1.3); // Add 30% for road winding
        }
      }
      matrix.push(row);
    }

    return matrix;
  } catch (error) {
    console.error('Google Maps API request failed:', error);
    throw error;
  }
}

/**
 * Get distance matrix using chunked Google API requests
 */
async function getChunkedGoogleDistanceMatrix(points: Point[]): Promise<number[][]> {
  const n = points.length;
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));

  const chunkSize = Math.min(MAX_ORIGINS_PER_REQUEST, 25);
  const numChunks = Math.ceil(n / chunkSize);

  console.log(`🗺️ Using chunked Google Maps API: ${n} points, ${chunkSize} per chunk, ${numChunks}² chunks`);

  for (let i = 0; i < numChunks; i++) {
    for (let j = 0; j < numChunks; j++) {
      const startI = i * chunkSize;
      const endI = Math.min(startI + chunkSize, n);
      const startJ = j * chunkSize;
      const endJ = Math.min(startJ + chunkSize, n);

      const originsChunk = points.slice(startI, endI);
      const destinationsChunk = points.slice(startJ, endJ);

      try {
        const chunkMatrix = await makeGoogleDistanceRequest(originsChunk, destinationsChunk, startI, startJ);

        // Fill the main matrix
        for (let ii = 0; ii < chunkMatrix.length; ii++) {
          for (let jj = 0; jj < chunkMatrix[ii].length; jj++) {
            matrix[startI + ii][startJ + jj] = chunkMatrix[ii][jj];
          }
        }

        // Rate limiting: wait between requests
        if (i < numChunks - 1 || j < numChunks - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error(`Google Maps chunk request failed for (${i}, ${j}):`, error);
        
        // Fallback to straight-line distances
        for (let ii = startI; ii < endI; ii++) {
          for (let jj = startJ; jj < endJ; jj++) {
            if (ii !== jj) {
              const dist = calculateStraightLineDistance(points[ii], points[jj]);
              matrix[ii][jj] = dist * 1.3;
            }
          }
        }
      }
    }
  }

  return matrix;
}

/**
 * Calculate straight-line distance as fallback (Haversine formula)
 */
function calculateStraightLineDistance(p1: Point, p2: Point): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get the name of the current distance service
 */
export function getDistanceServiceName(): string {
  return isGoogleMapsConfigured() ? 'Google Maps' : 'OpenStreetMap (OSRM)';
}

