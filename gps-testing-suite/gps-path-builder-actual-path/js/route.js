/**
 * Route Controller for GPS Path Builder
 * Handles OpenRouteService API integration and route generation
 */
const RouteController = {
    /**
     * Generate route using OpenRouteService API
     * @param {string} apiKey - OpenRouteService API key
     * @param {number} speed - Speed in km/h for duration calculations
     * @param {number} intervalMeters - Interval between GPS points in meters (default: 10)
     */
    async generateRoute(apiKey, speed, intervalMeters = 10) {
        try {
            Utils.showStatus('Generating route...', 'info');

            const waypoints = MapController.getWaypointsForAPI();
            
            if (waypoints.length < 2) {
                throw new Error('At least 2 waypoints are required');
            }

            if (waypoints.length > 50) {
                throw new Error('Maximum 50 waypoints allowed per route');
            }

            // Call OpenRouteService API
            const routeData = await this.callOpenRouteServiceAPI(apiKey, waypoints);
            
            if (!this.validateAPIResponse(routeData)) {
                console.error('Invalid API response:', routeData);
                throw new Error('Invalid response from OpenRouteService API');
            }

            const feature = routeData.features[0];
            const geometry = feature.geometry;
            const properties = feature.properties;

            // Validate essential components
            if (!geometry || !geometry.coordinates || !Array.isArray(geometry.coordinates)) {
                throw new Error('Invalid route geometry in API response');
            }

            if (geometry.coordinates.length < 2) {
                throw new Error('Route must have at least 2 coordinate points');
            }

            // Log successful API response (for debugging if needed)
            console.log('Route generated successfully with', geometry.coordinates.length, 'coordinate points');

            // Extract route information with better error handling
            let distance = 0;
            let duration = 0;

            // Handle different response structures
            if (properties.segments && Array.isArray(properties.segments)) {
                // Standard segments format
                distance = properties.segments.reduce((total, segment) => total + (segment.distance || 0), 0);
                duration = properties.segments.reduce((total, segment) => total + (segment.duration || 0), 0);
            } else if (properties.summary) {
                // Summary format (some API responses use this)
                distance = properties.summary.distance || 0;
                duration = properties.summary.duration || 0;
            } else if (typeof properties.distance === 'number' && typeof properties.duration === 'number') {
                // Direct properties format
                distance = properties.distance;
                duration = properties.duration;
            } else {
                // Fallback: calculate from coordinates if available
                console.warn('Using fallback distance calculation from coordinates');
                distance = this.calculateRouteStats(geometry.coordinates).distance;
                duration = distance / 1000 / 40 * 3600; // Assume 40 km/h for duration
            }

            const routeInfo = {
                distance: distance,
                duration: duration,
                coordinates: geometry.coordinates
            };

            // Draw route on map
            MapController.drawRoute(routeInfo.coordinates, routeInfo);

            // Generate interpolated GPS points
            const interpolatedPoints = InterpolationController.interpolateRoute(
                routeInfo.coordinates, 
                speed,
                intervalMeters // Use dynamic interval from UI
            );

            // Store GPS data globally
            window.gpsData = interpolatedPoints;

            // Update GPS points count in UI
            document.getElementById('gps-points-count').textContent = interpolatedPoints.length;

            // Update UI state
            if (typeof updateUI === 'function') {
                updateUI();
            }

            Utils.showStatus(
                `Route generated successfully! ${interpolatedPoints.length} GPS points created at ${intervalMeters}m intervals.`, 
                'success'
            );

        } catch (error) {
            console.error('Route generation error:', error);
            Utils.showStatus(`Error generating route: ${error.message}`, 'error');
        }
    },

    /**
     * Call OpenRouteService Directions API
     * @param {string} apiKey - API key
     * @param {Array} coordinates - Array of [lng, lat] coordinates
     * @returns {Promise<Object>} Route data
     */
    async callOpenRouteServiceAPI(apiKey, coordinates) {
        const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
        
        const requestBody = {
            coordinates: coordinates,
            format: 'geojson',
            instructions: false,
            geometry: true,
            options: {
                avoid_features: [],
                avoid_borders: 'none',
                avoid_countries: []
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                'Authorization': apiKey,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                if (errorData.error && errorData.error.message) {
                    errorMessage = errorData.error.message;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                // If we can't parse the error response, use the HTTP status
            }

            // Handle common API errors
            if (response.status === 401) {
                errorMessage = 'Invalid API key. Please check your OpenRouteService API key.';
            } else if (response.status === 403) {
                errorMessage = 'API key quota exceeded or permission denied.';
            } else if (response.status === 404) {
                errorMessage = 'No route found between the specified points.';
            } else if (response.status === 429) {
                errorMessage = 'Too many requests. Please try again later.';
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Additional validation for empty or malformed responses
        if (!data) {
            throw new Error('Empty response from OpenRouteService API');
        }

        return data;
    },

    /**
     * Validate API response
     * @param {Object} data - API response data
     * @returns {boolean} True if valid
     */
    validateAPIResponse(data) {
        // Check basic structure
        if (!data || typeof data !== 'object') {
            console.error('API response is not an object:', data);
            return false;
        }

        // Check for error in response
        if (data.error) {
            console.error('API returned error:', data.error);
            return false;
        }

        // Check features array
        if (!data.features || !Array.isArray(data.features)) {
            console.error('API response missing features array:', data);
            return false;
        }

        if (data.features.length === 0) {
            console.error('API response has empty features array');
            return false;
        }

        // Check first feature
        const feature = data.features[0];
        if (!feature || typeof feature !== 'object') {
            console.error('First feature is invalid:', feature);
            return false;
        }

        // Check geometry
        if (!feature.geometry || !feature.geometry.coordinates) {
            console.error('Feature missing geometry or coordinates:', feature);
            return false;
        }

        if (!Array.isArray(feature.geometry.coordinates)) {
            console.error('Geometry coordinates is not an array:', feature.geometry.coordinates);
            return false;
        }

        if (feature.geometry.coordinates.length < 2) {
            console.error('Route must have at least 2 coordinate points');
            return false;
        }

        // Check properties (optional but log if missing)
        if (!feature.properties) {
            console.warn('Feature missing properties, will use fallback calculations');
        }

        return true;
    },

    /**
     * Get route statistics
     * @param {Array} coordinates - Route coordinates
     * @returns {Object} Route statistics
     */
    calculateRouteStats(coordinates) {
        if (!coordinates || coordinates.length < 2) {
            return { distance: 0, points: 0 };
        }

        let totalDistance = 0;
        
        for (let i = 1; i < coordinates.length; i++) {
            const [lng1, lat1] = coordinates[i - 1];
            const [lng2, lat2] = coordinates[i];
            
            const segmentDistance = Utils.haversineDistance(lat1, lng1, lat2, lng2);
            totalDistance += segmentDistance;
        }

        return {
            distance: totalDistance,
            points: coordinates.length
        };
    },

    /**
     * Split long routes into chunks for API limits
     * @param {Array} waypoints - Array of waypoints
     * @param {number} maxWaypoints - Maximum waypoints per request
     * @returns {Array} Array of waypoint chunks
     */
    chunkWaypoints(waypoints, maxWaypoints = 50) {
        if (waypoints.length <= maxWaypoints) {
            return [waypoints];
        }

        const chunks = [];
        for (let i = 0; i < waypoints.length - 1; i += maxWaypoints - 1) {
            const chunk = waypoints.slice(i, i + maxWaypoints);
            chunks.push(chunk);
        }

        return chunks;
    },

    /**
     * Generate route for multiple chunks (for routes with >50 waypoints)
     * @param {string} apiKey - API key
     * @param {Array} waypoints - All waypoints
     * @param {number} speed - Speed in km/h
     */
    async generateMultiChunkRoute(apiKey, waypoints, speed) {
        const chunks = this.chunkWaypoints(waypoints);
        let allCoordinates = [];
        let totalDistance = 0;
        let totalDuration = 0;

        for (let i = 0; i < chunks.length; i++) {
            Utils.showStatus(`Processing route segment ${i + 1} of ${chunks.length}...`, 'info');
            
            const chunkData = await this.callOpenRouteServiceAPI(apiKey, chunks[i]);
            
            if (chunkData && chunkData.features && chunkData.features.length > 0) {
                const feature = chunkData.features[0];
                const coordinates = feature.geometry.coordinates;
                const properties = feature.properties;

                // Remove duplicate points between chunks (except for first chunk)
                if (i > 0 && coordinates.length > 0) {
                    coordinates.shift(); // Remove first point to avoid duplication
                }

                allCoordinates = allCoordinates.concat(coordinates);
                totalDistance += properties.segments.reduce((total, segment) => total + segment.distance, 0);
                totalDuration += properties.segments.reduce((total, segment) => total + segment.duration, 0);
            }
        }

        return {
            coordinates: allCoordinates,
            distance: totalDistance,
            duration: totalDuration
        };
    }
}; 