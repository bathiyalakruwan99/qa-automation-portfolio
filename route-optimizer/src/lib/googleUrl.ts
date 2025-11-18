/**
 * Build chunked Google Maps Direction URLs
 * Google Maps reliably supports start + 8 waypoints + end (10 total)
 */

export type LatLng = { lat: number; lng: number };

export function buildGoogleDirUrl(coords: LatLng[]): string[] {
  // Standard Maps reliably supports start + 8 waypoints + end (10 total).
  const MAX = 10;
  const chunks: string[] = [];
  
  for (let i = 0; i < coords.length - 1; ) {
    const start = i;
    const end = Math.min(i + MAX - 1, coords.length - 1);
    const slice = coords.slice(start, end + 1);
    const parts = slice.map(p => `${p.lat},${p.lng}`).join('/');
    chunks.push(`https://www.google.com/maps/dir/${parts}`);
    i = end; // next chunk starts at previous end (end becomes new start)
  }
  
  return chunks;
}

