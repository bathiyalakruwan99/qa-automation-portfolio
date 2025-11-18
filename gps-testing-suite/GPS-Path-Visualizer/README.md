# 🗺️ GPS Path Visualizer

A web-based GPS coordinate path visualizer that uses OpenStreetMap and Leaflet to display and navigate through GPS coordinate sequences. **No API keys required!**

![GPS Path Visualizer](https://img.shields.io/badge/Map-OpenStreetMap-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Status](https://img.shields.io/badge/Status-Active-brightgreen)

## ✨ Features

### 🗺️ Map Visualization
- **OpenStreetMap Integration**: Uses free OpenStreetMap tiles - no Google Maps API keys needed
- **Interactive Map**: Pan, zoom, and explore the coordinate path
- **Responsive Design**: Works on desktop and mobile devices
- **Path Visualization**: Show/hide the complete route path with toggle controls

### 📊 Data Management
- **Multi-format Support**: Load data from JSON files or paste directly
- **Flexible Coordinate Formats**: Supports `lat/lng`, `latitude/longitude`, and other common formats
- **Sample Data**: Built-in sample data for testing
- **Real-time Status**: Live status indicators for map, data, and path states

### 🎯 Navigation Controls
- **Step-by-step Navigation**: Move through coordinates one by one
- **Jump to Position**: Quick navigation to any specific coordinate
- **Auto-play Mode**: Automatic progression through the entire path
- **Speed Control**: Adjustable playback speed (0.1x to 5x)
- **Progress Tracking**: Real-time progress information with distance and duration

### 📈 Analytics & Information
- **Route Statistics**: Total distance, duration, and average speed calculations
- **Position Details**: Detailed information for each coordinate point
- **Debug Logging**: Comprehensive logging for troubleshooting
- **Distance Calculations**: Accurate distance measurements between points

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for loading local JSON files) or simply open directly in browser

### Installation

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd GPS-Path-Visualizer
   ```

2. **Open in Browser**
   - Simply open `gps path visualizer.html` in your web browser
   - Or serve via local web server for full functionality

3. **For Local Development**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

## 📝 Usage

### Loading Data

#### Method 1: JSON File
Create a `coordinates-formatted.json` file in the same directory:
```json
[
  {
    "lat": 6.9810533,
    "lng": 81.0536566,
    "duration": 7000,
    "name": "Start Point"
  },
  {
    "lat": 6.9808416,
    "lng": 81.0537516,
    "duration": 4000,
    "name": "Waypoint 1"
  }
]
```

#### Method 2: Manual Input
Paste JSON data directly into the text area in the application.

#### Method 3: Sample Data
Use the built-in sample data for testing and demonstration.

### Data Format

The application supports flexible coordinate formats:

```json
{
  "lat": 6.9810533,           // Required: Latitude
  "lng": 81.0536566,          // Required: Longitude (also accepts 'lon' or 'longitude')
  "duration": 7000,           // Optional: Time to spend at this point (ms)
  "name": "Location Name"     // Optional: Display name for the point
}
```

### Navigation

- **📊 Load Data**: Load coordinate data from file or manual input
- **🎯 Navigate**: Use First/Previous/Next/Last buttons
- **▶️ Auto-play**: Automatic progression through coordinates
- **🔄 Reset**: Return to the starting position
- **📏 Fit View**: Zoom map to show all coordinates
- **👁️ Toggle Path**: Show/hide the complete route line

## 🛠️ Technical Details

### Built With
- **[Leaflet](https://leafletjs.com/)** - Interactive map library
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Free map tiles
- **Vanilla JavaScript** - No additional frameworks required
- **HTML5 & CSS3** - Modern web standards

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

### File Structure
```
GPS-Path-Visualizer/
├── gps path visualizer.html    # Main application file
├── README.md                   # This documentation
└── coordinates-formatted.json  # Optional: Your coordinate data
```

## 🎨 Customization

### Styling
The application uses CSS variables and is easily customizable. Key style sections:
- Map container styling
- Control panel layout
- Button themes and colors
- Status indicators

### Map Options
You can modify the default map settings in the JavaScript:
```javascript
map = L.map('map', {
    center: [6.9271, 79.8612],  // Default center coordinates
    zoom: 13                    // Default zoom level
});
```

## 🔧 Troubleshooting

### Common Issues

1. **"No Data" Status**
   - Ensure JSON file exists and is properly formatted
   - Check browser console for loading errors
   - Verify coordinate data format

2. **Map Not Loading**
   - Check internet connection (OpenStreetMap requires online access)
   - Verify browser compatibility
   - Check browser console for JavaScript errors

3. **Coordinates Not Displaying**
   - Verify latitude/longitude values are valid numbers
   - Ensure coordinates are within valid ranges (-90 to 90 for lat, -180 to 180 for lng)
   - Check data format matches expected structure

### Debug Information
The application includes a built-in debug panel that logs:
- Data loading status
- Map initialization
- Navigation actions
- Error messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Maintain compatibility with modern browsers
2. Keep the application dependency-free (no external JS frameworks)
3. Follow existing code style and patterns
4. Test with various coordinate data formats
5. Update documentation for new features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Look at the debug log in the application
3. Open an issue on GitHub with:
   - Browser and version
   - Sample coordinate data (if applicable)
   - Error messages from browser console

## 🎯 Roadmap

Future enhancements planned:
- [ ] Export functionality (GPX, KML formats)
- [ ] Offline map tiles support
- [ ] Custom marker icons
- [ ] Time-based playback (respecting actual timestamps)
- [ ] Route optimization features
- [ ] Mobile app version

---

**Made with ❤️ for GPS data visualization**

*Always works - No API keys required!* 