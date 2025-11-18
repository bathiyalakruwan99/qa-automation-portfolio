import { GeocodeResult } from './types';
import { isCoordinateInput, parseCoordinates, sleep } from './utils';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const GEOCODE_DELAY = 1000; // 1 second delay between requests for politeness

/**
 * Geocode a single address using Nominatim
 */
export async function geocodeOne(query: string): Promise<GeocodeResult> {
  // Check if it's already coordinates
  if (isCoordinateInput(query)) {
    const coords = parseCoordinates(query);
    if (coords) {
      return {
        lat: coords.lat,
        lng: coords.lng,
        label: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
        address: query.trim()
      };
    }
  }

  const params = new URLSearchParams({
    q: query.trim(),
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
    extratags: '1'
  });

  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}?${params}`, {
      headers: {
        'User-Agent': 'RouteOptimizer/1.0 (https://github.com/route-optimizer)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No results found for this address');
    }

    const result = data[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid coordinates returned');
    }

    // Build a readable label
    const address = result.display_name || query;
    const label = result.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    return {
      lat,
      lng,
      label,
      address
    };
  } catch (error) {
    throw new Error(`Failed to geocode "${query}": ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Geocode multiple addresses with throttling
 */
export async function geocodeMultiple(
  queries: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<GeocodeResult[]> {
  const results: GeocodeResult[] = [];
  const errors: string[] = [];

  for (let i = 0; i < queries.length; i++) {
    try {
      const result = await geocodeOne(queries[i]);
      results.push(result);
      
      if (onProgress) {
        onProgress(i + 1, queries.length);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Row ${i + 1}: ${errorMessage}`);
      
      // Add a placeholder result to maintain array indices
      results.push({
        lat: 0,
        lng: 0,
        label: `Error: ${queries[i]}`,
        address: queries[i]
      });
    }

    // Add delay between requests for politeness (except for the last one)
    if (i < queries.length - 1) {
      await sleep(GEOCODE_DELAY);
    }
  }

  if (errors.length > 0) {
    console.warn('Geocoding errors:', errors);
  }

  return results;
}

/**
 * Batch geocode with error handling and progress reporting
 */
export async function batchGeocode(
  inputs: string[],
  onProgress?: (completed: number, total: number, current?: string) => void,
  onError?: (error: string) => void
): Promise<{ results: GeocodeResult[]; errors: string[] }> {
  const results: GeocodeResult[] = [];
  const errors: string[] = [];

  // Filter out empty inputs
  const validInputs = inputs.filter(input => input.trim().length > 0);
  
  if (validInputs.length === 0) {
    return { results, errors: ['No valid inputs provided'] };
  }

  for (let i = 0; i < validInputs.length; i++) {
    const input = validInputs[i];
    
    if (onProgress) {
      onProgress(i, validInputs.length, input);
    }

    try {
      const result = await geocodeOne(input);
      results.push(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const fullError = `Row ${i + 1} (${input}): ${errorMessage}`;
      errors.push(fullError);
      
      if (onError) {
        onError(fullError);
      }

      // Add a placeholder result to maintain array indices
      results.push({
        lat: 0,
        lng: 0,
        label: `Error: ${input}`,
        address: input
      });
    }

    // Add delay between requests for politeness (except for the last one)
    if (i < validInputs.length - 1) {
      await sleep(GEOCODE_DELAY);
    }
  }

  if (onProgress) {
    onProgress(validInputs.length, validInputs.length);
  }

  return { results, errors };
}

/**
 * Validate geocoding results
 */
export function validateGeocodeResults(results: GeocodeResult[]): { valid: GeocodeResult[]; invalid: GeocodeResult[] } {
  const valid: GeocodeResult[] = [];
  const invalid: GeocodeResult[] = [];

  for (const result of results) {
    if (result.lat === 0 && result.lng === 0) {
      invalid.push(result);
    } else if (isNaN(result.lat) || isNaN(result.lng)) {
      invalid.push(result);
    } else if (result.lat < -90 || result.lat > 90 || result.lng < -180 || result.lng > 180) {
      invalid.push(result);
    } else {
      valid.push(result);
    }
  }

  return { valid, invalid };
}
