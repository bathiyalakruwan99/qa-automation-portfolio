import { Point, Route } from './types';

/**
 * Fetch distance for a single route using Google Maps Directions API
 * This is more efficient than the Distance Matrix API for individual routes
 */
export async function getGoogleRouteDistance(
  points: Point[],
  routeOrder: number[]
): Promise<{
  distance: number;
  duration: number;
  status: 'success' | 'error' | 'api_not_configured';
  error?: string;
}> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return {
      distance: 0,
      duration: 0,
      status: 'api_not_configured',
      error: 'Google Maps API key not configured'
    };
  }

  try {
    // Order points according to route order
    const orderedPoints = routeOrder.map(index => points[index]);
    
    // Create waypoints string (exclude first and last points)
    const waypoints = orderedPoints.slice(1, -1)
      .map(p => `${p.lat},${p.lng}`)
      .join('|');
    
    // Build Google Directions API URL
    const origin = `${orderedPoints[0].lat},${orderedPoints[0].lng}`;
    const destination = `${orderedPoints[orderedPoints.length - 1].lat},${orderedPoints[orderedPoints.length - 1].lng}`;
    
    const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
    url.searchParams.set('origin', origin);
    url.searchParams.set('destination', destination);
    url.searchParams.set('waypoints', waypoints);
    url.searchParams.set('mode', 'driving');
    url.searchParams.set('units', 'metric');
    url.searchParams.set('key', apiKey);

    console.log('🗺️ Fetching Google Maps distance for route:', routeOrder.join(' → '));

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google Directions API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Directions API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No routes returned from Google Directions API');
    }

    const route = data.routes[0];
    const distanceKm = route.legs.reduce((sum: number, leg: any) => sum + leg.distance.value, 0) / 1000;
    const durationSeconds = route.legs.reduce((sum: number, leg: any) => sum + leg.duration.value, 0);

    console.log(`✅ Google Maps route distance: ${distanceKm.toFixed(1)}km, duration: ${Math.round(durationSeconds/60)}min`);

    return {
      distance: distanceKm,
      duration: durationSeconds,
      status: 'success'
    };

  } catch (error) {
    console.error('❌ Failed to fetch Google Maps distance:', error);
    return {
      distance: 0,
      duration: 0,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch Google Maps distances for multiple routes in parallel
 * with rate limiting to respect API quotas
 */
export async function getGoogleDistancesForRoutes(
  routes: Route[],
  points: Point[],
  onProgress?: (completed: number, total: number, currentRoute?: string) => void
): Promise<Map<string, { distance: number; duration: number; status: string }>> {
  const results = new Map<string, { distance: number; duration: number; status: string }>();
  
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.log('⚠️ Google Maps API not configured, skipping distance fetching');
    return results;
  }

  console.log(`🗺️ Fetching Google Maps distances for ${routes.length} routes...`);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const routeKey = route.order.join(',');
    
    onProgress?.(i, routes.length, `Route ${i + 1}: ${route.order.join(' → ')}`);
    
    const result = await getGoogleRouteDistance(points, route.order);
    
    results.set(routeKey, {
      distance: result.distance,
      duration: result.duration,
      status: result.status
    });

    // Rate limiting: wait 200ms between requests to respect quotas
    if (i < routes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  onProgress?.(routes.length, routes.length, 'Complete');
  console.log(`✅ Fetched Google Maps distances for ${results.size} routes`);

  return results;
}

/**
 * Check if Google Maps API is configured for fetching distances
 */
export function canFetchGoogleDistances(): boolean {
  return !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
}
