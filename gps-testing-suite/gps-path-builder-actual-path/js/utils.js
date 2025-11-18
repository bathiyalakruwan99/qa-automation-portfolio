/**
 * Utility functions for GPS Path Builder
 */
const Utils = {
    /**
     * Calculate distance between two points using Haversine formula
     * @param {number} lat1 - Latitude of first point
     * @param {number} lng1 - Longitude of first point
     * @param {number} lat2 - Latitude of second point
     * @param {number} lng2 - Longitude of second point
     * @returns {number} Distance in meters
     */
    haversineDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                 Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                 Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    /**
     * Convert degrees to radians
     * @param {number} deg - Degrees
     * @returns {number} Radians
     */
    toRadians(deg) {
        return deg * (Math.PI / 180);
    },

    /**
     * Convert radians to degrees
     * @param {number} rad - Radians
     * @returns {number} Degrees
     */
    toDegrees(rad) {
        return rad * (180 / Math.PI);
    },

    /**
     * Calculate duration in milliseconds based on distance and speed
     * @param {number} distanceMeters - Distance in meters
     * @param {number} speedKmh - Speed in km/h
     * @returns {number} Duration in milliseconds
     */
    calculateDuration(distanceMeters, speedKmh) {
        const distanceKm = distanceMeters / 1000;
        const timeHours = distanceKm / speedKmh;
        const timeMilliseconds = timeHours * 3600 * 1000;
        return Math.round(timeMilliseconds);
    },

    /**
     * Format distance for display
     * @param {number} meters - Distance in meters
     * @returns {string} Formatted distance
     */
    formatDistance(meters) {
        if (meters < 1000) {
            return `${Math.round(meters)} m`;
        } else {
            return `${(meters / 1000).toFixed(2)} km`;
        }
    },

    /**
     * Format time for display
     * @param {number} milliseconds - Time in milliseconds
     * @returns {string} Formatted time
     */
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    },

    /**
     * Show status message to user
     * @param {string} message - Message to display
     * @param {string} type - Message type: 'success', 'error', 'info'
     * @param {number} duration - Duration to show message (ms), default 5000
     */
    showStatus(message, type = 'info', duration = 5000) {
        const statusElement = document.getElementById('status-message');
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        
        // Clear previous timeout
        if (this.statusTimeout) {
            clearTimeout(this.statusTimeout);
        }
        
        // Auto-clear after duration
        this.statusTimeout = setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = 'status-message';
        }, duration);
    },

    /**
     * Calculate bearing between two points
     * @param {number} lat1 - Latitude of first point
     * @param {number} lng1 - Longitude of first point
     * @param {number} lat2 - Latitude of second point
     * @param {number} lng2 - Longitude of second point
     * @returns {number} Bearing in degrees
     */
    calculateBearing(lat1, lng1, lat2, lng2) {
        const dLng = this.toRadians(lng2 - lng1);
        const lat1Rad = this.toRadians(lat1);
        const lat2Rad = this.toRadians(lat2);

        const y = Math.sin(dLng) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
                 Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

        const bearing = this.toDegrees(Math.atan2(y, x));
        return (bearing + 360) % 360; // Normalize to 0-360
    },

    /**
     * Generate a point at specified distance and bearing from origin
     * @param {number} lat - Origin latitude
     * @param {number} lng - Origin longitude
     * @param {number} bearing - Bearing in degrees
     * @param {number} distanceMeters - Distance in meters
     * @returns {Object} New point {lat, lng}
     */
    destinationPoint(lat, lng, bearing, distanceMeters) {
        const R = 6371000; // Earth's radius in meters
        const d = distanceMeters / R; // Angular distance
        const brng = this.toRadians(bearing);
        const lat1 = this.toRadians(lat);
        const lng1 = this.toRadians(lng);

        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + 
                              Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
        const lng2 = lng1 + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
                                      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));

        return {
            lat: this.toDegrees(lat2),
            lng: this.toDegrees(lng2)
        };
    },

    /**
     * Validate coordinates
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @returns {boolean} True if valid
     */
    isValidCoordinate(lat, lng) {
        return typeof lat === 'number' && typeof lng === 'number' &&
               lat >= -90 && lat <= 90 &&
               lng >= -180 && lng <= 180 &&
               !isNaN(lat) && !isNaN(lng);
    },

    /**
     * Deep clone an object
     * @param {*} obj - Object to clone
     * @returns {*} Cloned object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}; 