/**
 * Map Controller for GPS Path Builder
 * Handles map initialization, waypoint management, and user interactions
 */
const MapController = {
    map: null,
    waypoints: [],
    markers: [],
    routeLayer: null,
    waypointCounter: 0,

    /**
     * Initialize the map
     */
    init() {
        // Initialize Leaflet map
        this.map = L.map('map').setView([6.9271, 79.8612], 10); // Default to Colombo, Sri Lanka

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Add click event listener for adding waypoints
        this.map.on('click', (e) => {
            this.addWaypoint(e.latlng.lat, e.latlng.lng);
        });

        // Initialize map controls
        this.addMapControls();

        Utils.showStatus('Map initialized. Click on the map to add waypoints.', 'info');
    },

    /**
     * Add custom map controls
     */
    addMapControls() {
        // Add scale control
        L.control.scale().addTo(this.map);

        // Custom control for current location
        const CurrentLocationControl = L.Control.extend({
            onAdd: function(map) {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.style.backgroundColor = 'white';
                container.style.width = '30px';
                container.style.height = '30px';
                container.style.cursor = 'pointer';
                container.innerHTML = '📍';
                container.title = 'Go to current location';

                container.onclick = function() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            map.setView([lat, lng], 15);
                            Utils.showStatus('Moved to current location', 'success');
                        }, function(error) {
                            Utils.showStatus('Could not get current location: ' + error.message, 'error');
                        });
                    } else {
                        Utils.showStatus('Geolocation is not supported by this browser', 'error');
                    }
                };

                return container;
            }
        });

        new CurrentLocationControl({ position: 'topright' }).addTo(this.map);
    },

    /**
     * Add a waypoint to the map
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {string} name - Optional name for the waypoint
     */
    addWaypoint(lat, lng, name = null) {
        if (!Utils.isValidCoordinate(lat, lng)) {
            Utils.showStatus('Invalid coordinates', 'error');
            return;
        }

        this.waypointCounter++;
        const waypointName = name || `Point ${this.waypointCounter}`;
        
        const waypoint = {
            id: Utils.generateId(),
            lat: lat,
            lng: lng,
            name: waypointName,
            index: this.waypoints.length
        };

        this.waypoints.push(waypoint);

        // Create marker
        const marker = this.createWaypointMarker(waypoint);
        this.markers.push(marker);

        // Update UI
        if (typeof updateUI === 'function') {
            updateUI();
        }

        Utils.showStatus(`Added waypoint: ${waypointName}`, 'success');
    },

    /**
     * Create a marker for a waypoint
     * @param {Object} waypoint - Waypoint object
     * @returns {L.Marker} Leaflet marker
     */
    createWaypointMarker(waypoint) {
        // Create custom icon based on waypoint index
        const isStart = waypoint.index === 0;
        const isEnd = waypoint.index === this.waypoints.length - 1 && this.waypoints.length > 1;
        
        let iconColor = '#3498db'; // Default blue
        let iconSymbol = waypoint.index + 1;
        
        if (isStart) {
            iconColor = '#27ae60'; // Green for start
            iconSymbol = 'S';
        } else if (isEnd && this.waypoints.length > 1) {
            iconColor = '#e74c3c'; // Red for end
            iconSymbol = 'E';
        }

        const customIcon = L.divIcon({
            className: 'custom-waypoint-marker',
            html: `<div style="
                background-color: ${iconColor};
                color: white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">${iconSymbol}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const marker = L.marker([waypoint.lat, waypoint.lng], { icon: customIcon })
            .addTo(this.map);

        // Create popup content
        const popupContent = `
            <div class="waypoint-popup">
                <strong>${waypoint.name}</strong><br>
                <small>Lat: ${waypoint.lat.toFixed(6)}<br>
                Lng: ${waypoint.lng.toFixed(6)}</small><br>
                <button class="remove-btn" onclick="MapController.removeWaypoint('${waypoint.id}')">
                    Remove
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);
        return marker;
    },

    /**
     * Remove a waypoint
     * @param {string} waypointId - ID of waypoint to remove
     */
    removeWaypoint(waypointId) {
        const waypointIndex = this.waypoints.findIndex(wp => wp.id === waypointId);
        if (waypointIndex === -1) return;

        const waypoint = this.waypoints[waypointIndex];
        
        // Remove marker
        if (this.markers[waypointIndex]) {
            this.map.removeLayer(this.markers[waypointIndex]);
            this.markers.splice(waypointIndex, 1);
        }

        // Remove waypoint
        this.waypoints.splice(waypointIndex, 1);

        // Update indices and recreate markers
        this.updateWaypointIndices();

        // Clear route if exists
        this.clearRoute();

        // Clear GPS data
        window.gpsData = [];

        // Update UI
        if (typeof updateUI === 'function') {
            updateUI();
        }

        Utils.showStatus(`Removed waypoint: ${waypoint.name}`, 'info');
    },

    /**
     * Update waypoint indices after removal
     */
    updateWaypointIndices() {
        // Remove all existing markers
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];

        // Recreate markers with updated indices
        this.waypoints.forEach((waypoint, index) => {
            waypoint.index = index;
            const marker = this.createWaypointMarker(waypoint);
            this.markers.push(marker);
        });
    },

    /**
     * Clear all waypoints and routes
     */
    clearMap() {
        // Remove all markers
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];

        // Clear waypoints
        this.waypoints = [];
        this.waypointCounter = 0;

        // Clear route
        this.clearRoute();

        // Clear GPS data
        window.gpsData = [];

        // Reset UI info
        document.getElementById('total-distance').textContent = '-';
        document.getElementById('estimated-time').textContent = '-';
        document.getElementById('gps-points-count').textContent = '0';

        Utils.showStatus('Map cleared', 'info');
    },

    /**
     * Draw route on map
     * @param {Array} coordinates - Array of [lng, lat] coordinates from OpenRouteService
     * @param {Object} routeInfo - Route information (distance, duration)
     */
    drawRoute(coordinates, routeInfo) {
        // Clear existing route
        this.clearRoute();

        // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
        const leafletCoords = coordinates.map(coord => [coord[1], coord[0]]);

        // Create polyline
        this.routeLayer = L.polyline(leafletCoords, {
            color: '#3498db',
            weight: 4,
            opacity: 0.8
        }).addTo(this.map);

        // Fit map to show entire route
        this.map.fitBounds(this.routeLayer.getBounds(), { padding: [20, 20] });

        // Update route info in UI
        document.getElementById('total-distance').textContent = Utils.formatDistance(routeInfo.distance);
        document.getElementById('estimated-time').textContent = Utils.formatTime(routeInfo.duration * 1000);

        Utils.showStatus('Route displayed on map', 'success');
    },

    /**
     * Clear route from map
     */
    clearRoute() {
        if (this.routeLayer) {
            this.map.removeLayer(this.routeLayer);
            this.routeLayer = null;
        }
    },

    /**
     * Get waypoints as coordinate array for API
     * @returns {Array} Array of [lng, lat] coordinates
     */
    getWaypointsForAPI() {
        return this.waypoints.map(wp => [wp.lng, wp.lat]);
    },

    /**
     * Get map bounds
     * @returns {Object} Map bounds
     */
    getMapBounds() {
        return this.map.getBounds();
    },

    /**
     * Set map view
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} zoom - Zoom level
     */
    setView(lat, lng, zoom = 13) {
        this.map.setView([lat, lng], zoom);
    }
}; 