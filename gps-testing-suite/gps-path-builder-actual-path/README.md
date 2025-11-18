# GPS Path Builder - Actual Road Routes

A web-based tool for generating GPS test data by creating actual road routes using OpenRouteService API. This tool allows users to click on a map to add waypoints, generates real driving routes between those points, and outputs interpolated GPS coordinates every 10 meters for use in GPS simulator testing.

## 🎯 Features

- **Interactive Map**: Click to add waypoints on a Leaflet/OpenStreetMap interface
- **Real Road Routes**: Uses OpenRouteService Directions API for actual driving paths
- **GPS Interpolation**: Generates GPS coordinates at customizable intervals along the route
- **Customizable Speed**: Set driving speed for duration calculations (default: 40 km/h)
- **Adjustable Interval**: Configure distance between GPS points (1-1000m, default: 10m)
- **JSON Export**: Download or copy GPS data in simulator-ready format
- **Responsive Design**: Works on desktop and mobile devices
- **Testable**: Includes data-testid attributes for automated testing

## 📁 Project Structure

```
gps-path-builder-actual-path/
├── index.html              # Main application interface
├── css/
│   └── style.css          # Responsive styling
├── js/
│   ├── utils.js           # Utility functions (Haversine, etc.)
│   ├── map.js             # Leaflet map controller
│   ├── route.js           # OpenRouteService API integration
│   ├── interpolate.js     # GPS coordinate interpolation
│   └── export.js          # JSON export functionality
└── README.md              # This file
```

## 🚀 Getting Started

### 1. Get OpenRouteService API Key

1. Visit [OpenRouteService Developer Portal](https://openrouteservice.org/dev/)
2. Sign up for a free account
3. Create an API key
4. Copy your API key (you'll need it in the application)

### 2. Run the Application

Simply open `index.html` in a web browser. No server setup required!

```bash
# Navigate to the project directory
cd gps-path-builder-actual-path

# Open in browser (various methods)
open index.html                    # macOS
start index.html                   # Windows
xdg-open index.html               # Linux

# Or use a simple HTTP server (optional)
python -m http.server 8000        # Python 3
# Then visit http://localhost:8000
```

### 3. Configure API Key

1. Enter your OpenRouteService API key in the "Configuration" section
2. The key is automatically saved in localStorage for future use
3. Adjust the speed setting if needed (default: 40 km/h)
4. Set the GPS point interval if desired (default: 10m, range: 1-1000m)

## 📘 How to Use

### Basic Workflow

1. **Add Waypoints**: Click on the map to add waypoints (minimum 2 required)
2. **Generate Route**: Click "Generate Route" to fetch the actual road path
3. **Review Results**: Check the route info (distance, time, GPS points count)
4. **Export Data**: Download JSON file or copy to clipboard

### Detailed Steps

#### Adding Waypoints
- Click anywhere on the map to add a waypoint
- First point becomes "Start" (green marker)
- Last point becomes "End" (red marker)  
- Middle points are numbered (blue markers)
- Click on markers to see coordinates and remove option

#### Generating Routes
- Ensure you have at least 2 waypoints
- Enter a valid OpenRouteService API key
- Click "Generate Route"
- The tool will:
  - Call OpenRouteService API for actual road routing
  - Draw the route on the map (blue line)
  - Interpolate GPS points every 10 meters
  - Calculate durations based on your speed setting

#### Exporting Data
- **Download JSON**: Saves a file with timestamp and point count
- **Copy to Clipboard**: Copies JSON data for pasting elsewhere
- Data format matches your existing GPS simulator requirements

## 📊 Output Format

The tool generates JSON in this format:

```json
[
  {
    "lat": 6.927079,
    "lng": 79.861244,
    "duration": 5000,
    "name": "Start"
  },
  {
    "lat": 6.927089,
    "lng": 79.861254,
    "duration": 900,
    "name": "Point 1"
  },
  {
    "lat": 6.927099,
    "lng": 79.861264,
    "duration": 900,
    "name": "Point 2"
  },
  ...
  {
    "lat": 6.928079,
    "lng": 79.862244,
    "duration": 900,
    "name": "End"
  }
]
```

### Field Descriptions

- **lat**: Latitude in decimal degrees (6 decimal places)
- **lng**: Longitude in decimal degrees (6 decimal places)  
- **duration**: Time to travel to this point in milliseconds
- **name**: Human-readable identifier for the point

## ⚙️ Configuration Options

### Speed Settings
- Default: 40 km/h
- Range: 1-120 km/h
- Used for duration calculations between GPS points
- Duration = (10 meters / speed) converted to milliseconds

### Interval Settings
- Default: 10 meters between GPS points
- Range: 1-1000 meters (configurable via UI)
- Lower intervals = more GPS points (higher precision, larger files)
- Higher intervals = fewer GPS points (lower precision, smaller files)
- Uses spherical linear interpolation (SLERP) for accuracy
- Automatically handles coordinate precision (6 decimal places)

## 🔧 API Integration

### OpenRouteService Configuration

The tool uses the following API endpoint:
```
POST https://api.openrouteservice.org/v2/directions/driving-car/geojson
```

### Request Format
```json
{
  "coordinates": [[lng1, lat1], [lng2, lat2], ...],
  "format": "geojson",
  "instructions": false,
  "geometry": true,
  "options": {
    "avoid_features": [],
    "avoid_borders": "none",
    "avoid_countries": []
  }
}
```

### Headers Required
```
Authorization: YOUR_API_KEY
Content-Type: application/json; charset=utf-8
Accept: application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8
```

### Rate Limits
- Free tier: 2,000 requests/day
- Maximum 50 waypoints per request
- For larger routes, the tool can chunk requests automatically

## 🛠️ Technical Details

### Dependencies
- **Leaflet 1.9.4**: Map rendering and interaction
- **OpenStreetMap**: Base map tiles
- **OpenRouteService API**: Route calculation
- **Vanilla JavaScript**: No frameworks required

### Browser Compatibility
- Modern browsers with ES6+ support
- Clipboard API for copy functionality
- Geolocation API for current location (optional)
- LocalStorage for API key persistence

### Mathematical Functions
- **Haversine Formula**: Distance calculations between coordinates
- **Spherical Linear Interpolation (SLERP)**: Accurate coordinate interpolation
- **Bearing Calculations**: Direction between points
- **Coordinate Validation**: Ensures valid lat/lng ranges

## 🧪 Testing

### Manual Testing
1. Add 2+ waypoints on the map
2. Generate route with valid API key
3. Verify route displays correctly
4. Check GPS point count matches expected interpolation
5. Test export functionality (download/copy)
6. Verify JSON format matches simulator requirements

### Test Data Attributes
The interface includes `data-testid` attributes for automated testing:

- `map-container`: Main map element
- `api-key-input`: API key input field
- `speed-input`: Speed configuration input
- `interval-input`: GPS point interval input field
- `generate-route-btn`: Route generation button
- `clear-map-btn`: Clear map button
- `download-json-btn`: Download export button
- `copy-json-btn`: Copy to clipboard button
- `waypoint-count`: Waypoint counter display
- `total-distance`: Distance display
- `estimated-time`: Time display
- `gps-points-count`: GPS points counter
- `current-interval`: Current interval display
- `status-message`: Status message area

## 🚨 Error Handling

### Common Errors and Solutions

#### "Invalid API key"
- Check your OpenRouteService API key
- Ensure key has proper permissions
- Verify account is not exceeded quota

#### "No route found"
- Check if waypoints are accessible by car
- Avoid placing points in water or restricted areas
- Try reducing distance between waypoints

#### "Maximum 50 waypoints allowed"
- Remove some waypoints
- The tool will automatically chunk larger routes (future enhancement)

#### "Could not get current location"
- Enable location permissions in browser
- Ensure HTTPS connection for geolocation API
- Use manual map navigation instead

## 🔮 Future Enhancements

- [ ] Import existing waypoints from JSON/GPX files
- [ ] Support for different transport modes (walking, cycling, truck)
- [ ] Batch processing for multiple routes
- [ ] Route optimization and editing
- [ ] Custom interpolation intervals
- [ ] Offline map support
- [ ] GPX export format
- [ ] Route comparison and analysis

## 📄 License

This project is provided as-is for GPS simulator testing purposes. Feel free to modify and distribute according to your needs.

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:

1. Check this README for common solutions
2. Verify your OpenRouteService API setup
3. Test with simple 2-point routes first
4. Check browser console for error messages

---

**Happy GPS Testing!** 🗺️📍 