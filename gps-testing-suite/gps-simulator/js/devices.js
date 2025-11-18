/**
 * Devices Module for GPS Simulator
 * Handles bulk device simulation, coordinate streaming, and device management
 */

const Devices = {
    // Device state
    deviceData: [],
    activeSimulations: new Map(),
    simulationStats: {
        activeCount: 0,
        totalApiCalls: 0,
        errors: 0,
        startTime: null
    },
    
    // Simulation control
    isSimulationRunning: false,
    isSimulationPaused: false,
    staggerDelay: 150,
    maxDevices: 1000,
    playbackSpeed: 1, // Speed multiplier (1x, 2x, 4x, etc.)
    vehicleSpeedOverride: null, // Manual speed override (km/h)

    /**
     * Initialize Devices module
     */
    init() {
        log('🚀 Devices module initialized');
        log(`📊 Maximum supported devices: ${this.maxDevices}`);
    },

    /**
     * Load sample device data
     */
    async loadSampleData() {
        try {
            log('📋 Loading sample device data...');
            
            // Check if sample file exists
            try {
                const response = await fetch('data/sample.json');
                if (response.ok) {
                    const data = await response.json();
                    log(`✅ Loaded sample data from file: ${data.length} devices`);
                    this.processDeviceData(data);
                    return;
                }
            } catch (fileError) {
                log('📁 Sample file not found, using built-in data');
            }
            
            // Fallback to built-in sample data
            const sampleData = this.generateSampleData();
            log(`✅ Generated sample data: ${sampleData.length} devices`);
            this.processDeviceData(sampleData);
            
        } catch (error) {
            log(`❌ Failed to load sample data: ${error.message}`);
        }
    },

    /**
     * Generate built-in sample data
     */
    generateSampleData() {
        return [
            {
                deviceId: "DEV-001-COLOMBO",
                coordinates: [
                    { lat: 6.9271, lng: 79.8612, duration: 5000, name: "Colombo Fort" },
                    { lat: 6.9319, lng: 79.8478, duration: 4000, name: "Pettah" },
                    { lat: 6.9147, lng: 79.8736, duration: 6000, name: "Bambalapitiya" },
                    { lat: 6.8989, lng: 79.8542, duration: 3000, name: "Wellawatta" },
                    { lat: 6.8649, lng: 79.8997, duration: 7000, name: "Mount Lavinia" }
                ]
            },
            {
                deviceId: "DEV-002-KANDY",
                coordinates: [
                    { lat: 7.2906, lng: 80.6337, duration: 4000, name: "Kandy City" },
                    { lat: 7.2731, lng: 80.5917, duration: 5000, name: "Peradeniya" },
                    { lat: 7.2575, lng: 80.5906, duration: 3000, name: "Botanical Garden" },
                    { lat: 7.2906, lng: 80.6337, duration: 6000, name: "Temple of Tooth" }
                ]
            },
            {
                deviceId: "DEV-003-GALLE",
                coordinates: [
                    { lat: 6.0329, lng: 80.217, duration: 4500, name: "Galle Fort" },
                    { lat: 6.0535, lng: 80.2211, duration: 3500, name: "Unawatuna" },
                    { lat: 5.9824, lng: 80.1738, duration: 5000, name: "Hikkaduwa" },
                    { lat: 5.9485, lng: 80.1162, duration: 4000, name: "Dodanduwa" }
                ]
            }
        ];
    },

    /**
     * Handle file upload
     */
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        log(`📂 Processing file: ${file.name} (${Utils.FormatUtils.formatBytes(file.size)})`);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                log(`✅ File parsed successfully`);
                this.processDeviceData(data);
            } catch (error) {
                log(`❌ Failed to parse JSON file: ${error.message}`);
            }
        };
        
        reader.onerror = () => {
            log(`❌ Failed to read file: ${file.name}`);
        };
        
        reader.readAsText(file);
    },

    /**
     * Parse manual JSON data
     */
    parseManualData() {
        const jsonInput = document.getElementById('jsonInput');
        const text = jsonInput.value.trim();
        
        if (!text) {
            log('❌ Please paste JSON data first');
            return;
        }
        
        try {
            const data = JSON.parse(text);
            log('📊 Manual JSON data parsed successfully');
            this.processDeviceData(data);
            
            // Clear input
            jsonInput.value = '';
            
        } catch (error) {
            log(`❌ Invalid JSON data: ${error.message}`);
        }
    },

    /**
     * Process and validate device data
     */
    processDeviceData(data) {
        try {
            // Validate data structure
            const validation = Utils.ValidationUtils.validateDeviceData(data);
            if (!validation.valid) {
                log('❌ Device data validation failed:');
                validation.errors.forEach(error => {
                    log(`   ├─ ${error}`);
                });
                return;
            }
            
            // Limit device count
            if (data.length > this.maxDevices) {
                log(`⚠️ Device count (${data.length}) exceeds maximum (${this.maxDevices}). Limiting to first ${this.maxDevices} devices.`);
                data = data.slice(0, this.maxDevices);
            }
            
            // Process coordinates
            this.deviceData = data.map(device => ({
                deviceId: device.deviceId,
                coordinates: device.coordinates.map(coord => ({
                    lat: parseFloat(coord.lat),
                    lng: parseFloat(coord.lng),
                    duration: parseInt(coord.duration) || 3000,
                    name: coord.name || `Point ${coord.lat}, ${coord.lng}`,
                    speed: coord.speed || 45
                })),
                currentIndex: 0,
                status: 'ready',
                lastUpdate: null
            }));
            
            const totalCoordinates = this.deviceData.reduce((sum, device) => sum + device.coordinates.length, 0);
            
            log(`✅ Processed ${this.deviceData.length} devices with ${totalCoordinates} total coordinates`);
            
            // Update UI
            this.updateDataInfo();
            this.showDeviceControls();
            UI.populateDeviceSelectors(this.deviceData);
            
            Utils.updateStatus('data-status', 'good', `${this.deviceData.length} Devices Loaded`);
            
        } catch (error) {
            log(`❌ Error processing device data: ${error.message}`);
            Utils.updateStatus('data-status', 'bad', 'Data Processing Failed');
        }
    },

    /**
     * Update data information display
     */
    updateDataInfo() {
        const dataInfo = document.getElementById('dataInfo');
        if (!dataInfo) return;
        
        const totalCoords = this.deviceData.reduce((sum, device) => sum + device.coordinates.length, 0);
        const avgCoordsPerDevice = (totalCoords / this.deviceData.length).toFixed(1);
        
        dataInfo.innerHTML = `
            <strong>📊 Data Summary:</strong><br>
            • Total Devices: ${Utils.FormatUtils.formatNumber(this.deviceData.length)}<br>
            • Total Coordinates: ${Utils.FormatUtils.formatNumber(totalCoords)}<br>
            • Avg Coordinates/Device: ${avgCoordsPerDevice}<br>
            • Status: Ready for simulation
        `;
        
        dataInfo.style.display = 'block';
    },

    /**
     * Show device control sections
     */
    showDeviceControls() {
        Utils.toggleSection('visualSection', true);
        Utils.toggleSection('controlSection', true);
    },

    /**
     * Start simulation for all devices
     */
    async startSimulation() {
        if (this.isSimulationRunning) {
            log('⚠️ Simulation already running');
            return;
        }
        
        if (this.deviceData.length === 0) {
            log('❌ No device data loaded');
            return;
        }
        
        if (!API.getTokenStatus().valid) {
            log('❌ No valid authentication token available');
            return;
        }
        
        this.isSimulationRunning = true;
        this.isSimulationPaused = false;
        this.simulationStats.startTime = Date.now();
        this.simulationStats.activeCount = 0;
        
        // Update UI
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-flex';
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('liveStaggerBtn').disabled = false;
        document.getElementById('simStats').style.display = 'block';
        Utils.updateStatus('sim-status', 'good', 'Running');
        
        // Get stagger delay
        this.staggerDelay = parseInt(document.getElementById('staggerDelay').value) || 150;
        
        log(`🚀 Starting simulation for ${this.deviceData.length} devices`);
        log(`⏰ Stagger delay: ${this.staggerDelay}ms between device starts`);
        
        // Start devices with staggered delays
        for (let i = 0; i < this.deviceData.length; i++) {
            if (!this.isSimulationRunning) break;
            
            const device = this.deviceData[i];
            
            // Start device simulation
            setTimeout(() => {
                this.startDeviceSimulation(device);
            }, i * this.staggerDelay);
        }
        
        // Start statistics updates
        this.startStatsUpdates();
    },

    /**
     * Pause all device simulations
     */
    pauseSimulation() {
        if (!this.isSimulationRunning || this.isSimulationPaused) return;
        
        this.isSimulationPaused = true;
        
        log(`⏸️ Pausing simulation for ${this.activeSimulations.size} active devices`);
        
        // Clear all timeouts but keep device states
        this.activeSimulations.forEach((simulation, deviceId) => {
            if (simulation.timeoutId) {
                clearTimeout(simulation.timeoutId);
                simulation.timeoutId = null;
            }
            // Mark devices as paused but keep their current index
            const device = this.deviceData.find(d => d.deviceId === deviceId);
            if (device && device.status === 'active') {
                device.status = 'paused';
            }
        });
        
        // Update UI
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'inline-flex';
        Utils.updateStatus('sim-status', 'warn', 'Paused');
        
        log('⏸️ Simulation paused successfully');
    },

    /**
     * Resume all device simulations
     */
    resumeSimulation() {
        if (!this.isSimulationRunning || !this.isSimulationPaused) return;
        
        this.isSimulationPaused = false;
        
        log(`▶️ Resuming simulation for ${this.activeSimulations.size} devices`);
        
        // Resume all paused devices
        this.activeSimulations.forEach((simulation, deviceId) => {
            const device = this.deviceData.find(d => d.deviceId === deviceId);
            if (device && device.status === 'paused') {
                device.status = 'active';
                // Resume coordinate streaming from current position
                this.simulateCoordinates(device);
            }
        });
        
        // Update UI
        document.getElementById('resumeBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-flex';
        Utils.updateStatus('sim-status', 'good', 'Running');
        
        log('▶️ Simulation resumed successfully');
    },

    /**
     * Stop all device simulations
     */
    stopSimulation() {
        if (!this.isSimulationRunning) return;
        
        this.isSimulationRunning = false;
        this.isSimulationPaused = false;
        
        log(`⏹️ Stopping simulation for ${this.activeSimulations.size} active devices`);
        
        // Stop all active device simulations
        this.activeSimulations.forEach((simulation, deviceId) => {
            if (simulation.timeoutId) {
                clearTimeout(simulation.timeoutId);
            }
            this.deviceData.find(d => d.deviceId === deviceId).status = 'stopped';
        });
        
        this.activeSimulations.clear();
        this.simulationStats.activeCount = 0;
        
        // Reset UI to initial state
        document.getElementById('startBtn').style.display = 'inline-flex';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('resumeBtn').style.display = 'none';
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('liveStaggerBtn').disabled = true;
        Utils.updateStatus('sim-status', 'bad', 'Stopped');
        
        const duration = Utils.FormatUtils.formatDuration(Date.now() - this.simulationStats.startTime);
        log(`📊 Simulation stopped. Duration: ${duration}`);
        log(`📊 Final stats: ${this.simulationStats.totalApiCalls} API calls, ${this.simulationStats.errors} errors`);
    },

    /**
     * Dynamically adjust timing intervals of running devices (Live Stagger)
     */
    adjustLiveStagger() {
        if (!this.isSimulationRunning || this.activeSimulations.size === 0 || this.isSimulationPaused) {
            log('❌ No active simulation to adjust');
            return;
        }

        const newStagger = parseInt(document.getElementById('staggerDelay').value) || 150;
        log(`🔄 Applying live stagger adjustment: ${newStagger}ms`);
        
        // Get all active devices and their current states
        const activeDevices = Array.from(this.activeSimulations.keys());
        let adjustedCount = 0;

        activeDevices.forEach((deviceId, index) => {
            const simulation = this.activeSimulations.get(deviceId);
            const device = this.deviceData.find(d => d.deviceId === deviceId);
            
            if (!device || device.status !== 'active' || !simulation) return;

            // Clear existing timeout
            if (simulation.timeoutId) {
                clearTimeout(simulation.timeoutId);
            }

            // Calculate new delay: base coordinate duration + stagger offset + speed multiplier
            const currentCoord = device.coordinates[device.currentIndex] || device.coordinates[device.currentIndex - 1];
            const baseDuration = currentCoord ? currentCoord.duration : 5000;
            
            // Apply playback speed multiplier (higher speed = shorter delays)
            const speedAdjustedDuration = Math.max(50, baseDuration / this.playbackSpeed); // Minimum 50ms
            
            // Apply stagger: each device gets additional delay based on its position
            const staggerOffset = (index % 10) * newStagger; // Spread devices across stagger intervals
            const newDelay = Math.max(100, speedAdjustedDuration + staggerOffset); // Minimum 100ms
            
            // Reschedule with new timing
            const newTimeoutId = setTimeout(() => {
                this.simulateCoordinates(device);
            }, newDelay);
            
            // Update the simulation record
            this.activeSimulations.set(deviceId, {
                deviceId: deviceId,
                timeoutId: newTimeoutId
            });
            
            adjustedCount++;
        });

        log(`✅ Live settings applied to ${adjustedCount} active devices`);
        log(`⏰ Speed: ${this.playbackSpeed}x | Stagger: ${newStagger}ms | Vehicle Speed: ${this.vehicleSpeedOverride ? this.vehicleSpeedOverride + ' km/h' : 'Auto'}`);
    },

    /**
     * Set playback speed multiplier
     */
    setPlaybackSpeed(multiplier) {
        this.playbackSpeed = multiplier;
        
        // Update UI to show active speed button
        document.querySelectorAll('.btn-speed').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`speed${multiplier}x`).classList.add('active');
        
        log(`🏃‍♂️ Playback speed set to ${multiplier}x`);
        
        // If simulation is running, apply speed change immediately
        if (this.isSimulationRunning) {
            this.adjustLiveStagger();
        }
    },

    /**
     * Set vehicle speed override
     */
    setVehicleSpeedOverride() {
        const speedInput = document.getElementById('vehicleSpeed');
        const speed = parseFloat(speedInput.value);
        
        this.vehicleSpeedOverride = isNaN(speed) || speed <= 0 ? null : speed;
        
        if (this.vehicleSpeedOverride) {
            log(`🚗 Vehicle speed override: ${this.vehicleSpeedOverride} km/h`);
        } else {
            log(`🚗 Vehicle speed override: Auto (from coordinate data)`);
        }
        
        // If simulation is running, apply speed change immediately
        if (this.isSimulationRunning) {
            this.adjustLiveStagger();
        }
    },

    /**
     * Start simulation for individual device
     */
    async startDeviceSimulation(device) {
        if (!this.isSimulationRunning) return;
        
        device.status = 'active';
        device.currentIndex = 0;
        this.simulationStats.activeCount++;
        
        log(`🎯 Started simulation for device: ${device.deviceId} (${device.coordinates.length} coordinates)`);
        
        // Start coordinate streaming
        this.simulateCoordinates(device);
    },

    /**
     * Simulate GPS coordinates for a device (core function)
     */
    async simulateCoordinates(device) {
        if (!this.isSimulationRunning || device.status !== 'active') {
            return;
        }
        
        // Skip if simulation is paused
        if (this.isSimulationPaused) {
            return;
        }
        
        if (device.currentIndex >= device.coordinates.length) {
            // Device simulation complete
            this.completeDeviceSimulation(device);
            return;
        }
        
        const currentCoord = device.coordinates[device.currentIndex];
        const { lat, lng, duration, speed } = currentCoord;
        
        // Apply vehicle speed override if set, otherwise use coordinate speed
        const finalSpeed = this.vehicleSpeedOverride || speed;
        
        try {
            // Send GPS data to API
            const result = await API.sendGPS(device.deviceId, lat, lng, {
                speed: finalSpeed,
                timestamp: new Date().toISOString(),
                additionalData: {
                    coordinateIndex: device.currentIndex,
                    coordinateName: currentCoord.name,
                    playbackSpeed: this.playbackSpeed
                }
            });
            
            if (result.success) {
                this.simulationStats.totalApiCalls++;
                device.lastUpdate = Date.now();
                
                // Update visual device if selected
                if (UI.visualDevices.includes(device.deviceId)) {
                    UI.updateDeviceMarker(device.deviceId, lat, lng, {
                        speed: finalSpeed,
                        status: 'active',
                        additionalInfo: `${device.currentIndex + 1}/${device.coordinates.length} - ${currentCoord.name} (${this.playbackSpeed}x)`
                    });
                }
                
            } else {
                this.simulationStats.errors++;
                device.status = 'error';
                log(`❌ Failed to send GPS data for ${device.deviceId}: ${result.error}`);
                
                // Update visual device status
                if (UI.visualDevices.includes(device.deviceId)) {
                    UI.updateDeviceStatus(device.deviceId, 'error', result.error);
                }
            }
            
        } catch (error) {
            this.simulationStats.errors++;
            device.status = 'error';
            log(`❌ Simulation error for ${device.deviceId}: ${error.message}`);
        }
        
        // Move to next coordinate
        device.currentIndex++;
        
        // Schedule next coordinate with specified duration (adjusted for playback speed)
        if (this.isSimulationRunning && device.status === 'active' && !this.isSimulationPaused) {
            // Apply playback speed multiplier (higher speed = shorter delays)
            const speedAdjustedDuration = Math.max(50, duration / this.playbackSpeed); // Minimum 50ms
            
            const simulation = {
                deviceId: device.deviceId,
                timeoutId: setTimeout(() => {
                    this.simulateCoordinates(device);
                }, speedAdjustedDuration)
            };
            
            this.activeSimulations.set(device.deviceId, simulation);
        }
    },

    /**
     * Complete device simulation
     */
    completeDeviceSimulation(device) {
        device.status = 'completed';
        this.simulationStats.activeCount = Math.max(0, this.simulationStats.activeCount - 1);
        this.activeSimulations.delete(device.deviceId);
        
        log(`✅ Completed simulation for device: ${device.deviceId}`);
        
        // Update visual device status
        if (UI.visualDevices.includes(device.deviceId)) {
            UI.updateDeviceStatus(device.deviceId, 'completed');
        }
        
        // Check if all simulations are complete
        if (this.simulationStats.activeCount === 0 && this.isSimulationRunning) {
            log('🎉 All device simulations completed');
            this.stopSimulation();
        }
    },

    /**
     * Start periodic statistics updates
     */
    startStatsUpdates() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
        
        this.statsInterval = setInterval(() => {
            if (!this.isSimulationRunning) {
                clearInterval(this.statsInterval);
                return;
            }
            
            this.updateSimulationStats();
        }, 1000);
    },

    /**
     * Update simulation statistics display
     */
    updateSimulationStats() {
        const activeElement = document.getElementById('activeCount');
        const callsElement = document.getElementById('apiCallCount');
        const errorsElement = document.getElementById('errorCount');
        
        if (activeElement) {
            activeElement.textContent = this.simulationStats.activeCount;
        }
        if (callsElement) {
            callsElement.textContent = Utils.FormatUtils.formatNumber(this.simulationStats.totalApiCalls);
        }
        if (errorsElement) {
            errorsElement.textContent = this.simulationStats.errors;
        }
        
        // Update device stats on map
        if (this.deviceData.length > 0) {
            UI.showDeviceStats(this.deviceData);
        }
    },

    /**
     * Get active device count
     */
    getActiveCount() {
        return this.simulationStats.activeCount;
    },

    /**
     * Load device data from external source (for external API calls)
     */
    loadDeviceData(data) {
        this.processDeviceData(data);
        return {
            success: true,
            deviceCount: this.deviceData.length,
            totalCoordinates: this.deviceData.reduce((sum, device) => sum + device.coordinates.length, 0)
        };
    },

    /**
     * Get current simulation status
     */
    getSimulationStatus() {
        return {
            isRunning: this.isSimulationRunning,
            isPaused: this.isSimulationPaused,
            activeDevices: this.simulationStats.activeCount,
            totalDevices: this.deviceData.length,
            apiCalls: this.simulationStats.totalApiCalls,
            errors: this.simulationStats.errors,
            startTime: this.simulationStats.startTime,
            uptime: this.simulationStats.startTime ? Date.now() - this.simulationStats.startTime : 0
        };
    },

    /**
     * Reset all device simulations
     */
    resetSimulation() {
        this.stopSimulation();
        
        // Reset device states
        this.deviceData.forEach(device => {
            device.currentIndex = 0;
            device.status = 'ready';
            device.lastUpdate = null;
        });
        
        // Reset statistics
        this.simulationStats = {
            activeCount: 0,
            totalApiCalls: 0,
            errors: 0,
            startTime: null
        };
        
        // Clear UI
        UI.clearAllDevices();
        
        log('🔄 Simulation reset - all devices ready');
    },

    /**
     * Get device by ID
     */
    getDevice(deviceId) {
        return this.deviceData.find(d => d.deviceId === deviceId);
    },

    /**
     * Get devices by status
     */
    getDevicesByStatus(status) {
        return this.deviceData.filter(d => d.status === status);
    }
};

// Export for external use
window.Devices = Devices; 