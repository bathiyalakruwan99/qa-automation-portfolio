'use client';

import { buildGoogleDirUrl } from '@/lib/googleUrl';
import { getLegMetrics } from '@/lib/osrm';
import { Point, Route as RouteType } from '@/lib/types';
import { formatDistance } from '@/lib/utils';
import { ChevronDown, ChevronUp, Download, ExternalLink, Map } from 'lucide-react';
import { useState } from 'react';

interface RouteDetailsProps {
  route: RouteType;
  points: Point[];
  onShowMap: () => void;
  onExportCSV: () => void;
}

export default function RouteDetails({ route, points, onShowMap, onExportCSV }: RouteDetailsProps) {
  const [debugExpanded, setDebugExpanded] = useState(false);
  const [legMetrics, setLegMetrics] = useState<Array<{ from: number; to: number; km: number; min: number }>>([]);

  const km = route.metrics?.km?.toFixed(1) ?? route.totalKm.toFixed(1);
  const minutes = route.metrics?.minutes;

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  const handleLoadDebugMetrics = async () => {
    if (debugExpanded) {
      setDebugExpanded(false);
      return;
    }

    try {
      const metrics = await getLegMetrics(points, route.order);
      const sorted = [...metrics].sort((a, b) => b.km - a.km);
      setLegMetrics(sorted);
      setDebugExpanded(true);
    } catch (error) {
      console.error('Failed to load leg metrics:', error);
    }
  };

  const googleLinks = buildGoogleDirUrl(
    route.order
      .map(i => points[i])
      .filter(point => point && typeof point.lat === 'number' && typeof point.lng === 'number')
      .map(point => ({ lat: point.lat, lng: point.lng }))
  );

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="rounded-xl border p-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <div className="text-xs text-slate-500">Total Distance</div>
            <div className="text-xl font-semibold text-gray-900">{km} km</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-slate-500">Est. Duration</div>
            <div className="text-xl font-semibold text-gray-900">
              {minutes ? `~${formatDuration(minutes)}` : '—'}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-slate-500">Routed Stops</div>
            <div className="text-xl font-semibold text-gray-900">{route.order.length}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-slate-500">Data Source</div>
            <div className={`text-xs rounded-full px-2 py-1 w-fit font-medium ${
              route.metrics?.source === 'osrm' 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'bg-amber-50 text-amber-700'
            }`}>
              {route.metrics?.source === 'osrm' ? 'OSRM Road' : 'Estimate'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={onShowMap}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            <Map className="h-4 w-4" />
            Show on Map
          </button>
          
          <button
            onClick={handleLoadDebugMetrics}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            {debugExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Debug Legs
          </button>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          
          {googleLinks.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              <ExternalLink className="h-4 w-4" />
              Google Maps {googleLinks.length > 1 ? `(${i + 1}/${googleLinks.length})` : ''}
            </a>
          ))}
        </div>
        
        {googleLinks.length > 1 && (
          <p className="text-xs text-slate-500 mt-2">
            Google limits waypoints; showing route in {googleLinks.length} parts
          </p>
        )}
      </div>

      {/* Debug Leg Metrics */}
      {debugExpanded && legMetrics.length > 0 && (
        <div className="rounded-xl border bg-indigo-50/50 p-4">
          <h4 className="text-sm font-semibold text-indigo-900 mb-3">
            Leg-by-Leg Metrics (sorted by distance)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-indigo-200">
                  <th className="text-left py-2 px-2 font-medium text-indigo-900">From</th>
                  <th className="text-left py-2 px-2 font-medium text-indigo-900">To</th>
                  <th className="text-right py-2 px-2 font-medium text-indigo-900">Distance</th>
                  <th className="text-right py-2 px-2 font-medium text-indigo-900">Duration</th>
                </tr>
              </thead>
              <tbody>
                {legMetrics.map((leg, idx) => (
                  <tr key={idx} className="border-b border-indigo-100">
                    <td className="py-2 px-2 text-indigo-700">{points[leg.from].label}</td>
                    <td className="py-2 px-2 text-indigo-700">{points[leg.to].label}</td>
                    <td className="text-right py-2 px-2 font-medium">{leg.km.toFixed(1)} km</td>
                    <td className="text-right py-2 px-2">{formatDuration(leg.min)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-indigo-600 mt-3">
            Total: {legMetrics.reduce((sum, leg) => sum + leg.km, 0).toFixed(1)} km, 
            {' '}{formatDuration(legMetrics.reduce((sum, leg) => sum + leg.min, 0))}
          </p>
        </div>
      )}

      {/* Route Steps */}
      <div className="rounded-xl border overflow-hidden flex flex-col" style={{ maxHeight: '400px' }}>
        <div className="flex-none border-b bg-white px-4 py-2.5 text-sm font-semibold text-gray-900">
          Route Steps
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <ol className="divide-y">
            {route.order.map((idx, i) => {
              const point = points[idx];
              const leg = route.legs.find(l => l.from === idx);
              const estimatedMinutes = leg ? (leg.distance / 50) * 60 : 0;
              const actualLegMetric = legMetrics.find(m => m.from === leg?.from && m.to === leg?.to);
              const durationMinutes = actualLegMetric?.min ?? estimatedMinutes;

              // Handle missing or invalid points
              if (!point) {
                return (
                  <li key={i} className="px-4 py-3 text-sm hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-700">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-red-600 truncate">Missing Point #{idx + 1}</div>
                          <div className="text-[11px] text-red-400">Point not found in locations list</div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={i} className="px-4 py-3 text-sm hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">{point.label}</div>
                        <div className="text-[11px] text-slate-500">
                          {typeof point.lat === 'number' && typeof point.lng === 'number' 
                            ? `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`
                            : 'Invalid coordinates'
                          }
                        </div>
                      </div>
                    </div>
                    {i < route.order.length - 1 && leg && (
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-medium text-gray-700">
                          {formatDistance(leg.distance)}
                        </div>
                        <div className="text-xs text-slate-500">
                          ~{formatDuration(durationMinutes)}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

