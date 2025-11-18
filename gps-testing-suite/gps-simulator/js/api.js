/**
 * API Module for GPS Simulator
 * Handles authentication, token management, and GPS API calls
 */

const API = {
    // Private state
    _currentToken: null,
    _tokenInfo: null,
    _apiCallCount: 0,
    _errorCount: 0,
    _requestQueue: new Map(),

    /**
     * Initialize API module
     */
    init() {
        log('🔌 API module initialized');
        
        // Try to load saved token from localStorage
        const savedToken = Utils.StorageUtils.load('auth-token');
        if (savedToken) {
            this._currentToken = savedToken;
            this._validateAndUpdateTokenStatus();
            log('🔐 Previous token loaded from storage');
        }
    },

    /**
     * Set and validate bearer token
     */
    setToken() {
        const tokenInput = document.getElementById('tokenInput');
        let token = tokenInput.value.trim();
        
        if (!token) {
            log('❌ Please paste your bearer token first');
            return false;
        }
        
        // Clean and validate token
        token = Utils.TokenUtils.clean(token);
        const validation = Utils.TokenUtils.validate(token);
        
        log('🔍 Token Validation Results:');
        if (!validation.valid) {
            log('❌ Token validation failed:');
            validation.issues.forEach(issue => {
                log(`   ├─ ${issue}`);
            });
            Utils.updateStatus('token-status', 'bad', 'Invalid Token Format');
            return false;
        }
        
        // Parse token to get additional info
        const parsed = Utils.TokenUtils.parse(token);
        if (parsed.valid) {
            const expiryInfo = Utils.TokenUtils.getExpiryInfo(parsed.payload);
            
            if (expiryInfo.expired) {
                log('⚠️ WARNING: This token appears to be expired!');
                Utils.updateStatus('token-status', 'bad', 'Token Expired');
                return false;
            }
            
            if (expiryInfo.expiresAt) {
                log(`📅 Token expires: ${expiryInfo.expiresAt.toLocaleString()}`);
                if (expiryInfo.timeLeftHours > 0) {
                    log(`⏰ Time remaining: ~${expiryInfo.timeLeftHours} hours`);
                }
            }
            
            this._tokenInfo = parsed.payload;
        }
        
        // Store token
        this._currentToken = token;
        Utils.StorageUtils.save('auth-token', token);
        
        log('✅ Bearer token set successfully!');
        log(`🚀 Token length: ${token.length} characters`);
        
        Utils.updateStatus('token-status', 'good', 'Token Valid');
        
        // Clear the input for security
        tokenInput.value = '';
        
        return true;
    },

    /**
     * Inspect token without setting it
     */
    inspectToken() {
        const tokenInput = document.getElementById('tokenInput');
        let token = tokenInput.value.trim();
        
        if (!token) {
            log('❌ No token to inspect - paste a token first');
            return;
        }
        
        log('🔍 TOKEN INSPECTION REPORT:');
        log('═'.repeat(50));
        
        // Clean token for inspection
        const originalToken = token;
        token = Utils.TokenUtils.clean(token);
        
        if (token !== originalToken) {
            log('🔧 Token would be cleaned during processing');
        }
        
        // Basic info
        log(`📏 Length: ${token.length} characters`);
        log(`🔤 First 20 chars: "${token.substring(0, 20)}..."`);
        log(`🔤 Last 20 chars: "...${token.substring(token.length - 20)}"`);
        
        // Validation
        const validation = Utils.TokenUtils.validate(token);
        log(`✅ Validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);
        if (!validation.valid) {
            validation.issues.forEach((issue, i) => {
                log(`   ${i + 1}. ${issue}`);
            });
        }
        
        // Parse JWT
        const parsed = Utils.TokenUtils.parse(token);
        if (parsed.valid) {
            log(`📋 Header: ${JSON.stringify(parsed.header)}`);
            log(`📦 Payload Keys: ${Object.keys(parsed.payload).join(', ')}`);
            
            // Check expiry
            const expiryInfo = Utils.TokenUtils.getExpiryInfo(parsed.payload);
            if (expiryInfo.expiresAt) {
                log(`📅 Expires: ${expiryInfo.expiresAt.toLocaleString()}`);
                if (expiryInfo.expired) {
                    log(`❌ EXPIRED ${Math.abs(expiryInfo.timeLeftHours)} hours ago!`);
                } else {
                    log(`⏰ Time left: ~${expiryInfo.timeLeftHours} hours`);
                }
            }
            
            // Check scopes
            if (parsed.payload.scopes && Array.isArray(parsed.payload.scopes)) {
                const hasGpsScope = parsed.payload.scopes.some(scope => 
                    scope.includes('gps') || scope.includes('manager')
                );
                log(`🔐 Scopes: ${parsed.payload.scopes.length} total`);
                log(`📡 GPS-related scopes: ${hasGpsScope ? 'YES' : 'NO'}`);
                if (hasGpsScope) {
                    const gpsScopes = parsed.payload.scopes.filter(s => 
                        s.includes('gps') || s.includes('manager')
                    );
                    gpsScopes.forEach(scope => {
                        log(`   • ${scope}`);
                    });
                }
            }
        } else {
            log(`❌ JWT parsing failed: ${parsed.error}`);
        }
        
        log('═'.repeat(50));
        log(validation.valid ? '🎉 Token format looks good!' : '🚨 Fix validation issues before using');
    },

    /**
     * Get API endpoint URL based on environment
     */
    getApiUrl() {
        const env = document.getElementById('environmentSelect').value;
        const customEndpoint = document.getElementById('customEndpoint').value;
        
        let url;
        switch (env) {
            case 'staging':
                url = 'https://staging-api.example-platform.com/api/telematics/gps-data/v2';
                break;
            case 'production':
                url = 'https://api.example-platform.com/api/telematics/gps-data/v2';
                break;
            case 'custom':
                url = customEndpoint.trim();
                if (!url) {
                    log('❌ Custom endpoint URL is required');
                    return null;
                }
                if (!Utils.ValidationUtils.isValidUrl(url)) {
                    log('❌ Invalid custom endpoint URL format');
                    return null;
                }
                break;
            default:
                log(`⚠️ Unknown environment "${env}", defaulting to staging`);
                url = 'https://staging-api.example-platform.com/api/telematics/gps-data/v1';
        }
        
        return url;
    },

    /**
     * Send GPS data to API
     */
    async sendGPS(deviceId, latitude, longitude, options = {}) {
        if (!this._currentToken) {
            log(`❌ No authentication token available for device ${deviceId}`);
            this._errorCount++;
            return { success: false, error: 'No token' };
        }
        const apiUrl = this.getApiUrl();
        if (!apiUrl) {
            this._errorCount++;
            return { success: false, error: 'Invalid API URL' };
        }
        
        // Prepare GPS data
        const gpsData = {
            s: deviceId,
            lt: parseFloat(latitude),
            lg: parseFloat(longitude),
            v: options.speed || 45,
            d: options.angle || 0,
            i: options.engineStatus || 'Running',
            m: options.millage || 0,
            t: new Date().toISOString(),
            ...options.additionalData
        };
        
        // Validate coordinates
        if (!Utils.ValidationUtils.isValidCoordinate(latitude, longitude)) {
            log('❌ Invalid coordinates for device ${deviceId}: ${latitude}, ${longitude}');
            this._errorCount++;
            return { success: false, error: 'Invalid coordinates' };
        }
        
        try {
            this._apiCallCount++;
            const requestId = `${deviceId}-${Date.now()}`;
            
            // Add to request queue for tracking
            this._requestQueue.set(requestId, {
                deviceId,
                startTime: performance.now(),
                data: gpsData
            });

            Utils.PerformanceUtils.startTimer(`api-call-${requestId}`);

            log(`📡 Sending GPS data for device ${deviceId}: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);

            const response = await fetch(apiUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': 'ac89c63a-79f0-4ef0-981e-e4f2dc74184c'
                },
                body: JSON.stringify(gpsData)
            });
            const responseTime = Utils.PerformanceUtils.endTimer(`api-call-${requestId}`, false);

            // Remove from queue
            this._requestQueue.delete(requestId);
            // Get response data
            let responseData = null;
            const responseText = await response.text();
            
            if (responseText) {
                try {
                    responseData = JSON.parse(responseText);
                } catch (parseError) {
                    responseData = { message: responseText };
                }
            }
            
            if (response.ok) {
                log('✅ GPS data sent successfully for device ${deviceId} (${responseTime.toFixed(2)}ms)');
                
                // Update UI counters
                this._updateApiStats();
                
                return { 
                    success: true, 
                    data: responseData,
                    responseTime,
                    status: response.status
                };
                
            } else {
                this._errorCount++;
                const errorMsg = responseData?.message || `HTTP ${response.status}: ${response.statusText}`;
                
                log(`❌ API call failed for device ${deviceId}: ${errorMsg}`);
                
                if (response.status === 401) {
                    log('🔑 Authentication failed - token may be expired or invalid');
                    Utils.updateStatus('token-status', 'bad', 'Auth Failed');
                }
                
                return { 
                    success: false, 
                    error: errorMsg,
                    status: response.status,
                    responseTime
                };
            }
            
        } catch (error) {
            this._errorCount++;
            this._requestQueue.delete(requestId);
            
            log('❌ Network error for device ${deviceId}: ${error.message}');
            
            if (error.message.includes('CORS')) {
                log('💡 This might be a CORS policy issue');
            } else if (error.message.includes('fetch')) {
                log('💡 Check network connectivity and API endpoint');
            }
            
            return { 
                success: false, 
                error: error.message,
                networkError: true
            };
        }
    },

    /**
     * Test API connectivity
     */
    async testConnection(deviceId = 'TEST-DEVICE') {
        log('🔍 Testing API connectivity...');
        
        const result = await this.sendGPS(deviceId, 6.9271, 79.8612, {
            speed: 0,
            additionalData: { test: true }
        });
        
        if (result.success) {
            log('✅ API connection test successful');
            Utils.updateStatus('token-status', 'good', 'API Connected');
        } else {
            log(`❌ API connection test failed: ${result.error}`);
        }
        
        return result;
    },

    /**
     * Batch send GPS data for multiple devices
     */
    async sendBatchGPS(gpsDataArray) {
        if (!Array.isArray(gpsDataArray) || gpsDataArray.length === 0) {
            log('❌ Invalid GPS data array for batch send');
            return [];
        }
        
        log(`📡 Sending batch GPS data for ${gpsDataArray.length} devices`);
        Utils.PerformanceUtils.startTimer('batch-send');
        
        const promises = gpsDataArray.map(data => 
            this.sendGPS(data.deviceId, data.lat, data.lng, {
                speed: data.speed,
                timestamp: data.timestamp,
                additionalData: data.additionalData
            })
        );
        
        const results = await Promise.allSettled(promises);
        const batchTime = Utils.PerformanceUtils.endTimer('batch-send');
        
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.length - successful;
        
        log(`📊 Batch complete: ${successful} successful, ${failed} failed (${batchTime.toFixed(2)}ms)`);
        
        return results.map(result => 
            result.status === 'fulfilled' ? result.value : { success: false, error: result.reason }
        );
    },

    /**
     * Get current token status
     */
    getTokenStatus() {
        if (!this._currentToken) {
            return { valid: false, message: 'No token set' };
        }
        
        const parsed = Utils.TokenUtils.parse(this._currentToken);
        if (!parsed.valid) {
            return { valid: false, message: 'Invalid token format' };
        }
        
        const expiryInfo = Utils.TokenUtils.getExpiryInfo(parsed.payload);
        if (expiryInfo.expired) {
            return { valid: false, message: 'Token expired' };
        }
        
        return { 
            valid: true, 
            message: 'Token valid',
            expiresAt: expiryInfo.expiresAt,
            timeLeft: expiryInfo.timeLeftHours
        };
    },

    /**
     * Get API call statistics
     */
    getCallCount() {
        return this._apiCallCount;
    },

    getErrorCount() {
        return this._errorCount;
    },

    getActiveRequests() {
        return this._requestQueue.size;
    },

    /**
     * Reset statistics
     */
    resetStats() {
        this._apiCallCount = 0;
        this._errorCount = 0;
        this._updateApiStats();
        log('📊 API statistics reset');
    },

    /**
     * Private method to validate token and update UI status
     */
    _validateAndUpdateTokenStatus() {
        const status = this.getTokenStatus();
        if (status.valid) {
            Utils.updateStatus('token-status', 'good', status.message);
            if (status.expiresAt) {
                log(`🔐 Token valid until: ${status.expiresAt.toLocaleString()}`);
            }
        } else {
            Utils.updateStatus('token-status', 'bad', status.message);
        }
    },

    /**
     * Private method to update API statistics in UI
     */
    _updateApiStats() {
        const activeElement = document.getElementById('activeCount');
        const callsElement = document.getElementById('apiCallCount');
        const errorsElement = document.getElementById('errorCount');
        
        if (activeElement) activeElement.textContent = this._requestQueue.size;
        if (callsElement) callsElement.textContent = Utils.FormatUtils.formatNumber(this._apiCallCount);
        if (errorsElement) errorsElement.textContent = this._errorCount;
    },

    /**
     * Clear current token
     */
    clearToken() {
        this._currentToken = null;
        this._tokenInfo = null;
        Utils.StorageUtils.remove('auth-token');
        Utils.updateStatus('token-status', 'bad', 'No Token');
        log('🗑️ Authentication token cleared');
    }
};

// Auto-update statistics display
setInterval(() => {
    if (API._apiCallCount > 0 || API._errorCount > 0) {
        API._updateApiStats();
    }
}, 1000);

// Export for external use
window.API = API; 