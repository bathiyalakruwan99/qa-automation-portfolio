# Environment Setup Guide

## Quick Start

The Route Optimizer works out of the box with **no configuration required**. It automatically uses the public OSRM server.

## Configuration Options

### Option 1: No Configuration (Default)

Just run the app:

```bash
npm run dev
```

The app will automatically use `https://router.project-osrm.org` for route calculations.

**Pros:**
- ✅ Zero configuration
- ✅ Works immediately
- ✅ Good for testing

**Cons:**
- ⚠️ Rate limited
- ⚠️ Shared public server (slower)
- ⚠️ Not recommended for production

---

### Option 2: Local OSRM Server (Recommended)

For better performance and no rate limits, run OSRM locally.

#### Step 1: Download OSM Data

Choose your region from [GeoFabrik](http://download.geofabrik.de/):

```bash
# Example: Sri Lanka
wget http://download.geofabrik.de/asia/sri-lanka-latest.osm.pbf

# Or: Entire Asia (large file!)
wget http://download.geofabrik.de/asia-latest.osm.pbf
```

#### Step 2: Process Data with Docker

```bash
# Extract
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/sri-lanka-latest.osm.pbf

# Partition
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/sri-lanka-latest.osrm

# Customize
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/sri-lanka-latest.osrm
```

#### Step 3: Start OSRM Server

```bash
docker run -t -i -p 5000:5000 -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/sri-lanka-latest.osrm
```

Server will be available at `http://localhost:5000`

#### Step 4: Configure App

Create `.env.local` in project root:

```env
NEXT_PUBLIC_OSRM_BASE_URL=http://localhost:5000
```

#### Step 5: Run App

```bash
npm run dev
```

**Pros:**
- ✅ Fast (local network)
- ✅ No rate limits
- ✅ Production-ready
- ✅ Custom regional data

**Cons:**
- ⚠️ Requires Docker
- ⚠️ Initial setup time (~10-30 min)
- ⚠️ Large disk space (varies by region)

---

## Environment Variables Reference

### `NEXT_PUBLIC_OSRM_BASE_URL`

**Purpose:** Override OSRM server URL  
**Type:** String (URL)  
**Default:** `https://router.project-osrm.org`  
**Example:** `http://localhost:5000`

**Important:** Must start with `NEXT_PUBLIC_` to be accessible in browser.

### Example `.env.local` File

```env
# Local OSRM server
NEXT_PUBLIC_OSRM_BASE_URL=http://localhost:5000

# Or use a hosted OSRM server
# NEXT_PUBLIC_OSRM_BASE_URL=https://osrm.example.com
```

---

## Testing Your Setup

### Test Local OSRM

```bash
# Health check
curl http://localhost:5000/route/v1/driving/79.8612,6.9271;80.6337,7.2906

# Should return JSON with route data
```

### Test in Browser

1. Open the app
2. Add some locations
3. Click "Optimize Route"
4. Look for the badges:
   - 🟢 **OSRM** = Working correctly
   - 🟡 **Estimate** = Fallback (check OSRM server)

---

## Troubleshooting

### "Estimate" badges instead of "OSRM"

**Check:**
1. Is OSRM server running? `docker ps | grep osrm`
2. Can you reach it? `curl http://localhost:5000/`
3. Is `.env.local` correct? Check `NEXT_PUBLIC_OSRM_BASE_URL`
4. Did you restart dev server after changing `.env.local`?

### Docker errors during data processing

**Solutions:**
1. Ensure enough disk space (OSM files can be large)
2. Increase Docker memory limit (Settings → Resources)
3. Try a smaller region first

### CORS errors (rare)

OSRM requests are made server-side, so CORS should not be an issue. If you see CORS errors:

1. Verify `NEXT_PUBLIC_OSRM_BASE_URL` is correct
2. Check browser console for exact error
3. Try public OSRM: remove `NEXT_PUBLIC_OSRM_BASE_URL` from `.env.local`

---

## Performance Comparison

| Setup | Request Time | Rate Limit | Production Ready |
|-------|--------------|------------|------------------|
| Public OSRM | 200-500ms | Yes (~5-10 req/s) | ❌ No |
| Local OSRM | 10-50ms | No | ✅ Yes |

**Recommendation:** Use local OSRM for production deployments.

---

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

**Note:** In production, always use a local or dedicated OSRM server. Do not rely on the public server.

### Docker Compose Example

For production deployment with Docker Compose:

```yaml
version: '3.8'

services:
  osrm:
    image: ghcr.io/project-osrm/osrm-backend
    command: osrm-routed --algorithm mld /data/sri-lanka-latest.osrm
    volumes:
      - ./osrm-data:/data
    ports:
      - "5000:5000"
    restart: unless-stopped

  app:
    build: .
    environment:
      - NEXT_PUBLIC_OSRM_BASE_URL=http://osrm:5000
    ports:
      - "3000:3000"
    depends_on:
      - osrm
    restart: unless-stopped
```

---

## Support

- **OSRM Documentation:** https://project-osrm.org/
- **GeoFabrik Downloads:** http://download.geofabrik.de/
- **Docker Install:** https://docs.docker.com/get-docker/

