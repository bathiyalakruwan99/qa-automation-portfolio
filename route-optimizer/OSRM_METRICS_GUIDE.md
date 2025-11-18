# OSRM Route Metrics Guide

## Overview

The Route Optimizer now uses **OSRM (Open Source Routing Machine)** to calculate real road distances and travel times for optimized routes. Google Maps scraping has been completely removed to avoid CORS issues, ToS violations, and fragility.

## Key Features

✅ **Real Road Metrics**: Uses OSRM `/route` endpoint for accurate distance and duration  
✅ **Local OSRM Support**: Prefers local OSRM server (if available) for faster performance  
✅ **Public OSRM Fallback**: Automatically falls back to public OSRM server  
✅ **LRU Caching**: Caches up to 80 route calculations for performance  
✅ **Estimate Fallback**: Uses Haversine × 1.15 when OSRM is unavailable  
✅ **Clear UI**: Badges show data source (OSRM vs Estimate) with tooltips  
✅ **View-Only Google Maps**: "Open in Google Maps" link preserved for viewing only  

## Environment Configuration

### Option 1: Local OSRM (Recommended for Production)

For the best performance and no rate limits, run OSRM locally using Docker:

```bash
# Download OSM data (e.g., for your region)
wget http://download.geofabrik.de/asia/sri-lanka-latest.osm.pbf

# Extract data
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/sri-lanka-latest.osm.pbf

# Partition data
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/sri-lanka-latest.osrm

# Customize data
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/sri-lanka-latest.osrm

# Run OSRM server
docker run -t -i -p 5000:5000 -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/sri-lanka-latest.osrm
```

Then set in your `.env.local`:

```env
NEXT_PUBLIC_OSRM_BASE_URL=http://localhost:5000
```

### Option 2: Public OSRM (Default)

No configuration needed. The app automatically uses `https://router.project-osrm.org` as fallback.

**Note**: Public OSRM has rate limits and may be slower. Use for testing/development only.

## How It Works

### 1. Optimization Phase

The TSP optimization uses the **OSRM table endpoint** to build a distance matrix:

```typescript
// Matrix calculation (for optimization)
const matrix = await getDistanceMatrix(points);
const { best, alternatives } = optimizeRoute(matrix, points, options);
```

This finds the best route order using matrix-based TSP algorithms.

### 2. Metrics Calculation Phase

After optimization, the app calculates **real road metrics** for each route using the **OSRM route endpoint**:

```typescript
// Calculate real road metrics for display
await Promise.all(routes.map(async (route) => {
  try {
    const { km, minutes } = await getRoadMetricsForOrder(points, route.order);
    route.metrics = { km, minutes, source: 'osrm' };
  } catch (e) {
    const km = estimateKm(points, route.order);
    route.metrics = { km, source: 'estimate' };
  }
}));
```

**Why separate endpoints?**
- **Matrix** (`/table`): Fast, gives all-pairs distances, perfect for optimization
- **Route** (`/route`): Accurate, follows exact route order, perfect for final display

### 3. UI Display

Routes display with clear badges:

- **🟢 OSRM**: Real road distance from OSRM (preferred)
- **🟡 Estimate**: Straight-line × 1.15 (fallback only)

Tooltips explain:
- **OSRM**: "Distance/time from OSRM (OSM road data)"
- **Estimate**: "Fallback: straight-line × 1.15 when OSRM route unavailable"

## API Reference

### `getRoadMetricsForOrder(points, order)`

Gets real road metrics for a specific route order.

**Parameters:**
- `points`: Array of `{lat, lng}` coordinates
- `order`: Array of indices representing route order

**Returns:**
```typescript
{
  km: number,      // Total distance in kilometers
  minutes: number  // Total duration in minutes
}
```

**Caching:** Results are cached with LRU (max 80 entries) based on ordered coordinates.

**Example:**
```typescript
const points = [
  { lat: 6.9271, lng: 79.8612 },  // Colombo
  { lat: 7.2906, lng: 80.6337 },  // Kandy
  { lat: 6.0329, lng: 80.2170 }   // Galle
];
const order = [0, 1, 2];  // Colombo → Kandy → Galle

const { km, minutes } = await getRoadMetricsForOrder(points, order);
// km: 245.3, minutes: 294 (~4.9 hours)
```

### `estimateKm(points, order, factor = 1.15)`

Fallback estimation using Haversine formula.

**Parameters:**
- `points`: Array of `{lat, lng}` coordinates
- `order`: Array of indices representing route order
- `factor`: Multiplier to approximate road distance (default 1.15)

**Returns:** `number` (kilometers)

**Example:**
```typescript
const km = estimateKm(points, order);  // 213.4 km (straight-line × 1.15)
```

## Performance

### Caching

The LRU cache dramatically improves performance:

```typescript
// First call: API request
const metrics1 = await getRoadMetricsForOrder(points, [0, 1, 2]);  // ~200ms

// Second call: Cached
const metrics2 = await getRoadMetricsForOrder(points, [0, 1, 2]);  // <1ms
```

### Parallel Requests

All routes are calculated in parallel:

```typescript
await Promise.all(routes.map(async (route) => {
  // All routes calculated simultaneously
  const metrics = await getRoadMetricsForOrder(points, route.order);
}));
```

For 12 routes: ~1-2 seconds total (vs 12+ seconds sequential)

## Migration Notes

### What Was Removed

- ❌ Google Maps scraping/extraction
- ❌ Screenshot generation
- ❌ Browser automation
- ❌ Multiple distance selection UI
- ❌ `/api/extract-google-maps` endpoint
- ❌ `/api/screenshots` endpoint

### What Was Kept

- ✅ "Open in Google Maps" button (view-only link)
- ✅ TSP optimization logic
- ✅ Matrix-based distance calculation
- ✅ Route visualization
- ✅ CSV export

### Data Flow Comparison

**Before (with scraping):**
```
Optimize → Display OSRM → Scrape Google Maps → Update Display
                           ↑ fragile, slow, ToS violation
```

**After (OSRM only):**
```
Optimize → Calculate OSRM Metrics → Display
           ↑ fast, reliable, proper API
```

## Troubleshooting

### "Estimate" badges showing instead of "OSRM"

**Cause:** OSRM route endpoint failed (network error, invalid coordinates, etc.)

**Solutions:**
1. Check if local OSRM is running: `curl http://localhost:5000/route/v1/driving/79.8612,6.9271;80.6337,7.2906`
2. Verify coordinates are valid (not null/NaN)
3. Check browser console for error details
4. Try public OSRM: remove `NEXT_PUBLIC_OSRM_BASE_URL` from `.env.local`

### Slow route calculations

**Cause:** Using public OSRM or network latency

**Solutions:**
1. **Use local OSRM** (see Configuration above)
2. Reduce `maxAlternatives` in optimization options
3. Check network connection

### CORS errors

**Should not happen** with OSRM (server-side requests), but if you see them:

1. Verify `NEXT_PUBLIC_OSRM_BASE_URL` is correct
2. Ensure OSRM server has CORS enabled
3. Check browser console for details

## Best Practices

1. **Production**: Always use local OSRM for best performance
2. **Development**: Public OSRM is fine for testing
3. **Regional Data**: Download OSM data for your specific region
4. **Cache Management**: 80-entry LRU cache is optimal for most use cases
5. **Error Handling**: Estimate fallback ensures the app always works

## Future Enhancements

Possible improvements:

- [ ] Route geometry visualization (polylines)
- [ ] Multiple vehicle profiles (car, bike, foot)
- [ ] Traffic-aware routing
- [ ] Waypoint optimization
- [ ] Batch route comparison

## Support

For issues or questions:
- Check OSRM documentation: https://project-osrm.org/
- Review browser console logs
- Verify environment configuration

