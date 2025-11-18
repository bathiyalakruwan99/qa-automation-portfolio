# Route Optimizer (TSP Solver)

Next.js web app that solves the Traveling Salesman Problem for testing route optimization algorithms. Built for validating TMS route optimization features.

**Scale:** Handles 50+ locations with real road distances

![Route Optimizer](screenshots/route%20optimizer.png)

---

## Why I Built This

Our TMS has a route optimizer that needed validation against real-world scenarios. Manual validation of complex multi-location routes wasn't practical - I needed a tool to:
- Generate optimal routes using standard TSP algorithms
- Use real road distances (not straight-line)
- Compare multiple route alternatives
- Validate our system's routing logic

**Demo Video:** [See it in action](videos/Free%20Route%20Optimizer%20-%20TSP%20Solver.mp4)

---

## Features

- No API keys required (uses free OSRM routing)
- Real road distances from OpenStreetMap
- Multiple optimization algorithms (Nearest Neighbor + 2-opt + 3-opt)
- Shows top alternative routes for comparison
- Interactive map visualization
- CSV import/export for test data
- Web Workers for performance (doesn't freeze on large routes)
- Mobile responsive

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

---

## How It Works

### Input
- Add locations by address or coordinates (lat,lng)
- Or import CSV file with multiple locations
- Choose route options (round trip, number of alternatives)

### Optimization
1. **Nearest Neighbor** - Quick initial solution
2. **2-opt** - Local search improvement
3. **3-opt** - Advanced optimization (for ≤30 locations)
4. **Multi-start** - Try different starting points for better results

### Output
- Optimal route with turn-by-turn directions
- Multiple alternative routes sorted by distance
- Total distance and estimated duration
- Interactive map with route visualization
- CSV export or Google Maps link

---

## Technical Details

**Algorithms:**
- TSP solver with Nearest Neighbor heuristic
- 2-opt improvement (always)
- 3-opt improvement (when ≤30 locations)
- Uses real road distances from OSRM

**Distance Calculation:**
- OSRM Matrix API for TSP optimization (fast)
- OSRM Route API for final accurate distances
- LRU cache (80 entries) for performance
- Haversine fallback if OSRM unavailable

**Performance:**
- Small routes (≤10 locations): Near-instant
- Medium routes (11-30): 1-3 seconds
- Large routes (31-50): 3-10 seconds with Web Worker

**Tech Stack:**
- Next.js 15, React 18, TypeScript
- Tailwind CSS for styling
- Leaflet for maps
- OSRM for routing
- Web Workers for performance

---

## Supported Input Formats

**Addresses:**
```
Colombo, Sri Lanka
Times Square, New York
```

**Coordinates:**
```
6.9271,79.8612
40.7589,-73.9851
```

**CSV Import:**
```csv
name,address
Location A,6.9271,79.8612
Location B,Colombo Fort
```

---

## Limitations

- **Maximum 50 locations** (OSRM server limits)
- **No real-time traffic** (uses static road network)
- **Geocoding accuracy** depends on OpenStreetMap data
- **Public OSRM rate limits** (use local OSRM for production - see [ENV_SETUP.md](ENV_SETUP.md))

---

## What I Learned

**Challenges:**
- TSP optimization gets slow with 30+ locations
- Browser freezes during computation without Web Workers
- OSRM public API has rate limits
- 3-opt is powerful but computationally expensive

**Solutions:**
- Web Workers keep UI responsive during optimization
- LRU cache reduces duplicate API calls
- Fallback to 2-opt only for large routes
- Local OSRM setup for production use

**Future improvements:**
- Time window constraints
- Vehicle capacity limits
- Multiple vehicle support
- Deploy to Vercel for live demo

---

## Project Structure

```
route-optimizer/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   └── lib/          # Core logic (TSP, OSRM, utils)
├── public/
│   └── screenshots/  # Demo screenshots
├── screenshots/      # Main screenshots
├── videos/           # Demo videos
└── README.md
```

---

## Additional Documentation

- [ENV_SETUP.md](ENV_SETUP.md) - Local OSRM server setup
- [OSRM_METRICS_GUIDE.md](OSRM_METRICS_GUIDE.md) - Technical details on distance calculation
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [CSV_FORMAT_GUIDE.md](CSV_FORMAT_GUIDE.md) - CSV import format

---

## Use Cases

**What I use this for:**
1. Validate TMS route optimizer output
2. Generate test routes for QA scenarios
3. Compare algorithm performance
4. Test edge cases (overlapping locations, constraints)
5. Generate realistic route test data

---

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## Changelog

### v2.0.0 (Current)
- Real OSRM route metrics (accurate distances)
- LRU cache for API calls
- Local OSRM server support
- Removed Google Maps scraping (CORS issues)
- Better error handling

### v1.0.0
- Initial release
- Basic TSP solver
- Map visualization
- CSV import/export

---

*Built to validate route optimization in Transport Management Systems. Free and open-source (MIT License).*
