/**
 * UI Module for GPS Simulator
 * Handles Leaflet map visualization and device tracking
 */

const UI = {
    // Map state
    map: null,
    deviceMarkers: new Map(),
    devicePaths: new Map(),
    showPaths: false,
    
    // Visual device tracking
    visualDevices: [],
    maxVisualDevices: 2,
    
    /**
     * Initialize UI module
     */
    init() {
        log('🗺️ UI module initialized');
        this.initMap();
    },

    /**
     * Initialize Leaflet map
     */
    initMap() {
        try {
            log('🗺️ Initializing OpenStreetMap with Leaflet...');
            
            // Create the map centered on Sri Lanka (default location)
            this.map = L.map('map', {
                center: [6.9271, 79.8612],
                zoom: 8,
                zoomControl: true,
                attributionControl: true
            });
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);
            
            // Add scale control
            L.control.scale({
                imperial: false,
                metric: true
            }).addTo(this.map);
            
            log('✅ OpenStreetMap initialized successfully!');
            Utils.updateStatus('map-status', 'good', 'Map Ready');
            
            // Set up map event listeners
            this.setupMapEvents();
            
        } catch (error) {
            log(`❌ Map initialization failed: ${error.message}`);
            Utils.updateStatus('map-status', 'bad', 'Map Failed');
        }
    },

    /**
     * Set up map event listeners
     */
    setupMapEvents() {
        if (!this.map) return;
        
        // Log map interactions
        this.map.on('zoomend', () => {
            log(`🔍 Map zoom level: ${this.map.getZoom()}`);
        });
        
        this.map.on('moveend', () => {
            const center = this.map.getCenter();
            log(`📍 Map center: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`);
        });
        
        // Click handler for manual coordinate selection
        this.map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            log(`🖱️ Map clicked: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            
            // Could be used for manual device placement in future
            this.showCoordinatePopup(lat, lng);
        });
    },

    /**
     * Show coordinate popup on map click
     */
    showCoordinatePopup(lat, lng) {
        L.popup()
            .setLatLng([lat, lng])
            .setContent(`
                <div style="text-align: center;">
                    <strong>📍 Coordinates</strong><br>
                    Lat: ${lat.toFixed(6)}<br>
                    Lng: ${lng.toFixed(6)}<br>
                    <small>Click to copy coordinates</small>
                </div>
            `)
            .openOn(this.map);
    },

    /**
     * Add or update device marker on map
     */
    updateDeviceMarker(deviceId, latitude, longitude, options = {}) {
        if (!this.map) {
            log('❌ Map not initialized');
            return;
        }
        
        // Check if device should be visualized
        if (!this.visualDevices.includes(deviceId)) {
            return; // Device not selected for visualization
        }
        
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        
        if (!Utils.ValidationUtils.isValidCoordinate(lat, lng)) {
            log(`❌ Invalid coordinates for device ${deviceId}: ${lat}, ${lng}`);
            return;
        }
        
        // Get or create marker
        let marker = this.deviceMarkers.get(deviceId);
        
        if (marker) {
            // Update existing marker position
            marker.setLatLng([lat, lng]);
            
            // Update popup content
            this.updateMarkerPopup(marker, deviceId, lat, lng, options);
            
        } else {
            // Create new marker
            const markerColor = this.getDeviceColor(deviceId);
            const markerIcon = this.createDeviceIcon(markerColor, options.status);
            
            marker = L.marker([lat, lng], {
                icon: markerIcon,
                title: `Device: ${deviceId}`
            }).addTo(this.map);
            
            // Set popup
            this.updateMarkerPopup(marker, deviceId, lat, lng, options);
            
            // Store marker
            this.deviceMarkers.set(deviceId, marker);
            
            log(`📍 Created marker for device ${deviceId} at ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
        
        // Update path if enabled
        this.updateDevicePath(deviceId, lat, lng);
        
        // Auto-center on first visual device
        if (this.visualDevices.length === 1 && this.visualDevices[0] === deviceId) {
            this.map.setView([lat, lng], Math.max(this.map.getZoom(), 12));
        }
    },

    /**
     * Create custom icon for device markers
     */
    createDeviceIcon(color, status = 'active') {
        const iconHtml = `
            <div style="
                width: 24px; 
                height: 24px; 
                background: ${color}; 
                border: 3px solid white; 
                border-radius: 50%; 
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: white;
                font-weight: bold;
            ">
                ${status === 'active' ? '🚗' : status === 'error' ? '❌' : '⏸️'}
            </div>
        `;
        
        return L.divIcon({
            html: iconHtml,
            className: 'device-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
        });
    },

    /**
     * Update marker popup content
     */
    updateMarkerPopup(marker, deviceId, lat, lng, options = {}) {
        const timestamp = new Date().toLocaleTimeString();
        const speed = options.speed || 0;
        const status = options.status || 'active';
        
        const popupContent = `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #333;">🚗 ${deviceId}</h4>
                <div style="font-size: 12px; line-height: 1.4;">
                    <strong>📍 Position:</strong><br>
                    Lat: ${lat.toFixed(6)}<br>
                    Lng: ${lng.toFixed(6)}<br><br>
                    
                    <strong>📊 Status:</strong><br>
                    Speed: ${speed} km/h<br>
                    Status: ${status}<br>
                    Updated: ${timestamp}<br><br>
                    
                    ${options.additionalInfo ? `<strong>ℹ️ Info:</strong><br>${options.additionalInfo}` : ''}
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    },

    /**
     * Get unique color for device
     */
    getDeviceColor(deviceId) {
        // Generate consistent color based on device ID
        let hash = 0;
        for (let i = 0; i < deviceId.length; i++) {
            hash = deviceId.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Convert to HSL color with good visibility
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 70%, 50%)`;
    },

    /**
     * Update device path trail
     */
    updateDevicePath(deviceId, lat, lng) {
        if (!this.showPaths) return;
        
        let path = this.devicePaths.get(deviceId);
        
        if (!path) {
            // Create new path
            const color = this.getDeviceColor(deviceId);
            path = {
                polyline: L.polyline([], {
                    color: color,
                    weight: 3,
                    opacity: 0.7,
                    smoothFactor: 1
                }).addTo(this.map),
                coordinates: []
            };
            
            this.devicePaths.set(deviceId, path);
        }
        
        // Add new coordinate to path
        const newPoint = [lat, lng];
        path.coordinates.push(newPoint);
        
        // Limit path length to prevent performance issues
        const maxPathPoints = 1000;
        if (path.coordinates.length > maxPathPoints) {
            path.coordinates = path.coordinates.slice(-maxPathPoints);
        }
        
        // Update polyline
        path.polyline.setLatLngs(path.coordinates);
    },

    /**
     * Toggle path visibility for all devices
     */
    togglePaths() {
        this.showPaths = !this.showPaths;
        
        const toggleBtn = document.getElementById('pathToggleBtn');
        if (toggleBtn) {
            toggleBtn.textContent = this.showPaths ? '👁️ Hide Paths' : '👁️ Show Paths';
        }
        
        if (this.showPaths) {
            log('👁️ Device paths enabled');
            // Show existing paths
            this.devicePaths.forEach((path, deviceId) => {
                if (!this.map.hasLayer(path.polyline)) {
                    this.map.addLayer(path.polyline);
                }
            });
        } else {
            log('👁️ Device paths disabled');
            // Hide all paths
            this.devicePaths.forEach((path, deviceId) => {
                if (this.map.hasLayer(path.polyline)) {
                    this.map.removeLayer(path.polyline);
                }
            });
        }
    },

    /**
     * Update visualization devices selection
     */
    updateVisualization() {
        const device1Select = document.getElementById('visualDevice1');
        const device2Select = document.getElementById('visualDevice2');
        
        const selectedDevices = [
            device1Select.value,
            device2Select.value
        ].filter(id => id && id !== '');
        
        // Remove markers for devices no longer selected
        this.visualDevices.forEach(deviceId => {
            if (!selectedDevices.includes(deviceId)) {
                this.removeDeviceVisualization(deviceId);
            }
        });
        
        // Update visual devices list
        this.visualDevices = selectedDevices;
        
        log(`👁️ Updated visualization for devices: [${selectedDevices.join(', ')}]`);
        
        // Fit map to show selected devices
        if (selectedDevices.length > 0) {
            this.fitMapToVisualDevices();
        }
    },

    /**
     * Remove device visualization
     */
    removeDeviceVisualization(deviceId) {
        // Remove marker
        const marker = this.deviceMarkers.get(deviceId);
        if (marker) {
            this.map.removeLayer(marker);
            this.deviceMarkers.delete(deviceId);
        }
        
        // Remove path
        const path = this.devicePaths.get(deviceId);
        if (path) {
            this.map.removeLayer(path.polyline);
            this.devicePaths.delete(deviceId);
        }
        
        log(`🗑️ Removed visualization for device ${deviceId}`);
    },

    /**
     * Populate device selection dropdowns
     */
    populateDeviceSelectors(devices) {
        const device1Select = document.getElementById('visualDevice1');
        const device2Select = document.getElementById('visualDevice2');
        
        if (!device1Select || !device2Select) return;
        
        // Store current selections
        const currentDevice1 = device1Select.value;
        const currentDevice2 = device2Select.value;
        
        // Clear existing options (except "None")
        [device1Select, device2Select].forEach(select => {
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }
        });
        
        // Add device options
        devices.forEach(device => {
            const option1 = new Option(device.deviceId, device.deviceId);
            const option2 = new Option(device.deviceId, device.deviceId);
            
            device1Select.add(option1);
            device2Select.add(option2);
        });
        
        // Restore selections if still valid
        if (devices.find(d => d.deviceId === currentDevice1)) {
            device1Select.value = currentDevice1;
        }
        if (devices.find(d => d.deviceId === currentDevice2)) {
            device2Select.value = currentDevice2;
        }
        
        log(`📋 Populated device selectors with ${devices.length} devices`);
    },

    /**
     * Fit map bounds to show all visual devices
     */
    fitMapToBounds() {
        if (!this.map || this.deviceMarkers.size === 0) {
            log('ℹ️ No devices to fit on map');
            return;
        }
        
        const group = L.featureGroup([...this.deviceMarkers.values()]);
        this.map.fitBounds(group.getBounds().pad(0.1));
        
        log('📏 Map fitted to show all visible devices');
    },

    /**
     * Fit map to show only visual devices
     */
    fitMapToVisualDevices() {
        if (!this.map || this.visualDevices.length === 0) return;
        
        const visualMarkers = this.visualDevices
            .map(deviceId => this.deviceMarkers.get(deviceId))
            .filter(marker => marker);
        
        if (visualMarkers.length === 0) return;
        
        if (visualMarkers.length === 1) {
            // Center on single device
            const marker = visualMarkers[0];
            this.map.setView(marker.getLatLng(), 14);
        } else {
            // Fit bounds to multiple devices
            const group = L.featureGroup(visualMarkers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
        
        log('🎯 Map fitted to visual devices');
    },

    /**
     * Clear all device visualizations
     */
    clearAllDevices() {
        // Remove all markers
        this.deviceMarkers.forEach((marker, deviceId) => {
            this.map.removeLayer(marker);
        });
        this.deviceMarkers.clear();
        
        // Remove all paths
        this.devicePaths.forEach((path, deviceId) => {
            this.map.removeLayer(path.polyline);
        });
        this.devicePaths.clear();
        
        // Clear visual devices
        this.visualDevices = [];
        
        // Reset selectors
        const device1Select = document.getElementById('visualDevice1');
        const device2Select = document.getElementById('visualDevice2');
        
        if (device1Select) device1Select.value = '';
        if (device2Select) device2Select.value = '';
        
        log('🗑️ Cleared all device visualizations');
    },

    /**
     * Update device status indicator
     */
    updateDeviceStatus(deviceId, status, errorMessage = null) {
        const marker = this.deviceMarkers.get(deviceId);
        if (!marker) return;
        
        // Update marker icon based on status
        const color = this.getDeviceColor(deviceId);
        const newIcon = this.createDeviceIcon(color, status);
        marker.setIcon(newIcon);
        
        // Update popup with status info
        const currentPopup = marker.getPopup();
        if (currentPopup) {
            const content = currentPopup.getContent();
            // Could update popup content with status/error info
        }
        
        log(`📊 Updated status for device ${deviceId}: ${status}`);
    },

    /**
     * Show device statistics overlay
     */
    showDeviceStats(devices) {
        if (!this.map) return;
        
        const activeDevices = devices.filter(d => d.status === 'active').length;
        const totalDevices = devices.length;
        
        // Create or update stats control
        if (!this.statsControl) {
            this.statsControl = L.control({ position: 'topleft' });
            
            this.statsControl.onAdd = function() {
                const div = L.DomUtil.create('div', 'device-stats');
                div.style.cssText = `
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    border: 1px solid #ddd;
                `;
                return div;
            };
            
            this.statsControl.addTo(this.map);
        }
        
        // Update stats content
        const statsDiv = document.querySelector('.device-stats');
        if (statsDiv) {
            statsDiv.innerHTML = `
                <strong>📊 Devices</strong><br>
                Active: ${activeDevices}<br>
                Total: ${totalDevices}<br>
                Visual: ${this.visualDevices.length}
            `;
        }
    },

    /**
     * Get current map state
     */
    getMapState() {
        if (!this.map) return null;
        
        const center = this.map.getCenter();
        return {
            center: { lat: center.lat, lng: center.lng },
            zoom: this.map.getZoom(),
            visualDevices: [...this.visualDevices],
            showPaths: this.showPaths,
            deviceCount: this.deviceMarkers.size
        };
    },

    /**
     * Restore map state
     */
    restoreMapState(state) {
        if (!this.map || !state) return;
        
        this.map.setView([state.center.lat, state.center.lng], state.zoom);
        this.showPaths = state.showPaths;
        
        // Update path toggle button
        const toggleBtn = document.getElementById('pathToggleBtn');
        if (toggleBtn) {
            toggleBtn.textContent = this.showPaths ? '👁️ Hide Paths' : '👁️ Show Paths';
        }
        
        log('🔄 Map state restored');
    }
};

// Export for external use
window.UI = UI; 