# GPS Simulator - Multi-Device Testing Tool

A modular GPS simulator for testing backend APIs with up to 1000 devices streaming GPS coordinates in parallel. Built with plain HTML, CSS, and JavaScript using OpenStreetMap (Leaflet) for visualization.

## 🎯 Purpose

This tool is designed for **internal API testing only** - simulating GPS coordinate streaming to test backend APIs and behavior with multiple devices. It is **not** intended for UI testing or Playwright automation.

## ✨ Features

### Core Functionality
- **🚀 Bulk Device Simulation**: Support for up to 1000 devices running in parallel
- **🗺️ OpenStreetMap Integration**: No API keys required - uses Leaflet.js
- **👁️ Visual Tracking**: Display 1-2 selected devices on the map while others run silently
- **⏰ Staggered Startup**: Configurable delays (100-200ms) between device starts to reduce CPU load
- **🔐 Token Authentication**: Bearer token support with validation and inspection
- **🌍 Environment Selection**: Staging, Production, and Custom endpoint support

### Data Management
- **📁 JSON Upload**: Load device data from files or manual paste
- **📊 Real-time Statistics**: Track active devices, API calls, and errors
- **🔧 Modular Architecture**: Clean separation of concerns across modules
- **💾 Session Persistence**: Auto-save tokens and settings

### Visualization
- **📍 Device Markers**: Color-coded markers with status indicators
- **🛤️ Path Tracking**: Optional path visualization for device movement
- **📊 Live Statistics**: Real-time counters and device status overlay
- **🎯 Auto-fitting**: Map automatically adjusts to show active devices

## 🏗️ Architecture

```
gps-simulator/
├── index.html              # Main UI and app initialization
├── css/
│   └── style.css          # Professional styling and responsive design
├── js/
│   ├── utils.js           # Logging, token parsing, validation utilities
│   ├── api.js             # Token management and GPS API calls
│   ├── ui.js              # Leaflet map visualization and device tracking
│   └── devices.js         # Bulk simulation and coordinate streaming
├── data/
│   └── sample.json        # Example device data (12 devices across Sri Lanka)
└── README.md              # This documentation
```

## 📋 Device Data Format

Device data should be provided as a JSON array with the following structure:

```json
[
  {
    "deviceId": "DEV-001",
    "coordinates": [
      {
        "lat": 6.921,
        "lng": 79.850,
        "duration": 5000,
        "name": "Location Name",
        "speed": 45
      }
    ]
  }
]
```

### Field Descriptions
- **`deviceId`** (required): Unique identifier for the device
- **`coordinates`** (required): Array of GPS coordinates to simulate
  - **`lat`** (required): Latitude (-90 to 90)
  - **`lng`** (required): Longitude (-180 to 180)
  - **`duration`** (optional): Wait time in milliseconds before next coordinate (default: 3000)
  - **`name`** (optional): Human-readable location name
  - **`speed`** (optional): Vehicle speed in km/h (default: 45)

## 🚀 Quick Start

### 1. Setup
1. Clone or download the GPS simulator files
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. No server setup required - works with `file://` protocol

### 2. Authentication
1. Get your Bearer token from your authentication system:
   - Open browser dev tools (F12)
   - Go to Network tab
   - Make an API request to your system
   - Copy the token from `Authorization: Bearer <token>` header
2. Paste the token in the "Bearer Token" field (without "Bearer " prefix)
3. Click "Set Token" or use "Inspect" to validate first

### 3. Load Device Data
Choose one of these options:
- **📋 Load Sample**: Uses built-in sample data (12 devices)
- **📂 Upload JSON**: Select a JSON file with your device data
- **✏️ Manual Paste**: Copy/paste JSON data directly

### 4. Configure Visualization (Optional)
- Select 1-2 devices to visualize on the map
- Other devices will run silently in the background
- Toggle path visualization on/off

### 5. Start Simulation
1. Set the stagger delay (recommended: 150ms)
2. Click "Start Simulation"
3. Monitor progress in the debug log and statistics panel

## 🔧 API Integration

### Endpoint Configuration
The simulator supports multiple environments:

- **Staging**: `https://staging-api.example-platform.com/api/telematics/gps-data/v1`
- **Production**: `https://api.example-platform.com/api/telematics/gps-data/v1`
- **Custom**: Enter your own endpoint URL

### API Request Format
Each GPS coordinate is sent as a POST request:

```json
{
  "deviceId": "DEV-001",
  "latitude": 6.921,
  "longitude": 79.850,
  "speed": 45,
  "reportedAt": "2024-01-15T10:30:00.000Z",
  "coordinateIndex": 0,
  "coordinateName": "Location Name"
}
```

### Headers
```
Content-Type: application/json
Authorization: Bearer <your-token>
```

## 📊 Monitoring & Statistics

### Real-time Metrics
- **Active Devices**: Currently running simulations
- **Total API Calls**: Successful GPS data transmissions
- **Errors**: Failed API calls with detailed error messages
- **Response Times**: Performance monitoring for each API call

### Debug Information
- Detailed logging with timestamps
- Token validation and expiry information
- API response analysis
- Network connectivity status
- Device simulation progress

### Export Capabilities
- Export debug logs as text files
- Timestamp-based filenames for easy organization
- Complete session history included

## 🛠️ Advanced Usage

### External Integration
The simulator exposes a global `GPSSimulator` object for external control:

```javascript
// Load device data programmatically
GPSSimulator.loadDeviceData(deviceArray);

// Start/stop simulation
GPSSimulator.startSimulation();
GPSSimulator.stopSimulation();

// Send individual GPS coordinates
await GPSSimulator.sendGPS(deviceId, lat, lng, options);

// Get current status
const status = GPSSimulator.getStatus();
```

### URL Parameters
Support for token injection via URL:
```
index.html?token=your-bearer-token-here
```

### Performance Optimization
- **Staggered Startup**: Prevents API flooding
- **Request Queueing**: Manages concurrent API calls
- **Memory Management**: Limits log entries and path points
- **Silent Mode**: Background devices don't update UI

## 🔍 Troubleshooting

### Common Issues

#### Authentication Problems
- **"JWT signature does not match"**: Token is expired or invalid
- **"Non-ASCII characters"**: Copy/paste error - use "Inspect" button
- **"Token expired"**: Get a fresh token from your system

#### Network Issues
- **CORS errors**: Check if your API supports cross-origin requests
- **Connection timeouts**: Verify API endpoint and network connectivity
- **429 Rate Limiting**: Reduce device count or increase stagger delay

#### Performance Issues
- **Browser slowdown**: Reduce device count or disable path visualization
- **High memory usage**: Clear debug log regularly
- **API overload**: Increase stagger delay between device starts

### Debug Features
- **Token Inspector**: Analyze JWT tokens before use
- **Network Testing**: Test API connectivity without full simulation
- **Verbose Logging**: Detailed information about each operation
- **Error Recovery**: Automatic retry logic for failed requests

## 📈 Best Practices

### Device Count Guidelines
- **1-10 devices**: Full visualization and detailed logging
- **10-100 devices**: Selective visualization, moderate logging
- **100-1000 devices**: Silent mode recommended, minimal UI updates

### API Rate Limiting
- Start with smaller device counts (10-20)
- Monitor API response times and error rates
- Adjust stagger delay based on backend capacity
- Use staging environment for large-scale testing

### Data Preparation
- Validate GPS coordinates before upload
- Use realistic durations between coordinates
- Include meaningful location names for debugging
- Test with small datasets first

### Security Considerations
- Never commit bearer tokens to version control
- Use staging tokens for development/testing
- Clear tokens when switching environments
- Monitor token expiry times

## 🧪 Testing Scenarios

### Typical Use Cases
1. **Backend Load Testing**: Simulate hundreds of devices for stress testing
2. **API Validation**: Test GPS data processing and storage
3. **Geofence Testing**: Simulate devices crossing geographic boundaries
4. **Route Analysis**: Test path tracking and optimization algorithms
5. **Real-time Processing**: Validate live GPS data streaming

### Sample Test Plans
- **Concurrency Test**: 100 devices starting simultaneously
- **Duration Test**: Long-running simulation with varying speeds
- **Error Handling**: Test with invalid coordinates and expired tokens
- **Scaling Test**: Gradually increase device count to find limits

## 📞 Support

### For Development Issues
- Check browser console for JavaScript errors
- Use the built-in debug logging system
- Test with sample data first
- Verify token authentication separately

### For API Integration
- Confirm endpoint URLs and authentication
- Test with minimal device count initially
- Monitor backend logs for processing issues
- Validate GPS data format and content

---

**Version**: 1.0  
**Last Updated**: 2024  
**License**: Internal Use Only  
**Requirements**: Modern web browser with ES6+ support 