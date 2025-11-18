/**
 * Export Controller for GPS Path Builder
 * Handles JSON export, download, and clipboard functionality
 */
const ExportController = {
    /**
     * Download GPS data as JSON file
     */
    downloadJSON() {
        try {
            if (!window.gpsData || window.gpsData.length === 0) {
                Utils.showStatus('No GPS data to download. Generate a route first.', 'error');
                return;
            }

            const jsonData = this.formatGPSDataForExport();
            const jsonString = JSON.stringify(jsonData, null, 2);
            
            // Create blob and download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = this.generateFileName();
            downloadLink.style.display = 'none';
            
            // Trigger download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            Utils.showStatus(`GPS data downloaded successfully! ${jsonData.length} points exported.`, 'success');
            
        } catch (error) {
            console.error('Download error:', error);
            Utils.showStatus(`Error downloading file: ${error.message}`, 'error');
        }
    },

    /**
     * Copy GPS data to clipboard
     */
    async copyToClipboard() {
        try {
            if (!window.gpsData || window.gpsData.length === 0) {
                Utils.showStatus('No GPS data to copy. Generate a route first.', 'error');
                return;
            }

            const jsonData = this.formatGPSDataForExport();
            const jsonString = JSON.stringify(jsonData, null, 2);
            
            // Use modern clipboard API if available
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(jsonString);
            } else {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(jsonString);
            }
            
            Utils.showStatus(`GPS data copied to clipboard! ${jsonData.length} points ready to paste.`, 'success');
            
        } catch (error) {
            console.error('Clipboard error:', error);
            Utils.showStatus(`Error copying to clipboard: ${error.message}`, 'error');
        }
    },

    /**
     * Fallback method for copying to clipboard in older browsers
     * @param {string} text - Text to copy
     */
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            throw new Error('Clipboard access not available');
        } finally {
            document.body.removeChild(textArea);
        }
    },

    /**
     * Format GPS data for export to match simulator requirements
     * @returns {Array} Formatted GPS data array
     */
    formatGPSDataForExport() {
        if (!window.gpsData || window.gpsData.length === 0) {
            return [];
        }

        return window.gpsData.map((point, index) => ({
            lat: point.lat,
            lng: point.lng,
            duration: point.duration,
            name: point.name || (index === 0 ? 'Start' : index === window.gpsData.length - 1 ? 'End' : `Point ${index + 1}`)
        }));
    },

    /**
     * Generate filename for export
     * @returns {string} Generated filename
     */
    generateFileName() {
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace(/[:\-]/g, '').replace('T', '_');
        const waypointCount = MapController.waypoints.length;
        const pointCount = window.gpsData.length;
        const intervalMeters = parseFloat(document.getElementById('interval').value) || 10;
        
        return `gps_route_${waypointCount}waypoints_${pointCount}points_${intervalMeters}m_${timestamp}.json`;
    },

    /**
     * Validate GPS data before export
     * @returns {Object} Validation result {isValid, errors}
     */
    validateGPSData() {
        const errors = [];
        
        if (!window.gpsData || !Array.isArray(window.gpsData)) {
            errors.push('GPS data is not available or not an array');
            return { isValid: false, errors };
        }
        
        if (window.gpsData.length === 0) {
            errors.push('GPS data is empty');
            return { isValid: false, errors };
        }
        
        // Validate each GPS point
        window.gpsData.forEach((point, index) => {
            if (!point || typeof point !== 'object') {
                errors.push(`Point ${index + 1}: Invalid point object`);
                return;
            }
            
            if (!Utils.isValidCoordinate(point.lat, point.lng)) {
                errors.push(`Point ${index + 1}: Invalid coordinates (lat: ${point.lat}, lng: ${point.lng})`);
            }
            
            if (typeof point.duration !== 'number' || point.duration < 0) {
                errors.push(`Point ${index + 1}: Invalid duration (${point.duration})`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Export GPS data with additional metadata
     * @returns {Object} Complete export object with metadata
     */
    exportWithMetadata() {
        const validation = this.validateGPSData();
        
        if (!validation.isValid) {
            throw new Error(`GPS data validation failed: ${validation.errors.join(', ')}`);
        }
        
        const gpsPoints = this.formatGPSDataForExport();
        const waypoints = MapController.waypoints.map(wp => ({
            lat: wp.lat,
            lng: wp.lng,
            name: wp.name
        }));
        
        // Calculate statistics
        const totalDistance = this.calculateTotalPathDistance(gpsPoints);
        const totalDuration = gpsPoints.reduce((sum, point) => sum + point.duration, 0);
        const avgSpeed = totalDistance > 0 ? (totalDistance / 1000) / (totalDuration / 3600000) : 0;
        
        // Get the actual interval used from UI
        const intervalMeters = parseFloat(document.getElementById('interval').value) || 10;
        
        return {
            metadata: {
                generatedAt: new Date().toISOString(),
                tool: 'GPS Path Builder',
                version: '1.0.0',
                waypoints: waypoints.length,
                gpsPoints: gpsPoints.length,
                totalDistance: totalDistance,
                totalDuration: totalDuration,
                averageSpeed: parseFloat(avgSpeed.toFixed(2)),
                intervalMeters: intervalMeters
            },
            waypoints: waypoints,
            route: gpsPoints
        };
    },

    /**
     * Calculate total distance of GPS path
     * @param {Array} gpsPoints - GPS points array
     * @returns {number} Total distance in meters
     */
    calculateTotalPathDistance(gpsPoints) {
        if (!gpsPoints || gpsPoints.length < 2) {
            return 0;
        }
        
        let totalDistance = 0;
        
        for (let i = 1; i < gpsPoints.length; i++) {
            const prev = gpsPoints[i - 1];
            const curr = gpsPoints[i];
            totalDistance += Utils.haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
        }
        
        return totalDistance;
    },

    /**
     * Preview GPS data in a modal or new window
     */
    previewGPSData() {
        try {
            const validation = this.validateGPSData();
            
            if (!validation.isValid) {
                Utils.showStatus(`Cannot preview: ${validation.errors.join(', ')}`, 'error');
                return;
            }
            
            const exportData = this.exportWithMetadata();
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Open in new window for preview
            const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
            
            if (previewWindow) {
                previewWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>GPS Data Preview</title>
                        <style>
                            body { font-family: monospace; padding: 20px; background: #f5f5f5; }
                            .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                            pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow: auto; max-height: 70vh; }
                            .header { margin-bottom: 20px; }
                            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 20px; }
                            .stat { background: #e9ecef; padding: 10px; border-radius: 4px; }
                            .stat strong { color: #495057; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>GPS Path Builder - Data Preview</h1>
                                <p>Generated on: ${exportData.metadata.generatedAt}</p>
                            </div>
                            
                            <div class="stats">
                                <div class="stat"><strong>Waypoints:</strong> ${exportData.metadata.waypoints}</div>
                                <div class="stat"><strong>GPS Points:</strong> ${exportData.metadata.gpsPoints}</div>
                                <div class="stat"><strong>Total Distance:</strong> ${Utils.formatDistance(exportData.metadata.totalDistance)}</div>
                                <div class="stat"><strong>Total Duration:</strong> ${Utils.formatTime(exportData.metadata.totalDuration)}</div>
                                <div class="stat"><strong>Average Speed:</strong> ${exportData.metadata.averageSpeed} km/h</div>
                                <div class="stat"><strong>Interval:</strong> ${exportData.metadata.intervalMeters} meters</div>
                            </div>
                            
                            <h3>JSON Data:</h3>
                            <pre>${jsonString}</pre>
                        </div>
                    </body>
                    </html>
                `);
                previewWindow.document.close();
            } else {
                Utils.showStatus('Could not open preview window. Please check popup blocker settings.', 'error');
            }
            
        } catch (error) {
            console.error('Preview error:', error);
            Utils.showStatus(`Error generating preview: ${error.message}`, 'error');
        }
    },

    /**
     * Import GPS data from JSON file
     * @param {File} file - JSON file to import
     */
    async importFromFile(file) {
        try {
            if (!file || file.type !== 'application/json') {
                throw new Error('Please select a valid JSON file');
            }
            
            const text = await file.text();
            const data = JSON.parse(text);
            
            // Validate imported data structure
            if (Array.isArray(data)) {
                // Simple array format
                window.gpsData = data;
            } else if (data.route && Array.isArray(data.route)) {
                // Format with metadata
                window.gpsData = data.route;
            } else {
                throw new Error('Invalid GPS data format');
            }
            
            // Validate the imported data
            const validation = this.validateGPSData();
            if (!validation.isValid) {
                throw new Error(`Invalid GPS data: ${validation.errors.join(', ')}`);
            }
            
            // Update UI
            document.getElementById('gps-points-count').textContent = window.gpsData.length;
            if (typeof updateUI === 'function') {
                updateUI();
            }
            
            Utils.showStatus(`GPS data imported successfully! ${window.gpsData.length} points loaded.`, 'success');
            
        } catch (error) {
            console.error('Import error:', error);
            Utils.showStatus(`Error importing file: ${error.message}`, 'error');
        }
    }
}; 