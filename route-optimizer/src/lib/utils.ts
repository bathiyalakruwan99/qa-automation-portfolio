import { Point, Route, RouteLeg } from './types';

/**
 * Parse coordinate string in format "lat,lng" or "lat, lng"
 */
export function parseCoordinates(input: string): { lat: number; lng: number } | null {
  const coordRegex = /^[-+]?\d+\.?\d*\s*,\s*[-+]?\d+\.?\d*$/;
  if (!coordRegex.test(input.trim())) {
    return null;
  }

  const parts = input.trim().split(/\s*,\s*/);
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);

  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }

  // Validate coordinate ranges
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
}

/**
 * Check if input looks like coordinates
 */
export function isCoordinateInput(input: string): boolean {
  return parseCoordinates(input) !== null;
}

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Generate a unique ID
 */
let idCounter = 0;
export function generateId(): string {
  idCounter++;
  return `id_${idCounter}_${Math.random().toString(36).substr(2, 6)}`;
}

/**
 * Calculate route direction (clockwise/anti-clockwise)
 */
export function calculateRouteDirection(points: Point[], order: number[]): 'clockwise' | 'anti-clockwise' | 'hybrid' {
  if (order.length < 3) return 'hybrid';

  // Calculate centroid
  const centroid = {
    lat: points.reduce((sum, p) => sum + p.lat, 0) / points.length,
    lng: points.reduce((sum, p) => sum + p.lng, 0) / points.length
  };

  // Calculate angles from centroid
  const angles: number[] = [];
  for (const idx of order) {
    const point = points[idx];
    const angle = Math.atan2(point.lng - centroid.lng, point.lat - centroid.lat);
    angles.push(angle);
  }

  // Check if angles are generally increasing or decreasing
  let clockwiseCount = 0;
  let antiClockwiseCount = 0;

  for (let i = 0; i < angles.length - 1; i++) {
    const diff = angles[i + 1] - angles[i];
    const normalizedDiff = ((diff % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    if (normalizedDiff < Math.PI) {
      clockwiseCount++;
    } else {
      antiClockwiseCount++;
    }
  }

  if (clockwiseCount > antiClockwiseCount * 1.5) return 'clockwise';
  if (antiClockwiseCount > clockwiseCount * 1.5) return 'anti-clockwise';
  return 'hybrid';
}

/**
 * Create route legs from order and distance matrix
 */
export function createRouteLegs(
  order: number[],
  matrix: number[][],
  points: Point[],
  roundTrip: boolean = true
): RouteLeg[] {
  const legs: RouteLeg[] = [];
  
  for (let i = 0; i < order.length - 1; i++) {
    const from = order[i];
    const to = order[i + 1];
    legs.push({
      from,
      to,
      distance: matrix[from][to],
      fromPoint: points[from],
      toPoint: points[to]
    });
  }

  // Add return leg for round trip
  if (roundTrip && order.length > 1) {
    const last = order[order.length - 1];
    const first = order[0];
    legs.push({
      from: last,
      to: first,
      distance: matrix[last][first],
      fromPoint: points[last],
      toPoint: points[first]
    });
  }

  return legs;
}

/**
 * Calculate total route distance
 */
export function calculateTotalDistance(legs: RouteLeg[]): number {
  return legs.reduce((sum, leg) => sum + leg.distance, 0);
}

/**
 * Create route from order and matrix
 */
export function createRoute(
  order: number[],
  matrix: number[][],
  points: Point[],
  roundTrip: boolean = true
): Route {
  // Guard against unintended loop closure
  let cleanedOrder = [...order];
  
  if (cleanedOrder.length > 1) {
    const first = cleanedOrder[0];
    const last = cleanedOrder[cleanedOrder.length - 1];
    
    if (!roundTrip) {
      // Ensure the last index !== first index (no unintended loop)
      if (last === first) {
        console.warn('⚠️ Guard: Removing duplicate first index at end (roundTrip=false)');
        cleanedOrder = cleanedOrder.slice(0, -1);
      }
    } else {
      // If roundTrip, ensure we don't already have the first index at the end
      // (createRouteLegs will add it)
      if (last === first) {
        console.warn('⚠️ Guard: Order already has return leg; removing it (roundTrip=true)');
        cleanedOrder = cleanedOrder.slice(0, -1);
      }
    }
  }
  
  const legs = createRouteLegs(cleanedOrder, matrix, points, roundTrip);
  const totalKm = calculateTotalDistance(legs);
  const direction = calculateRouteDirection(points, cleanedOrder);

  // Debug logging
  console.log('🔍 Route Creation Debug:');
  console.log('  Order:', cleanedOrder);
  console.log('  Round trip:', roundTrip, roundTrip ? '(WITH return to start)' : '(NO return - ends at last location)');
  console.log('  Legs:', legs.map(leg => `${leg.from}->${leg.to}: ${leg.distance.toFixed(1)}km`));
  console.log('  Total calculated:', totalKm.toFixed(1), 'km');
  
  // Calculate what the distance would be without round trip for comparison
  if (roundTrip) {
    const oneWayDistance = legs.slice(0, -1).reduce((sum, leg) => sum + leg.distance, 0);
    console.log('  One-way distance (without return):', oneWayDistance.toFixed(1), 'km');
    console.log('  Return leg distance:', legs[legs.length - 1]?.distance.toFixed(1), 'km');
  }
  
  // Check for zero distance legs
  const zeroDistanceLegs = legs.filter(leg => leg.distance === 0 && leg.from !== leg.to);
  if (zeroDistanceLegs.length > 0) {
    console.warn('⚠️ Found zero distance legs:', zeroDistanceLegs.map(leg => `${leg.from}->${leg.to}`));
  }

  return {
    order: cleanedOrder,
    totalKm,
    legs,
    direction
  };
}

/**
 * Generate Google Maps URL for route
 */
export function generateGoogleMapsUrl(points: Point[], order: number[]): string {
  if (order.length === 0) return '';

  const orderedPoints = order.map(idx => points[idx]);
  const origin = `${orderedPoints[0].lat},${orderedPoints[0].lng}`;
  const destination = `${orderedPoints[orderedPoints.length - 1].lat},${orderedPoints[orderedPoints.length - 1].lng}`;
  
  const waypoints = orderedPoints.slice(1, -1)
    .map(p => `${p.lat},${p.lng}`)
    .join('|');

  const baseUrl = 'https://www.google.com/maps/dir/';
  const params = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: 'driving'
  });

  if (waypoints) {
    params.set('waypoints', waypoints);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep function for throttling
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate input text for addresses/coordinates
 */
export function validateInput(input: string): { isValid: boolean; error?: string } {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Input cannot be empty' };
  }

  // Check if it's coordinates
  if (isCoordinateInput(trimmed)) {
    const coords = parseCoordinates(trimmed);
    if (!coords) {
      return { isValid: false, error: 'Invalid coordinate format' };
    }
    return { isValid: true };
  }

  // For addresses, just check it's not too short
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Address too short' };
  }

  return { isValid: true };
}
