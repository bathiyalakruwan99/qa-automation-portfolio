'use client';

import { OptimizationOptions, Point } from '@/lib/types';
import { generateId, isCoordinateInput, validateInput } from '@/lib/utils';
import { MapPin, Navigation, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface InputPanelProps {
  points: Point[];
  onPointsChange: (points: Point[]) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
  options: OptimizationOptions;
  onOptionsChange: (options: OptimizationOptions) => void;
  onStartPointChange?: (startPoint: number | undefined) => void;
  onEndPointChange?: (endPoint: number | undefined) => void;
  onLoadDefaults?: () => void;
  hasResults?: boolean;
}

export default function InputPanel({
  points,
  onPointsChange,
  onOptimize,
  isOptimizing,
  options,
  onOptionsChange,
  onStartPointChange,
  onEndPointChange,
  onLoadDefaults,
  hasResults = false,
}: InputPanelProps) {
  const [inputText, setInputText] = useState('');
  const [showAddRow, setShowAddRow] = useState(false);

  const addPoint = useCallback(() => {
    if (!inputText.trim()) return;

    const validation = validateInput(inputText);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const newPoint: Point = {
      id: generateId(),
      label: inputText.trim(),
      lat: 0,
      lng: 0,
      address: inputText.trim()
    };

    onPointsChange([...points, newPoint]);
    setInputText('');
    setShowAddRow(false);
  }, [inputText, points, onPointsChange]);

  const removePoint = useCallback((id: string) => {
    onPointsChange(points.filter(p => p.id !== id));
  }, [points, onPointsChange]);

  const updatePoint = useCallback((id: string, newLabel: string) => {
    onPointsChange(points.map(p => 
      p.id === id ? { ...p, label: newLabel, address: newLabel } : p
    ));
  }, [points, onPointsChange]);

  const clearAll = useCallback(() => {
    if (points.length > 0 && confirm('Clear all locations?')) {
      onPointsChange([]);
      // Also clear start and end point selections
      if (onStartPointChange) onStartPointChange(undefined);
      if (onEndPointChange) onEndPointChange(undefined);
    }
  }, [points.length, onPointsChange, onStartPointChange, onEndPointChange]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Check if it's a JSON file
      if (file.name.toLowerCase().endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          console.log('📁 JSON file loaded:', jsonData);
          
          const newPoints: Point[] = [];
          
          // Handle array of locations
          if (Array.isArray(jsonData)) {
            jsonData.forEach((location, index) => {
              if (location && typeof location === 'object') {
                const name = location.location_name || location.name || location.locationName || `Location ${index + 1}`;
                const refId = location.ref_id || location.refId || location.location_reference_id || location.locationReferenceId || '';
                const lat = parseFloat(location.lat || location.latitude || location.lat_coordinate || location.latCoordinate);
                const lng = parseFloat(location.lng || location.longitude || location.lng_coordinate || location.lngCoordinate || location.lon_coordinate || location.lonCoordinate);
                
                console.log('📍 Parsing JSON location:', { name, refId, lat, lng });
                console.log('  Raw location data:', location);
                
                // Validate coordinate ranges
                const validLat = !isNaN(lat) && lat >= -90 && lat <= 90;
                const validLng = !isNaN(lng) && lng >= -180 && lng <= 180;
                
                if (validLat && validLng) {
                  newPoints.push({
                    id: generateId(),
                    label: refId ? `${name} (ID: ${refId})` : name,
                    lat: lat,
                    lng: lng,
                    address: `${lat}, ${lng}` // Use coordinates as address to avoid geocoding
                  });
                  console.log('✅ JSON location added:', { name, refId, lat, lng });
                } else {
                  console.log('❌ Invalid coordinates in JSON:', { 
                    name, 
                    lat, 
                    lng, 
                    validLat, 
                    validLng,
                    rawLat: location.lat || location.latitude,
                    rawLng: location.lng || location.longitude
                  });
                }
              }
            });
          }
          // Handle single location object
          else if (typeof jsonData === 'object' && jsonData.location_name) {
            const name = jsonData.location_name || jsonData.name || 'Location';
            const refId = jsonData.ref_id || jsonData.refId || jsonData.location_reference_id || jsonData.locationReferenceId || '';
            const lat = parseFloat(jsonData.lat || jsonData.latitude || jsonData.lat_coordinate || jsonData.latCoordinate);
            const lng = parseFloat(jsonData.lng || jsonData.longitude || jsonData.lng_coordinate || jsonData.lngCoordinate || jsonData.lon_coordinate || jsonData.lonCoordinate);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              newPoints.push({
                id: generateId(),
                label: refId ? `${name} (ID: ${refId})` : name,
                lat: lat,
                lng: lng,
                address: `${lat}, ${lng}`
              });
            }
          }
          
          if (newPoints.length > 0) {
            onPointsChange([...points, ...newPoints]);
            console.log(`✅ Added ${newPoints.length} locations from JSON file`);
          } else {
            console.log('❌ No valid locations found in JSON file');
          }
          
        } catch (error) {
          console.error('❌ Error parsing JSON file:', error);
          alert('Error parsing JSON file. Please check the format.');
        }
        return;
      }
      
      // Handle CSV files (existing logic)
      const lines = content.split('\n').filter(line => line.trim());
      
      const newPoints: Point[] = lines.map((line) => {
        const trimmedLine = line.trim();
        
        // Check if line has comma-separated values (CSV format)
        if (trimmedLine.includes(',')) {
          const parts = trimmedLine.split(',').map(p => p.trim());
          
          // Format 1: Name, ID, Coordinates (3 parts)
          if (parts.length >= 3) {
            const name = parts[0];
            const locationId = parts[1];
            const coords = parts[2];
            
            // Try to parse coordinates - handle space-separated format
            const coordParts = coords.trim().split(/\s+/);
            if (coordParts.length >= 2) {
              const lat = parseFloat(coordParts[0]);
              const lng = parseFloat(coordParts[1]);
              
              console.log('Parsing coordinates:', { coords, coordParts, lat, lng });
              
              if (!isNaN(lat) && !isNaN(lng)) {
                console.log('✅ Valid coordinates found:', { name, locationId, lat, lng });
                return {
                  id: generateId(),
                  label: `${name} (ID: ${locationId})`,
                  lat: lat,
                  lng: lng,
                  address: `${lat}, ${lng}` // Use coordinates as address to avoid geocoding
                };
              } else {
                console.log('❌ Invalid coordinates:', { lat, lng });
              }
            } else {
              console.log('❌ Not enough coordinate parts:', { coords, coordParts });
            }
            
            // If coordinates invalid, use name and let it geocode
            return {
              id: generateId(),
              label: `${name} (ID: ${locationId})`,
              lat: 0,
              lng: 0,
              address: name
            };
          }
          
          // Format 2: Just coordinates (lat,lng)
          if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              return {
                id: generateId(),
                label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                lat: lat,
                lng: lng,
                address: `${lat}, ${lng}` // Use coordinates as address to avoid geocoding
              };
            }
          }
        }
        
        // Default: Single line address/location
        return {
          id: generateId(),
          label: trimmedLine,
          lat: 0,
          lng: 0,
          address: trimmedLine
        };
      });

      onPointsChange([...points, ...newPoints]);
    };
    reader.readAsText(file);
  }, [points, onPointsChange]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPoint();
    } else if (e.key === 'Escape') {
      setShowAddRow(false);
      setInputText('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center">
          <MapPin className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <span className="hidden sm:inline">Route Optimizer</span>
          <span className="sm:hidden">Optimizer</span>
        </h2>
        <button
          onClick={clearAll}
          disabled={points.length === 0}
          className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed p-1"
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Options */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="flex items-start space-x-2 sm:space-x-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={options.roundTrip}
              onChange={(e) => onOptionsChange({ ...options, roundTrip: e.target.checked })}
              className="mr-2 sm:mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
            />
            <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">
              <span className="hidden sm:inline">Round trip (return to start)</span>
              <span className="sm:hidden">Round trip</span>
            </span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Alternatives:</label>
          <select
            value={options.maxAlternatives}
            onChange={(e) => onOptionsChange({ ...options, maxAlternatives: parseInt(e.target.value) })}
            className="border border-gray-300 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-16 sm:w-auto"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="flex items-start space-x-2 sm:space-x-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={options.useWebWorker}
              onChange={(e) => onOptionsChange({ ...options, useWebWorker: e.target.checked })}
              className="mr-2 sm:mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
            />
            <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">
              <span className="hidden sm:inline">Use Web Worker (faster for large routes)</span>
              <span className="sm:hidden">Use Web Worker</span>
            </span>
          </label>
        </div>


        {/* Starting Location Selection */}
        {points.length > 0 && (
          <div className="flex flex-col space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Starting Location (optional):</label>
            <select
              value={options.startPoint !== undefined ? options.startPoint : ''}
              onChange={(e) => onOptionsChange({ 
                ...options, 
                startPoint: e.target.value === '' ? undefined : parseInt(e.target.value) 
              })}
              className="border border-gray-300 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Auto-select (optimize all)</option>
              {points.map((point, index) => (
                <option 
                  key={point.id} 
                  value={index}
                  disabled={options.endPoint === index}
                >
                  {index + 1}. {point.label.length > 30 ? point.label.substring(0, 30) + '...' : point.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Choose a specific starting point or let the algorithm find the best one
            </p>
          </div>
        )}

        {/* Ending Location Selection */}
        {points.length > 0 && (
          <div className="flex flex-col space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Ending Location (optional):</label>
            <select
              value={options.endPoint !== undefined ? options.endPoint : ''}
              onChange={(e) => onOptionsChange({ 
                ...options, 
                endPoint: e.target.value === '' ? undefined : parseInt(e.target.value) 
              })}
              className="border border-gray-300 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Auto-select (optimize all)</option>
              {points.map((point, index) => (
                <option 
                  key={point.id} 
                  value={index}
                  disabled={options.startPoint === index}
                >
                  {index + 1}. {point.label.length > 30 ? point.label.substring(0, 30) + '...' : point.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Choose a specific ending point - this will always be the last stop
            </p>
          </div>
        )}
      </div>

      {/* Points List */}
      <div className="flex-1 mb-3 sm:mb-4">
        {points.length > 0 && (
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">
              Locations ({points.length})
            </h3>
            <button
              onClick={clearAll}
              className="flex items-center px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Clear all locations"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </button>
          </div>
        )}
        <div className="space-y-2 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
          {points.length === 0 && onLoadDefaults ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <MapPin className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-3">No locations added yet</p>
              <button
                onClick={onLoadDefaults}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Load Sample Locations
              </button>
            </div>
          ) : (
            points.map((point, index) => (
            <div key={point.id} className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg transition-colors ${
              options.startPoint === index 
                ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                : options.endPoint === index
                ? 'border-red-500 bg-red-50 hover:bg-red-100'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}>
              <div className="flex items-center space-x-2">
                <span className={`text-xs sm:text-sm font-bold text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  options.startPoint === index ? 'bg-green-600' : options.endPoint === index ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                  {index + 1}
                </span>
                {options.startPoint === index && (
                  <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded-full">
                    START
                  </span>
                )}
                {options.endPoint === index && (
                  <span className="text-xs font-semibold text-red-700 bg-red-200 px-2 py-1 rounded-full">
                    END
                  </span>
                )}
              </div>
              <input
                type="text"
                value={point.label}
                onChange={(e) => updatePoint(point.id, e.target.value)}
                className="flex-1 text-xs sm:text-sm border-none outline-none bg-transparent text-gray-800 placeholder-gray-500"
                placeholder="Enter address or lat,lng"
              />
              <button
                onClick={() => removePoint(point.id)}
                className="text-red-600 hover:text-red-800 p-1 sm:p-2 hover:bg-red-100 rounded-full transition-colors"
                title="Remove location"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          ))
          )}
        </div>
      </div>

      {/* Add Point */}
      {showAddRow ? (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter address or lat,lng"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={addPoint}
              disabled={!inputText.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddRow(false);
                setInputText('');
              }}
              className="px-3 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isCoordinateInput(inputText) ? 'Coordinates detected' : 'Address will be geocoded'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 mb-3 sm:mb-4">
          <button
            onClick={() => setShowAddRow(true)}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Location</span>
            <span className="sm:hidden">Add</span>
          </button>
          
          <label className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg text-xs sm:text-sm hover:bg-gray-700 cursor-pointer transition-colors font-medium shadow-md hover:shadow-lg">
            <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Import File</span>
            <span className="sm:hidden">Import</span>
            <input
              type="file"
              accept=".csv,.json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          {points.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm hover:bg-red-700 transition-colors font-medium shadow-md hover:shadow-lg"
              title="Clear all locations"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </button>
          )}
          
          {points.length === 0 && onLoadDefaults && (
            <button
              onClick={onLoadDefaults}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
              title="Load default sample locations"
            >
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Load Sample</span>
              <span className="sm:hidden">Sample</span>
            </button>
          )}
        </div>
      )}

      {/* Optimize Button */}
      <button
        onClick={onOptimize}
        disabled={isOptimizing || points.length < 2}
        className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
      >
        {isOptimizing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Optimizing...
          </>
        ) : (
          <>
            <Navigation className="h-4 w-4 mr-2" />
            Optimize Route
          </>
        )}
      </button>

      {/* Info */}
      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-xs text-blue-800 space-y-1">
          <p className="flex items-start">
            <svg className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Enter addresses or coordinates (lat,lng)</span>
            <span className="sm:hidden">Enter addresses or coordinates</span>
          </p>
          <p className="flex items-start">
            <svg className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="hidden sm:inline">Supports up to 50 locations</span>
            <span className="sm:hidden">Up to 50 locations</span>
          </p>
          <p className="flex items-start">
            <svg className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="hidden sm:inline">Uses free OpenStreetMap data</span>
            <span className="sm:hidden">Free OpenStreetMap data</span>
          </p>
          <p className="flex items-start">
            <svg className="w-3 h-3 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Choose start/end locations or auto-optimize</span>
            <span className="sm:hidden">Choose start/end or auto-optimize</span>
          </p>
        </div>
      </div>
    </div>
  );
}
