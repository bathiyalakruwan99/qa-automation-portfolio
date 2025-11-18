export interface Point {
  id: string;
  label: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface Route {
  order: number[];
  totalKm: number;
  legs: RouteLeg[];
  direction?: 'clockwise' | 'anti-clockwise' | 'hybrid';
  // Real road metrics from OSRM route endpoint (for display)
  metrics?: { 
    km: number; 
    minutes?: number; 
    source: 'osrm' | 'estimate' 
  };
  // Deprecated fields (keeping for backward compatibility during transition)
  googleDistance?: number;
  googleDuration?: number;
  googleStatus?: 'success' | 'error' | 'api_not_configured' | 'pending' | 'manual_entry';
  extractedScreenshot?: string;
  extractedValue?: number;
  extractionMethod?: string;
  allDistances?: number[];
  selectedReason?: string;
  totalOptions?: number;
}

export interface RouteLeg {
  from: number;
  to: number;
  distance: number; // in km
  fromPoint: Point;
  toPoint: Point;
}

export interface OptimizationResult {
  best: Route;
  alternatives: Route[];
  matrix: number[][];
  points: Point[];
  processingTime: number;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  label: string;
  address?: string;
}

export interface OSRMTableResponse {
  distances: number[][];
  durations: number[][];
  sources: Array<{ location: [number, number]; name: string }>;
  destinations: Array<{ location: [number, number]; name: string }>;
}

export interface OSRMRouteResponse {
  routes: Array<{
    geometry: {
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
  }>;
  waypoints: Array<{
    location: [number, number];
    name: string;
  }>;
}

export interface OptimizationOptions {
  maxAlternatives: number;
  roundTrip: boolean;
  startPoint?: number;
  endPoint?: number;
  useWebWorker: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
