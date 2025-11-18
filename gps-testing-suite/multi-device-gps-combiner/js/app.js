/**
 * Main application logic for Multi-Device GPS Combiner Tool
 * Handles device management, validation, and combining GPS data
 */

class GPSCombinerApp {
    constructor() {
        this.deviceCounter = 0;
        this.devices = new Map();
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.bindEvents();
        this.addInitialDevice();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Main control buttons
        document.getElementById('add-device-btn').addEventListener('click', () => {
            this.addDevice();
        });

        document.getElementById('generate-json-btn').addEventListener('click', () => {
            this.generateCombinedJSON();
        });

        // Result action buttons
        document.getElementById('copy-json-btn').addEventListener('click', () => {
            this.copyJSONToClipboard();
        });

        document.getElementById('download-json-btn').addEventListener('click', () => {
            this.downloadJSON();
        });

        // Output format dropdown
        document.getElementById('output-format').addEventListener('change', (e) => {
            this.handleFormatChange(e.target.value);
        });
    }

    /**
     * Add initial device on load
     */
    addInitialDevice() {
        this.addDevice();
    }

    /**
     * Add a new device input block
     */
    addDevice() {
        this.deviceCounter++;
        const deviceId = `device-${this.deviceCounter}`;
        
        const deviceBlock = this.createDeviceBlock(deviceId);
        const container = document.getElementById('devices-container');
        
        container.appendChild(deviceBlock);
        
        // Add animation class
        deviceBlock.classList.add('new');
        setTimeout(() => {
            deviceBlock.classList.remove('new');
        }, 300);

        // Focus on device ID input
        const deviceIdInput = deviceBlock.querySelector('.device-id-input');
        deviceIdInput.focus();

        // Store device reference
        this.devices.set(deviceId, {
            element: deviceBlock,
            deviceId: '',
            gpsData: null
        });
    }

    /**
     * Create a device input block
     * @param {string} deviceId - Unique device identifier
     * @returns {HTMLElement} Device block element
     */
    createDeviceBlock(deviceId) {
        const deviceBlock = document.createElement('div');
        deviceBlock.className = 'device-block';
        deviceBlock.setAttribute('data-device-id', deviceId);
        deviceBlock.setAttribute('data-testid', `device-block-${deviceId}`);

        deviceBlock.innerHTML = `
            <div class="device-header">
                <h3 class="device-title">📱 Device #${this.deviceCounter}</h3>
                <button class="btn btn-danger remove-device-btn" data-testid="remove-device-${deviceId}">
                    🗑️ Remove Device
                </button>
            </div>
            
            <div class="device-inputs">
                <div class="input-group">
                    <label for="${deviceId}-device-id">Device ID *</label>
                    <input 
                        type="text" 
                        id="${deviceId}-device-id" 
                        class="device-id-input"
                        data-testid="device-id-input-${deviceId}"
                        placeholder="e.g., VEHICLE-1, TRUCK-A, etc."
                        required
                    >
                    
                    <div class="file-upload">
                        <input 
                            type="file" 
                            id="${deviceId}-file" 
                            accept=".json"
                            data-testid="file-upload-${deviceId}"
                        >
                        <label for="${deviceId}-file" class="file-upload-label">
                            📁 Or upload JSON file
                        </label>
                    </div>
                </div>
                
                <div class="input-group">
                    <label for="${deviceId}-gps-data">GPS Data (JSON Array) *</label>
                    <textarea 
                        id="${deviceId}-gps-data" 
                        class="gps-data-input"
                        data-testid="gps-data-input-${deviceId}"
                        placeholder='[
  {
    "lat": 6.9271,
    "lng": 79.8612,
    "duration": 1000,
    "name": "Start Point"
  },
  {
    "lat": 6.9280,
    "lng": 79.8620,
    "duration": 2000,
    "name": "Next Point"
  }
]'
                        required
                    ></textarea>
                    
                    <div class="validation-feedback" data-testid="validation-feedback-${deviceId}"></div>
                </div>
            </div>
        `;

        this.bindDeviceEvents(deviceBlock, deviceId);
        return deviceBlock;
    }

    /**
     * Bind events for a specific device block
     * @param {HTMLElement} deviceBlock - Device block element
     * @param {string} deviceId - Device identifier
     */
    bindDeviceEvents(deviceBlock, deviceId) {
        // Remove device button
        const removeBtn = deviceBlock.querySelector('.remove-device-btn');
        removeBtn.addEventListener('click', () => {
            this.removeDevice(deviceId);
        });

        // Device ID input validation
        const deviceIdInput = deviceBlock.querySelector('.device-id-input');
        deviceIdInput.addEventListener('input', (e) => {
            this.updateDeviceId(deviceId, e.target.value);
        });

        // GPS data input validation
        const gpsDataInput = deviceBlock.querySelector('.gps-data-input');
        gpsDataInput.addEventListener('input', (e) => {
            this.validateGPSData(deviceId, e.target.value);
        });

        // File upload handler
        const fileInput = deviceBlock.querySelector('input[type="file"]');
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(deviceId, e.target.files[0]);
        });
    }

    /**
     * Remove a device block
     * @param {string} deviceId - Device identifier
     */
    removeDevice(deviceId) {
        if (this.devices.size <= 1) {
            ExportManager.showFeedback('At least one device is required', 'warning');
            return;
        }

        const deviceData = this.devices.get(deviceId);
        if (deviceData && deviceData.element) {
            deviceData.element.remove();
            this.devices.delete(deviceId);
            ExportManager.showFeedback('Device removed successfully', 'success');
        }
    }

    /**
     * Update device ID
     * @param {string} deviceId - Device identifier
     * @param {string} value - New device ID value
     */
    updateDeviceId(deviceId, value) {
        const deviceData = this.devices.get(deviceId);
        if (deviceData) {
            deviceData.deviceId = value.trim();
        }
    }

    /**
     * Normalize GPS data structure to handle different formats
     * @param {*} data - Input data to normalize
     * @returns {*} Normalized data
     */
    normalizeGPSData(data) {
        // Handle array of GPS points directly
        if (Array.isArray(data)) {
            return data;
        }

        // Handle device object with coordinates/gps key
        if (typeof data === 'object' && data !== null) {
            // Create a copy to avoid mutating original data
            const normalized = { ...data };
            
            // Convert coordinates → gps if present
            if (normalized.coordinates) {
                normalized.gps = normalized.coordinates;
                delete normalized.coordinates;
            }

            // If it's a device object, return the coordinates array
            if (normalized.gps && Array.isArray(normalized.gps)) {
                return normalized.gps;
            }
        }

        return data;
    }

    /**
     * Validate GPS data for a device
     * @param {string} deviceId - Device identifier
     * @param {string} jsonString - GPS data as JSON string
     */
    validateGPSData(deviceId, jsonString) {
        const deviceData = this.devices.get(deviceId);
        if (!deviceData) return;

        const feedbackElement = deviceData.element.querySelector('.validation-feedback');
        feedbackElement.innerHTML = '';

        if (!jsonString.trim()) {
            deviceData.gpsData = null;
            return;
        }

        // Parse JSON
        const parsedData = ExportManager.parseJSON(jsonString);
        if (!parsedData) {
            feedbackElement.innerHTML = '<div class="validation-message error">Invalid JSON format</div>';
            deviceData.gpsData = null;
            return;
        }

        // Normalize the data structure
        const normalizedData = this.normalizeGPSData(parsedData);

        // Validate GPS data structure
        const validation = ExportManager.validateGPSData(normalizedData);
        
        let feedbackHTML = '';
        
        if (validation.errors.length > 0) {
            feedbackHTML += validation.errors.map(error => 
                `<div class="validation-message error">${error}</div>`
            ).join('');
            deviceData.gpsData = null;
        } else {
            deviceData.gpsData = normalizedData;
            feedbackHTML += '<div class="validation-message success">✅ Valid GPS data format</div>';
            
                         // Show info about detected format
             if (typeof parsedData === 'object' && parsedData !== null && parsedData.coordinates) {
                 feedbackHTML += '<div class="validation-message warning">📝 Detected device object format - extracted coordinates array</div>';
             }
        }

        if (validation.warnings.length > 0) {
            feedbackHTML += validation.warnings.map(warning => 
                `<div class="validation-message warning">${warning}</div>`
            ).join('');
        }

        feedbackElement.innerHTML = feedbackHTML;
    }

    /**
     * Handle file upload for a device
     * @param {string} deviceId - Device identifier
     * @param {File} file - Uploaded file
     */
    async handleFileUpload(deviceId, file) {
        if (!file) return;

        const deviceData = this.devices.get(deviceId);
        if (!deviceData) return;

        try {
            const text = await this.readFileAsText(file);
            const gpsDataInput = deviceData.element.querySelector('.gps-data-input');
            gpsDataInput.value = text;
            
            // Trigger validation
            this.validateGPSData(deviceId, text);
            
            ExportManager.showFeedback('File loaded successfully', 'success');
        } catch (error) {
            console.error('Error reading file:', error);
            ExportManager.showFeedback('Error reading file', 'error');
        }
    }

    /**
     * Read file as text
     * @param {File} file - File to read
     * @returns {Promise<string>} File content
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    /**
     * Generate combined JSON from all devices
     */
    generateCombinedJSON() {
        this.clearValidationMessages();

        const validDevices = [];
        const errors = [];

        // Get selected output format
        const outputFormat = document.getElementById('output-format').value;

        // Validate all devices
        for (const [deviceId, deviceData] of this.devices.entries()) {
            const deviceIdValue = deviceData.deviceId;
            const gpsData = deviceData.gpsData;

            // Check device ID
            if (!deviceIdValue) {
                errors.push(`Device #${deviceId.split('-')[1]}: Device ID is required`);
                continue;
            }

            // Check GPS data
            if (!gpsData) {
                errors.push(`Device #${deviceId.split('-')[1]} (${deviceIdValue}): Valid GPS data is required`);
                continue;
            }

            // Check for duplicate device IDs
            const duplicateDevice = validDevices.find(d => d.deviceId === deviceIdValue);
            if (duplicateDevice) {
                errors.push(`Duplicate device ID: "${deviceIdValue}"`);
                continue;
            }

            // Filter GPS data based on output format
            const filteredGpsData = ExportManager.filterGPSDataByFormat(gpsData, outputFormat);

            validDevices.push({
                deviceId: deviceIdValue,
                coordinates: filteredGpsData
            });
        }

        // Show errors if any
        if (errors.length > 0) {
            this.showValidationMessages(errors.map(error => ({ type: 'error', message: error })));
            return;
        }

        // Generate combined JSON
        const combinedData = validDevices;
        const formattedJSON = ExportManager.formatJSON(combinedData);

        // Display results
        this.showResults(formattedJSON, combinedData);
        
        const formatText = outputFormat === 'basic' ? 'basic format (no speed)' : 'full format (with speed)';
        ExportManager.showFeedback(`Successfully combined ${validDevices.length} device(s) in ${formatText}`, 'success');
    }

    /**
     * Handle output format change
     * @param {string} format - Selected format ('basic' or 'full')
     */
    handleFormatChange(format) {
        // Only regenerate if we have existing data
        if (this.lastGeneratedData && this.lastGeneratedData.length > 0) {
            this.generateCombinedJSON();
        }
    }

    /**
     * Show validation messages
     * @param {Array} messages - Array of message objects with type and message
     */
    showValidationMessages(messages) {
        const container = document.getElementById('validation-messages');
        container.innerHTML = messages.map(msg => 
            `<div class="validation-message ${msg.type}">${msg.message}</div>`
        ).join('');
    }

    /**
     * Clear validation messages
     */
    clearValidationMessages() {
        const container = document.getElementById('validation-messages');
        container.innerHTML = '';
    }

    /**
     * Show results section with generated JSON
     * @param {string} formattedJSON - Formatted JSON string
     * @param {Array} data - Original data for download
     */
    showResults(formattedJSON, data) {
        const resultsSection = document.getElementById('results-section');
        const jsonOutput = document.getElementById('json-output');
        
        jsonOutput.value = formattedJSON;
        resultsSection.style.display = 'block';
        
        // Store data for download
        this.lastGeneratedData = data;
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Copy JSON to clipboard
     */
    async copyJSONToClipboard() {
        const jsonOutput = document.getElementById('json-output');
        const text = jsonOutput.value;
        
        if (!text) {
            ExportManager.showFeedback('No JSON to copy', 'warning');
            return;
        }

        const success = await ExportManager.copyToClipboard(text);
        if (success) {
            ExportManager.showFeedback('JSON copied to clipboard!', 'success');
        } else {
            ExportManager.showFeedback('Failed to copy to clipboard', 'error');
        }
    }

    /**
     * Download JSON file
     */
    downloadJSON() {
        if (!this.lastGeneratedData) {
            ExportManager.showFeedback('No data to download', 'warning');
            return;
        }

        const filename = ExportManager.generateFilename('combined-gps-data');
        const success = ExportManager.downloadJSON(this.lastGeneratedData, filename);
        
        if (success) {
            ExportManager.showFeedback('JSON file downloaded!', 'success');
        } else {
            ExportManager.showFeedback('Failed to download file', 'error');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gpsApp = new GPSCombinerApp();
});

// Make GPSCombinerApp available globally for testing
window.GPSCombinerApp = GPSCombinerApp; 