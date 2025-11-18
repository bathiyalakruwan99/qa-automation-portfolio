import { getGoogleDistanceMatrix, isGoogleMapsConfigured } from './googleMaps';
import { OSRMRouteResponse, OSRMTableResponse, Point } from './types';

const OSRM_BASE_URL = 'https://router.project-osrm.org';
const MAX_MATRIX_SIZE = 100; // OSRM demo server limit
const CHUNK_SIZE = 25; // Conservative chunk size for matrix requests

// OSRM base URL for route calculations (local preferred, fallback to public)
const BASE = typeof process !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_OSRM_BASE_URL || process.env.OSRM_BASE_URL || 'https://router.project-osrm.org')
  : 'https://router.project-osrm.org';

export type LatLng = { lat: number; lng: number };

type OsrmRouteResponseWithLegs = {
  code: string;
  routes: Array<{ 
    distance: number; 
    duration: number; 
    legs: Array<{ distance: number; duration: number }> 
  }>;
};

// LRU Cache for route metrics
const CACHE = new Map<string, { km: number; minutes: number }>();
const MAX_CACHE = 80;

function keyFor(points: LatLng[], order: number[]) {
  return order.map(i => `${points[i].lat.toFixed(6)},${points[i].lng.toFixed(6)}`).join('|');
}

function setCache(k: string, v: { km: number; minutes: number }) {
  CACHE.set(k, v);
  if (CACHE.size > MAX_CACHE) {
    const first = CACHE.keys().next().value;
    if (first) CACHE.delete(first);
  }
}

/**
 * Convert points to OSRM coordinate format (lng,lat)
 */
function pointsToCoordinates(points: Point[]): string {
  return points.map(p => `${p.lng},${p.lat}`).join(';');
}

/**
 * Make OSRM table request with error handling
 */
async function makeOSRMTableRequest(coordinates: string): Promise<OSRMTableResponse> {
  const url = `${OSRM_BASE_URL}/table/v1/driving/${coordinates}?annotations=distance,duration`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RouteOptimizer/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`OSRM request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.code !== 'Ok') {
      throw new Error(`OSRM error: ${data.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    throw new Error(`OSRM table request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get distance matrix for points using Google Maps (if configured) or OSRM (fallback)
 */
export async function getDistanceMatrix(points: Point[]): Promise<number[][]> {
  if (points.length === 0) {
    return [];
  }

  if (points.length === 1) {
    return [[0]];
  }

  // Try Google Maps first if API key is configured
  if (isGoogleMapsConfigured()) {
    console.log('🗺️ Using Google Maps Distance Matrix API (more accurate)');
    try {
      return await getGoogleDistanceMatrix(points);
    } catch (error) {
      console.warn('⚠️ Google Maps API failed, falling back to OSRM:', error);
      // Fall through to OSRM
    }
  } else {
    console.log('🗺️ Using OSRM (OpenStreetMap) - Free service');
    console.log('💡 TIP: Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to use Google Maps for more accurate distances');
  }

  // For small matrices, make a single request
  if (points.length <= Math.sqrt(MAX_MATRIX_SIZE)) {
    try {
      const coordinates = pointsToCoordinates(points);
      const response = await makeOSRMTableRequest(coordinates);
      
      // Convert meters to kilometers and handle null/undefined values
      const matrix = response.distances.map(row => 
        row.map(distance => {
          if (distance === null || distance === undefined || isNaN(distance)) {
            console.warn('⚠️ Invalid distance value from OSRM:', distance);
            return 0; // Fallback to 0 for invalid distances
          }
          return distance / 1000;
        })
      );
      
      // Debug logging for distance matrix
      console.log('🔍 OSRM Distance Matrix Debug:');
      console.log('  Matrix size:', matrix.length, 'x', matrix[0]?.length);
      console.log('  Sample distances (first 3x3):');
      for (let i = 0; i < Math.min(3, matrix.length); i++) {
        const row = matrix[i].slice(0, 3).map(d => d.toFixed(1)).join(', ');
        console.log(`    [${i}]: [${row}]`);
      }
      
      // Show some sample distances between locations
      console.log('🔍 Sample location distances:');
      for (let i = 0; i < Math.min(3, matrix.length); i++) {
        for (let j = i + 1; j < Math.min(3, matrix.length); j++) {
          const dist = matrix[i][j];
          const straightLine = calculateStraightLineDistance(points[i], points[j]);
          console.log(`  ${points[i].label} -> ${points[j].label}: ${dist.toFixed(1)}km (straight-line: ${straightLine.toFixed(1)}km)`);
        }
      }
      
      // Check for zero distances and replace with straight-line distances (with multiplier)
      let zeroDistanceCount = 0;
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          if (i !== j && matrix[i][j] === 0) {
            zeroDistanceCount++;
            console.warn(`⚠️ Zero distance found: ${i} -> ${j}, calculating straight-line distance`);
            // Calculate straight-line distance as fallback with 1.3x multiplier (typical road vs straight-line ratio)
            const straightLineDist = calculateStraightLineDistance(points[i], points[j]);
            const roadDistance = straightLineDist * 1.3; // Add 30% for typical road winding
            matrix[i][j] = roadDistance;
            console.log(`✅ Replaced with estimated road distance: ${roadDistance.toFixed(1)}km (straight-line: ${straightLineDist.toFixed(1)}km)`);
          }
        }
      }
      if (zeroDistanceCount > 0) {
        console.warn(`⚠️ Found and fixed ${zeroDistanceCount} zero distances in matrix!`);
      }
      
      // Final validation - ensure matrix is properly formed
      console.log('🔍 Final matrix validation:');
      console.log('  Matrix dimensions:', matrix.length, 'x', matrix[0]?.length);
      console.log('  Sample distances after fixes:');
      for (let i = 0; i < Math.min(3, matrix.length); i++) {
        const row = matrix[i].slice(0, 3).map(d => d.toFixed(1)).join(', ');
        console.log(`    [${i}]: [${row}]`);
      }
      
      return matrix;
    } catch (error) {
      console.warn('Single OSRM request failed, trying chunked approach:', error);
      return getChunkedDistanceMatrix(points);
    }
  }

  // For large matrices, use chunked approach
  return getChunkedDistanceMatrix(points);
}

/**
 * Get distance matrix using chunked requests
 */
async function getChunkedDistanceMatrix(points: Point[]): Promise<number[][]> {
  const n = points.length;
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));

  // Calculate chunk sizes
  const chunkSize = Math.min(CHUNK_SIZE, Math.floor(Math.sqrt(MAX_MATRIX_SIZE)));
  const numChunks = Math.ceil(n / chunkSize);

  console.log(`Using chunked approach: ${n} points, ${chunkSize} per chunk, ${numChunks} chunks`);

  // Process chunks
  for (let i = 0; i < numChunks; i++) {
    for (let j = 0; j < numChunks; j++) {
      const startI = i * chunkSize;
      const endI = Math.min(startI + chunkSize, n);
      const startJ = j * chunkSize;
      const endJ = Math.min(startJ + chunkSize, n);

      const chunkPointsI = points.slice(startI, endI);
      const chunkPointsJ = points.slice(startJ, endJ);

      try {
        const coordinatesI = pointsToCoordinates(chunkPointsI);
        const coordinatesJ = pointsToCoordinates(chunkPointsJ);
        const coordinates = `${coordinatesI};${coordinatesJ}`;

        const response = await makeOSRMTableRequest(coordinates);
        
        // Fill the matrix chunk
        const distances = response.distances;
        for (let ii = 0; ii < distances.length; ii++) {
          for (let jj = 0; jj < distances[ii].length; jj++) {
            const globalI = startI + ii;
            const globalJ = startJ + jj;
            if (globalI < n && globalJ < n) {
              const distance = distances[ii][jj];
              if (distance === null || distance === undefined || isNaN(distance)) {
                console.warn(`⚠️ Invalid distance in chunk (${globalI}, ${globalJ}):`, distance);
                matrix[globalI][globalJ] = 0;
              } else {
                matrix[globalI][globalJ] = distance / 1000;
              }
            }
          }
        }

        // Add small delay between chunk requests
        if (i < numChunks - 1 || j < numChunks - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.warn(`Chunk request failed for (${i}, ${j}):`, error);
        
        // Fill with fallback distances (straight-line)
        for (let ii = startI; ii < endI; ii++) {
          for (let jj = startJ; jj < endJ; jj++) {
            if (ii !== jj) {
              const dist = calculateStraightLineDistance(points[ii], points[jj]);
              matrix[ii][jj] = dist;
            }
          }
        }
      }
    }
  }

  // Check for zero distances and replace with straight-line distances (with multiplier)
  let zeroDistanceCount = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (i !== j && matrix[i][j] === 0) {
        zeroDistanceCount++;
        console.warn(`⚠️ Zero distance found in chunked matrix: ${i} -> ${j}, calculating straight-line distance`);
        // Calculate straight-line distance as fallback with 1.3x multiplier (typical road vs straight-line ratio)
        const straightLineDist = calculateStraightLineDistance(points[i], points[j]);
        const roadDistance = straightLineDist * 1.3; // Add 30% for typical road winding
        matrix[i][j] = roadDistance;
        console.log(`✅ Replaced with estimated road distance: ${roadDistance.toFixed(1)}km (straight-line: ${straightLineDist.toFixed(1)}km)`);
      }
    }
  }
  if (zeroDistanceCount > 0) {
    console.warn(`⚠️ Found and fixed ${zeroDistanceCount} zero distances in chunked matrix!`);
  }

  return matrix;
}

/**
 * Calculate straight-line distance as fallback
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
 * Get route geometry from OSRM
 */
export async function getRouteGeometry(points: Point[]): Promise<[number, number][]> {
  if (points.length < 2) {
    return [];
  }

  const coordinates = pointsToCoordinates(points);
  const url = `${OSRM_BASE_URL}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RouteOptimizer/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`OSRM route request failed: ${response.status} ${response.statusText}`);
    }

    const data: OSRMRouteResponse = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates;
    }

    throw new Error('No route geometry returned');
  } catch (error) {
    console.warn('OSRM route request failed:', error);
    
    // Fallback to straight lines between points
    return points.map(p => [p.lng, p.lat]);
  }
}

/**
 * Get route information including distance and duration
 */
export async function getRouteInfo(points: Point[]): Promise<{
  distance: number;
  duration: number;
  geometry: [number, number][];
}> {
  if (points.length < 2) {
    return { distance: 0, duration: 0, geometry: [] };
  }

  const coordinates = pointsToCoordinates(points);
  const url = `${OSRM_BASE_URL}/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RouteOptimizer/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`OSRM route request failed: ${response.status} ${response.statusText}`);
    }

    const data: OSRMRouteResponse = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: route.distance / 1000, // Convert to km
        duration: route.duration,
        geometry: route.geometry.coordinates
      };
    }

    throw new Error('No route returned');
  } catch (error) {
    console.warn('OSRM route request failed:', error);
    
    // Fallback to straight-line distance
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += calculateStraightLineDistance(points[i], points[i + 1]);
    }
    
    return {
      distance: totalDistance,
      duration: totalDistance * 60 / 50, // Assume 50 km/h average speed
      geometry: points.map(p => [p.lng, p.lat])
    };
  }
}

/**
 * Check if OSRM service is available
 */
export async function checkOSRMAvailability(): Promise<boolean> {
  try {
    const testCoordinates = '0,0;1,1';
    const response = await fetch(`${OSRM_BASE_URL}/table/v1/driving/${testCoordinates}?annotations=distance`, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'RouteOptimizer/1.0'
      }
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get the name of the current distance service being used
 */
export function getDistanceServiceName(): string {
  return isGoogleMapsConfigured() ? 'Google Maps API' : 'OpenStreetMap (OSRM)';
}

/**
 * Get real road metrics (distance and duration) for an ordered route using OSRM.
 * Uses exact-order OSRM /route endpoint with LRU caching.
 * Note: This is for final display only. The optimization matrix still uses table endpoint.
 */
export async function getRoadMetricsForOrder(
  points: LatLng[], 
  order: number[]
): Promise<{ km: number; minutes: number }> {
  const cacheKey = keyFor(points, order);
  const cached = CACHE.get(cacheKey);
  if (cached) return cached;

  if (!order || order.length < 2) return { km: 0, minutes: 0 };

  const coords = order.map(i => `${points[i].lng},${points[i].lat}`).join(';');
  const url = `${BASE}/route/v1/driving/${coords}?overview=false&steps=false&geometries=polyline`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM route failed ${res.status}`);
    
    const data = (await res.json()) as OsrmRouteResponseWithLegs;
    if (!data.routes?.[0]) throw new Error('OSRM route: no routes');

    const route = data.routes[0];
    const km = route.distance / 1000;
    const minutes = route.duration / 60;

    const out = { km, minutes };
    setCache(cacheKey, out);
    return out;
  } catch (error) {
    console.warn('OSRM route failed, using estimate fallback:', error);
    // Fallback to estimate
    throw error;
  }
}

/**
 * Gentle straight-line fallback when OSRM route is unavailable.
 * Calculates Haversine distance and applies a road factor (default 1.15).
 */
export function estimateKm(points: LatLng[], order: number[], factor = 1.15): number {
  const R = 6371; // Earth's radius in km
  const rad = (d: number) => (d * Math.PI) / 180;
  let km = 0;
  
  for (let i = 0; i < order.length - 1; i++) {
    const a = points[order[i]], b = points[order[i + 1]];
    const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
    const lat1 = rad(a.lat), lat2 = rad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    km += 2 * R * Math.asin(Math.sqrt(h));
  }
  
  return km * factor;
}

/**
 * Get leg-by-leg metrics for debugging route details.
 * Returns distance and duration for each leg of the route.
 */
export async function getLegMetrics(
  points: LatLng[], 
  order: number[]
): Promise<Array<{ from: number; to: number; km: number; min: number }>> {
  if (!order || order.length < 2) return [];

  const coords = order.map(i => `${points[i].lng},${points[i].lat}`).join(';');
  const url = `${BASE}/route/v1/driving/${coords}?overview=false&steps=false&annotations=distance,duration`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM route failed ${res.status}`);
    
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route?.legs) return [];
    
    return route.legs.map((leg: any, idx: number) => ({
      from: order[idx],
      to: order[idx + 1],
      km: leg.distance / 1000,
      min: leg.duration / 60
    }));
  } catch (error) {
    console.error('Failed to get leg metrics:', error);
    return [];
  }
}
