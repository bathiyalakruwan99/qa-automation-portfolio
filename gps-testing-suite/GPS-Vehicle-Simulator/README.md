# GPS Vehicle Simulator

A comprehensive web-based GPS vehicle simulator for testing GPS data transmission to various API endpoints. This tool provides an interactive map interface for simulating vehicle movement and sending real-time GPS data to development, staging, and production environments.

## 🚀 Features

### Core Functionality
- **Interactive Map**: Click anywhere on the map to simulate vehicle movement
- **Real-time GPS Data**: Send authentic GPS coordinates to your API endpoints
- **Multi-Environment Support**: Test against development, staging, and production APIs
- **Token Management**: Secure bearer token handling with validation and inspection
- **Debug Console**: Real-time logging and API response monitoring

### Advanced Features
- **Token Validation**: Comprehensive JWT token analysis and validation
- **Drag & Drop**: Drag the vehicle marker to new positions
- **Auto-transmission**: Automatically send GPS data when moving the vehicle
- **Network Testing**: Dedicated network connectivity testing tools
- **CORS Handling**: Built-in CORS support for cross-origin API calls

## 🛠️ Setup

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for Google Maps API
- Valid bearer token from your authentication system

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/gps-vehicle-simulator.git
   cd gps-vehicle-simulator
   ```

2. Open `devtool gps path maker.html` in your web browser

3. The tool is ready to use! No additional setup required.

## 📖 Usage

### Getting Started

1. **Get Your Bearer Token**:
   - Log into your example platform system
   - Open browser developer tools (F12)
   - Go to Network tab and make any API request
   - Find a request with "Authorization: Bearer ..." header
   - Copy the token part (after "Bearer ")

2. **Set Up the Tool**:
   - Paste your bearer token in the text area
   - Click "Use This Token" (or "Inspect" to analyze first)
   - Select your target environment (Staging/Production/Development)

3. **Simulate Vehicle Movement**:
   - Click anywhere on the map to move the vehicle
   - GPS data is automatically sent to your selected API endpoint
   - Watch the debug console for real-time feedback

### API Endpoints

The simulator supports three environments:

- **Development**: `http://localhost:8080/api/telematics/gps-data/v1`
- **Staging**: `https://staging-api.example-platform.com/api/telematics/gps-data/v1`
- **Production**: `https://api.example-platform.com/api/telematics/gps-data/v1`

### GPS Data Format

The tool sends GPS data in the following JSON format:

```json
{
  "deviceId": "350612076505187",
  "latitude": 6.993909,
  "longitude": 79.92087,
  "speed": 45,
  "reportedAt": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Controls & Tools

### Authentication
- **Token Input**: Secure token management with validation
- **Inspect Token**: Analyze JWT tokens for expiry, scopes, and format
- **Token Validation**: Automatic detection of common token issues

### Testing Tools
- **Manual API Call**: Send GPS data manually
- **Test Network Only**: Check connectivity without sending data
- **Force Test Production**: Direct production endpoint testing
- **Clear Everything**: Reset all data and start fresh

### Configuration
- **Device ID**: Customize the GPS device identifier
- **Speed**: Set vehicle speed (0-120 km/h)
- **Environment**: Switch between dev/staging/production
- **Test Position**: Manual coordinate input

## 🐛 Troubleshooting

### Common Issues

#### "JWT signature does not match"
- **Cause**: Invalid or expired token
- **Solution**: Get a fresh token from your authentication system

#### "Non-ASCII characters"
- **Cause**: Copy/paste formatting issues
- **Solution**: Use the "Inspect" button to analyze and clean the token

#### "Token expired"
- **Cause**: The JWT token has passed its expiration time
- **Solution**: Generate a new token from your system

#### CORS Errors
- **Cause**: Cross-origin request blocked by browser
- **Solution**: Ensure your API endpoints have proper CORS headers

### Debug Features

The debug console provides detailed information about:
- API request/response details
- Token validation results
- Network connectivity status
- GPS data transmission logs
- Error messages with solutions

## 🎯 Use Cases

### Development Testing
- Test GPS data flow during development
- Validate API endpoint responses
- Debug authentication issues

### QA & Staging
- Simulate realistic vehicle movements
- Test GPS data processing pipelines
- Validate production-like scenarios

### Production Monitoring
- Verify production API accessibility
- Test real authentication tokens
- Monitor GPS data transmission

## 🔒 Security Notes

- Tokens are stored only in browser memory (not persistent)
- Token input field is cleared after use
- All API calls use HTTPS (except localhost)
- No sensitive data is logged to console

## 🌐 Browser Compatibility

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+

## 📝 Technical Details

### Dependencies
- Google Maps JavaScript API
- Modern browser with Fetch API support
- JWT token support

### File Structure
```
GPS-Vehicle-Simulator/
├── devtool gps path maker.html    # Main application file
└── README.md                      # This file
```

### Key Components
- **Authentication Manager**: Handles bearer token operations
- **Map Controller**: Manages Google Maps integration
- **API Client**: Handles HTTP requests to GPS endpoints
- **Debug Logger**: Provides comprehensive logging system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Use the "Inspect Token" feature for token-related issues
3. Review the debug console for detailed error messages
4. Open an issue on GitHub with detailed information

## 🚗 About

This GPS Vehicle Simulator was built to simplify GPS data testing and validation across different environments. It provides a user-friendly interface for developers, QA engineers, and system administrators to test GPS tracking systems without needing physical vehicles or complex setup procedures.

---

**Happy Testing! 🚀** 