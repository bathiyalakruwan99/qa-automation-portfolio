'use client';

import { Point, Route } from '@/lib/types';

interface MapViewProps {
  points: Point[];
  selectedRoute?: Route;
  isVisible: boolean;
  className?: string;
  startPoint?: number;
  endPoint?: number;
}

export default function MapView({ points, selectedRoute, isVisible, className = '', startPoint, endPoint }: MapViewProps) {
  // Function to open Google Maps with the location
  const openInGoogleMaps = (point: Point, index: number) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${point.lat},${point.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Function to open Google Maps with route
  const openRouteInGoogleMaps = () => {
    if (!selectedRoute || points.length === 0) return;
    
    // Create waypoints for the route
    const waypoints = selectedRoute.order
      .slice(1, -1) // Exclude start and end points for waypoints
      .map(index => `${points[index].lat},${points[index].lng}`)
      .join('|');
    
    const origin = `${points[selectedRoute.order[0]].lat},${points[selectedRoute.order[0]].lng}`;
    const destination = `${points[selectedRoute.order[selectedRoute.order.length - 1]].lat},${points[selectedRoute.order[selectedRoute.order.length - 1]].lng}`;
    
    let googleMapsUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;
    if (waypoints) {
      googleMapsUrl += `/${waypoints}`;
    }
    
    window.open(googleMapsUrl, '_blank');
  };

  if (!isVisible) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📍</div>
          <p>Locations will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Route Locations
            </h3>
            <p className="text-blue-100 mt-1">
              {points.length} location{points.length !== 1 ? 's' : ''} 
              {selectedRoute && (
                <span className="ml-2 px-2 py-1 bg-blue-500 rounded-full text-xs">
                  {selectedRoute.totalKm.toFixed(1)}km route
                </span>
              )}
            </p>
          </div>
          {selectedRoute && (
            <button
              onClick={openRouteInGoogleMaps}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in Google Maps
            </button>
          )}
        </div>
      </div>
      
      {/* Locations List */}
      <div className="p-4 sm:p-6">
        {points.length > 0 ? (
          <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 pr-2">
            {points.map((point, index) => (
              <div
                key={point.id}
                className={`group flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                  startPoint === index
                    ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 hover:from-green-100 hover:to-green-200'
                    : endPoint === index
                    ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300 hover:from-red-100 hover:to-red-200'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300'
                }`}
                onClick={() => openInGoogleMaps(point, index)}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {/* Number Badge */}
                  <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg ${
                    startPoint === index
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : endPoint === index
                      ? 'bg-gradient-to-br from-red-500 to-red-600'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Location Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <div className={`font-semibold text-sm sm:text-lg group-hover:text-blue-900 transition-colors truncate ${
                        startPoint === index ? 'text-green-900' : endPoint === index ? 'text-red-900' : 'text-gray-900'
                      }`}>
                        {point.label}
                      </div>
                      {startPoint === index && (
                        <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded-full">
                          START
                        </span>
                      )}
                      {endPoint === index && (
                        <span className="text-xs font-bold text-red-700 bg-red-200 px-2 py-1 rounded-full">
                          END
                        </span>
                      )}
                    </div>
                    {point.address && point.address !== point.label && (
                      <div className={`text-xs sm:text-sm mt-1 group-hover:text-blue-700 transition-colors truncate ${
                        startPoint === index ? 'text-green-700' : endPoint === index ? 'text-red-700' : 'text-gray-600'
                      }`}>
                        {point.address}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1 font-mono bg-gray-200 px-2 py-1 rounded inline-block">
                      {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                    </div>
                  </div>
                </div>
                
                {/* Action Icon */}
                <div className="flex-shrink-0 ml-3 sm:ml-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                    startPoint === index
                      ? 'bg-white group-hover:bg-green-600 group-hover:text-white'
                      : endPoint === index
                      ? 'bg-white group-hover:bg-red-600 group-hover:text-white'
                      : 'bg-white group-hover:bg-blue-600 group-hover:text-white'
                  }`}>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-4">📍</div>
            <h4 className="text-base sm:text-lg font-semibold mb-2">No locations added yet</h4>
            <p className="text-sm">Add locations in the left panel to see them here</p>
          </div>
        )}
        
        {/* Help Text */}
        {points.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">Click any location to open it in Google Maps</p>
                <p className="text-xs text-blue-600 mt-1">
                  {selectedRoute 
                    ? "Click 'Open in Google Maps' above to see the complete route with directions"
                    : "Optimize your route to see the complete journey with turn-by-turn directions"
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
