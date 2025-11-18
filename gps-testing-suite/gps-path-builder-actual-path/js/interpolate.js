/**
 * Interpolation Controller for GPS Path Builder
 * Handles GPS coordinate interpolation along routes
 */
const InterpolationController = {
    /**
     * Interpolate GPS coordinates along a route
     * @param {Array} coordinates - Array of [lng, lat] coordinates from OpenRouteService
     * @param {number} speedKmh - Speed in km/h for duration calculation
     * @param {number} intervalMeters - Interval between points in meters (default: 10)
     * @returns {Array} Array of GPS points with lat, lng, duration, and name
     */
    interpolateRoute(coordinates, speedKmh, intervalMeters = 10) {
        if (!coordinates || coordinates.length < 2) {
            return [];
        }

        const interpolatedPoints = [];
        let cumulativeDistance = 0;
        let pointCounter = 0;

        // Add start point
        const startPoint = {
            lat: coordinates[0][1],
            lng: coordinates[0][0],
            duration: Utils.calculateDuration(intervalMeters, speedKmh),
            name: "Start"
        };
        interpolatedPoints.push(startPoint);

        // Process each segment of the route
        for (let i = 1; i < coordinates.length; i++) {
            const [lng1, lat1] = coordinates[i - 1];
            const [lng2, lat2] = coordinates[i];

            const segmentDistance = Utils.haversineDistance(lat1, lng1, lat2, lng2);
            
            if (segmentDistance === 0) continue; // Skip if points are identical

            // Calculate number of interpolation points needed for this segment
            const numInterpolationPoints = Math.floor(segmentDistance / intervalMeters);

            // Add interpolated points along this segment
            for (let j = 1; j <= numInterpolationPoints; j++) {
                const ratio = (j * intervalMeters) / segmentDistance;
                const interpolatedPoint = this.interpolatePoint(lat1, lng1, lat2, lng2, ratio);
                
                pointCounter++;
                cumulativeDistance += intervalMeters;

                const gpsPoint = {
                    lat: parseFloat(interpolatedPoint.lat.toFixed(6)),
                    lng: parseFloat(interpolatedPoint.lng.toFixed(6)),
                    duration: Utils.calculateDuration(intervalMeters, speedKmh),
                    name: `Point ${pointCounter}`
                };

                interpolatedPoints.push(gpsPoint);
            }

            // Add the actual waypoint if it's not too close to the last interpolated point
            const lastPoint = interpolatedPoints[interpolatedPoints.length - 1];
            const distanceToWaypoint = Utils.haversineDistance(
                lastPoint.lat, lastPoint.lng, lat2, lng2
            );

            if (distanceToWaypoint >= intervalMeters / 2) {
                pointCounter++;
                const duration = Utils.calculateDuration(distanceToWaypoint, speedKmh);
                
                const waypointPoint = {
                    lat: parseFloat(lat2.toFixed(6)),
                    lng: parseFloat(lng2.toFixed(6)),
                    duration: duration,
                    name: i === coordinates.length - 1 ? "End" : `Waypoint ${i}`
                };

                interpolatedPoints.push(waypointPoint);
                cumulativeDistance += distanceToWaypoint;
            }
        }

        // Ensure we have an end point
        if (interpolatedPoints.length > 1) {
            const lastIndex = interpolatedPoints.length - 1;
            const endCoord = coordinates[coordinates.length - 1];
            
            if (interpolatedPoints[lastIndex].lat !== endCoord[1] || 
                interpolatedPoints[lastIndex].lng !== endCoord[0]) {
                
                interpolatedPoints[lastIndex] = {
                    lat: parseFloat(endCoord[1].toFixed(6)),
                    lng: parseFloat(endCoord[0].toFixed(6)),
                    duration: interpolatedPoints[lastIndex].duration,
                    name: "End"
                };
            } else {
                interpolatedPoints[lastIndex].name = "End";
            }
        }

        return interpolatedPoints;
    },

    /**
     * Interpolate a single point between two coordinates
     * @param {number} lat1 - Start latitude
     * @param {number} lng1 - Start longitude
     * @param {number} lat2 - End latitude
     * @param {number} lng2 - End longitude
     * @param {number} ratio - Ratio along the line (0-1)
     * @returns {Object} Interpolated point {lat, lng}
     */
    interpolatePoint(lat1, lng1, lat2, lng2, ratio) {
        // Use spherical linear interpolation for better accuracy over long distances
        return this.slerp(lat1, lng1, lat2, lng2, ratio);
    },

    /**
     * Spherical linear interpolation between two points
     * @param {number} lat1 - Start latitude
     * @param {number} lng1 - Start longitude
     * @param {number} lat2 - End latitude
     * @param {number} lng2 - End longitude
     * @param {number} t - Interpolation parameter (0-1)
     * @returns {Object} Interpolated point {lat, lng}
     */
    slerp(lat1, lng1, lat2, lng2, t) {
        // Convert to radians
        const lat1Rad = Utils.toRadians(lat1);
        const lng1Rad = Utils.toRadians(lng1);
        const lat2Rad = Utils.toRadians(lat2);
        const lng2Rad = Utils.toRadians(lng2);

        // Calculate the angular distance
        const deltaLng = lng2Rad - lng1Rad;
        const a = Math.sin(lat1Rad) * Math.sin(lat2Rad) + 
                 Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLng);
        const angle = Math.acos(Math.max(-1, Math.min(1, a)));

        // If points are very close, use linear interpolation
        if (Math.abs(angle) < 1e-6) {
            return {
                lat: lat1 + t * (lat2 - lat1),
                lng: lng1 + t * (lng2 - lng1)
            };
        }

        // Spherical interpolation
        const sinAngle = Math.sin(angle);
        const ratioA = Math.sin((1 - t) * angle) / sinAngle;
        const ratioB = Math.sin(t * angle) / sinAngle;

        const x = ratioA * Math.cos(lat1Rad) * Math.cos(lng1Rad) + 
                 ratioB * Math.cos(lat2Rad) * Math.cos(lng2Rad);
        const y = ratioA * Math.cos(lat1Rad) * Math.sin(lng1Rad) + 
                 ratioB * Math.cos(lat2Rad) * Math.sin(lng2Rad);
        const z = ratioA * Math.sin(lat1Rad) + ratioB * Math.sin(lat2Rad);

        const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
        const lng = Math.atan2(y, x);

        return {
            lat: Utils.toDegrees(lat),
            lng: Utils.toDegrees(lng)
        };
    },

    /**
     * Linear interpolation between two points (simpler but less accurate)
     * @param {number} lat1 - Start latitude
     * @param {number} lng1 - Start longitude
     * @param {number} lat2 - End latitude
     * @param {number} lng2 - End longitude
     * @param {number} t - Interpolation parameter (0-1)
     * @returns {Object} Interpolated point {lat, lng}
     */
    linearInterpolate(lat1, lng1, lat2, lng2, t) {
        return {
            lat: lat1 + t * (lat2 - lat1),
            lng: lng1 + t * (lng2 - lng1)
        };
    },

    /**
     * Generate points at regular intervals along a polyline
     * @param {Array} coordinates - Array of [lng, lat] coordinates
     * @param {number} intervalMeters - Interval between points in meters
     * @returns {Array} Array of interpolated coordinates
     */
    generateRegularIntervals(coordinates, intervalMeters) {
        if (!coordinates || coordinates.length < 2) {
            return [];
        }

        const result = [];
        let currentDistance = 0;
        let segmentStartIndex = 0;
        let segmentStartDistance = 0;

        // Add first point
        result.push([coordinates[0][1], coordinates[0][0]]); // Convert to [lat, lng]

        for (let i = 1; i < coordinates.length; i++) {
            const [lng1, lat1] = coordinates[i - 1];
            const [lng2, lat2] = coordinates[i];
            const segmentDistance = Utils.haversineDistance(lat1, lng1, lat2, lng2);
            
            currentDistance += segmentDistance;

            // Check if we need to add interpolated points in this segment
            while (segmentStartDistance + intervalMeters <= currentDistance) {
                const targetDistance = segmentStartDistance + intervalMeters;
                const distanceIntoSegment = targetDistance - (currentDistance - segmentDistance);
                const ratio = distanceIntoSegment / segmentDistance;

                const interpolated = this.interpolatePoint(lat1, lng1, lat2, lng2, ratio);
                result.push([interpolated.lat, interpolated.lng]);

                segmentStartDistance = targetDistance;
            }

            // Update segment start for next iteration
            if (i === coordinates.length - 1) {
                // Add last point if it's not too close to the previous point
                const lastResult = result[result.length - 1];
                const distanceToEnd = Utils.haversineDistance(
                    lastResult[0], lastResult[1], lat2, lng2
                );
                
                if (distanceToEnd >= intervalMeters / 2) {
                    result.push([lat2, lng2]);
                }
            }
        }

        return result;
    },

    /**
     * Calculate total route distance
     * @param {Array} coordinates - Array of [lng, lat] coordinates
     * @returns {number} Total distance in meters
     */
    calculateTotalDistance(coordinates) {
        if (!coordinates || coordinates.length < 2) {
            return 0;
        }

        let totalDistance = 0;
        
        for (let i = 1; i < coordinates.length; i++) {
            const [lng1, lat1] = coordinates[i - 1];
            const [lng2, lat2] = coordinates[i];
            totalDistance += Utils.haversineDistance(lat1, lng1, lat2, lng2);
        }

        return totalDistance;
    },

    /**
     * Smooth GPS coordinates to reduce noise
     * @param {Array} gpsPoints - Array of GPS points
     * @param {number} windowSize - Smoothing window size
     * @returns {Array} Smoothed GPS points
     */
    smoothGPSPoints(gpsPoints, windowSize = 3) {
        if (!gpsPoints || gpsPoints.length < windowSize) {
            return gpsPoints;
        }

        const smoothed = [];
        const halfWindow = Math.floor(windowSize / 2);

        for (let i = 0; i < gpsPoints.length; i++) {
            if (i < halfWindow || i >= gpsPoints.length - halfWindow) {
                // Keep boundary points unchanged
                smoothed.push({ ...gpsPoints[i] });
            } else {
                // Apply smoothing
                let sumLat = 0;
                let sumLng = 0;
                
                for (let j = i - halfWindow; j <= i + halfWindow; j++) {
                    sumLat += gpsPoints[j].lat;
                    sumLng += gpsPoints[j].lng;
                }
                
                smoothed.push({
                    ...gpsPoints[i],
                    lat: parseFloat((sumLat / windowSize).toFixed(6)),
                    lng: parseFloat((sumLng / windowSize).toFixed(6))
                });
            }
        }

        return smoothed;
    }
}; 