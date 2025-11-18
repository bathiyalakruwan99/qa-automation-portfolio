/**
 * Export utilities for GPS Combiner Tool
 * Handles JSON formatting, clipboard operations, and file downloads
 */

class ExportManager {
    /**
     * Format JSON with proper indentation
     * @param {Object} data - Data to format
     * @returns {string} Formatted JSON string
     */
    static formatJSON(data) {
        try {
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Error formatting JSON:', error);
            return 'Error formatting JSON data';
        }
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Use modern clipboard API if available
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers or non-secure contexts
                return this.fallbackCopyToClipboard(text);
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            return this.fallbackCopyToClipboard(text);
        }
    }

    /**
     * Fallback method for copying to clipboard
     * @param {string} text - Text to copy
     * @returns {boolean} Success status
     */
    static fallbackCopyToClipboard(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (error) {
            console.error('Fallback copy failed:', error);
            return false;
        }
    }

    /**
     * Download JSON data as a file
     * @param {Object} data - Data to download
     * @param {string} filename - Name of the file (without extension)
     */
    static downloadJSON(data, filename = 'combined-gps-data') {
        try {
            const jsonString = this.formatJSON(data);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.json`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the URL object
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Error downloading JSON:', error);
            return false;
        }
    }

    /**
     * Validate and parse JSON string
     * @param {string} jsonString - JSON string to parse
     * @returns {Object} Parsed data or null if invalid
     */
    static parseJSON(jsonString) {
        try {
            const trimmed = jsonString.trim();
            if (!trimmed) {
                return null;
            }
            return JSON.parse(trimmed);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    }

    /**
     * Validate GPS data structure
     * @param {Array} gpsData - GPS data array to validate
     * @returns {Object} Validation result with isValid and errors
     */
    static validateGPSData(gpsData) {
        const result = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Check if it's an array
        if (!Array.isArray(gpsData)) {
            result.isValid = false;
            result.errors.push('GPS data must be an array');
            return result;
        }

        // Check if array is empty
        if (gpsData.length === 0) {
            result.isValid = false;
            result.errors.push('GPS data array cannot be empty');
            return result;
        }

        // Validate each GPS point
        gpsData.forEach((point, index) => {
            if (typeof point !== 'object' || point === null) {
                result.isValid = false;
                result.errors.push(`GPS point at index ${index} must be an object`);
                return;
            }

            // Check required fields (only lat and lng are truly required)
            const requiredFields = ['lat', 'lng'];
            requiredFields.forEach(field => {
                if (!(field in point)) {
                    result.isValid = false;
                    result.errors.push(`GPS point at index ${index} missing required field: ${field}`);
                } else if (typeof point[field] !== 'number') {
                    result.isValid = false;
                    result.errors.push(`GPS point at index ${index} field '${field}' must be a number`);
                }
            });

            // Validate coordinate ranges
            if (typeof point.lat === 'number' && (point.lat < -90 || point.lat > 90)) {
                result.warnings.push(`GPS point at index ${index} has invalid latitude: ${point.lat} (should be between -90 and 90)`);
            }

            if (typeof point.lng === 'number' && (point.lng < -180 || point.lng > 180)) {
                result.warnings.push(`GPS point at index ${index} has invalid longitude: ${point.lng} (should be between -180 and 180)`);
            }

            // Check optional fields
            if ('duration' in point && typeof point.duration !== 'number') {
                result.warnings.push(`GPS point at index ${index} field 'duration' should be a number`);
            }

            if ('name' in point && typeof point.name !== 'string') {
                result.warnings.push(`GPS point at index ${index} field 'name' should be a string`);
            }

            if ('speed' in point && typeof point.speed !== 'number') {
                result.warnings.push(`GPS point at index ${index} field 'speed' should be a number`);
            }
        });

        return result;
    }

    /**
     * Filter GPS data based on output format
     * @param {Array} gpsData - GPS data array
     * @param {string} format - Output format ('basic' or 'full')
     * @returns {Array} Filtered GPS data
     */
    static filterGPSDataByFormat(gpsData, format = 'full') {
        if (format === 'basic') {
            // Remove speed field from all points
            return gpsData.map(point => {
                const filtered = { ...point };
                delete filtered.speed;
                return filtered;
            });
        }
        
        // For full format, add default speed of 45 if not present
        return gpsData.map(point => {
            const enhanced = { ...point };
            if (!('speed' in enhanced) || enhanced.speed === null || enhanced.speed === undefined) {
                enhanced.speed = 45;
            }
            return enhanced;
        });
    }

    /**
     * Generate filename with timestamp
     * @param {string} prefix - Filename prefix
     * @returns {string} Filename with timestamp
     */
    static generateFilename(prefix = 'combined-gps-data') {
        const now = new Date();
        const timestamp = now.toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_')
            .split('.')[0];
        return `${prefix}_${timestamp}`;
    }

    /**
     * Show user feedback message
     * @param {string} message - Message to show
     * @param {string} type - Message type (success, error, warning)
     * @param {number} duration - How long to show message (ms)
     */
    static showFeedback(message, type = 'success', duration = 3000) {
        // Remove existing feedback messages
        const existingFeedback = document.querySelectorAll('.feedback-message');
        existingFeedback.forEach(msg => msg.remove());

        // Create new feedback message
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message validation-message ${type}`;
        feedbackDiv.textContent = message;
        feedbackDiv.style.position = 'fixed';
        feedbackDiv.style.top = '20px';
        feedbackDiv.style.right = '20px';
        feedbackDiv.style.zIndex = '9999';
        feedbackDiv.style.maxWidth = '300px';
        feedbackDiv.style.animation = 'slideIn 0.3s ease-out';

        document.body.appendChild(feedbackDiv);

        // Auto-remove after duration
        setTimeout(() => {
            if (feedbackDiv.parentNode) {
                feedbackDiv.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    if (feedbackDiv.parentNode) {
                        feedbackDiv.remove();
                    }
                }, 300);
            }
        }, duration);
    }
}

// Add fadeOut animation to CSS if not already present
if (!document.querySelector('style[data-export-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-export-animations', 'true');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(20px); }
        }
    `;
    document.head.appendChild(style);
}

// Make ExportManager available globally
window.ExportManager = ExportManager; 