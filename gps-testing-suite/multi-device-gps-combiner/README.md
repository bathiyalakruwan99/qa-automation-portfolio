# 🛠 Multi-Device GPS Combiner Tool

A web-based tool for combining multiple GPS datasets from different devices into a single JSON file. Perfect for GPS test data preparation and device simulation scenarios.

## 🎯 Purpose

This tool allows you to:
- Upload or paste multiple individual GPS datasets
- Assign unique device IDs to each dataset
- Validate GPS data format and structure
- Export combined data as a single JSON array
- Download or copy the combined result

## 📁 Project Structure

```
multi-device-gps-combiner/
├── index.html          # Main application interface
├── css/
│   └── style.css       # Modern UI styling with glassmorphism effects
├── js/
│   ├── app.js          # Core application logic and device management
│   └── export.js       # JSON handling, validation, and export utilities
└── README.md           # This documentation
```

## 🚀 Getting Started

1. **Open the Tool**: Open `index.html` in any modern web browser
2. **Add Devices**: Click "➕ Add Device" to create device input blocks
3. **Enter Data**: For each device:
   - Enter a unique Device ID (e.g., "VEHICLE-1", "TRUCK-A")
   - Paste GPS data as JSON array OR upload a JSON file
4. **Generate**: Click "🚀 Generate Combined JSON" to create the combined output
5. **Export**: Copy to clipboard or download as JSON file

## 📋 Input Format

Each device's GPS data should be a JSON array with the following structure:

```json
[
  {
    "lat": 6.9271,
    "lng": 79.8612,
    "duration": 1000,
    "name": "Start Point"
  },
  {
    "lat": 6.9280,
    "lng": 79.8620,
    "duration": 2000,
    "name": "Next Point"
  }
]
```

### Required Fields
- `lat` (number): Latitude coordinate (-90 to 90)
- `lng` (number): Longitude coordinate (-180 to 180)
- `duration` (number): Time duration in milliseconds

### Optional Fields
- `name` (string): Descriptive name for the GPS point

## 📤 Output Format

The tool generates a combined JSON array with this structure:

```json
[
  {
    "deviceId": "VEHICLE-1",
    "coordinates": [
      {
        "lat": 6.9271,
        "lng": 79.8612,
        "duration": 1000,
        "name": "Start Point",
        "speed": 45
      }
    ]
  },
  {
    "deviceId": "VEHICLE-2",
    "coordinates": [
      {
        "lat": 6.9300,
        "lng": 79.8650,
        "duration": 1500,
        "name": "Another Point",
        "speed": 45
      }
    ]
  }
]
```

## ✨ Features

### Device Management
- ➕ **Add Multiple Devices**: Create as many device blocks as needed
- 🗑️ **Remove Devices**: Delete unwanted device blocks (minimum one required)
- 📱 **Device Numbering**: Automatic numbering for easy identification

### Data Input Options
- ✏️ **Manual Input**: Paste JSON data directly into textarea
- 📁 **File Upload**: Upload JSON files with drag-and-drop styling
- 🔄 **Real-time Validation**: Instant feedback on data format and structure

### Validation Features
- 📝 **JSON Syntax**: Validates proper JSON formatting
- 🗺️ **GPS Structure**: Ensures required fields (lat, lng) are present, adds default speed (45) if missing
- 🌍 **Coordinate Ranges**: Warns about invalid latitude/longitude values
- 🔑 **Unique Device IDs**: Prevents duplicate device identifiers
- ⚠️ **Error Feedback**: Clear error messages with specific locations

### Export Options
- 📋 **Copy to Clipboard**: Modern clipboard API with fallback support
- 💾 **Download JSON**: Automatic file download with timestamped filenames
- 📊 **Formatted Output**: Pretty-printed JSON with proper indentation

### User Experience
- 🎨 **Modern UI**: Glassmorphism design with smooth animations
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices
- ⚡ **Real-time Feedback**: Instant validation and success/error notifications
- 🎯 **Accessibility**: Proper labeling and keyboard navigation support

## 🧪 Testing Support

The tool includes comprehensive `data-testid` attributes for automated testing:

- `add-device-btn`: Add device button
- `generate-json-btn`: Generate combined JSON button
- `device-block-{id}`: Individual device blocks
- `device-id-input-{id}`: Device ID input fields
- `gps-data-input-{id}`: GPS data textarea fields
- `file-upload-{id}`: File upload inputs
- `json-output`: Final JSON output textarea
- `copy-json-btn`: Copy to clipboard button
- `download-json-btn`: Download JSON button

## 🔧 Browser Compatibility

- ✅ **Chrome/Edge** 80+
- ✅ **Firefox** 75+
- ✅ **Safari** 13+
- ✅ **Mobile Browsers** (iOS Safari, Chrome Mobile)

## 📚 Usage Examples

### Example 1: Two Vehicle Fleet
```json
// Input for VEHICLE-1
[
  {"lat": 6.9271, "lng": 79.8612, "duration": 1000, "name": "Depot"},
  {"lat": 6.9280, "lng": 79.8620, "duration": 2000, "name": "Stop 1"}
]

// Input for VEHICLE-2
[
  {"lat": 6.9290, "lng": 79.8630, "duration": 1500, "name": "Depot"},
  {"lat": 6.9300, "lng": 79.8640, "duration": 2500, "name": "Stop 1"}
]
```

### Example 2: Delivery Trucks
```json
// Input for TRUCK-A
[
  {"lat": 6.9271, "lng": 79.8612, "duration": 0, "name": "Warehouse"},
  {"lat": 6.9280, "lng": 79.8620, "duration": 900000, "name": "Customer 1"},
  {"lat": 6.9290, "lng": 79.8630, "duration": 1800000, "name": "Customer 2"}
]
```

## 🐛 Error Handling

The tool provides comprehensive error handling for:

- **Invalid JSON**: Clear syntax error messages
- **Missing Fields**: Specific field validation errors
- **Invalid Coordinates**: Range validation warnings
- **Duplicate Device IDs**: Conflict detection
- **Empty Data**: Required field validation
- **File Upload Errors**: File reading error handling

## 🎨 Customization

The tool uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --error-color: #dc3545;
  --warning-color: #ffc107;
}
```

## 📝 Notes

- This tool is designed for GPS test data preparation
- All processing happens client-side (no server required)
- Data is not stored or transmitted anywhere
- Perfect for development and testing scenarios
- Supports large datasets with efficient processing

## 🔜 Future Enhancements

- 📊 **Data Preview**: Visual preview of GPS paths on a map
- 📈 **Statistics**: GPS point counts and route analysis
- 🔄 **Batch Import**: Multiple file upload with automatic device naming
- 📋 **Templates**: Pre-defined GPS data templates
- 🧪 **Testing Integration**: Built-in Playwright test examples 