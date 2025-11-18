'use client';

import { buildGoogleDirUrl } from '@/lib/googleUrl';
import { getLegMetrics } from '@/lib/osrm';
import { Point, Route as RouteType } from '@/lib/types';
import { formatDistance } from '@/lib/utils';
import {
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Copy,
    Download,
    ExternalLink,
    Map,
    Navigation,
    Route
} from 'lucide-react';
import { useState } from 'react';

interface ResultsPanelProps {
  bestRoute?: RouteType;
  alternatives: RouteType[];
  points: Point[];
  onShowOnMap: (route: RouteType) => void;
  onExportCSV: (route: RouteType) => void;
  isVisible: boolean;
  startPoint?: number;
  endPoint?: number;
}

export default function ResultsPanel({
  bestRoute,
  alternatives,
  points,
  onShowOnMap,
  onExportCSV,
  isVisible,
  startPoint,
  endPoint,
}: ResultsPanelProps) {
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(bestRoute || null);
  const [copiedRoute, setCopiedRoute] = useState<number | null>(null);
  const [debugExpanded, setDebugExpanded] = useState(false);
  const [legMetrics, setLegMetrics] = useState<Array<{ from: number; to: number; km: number; min: number }>>([]);

  // Format duration as hours and minutes
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };

  if (!isVisible || !bestRoute) {
    return null;
  }

  const copyToClipboard = async (text: string, routeIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRoute(routeIndex);
      setTimeout(() => setCopiedRoute(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyRouteOrder = (route: RouteType) => {
    const orderText = route.order.map(i => `${i + 1}. ${points[i].label}`).join('\n');
    copyToClipboard(orderText, route.order[0]);
  };

  const getGoogleMapsUrls = (route: RouteType) => {
    const coords = route.order.map(i => ({ lat: points[i].lat, lng: points[i].lng }));
    return buildGoogleDirUrl(coords);
  };

  const handleLoadDebugMetrics = async (route: RouteType) => {
    try {
      const metrics = await getLegMetrics(points, route.order);
      // Sort by distance descending
      const sorted = [...metrics].sort((a, b) => b.km - a.km);
      setLegMetrics(sorted);
      setDebugExpanded(true);
    } catch (error) {
      console.error('Failed to load leg metrics:', error);
    }
  };

  const getDirectionIcon = (direction?: string) => {
    switch (direction) {
      case 'clockwise':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'anti-clockwise':
        return <Clock className="h-4 w-4 text-green-600 transform scale-x-[-1]" />;
      default:
        return <Route className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDirectionText = (direction?: string) => {
    switch (direction) {
      case 'clockwise':
        return 'Clockwise';
      case 'anti-clockwise':
        return 'Anti-clockwise';
      default:
        return 'Hybrid';
    }
  };

  const allRoutes = [bestRoute, ...alternatives];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center">
          <Navigation className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          <span className="hidden sm:inline">Route Results</span>
          <span className="sm:hidden">Results</span>
        </h2>
        <div className="text-xs sm:text-sm text-gray-500">
          {allRoutes.length} route{allRoutes.length !== 1 ? 's' : ''} found
          {startPoint !== undefined && (
            <span className="ml-2 text-green-600 font-medium">
              • Start: {points[startPoint]?.label || `Point ${startPoint + 1}`}
            </span>
          )}
          {endPoint !== undefined && (
            <span className="ml-2 text-red-600 font-medium">
              • End: {points[endPoint]?.label || `Point ${endPoint + 1}`}
            </span>
          )}
        </div>
      </div>

      {/* Route Selection */}
      <div className="mb-4 sm:mb-6">
        <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 pr-2">
          {allRoutes.map((route, index) => (
            <div
              key={index}
              className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedRoute === route
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedRoute(route)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                    index === 0 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                      {index === 0 ? 'Best Route' : `Alternative ${index}`}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center space-x-1 sm:space-x-2">
                      {getDirectionIcon(route.direction)}
                      <span>{getDirectionText(route.direction)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base sm:text-lg text-gray-900">
                    {route.metrics ? (
                      <>
                        <div className="flex items-center justify-end gap-2">
                          <span>{route.metrics.km.toFixed(1)} km</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            route.metrics.source === 'osrm' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`} title={
                            route.metrics.source === 'osrm'
                              ? 'Distance/time from OSRM (OSM road data)'
                              : 'Fallback: straight-line × 1.15 when OSRM route unavailable'
                          }>
                            {route.metrics.source === 'osrm' ? 'OSRM' : 'Estimate'}
                          </span>
                        </div>
                        {route.metrics.minutes && (
                          <div className="text-sm text-gray-600 mt-1">
                            ~{formatDuration(route.metrics.minutes)}
                          </div>
                        )}
                      </>
                    ) : (
                      <span>{formatDistance(route.totalKm)}</span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">
                    Routed stops: {route.order.length}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Route Details */}
      {selectedRoute && (
        <div className="flex-1 mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Route Details</h3>
            <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 pr-2">
              {selectedRoute.legs.map((leg, index) => {
                const point = points[leg.from];
                
                // Estimate duration for this leg (assuming average speed of 50 km/h)
                const estimatedMinutes = (leg.distance / 50) * 60;
                
                // Try to find actual duration from leg metrics if loaded
                const actualLegMetric = legMetrics.find(m => m.from === leg.from && m.to === leg.to);
                const durationMinutes = actualLegMetric?.min ?? estimatedMinutes;
                
                return (
                  <div key={`${leg.from}-${leg.to}`} className="flex items-center space-x-2 sm:space-x-3 p-2 border border-gray-200 rounded">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold">
                      {selectedRoute.order.indexOf(leg.from) + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{point.label}</div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-700">
                        {formatDistance(leg.distance)}
                      </div>
                      <div className="text-xs text-gray-600">
                        ~{formatDuration(durationMinutes)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {leg.to === selectedRoute.order[0] ? 'to start' : 'to next'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedRoute && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onShowOnMap(selectedRoute)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              <Map className="h-4 w-4 mr-2" />
              Show on Map
            </button>
            <button
              onClick={() => handleLoadDebugMetrics(selectedRoute)}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              {debugExpanded ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
              Debug Legs
            </button>
          </div>
          
          {/* Google Maps Chunked Links */}
          <div className="space-y-2">
            {(() => {
              const googleUrls = getGoogleMapsUrls(selectedRoute);
              return (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {googleUrls.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => window.open(url, '_blank')}
                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Google Maps {googleUrls.length > 1 ? `(${idx + 1}/${googleUrls.length})` : ''}
                      </button>
                    ))}
                  </div>
                  {googleUrls.length > 1 && (
                    <p className="text-xs text-gray-500 text-center">
                      Google limits waypoints; showing route in {googleUrls.length} parts
                    </p>
                  )}
                </>
              );
            })()}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => copyRouteOrder(selectedRoute)}
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
            >
              {copiedRoute === selectedRoute.order[0] ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Order
                </>
              )}
            </button>
            <button
              onClick={() => onExportCSV(selectedRoute)}
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      )}

      {/* Debug Leg Metrics */}
      {selectedRoute && debugExpanded && legMetrics.length > 0 && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="text-sm font-semibold text-indigo-900 mb-2">Leg-by-Leg Metrics (sorted by distance)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-indigo-200">
                  <th className="text-left py-1 px-2">From</th>
                  <th className="text-left py-1 px-2">To</th>
                  <th className="text-right py-1 px-2">Distance</th>
                  <th className="text-right py-1 px-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {legMetrics.map((leg, idx) => (
                  <tr key={idx} className="border-b border-indigo-100">
                    <td className="py-1 px-2 text-indigo-700">{points[leg.from].label}</td>
                    <td className="py-1 px-2 text-indigo-700">{points[leg.to].label}</td>
                    <td className="text-right py-1 px-2 font-medium">{leg.km.toFixed(1)} km</td>
                    <td className="text-right py-1 px-2">{formatDuration(leg.min)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-indigo-600 mt-2">
            Total: {legMetrics.reduce((sum, leg) => sum + leg.km, 0).toFixed(1)} km, 
            {' '}{formatDuration(legMetrics.reduce((sum, leg) => sum + leg.min, 0))}
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {selectedRoute && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>Total Distance:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {selectedRoute.metrics ? selectedRoute.metrics.km.toFixed(1) : selectedRoute.totalKm.toFixed(1)} km
                </span>
                {selectedRoute.metrics && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    selectedRoute.metrics.source === 'osrm' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedRoute.metrics.source === 'osrm' ? 'OSRM' : 'Est.'}
                  </span>
                )}
              </div>
            </div>
            {selectedRoute.metrics?.minutes && (
              <div className="flex justify-between">
                <span>Est. Duration:</span>
                <span className="font-medium">~{formatDuration(selectedRoute.metrics.minutes)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Stops:</span>
              <span className="font-medium">{selectedRoute.order.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Direction:</span>
              <span className="font-medium">{getDirectionText(selectedRoute.direction)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
