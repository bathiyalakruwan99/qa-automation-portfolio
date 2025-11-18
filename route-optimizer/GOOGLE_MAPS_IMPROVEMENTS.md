# Google Maps Integration Improvements

## ✅ Changes Implemented

### 1. Chunked Google Maps URLs (`src/lib/googleUrl.ts`)

**Problem:** Google Maps has a limit of ~10 waypoints per URL.

**Solution:** Created `buildGoogleDirUrl()` function that:
- Splits routes into chunks of 10 stops max
- Each chunk overlaps at endpoints (previous end becomes next start)
- Returns array of valid Google Maps Direction URLs

**Example:**
```typescript
// 25 stops → 3 URLs
const coords = route.order.map(i => ({ lat: points[i].lat, lng: points[i].lng }));
const urls = buildGoogleDirUrl(coords);
// urls[0]: stops 1-10
// urls[1]: stops 10-19
// urls[2]: stops 19-25
```

### 2. Enhanced Results UI (`src/components/ResultsPanel.tsx`)

**Added:**
- Multiple "Google Maps (Part X/Y)" buttons
- Caption: "Google limits waypoints; showing route in X parts"
- "Routed stops: X" displayed next to OSRM badge
- "Debug Legs" button with collapsible metrics table

**UI Changes:**
```
Before:
[Show on Map] [Google Maps]

After:
[Show on Map] [Debug Legs]
[Google Maps (1/3)] [Google Maps (2/3)]
[Google Maps (3/3)]
Google limits waypoints; showing route in 3 parts
```

**Metrics Display:**
- Changed from "X legs" to "Routed stops: X" for clarity
- Shows actual number of locations visited

### 3. Leg-by-Leg Debug Table (`src/lib/osrm.ts`)

**Added:** `getLegMetrics()` function that:
- Fetches detailed metrics for each leg of the route
- Returns array of: `{ from, to, km, min }`
- Sorted by distance (longest first) in the UI

**Debug Table Shows:**
| From | To | Distance | Duration |
|------|-----|----------|----------|
| Colombo | Kandy | 115.2 km | 138 min |
| Kandy | Galle | 95.8 km | 115 min |
| ... | ... | ... | ... |

**Features:**
- On-demand loading (click "Debug Legs" button)
- Sortable by distance
- Shows total at bottom
- Helpful for identifying long/expensive legs

### 4. Route Guard Against Loop Closure (`src/lib/utils.ts`)

**Problem:** Routes could have unintended loops or double returns.

**Solution:** Added guards in `createRoute()`:

```typescript
// Guard 1: No round trip
if (!roundTrip && last === first) {
  // Remove duplicate first index at end
  cleanedOrder = cleanedOrder.slice(0, -1);
}

// Guard 2: Round trip
if (roundTrip && last === first) {
  // Remove duplicate (createRouteLegs will add it)
  cleanedOrder = cleanedOrder.slice(0, -1);
}
```

**Prevents:**
- ❌ Non-round-trip ending at start (order: [0,1,2,0])
- ❌ Double return legs (order: [0,1,2,0] → adds another 0)

**Ensures:**
- ✅ Non-round-trip: [0,1,2] (ends at location 2)
- ✅ Round-trip: [0,1,2] → legs include 2→0

## 🎯 Use Cases

### Large Routes (>10 stops)
```
Route with 25 stops:
- Google Maps (1/3): Shows stops 1-10
- Google Maps (2/3): Shows stops 10-19  
- Google Maps (3/3): Shows stops 19-25

User can open all 3 to view complete route
```

### Debugging Long Legs
```
1. Click "Debug Legs"
2. See table sorted by distance
3. Identify bottleneck: Colombo → Trincomalee (275 km)
4. Consider splitting route or reordering
```

### Route Verification
```
Before: "12 legs" (confusing - is that 12 or 13 stops?)
After: "Routed stops: 13" (crystal clear)
```

## 📊 Benefits

### User Experience
- ✅ **No confusion** about waypoint limits
- ✅ **Clear indicators** when route is chunked
- ✅ **Easy debugging** with leg-by-leg metrics
- ✅ **Better understanding** of route structure

### Reliability
- ✅ **No failed Google Maps links** (all chunks valid)
- ✅ **No duplicate routes** (guards prevent loops)
- ✅ **Accurate metrics** (OSRM legs match reality)

### Debugging
- ✅ **Identify long legs** quickly
- ✅ **Verify route totals** (leg sum = route total)
- ✅ **Spot anomalies** (zero distance, huge jumps)

## 🔍 Technical Details

### Chunking Algorithm
```typescript
// Overlapping chunks ensure continuity
for (let i = 0; i < coords.length - 1; ) {
  const start = i;
  const end = Math.min(i + MAX - 1, coords.length - 1);
  const slice = coords.slice(start, end + 1);
  // ... build URL
  i = end; // Next chunk starts at previous end
}
```

### Debug Metrics Request
```typescript
// Uses OSRM annotations for leg details
const url = `${BASE}/route/v1/driving/${coords}?annotations=distance,duration`;
// Returns: legs[].distance, legs[].duration
```

### Route Guards
```typescript
// Runs before leg creation
if (last === first) {
  console.warn('⚠️ Guard triggered');
  cleanedOrder = cleanedOrder.slice(0, -1);
}
// Ensures clean, non-duplicate orders
```

## 🧪 Testing

### Manual Tests

1. **Small Route (≤10 stops)**
   - ✅ Single Google Maps button
   - ✅ No chunking message
   - ✅ All stops in one URL

2. **Large Route (>10 stops)**
   - ✅ Multiple Google Maps buttons
   - ✅ Shows "Part X/Y"
   - ✅ Chunking message displayed
   - ✅ Each URL opens correctly

3. **Debug Legs**
   - ✅ Table loads on demand
   - ✅ Sorted by distance (desc)
   - ✅ Totals match route metrics
   - ✅ Toggle expand/collapse works

4. **Round Trip OFF**
   - ✅ Last stop ≠ first stop
   - ✅ No return leg in legs
   - ✅ "Routed stops: N" matches order.length

5. **Round Trip ON**
   - ✅ Legs include return (last → first)
   - ✅ No duplicate first index in order
   - ✅ "Routed stops: N" shows unique stops

## 📝 Notes

### Google Maps Waypoint Limit
- **Documented:** ~25 waypoints with API
- **Reality:** Web UI supports ~10 reliably
- **Our approach:** Conservative 10-stop chunks
- **Benefit:** Always works, no trial-and-error

### Leg Metrics vs Route Metrics
- **Route metrics:** Total distance/time for entire route
- **Leg metrics:** Individual segment breakdowns
- **Use route metrics** for display (cached, fast)
- **Use leg metrics** for debugging (on-demand, detailed)

### Performance
- **Chunking:** O(n) - very fast
- **Leg metrics:** Network request - on demand only
- **Guards:** O(1) - negligible overhead

## 🚀 Future Enhancements

Possible improvements:

- [ ] Export leg metrics to CSV
- [ ] Highlight longest legs on map
- [ ] Suggest route optimizations based on legs
- [ ] Multiple chunk sizes (user preference)
- [ ] Alternative mapping services (Bing, Apple)

## 📚 Related Files

- `src/lib/googleUrl.ts` - Chunking logic
- `src/lib/osrm.ts` - Leg metrics + route guards
- `src/lib/utils.ts` - Route creation with guards
- `src/components/ResultsPanel.tsx` - UI implementation

---

**All improvements are backward compatible and require no migration.**

