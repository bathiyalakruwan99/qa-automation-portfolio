/**
 * Utility Functions for GPS Simulator
 * Handles logging, token parsing, timing utilities, and helper functions
 */

// Global debug log container
let debugLogContainer = null;
let logBuffer = [];
const MAX_LOG_ENTRIES = 1000;

/**
 * Initialize utilities
 */
function initUtils() {
    debugLogContainer = document.getElementById('debugLog');
    log('🔧 Utils module initialized');
}

/**
 * Enhanced logging function with timestamps and formatting
 */
function log(message, level = 'info') {
    const timestamp = new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
    });
    
    const logEntry = {
        timestamp,
        message,
        level,
        fullMessage: `[${timestamp}] ${message}`
    };
    
    // Add to buffer
    logBuffer.push(logEntry);
    
    // Keep buffer size manageable
    if (logBuffer.length > MAX_LOG_ENTRIES) {
        logBuffer = logBuffer.slice(-MAX_LOG_ENTRIES);
    }
    
    // Output to console
    console.log(logEntry.fullMessage);
    
    // Output to UI if available
    if (debugLogContainer) {
        debugLogContainer.textContent += logEntry.fullMessage + '\n';
        debugLogContainer.scrollTop = debugLogContainer.scrollHeight;
        
        // Highlight important messages
        if (level === 'error' || message.includes('❌')) {
            debugLogContainer.classList.add('highlight');
            setTimeout(() => debugLogContainer.classList.remove('highlight'), 1000);
        }
    }
}

/**
 * Clear debug log
 */
function clearDebugLog() {
    if (debugLogContainer) {
        debugLogContainer.textContent = '';
    }
    logBuffer = [];
    log('🗑️ Debug log cleared');
}

/**
 * Export debug log as file
 */
function exportDebugLog() {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `gps-simulator-log-${timestamp}.txt`;
    
    const logContent = logBuffer.map(entry => entry.fullMessage).join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    log(`💾 Debug log exported as: ${filename}`);
}

/**
 * Wait/delay utility with promise
 */
async function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Token validation and parsing utilities
 */
const TokenUtils = {
    /**
     * Validate token format and characters
     */
    validate(token) {
        const issues = [];
        
        if (!token || token.trim().length === 0) {
            issues.push("Token is empty");
            return { valid: false, issues };
        }
        
        // Check for non-ASCII characters
        const nonAsciiRegex = /[^\x00-\x7F]/;
        if (nonAsciiRegex.test(token)) {
            issues.push("Contains non-ASCII characters (will cause fetch errors)");
        }
        
        // Check basic JWT format
        const parts = token.split('.');
        if (parts.length !== 3) {
            issues.push("Not a valid JWT format (should have 3 parts separated by dots)");
        }
        
        // Check if starts with expected JWT header
        if (!token.startsWith('eyJ')) {
            issues.push("Doesn't look like a JWT (should start with 'eyJ')");
        }
        
        // Check for whitespace/formatting issues
        if (token !== token.trim()) {
            issues.push("Has leading/trailing whitespace");
        }
        
        if (token.includes('\n') || token.includes('\r')) {
            issues.push("Contains line breaks");
        }
        
        return {
            valid: issues.length === 0,
            issues: issues
        };
    },

    /**
     * Clean token by removing common issues
     */
    clean(token) {
        if (!token) return token;
        
        // Remove Bearer prefix if present
        if (token.toLowerCase().startsWith('bearer ')) {
            token = token.substring(7);
            log('🔧 Removed "Bearer " prefix from token');
        }
        
        // Remove whitespace and line breaks
        const cleaned = token.replace(/[\r\n\s]/g, '');
        
        if (cleaned !== token) {
            log(`🔧 Cleaned token (removed whitespace/line breaks)`);
            log(`📏 Original length: ${token.length}, Cleaned: ${cleaned.length}`);
        }
        
        return cleaned;
    },

    /**
     * Parse JWT token payload
     */
    parse(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }
            
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            
            return {
                header,
                payload,
                valid: true
            };
        } catch (error) {
            return {
                header: null,
                payload: null,
                valid: false,
                error: error.message
            };
        }
    },

    /**
     * Get token expiry information
     */
    getExpiryInfo(payload) {
        if (!payload || !payload.exp) {
            return { expired: false, expiresAt: null, timeLeft: null };
        }
        
        const expiresAt = new Date(payload.exp * 1000);
        const now = new Date();
        const timeLeft = expiresAt.getTime() - now.getTime();
        
        return {
            expired: timeLeft <= 0,
            expiresAt: expiresAt,
            timeLeft: timeLeft,
            timeLeftHours: Math.round(timeLeft / (1000 * 60 * 60))
        };
    }
};

/**
 * Format utilities
 */
const FormatUtils = {
    /**
     * Format bytes to human readable format
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    /**
     * Format duration in milliseconds to human readable
     */
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    },

    /**
     * Format coordinate with proper precision
     */
    formatCoordinate(coord, precision = 6) {
        return parseFloat(coord).toFixed(precision);
    },

    /**
     * Format large numbers with separators
     */
    formatNumber(number) {
        return new Intl.NumberFormat().format(number);
    }
};

/**
 * Validation utilities
 */
const ValidationUtils = {
    /**
     * Validate coordinate
     */
    isValidCoordinate(lat, lng) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        
        return !isNaN(latitude) && !isNaN(longitude) &&
               latitude >= -90 && latitude <= 90 &&
               longitude >= -180 && longitude <= 180;
    },

    /**
     * Validate device ID format
     */
    isValidDeviceId(deviceId) {
        return typeof deviceId === 'string' && deviceId.trim().length > 0;
    },

    /**
     * Validate URL format
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Validate JSON structure for device data
     */
    validateDeviceData(data) {
        const errors = [];
        
        if (!Array.isArray(data)) {
            errors.push('Data must be an array');
            return { valid: false, errors };
        }
        
        data.forEach((device, index) => {
            if (!device.deviceId || typeof device.deviceId !== 'string') {
                errors.push(`Device ${index + 1}: Missing or invalid deviceId`);
            }
            
            if (!device.coordinates || !Array.isArray(device.coordinates)) {
                errors.push(`Device ${index + 1}: Missing or invalid coordinates array`);
            } else {
                device.coordinates.forEach((coord, coordIndex) => {
                    if (!this.isValidCoordinate(coord.lat, coord.lng)) {
                        errors.push(`Device ${index + 1}, Coordinate ${coordIndex + 1}: Invalid lat/lng`);
                    }
                    if (coord.duration && (isNaN(coord.duration) || coord.duration < 0)) {
                        errors.push(`Device ${index + 1}, Coordinate ${coordIndex + 1}: Invalid duration`);
                    }
                });
            }
        });
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
};

/**
 * Performance monitoring utilities
 */
const PerformanceUtils = {
    timers: new Map(),
    
    /**
     * Start a performance timer
     */
    startTimer(name) {
        this.timers.set(name, performance.now());
    },
    
    /**
     * End a performance timer and log result
     */
    endTimer(name, logResult = true) {
        const startTime = this.timers.get(name);
        if (startTime === undefined) {
            log(`⚠️ Timer '${name}' was never started`);
            return 0;
        }
        
        const duration = performance.now() - startTime;
        this.timers.delete(name);
        
        if (logResult) {
            log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
        }
        
        return duration;
    }
};

/**
 * Storage utilities for session persistence
 */
const StorageUtils = {
    /**
     * Save data to localStorage with error handling
     */
    save(key, data) {
        try {
            localStorage.setItem(`gps-simulator-${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            log(`❌ Failed to save to localStorage: ${error.message}`);
            return false;
        }
    },

    /**
     * Load data from localStorage with error handling
     */
    load(key) {
        try {
            const item = localStorage.getItem(`gps-simulator-${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            log(`❌ Failed to load from localStorage: ${error.message}`);
            return null;
        }
    },

    /**
     * Remove data from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(`gps-simulator-${key}`);
            return true;
        } catch (error) {
            log(`❌ Failed to remove from localStorage: ${error.message}`);
            return false;
        }
    }
};

/**
 * Update UI status elements
 */
function updateStatus(elementId, status, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Remove existing status classes
    element.classList.remove('status-good', 'status-bad', 'status-warn');
    
    // Add new status class
    element.classList.add(`status-${status}`);
    
    // Update text content
    const icon = status === 'good' ? '✅' : status === 'bad' ? '❌' : '⚠️';
    element.textContent = `${icon} ${message}`;
}

/**
 * Show/hide sections with animation
 */
function toggleSection(sectionId, show) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    if (show) {
        section.style.display = 'block';
        // Trigger animation
        setTimeout(() => section.classList.add('fade-in'), 10);
    } else {
        section.style.display = 'none';
        section.classList.remove('fade-in');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUtils);
} else {
    initUtils();
}

// Export utilities for use by other modules
window.Utils = {
    TokenUtils,
    FormatUtils,
    ValidationUtils,
    PerformanceUtils,
    StorageUtils,
    updateStatus,
    toggleSection
}; 