'use client';

import { Route as RouteType } from '@/lib/types';
import { CheckCircle2, Clock, MapPin } from 'lucide-react';

interface RouteCardProps {
  route: RouteType;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

export default function RouteCard({ route, index, selected, onSelect }: RouteCardProps) {
  const km = route.metrics?.km?.toFixed(1) ?? route.totalKm.toFixed(1);
  const min = route.metrics?.minutes ? Math.round(route.metrics.minutes) : undefined;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border px-3 py-2 transition ${
        selected 
          ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/40' 
          : 'border-gray-200 hover:bg-slate-50 hover:border-gray-300'
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
            selected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {index + 1}
          </div>
          <div className="text-sm font-medium">
            {index === 0 ? 'Best Route' : `Alternative ${index}`}
          </div>
          {route.direction && (
            <span className="text-[10px] rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              {route.direction}
            </span>
          )}
        </div>
        <div className="text-sm font-semibold text-gray-900">{km} km</div>
      </div>

      <div className="mt-1 flex items-center gap-3 text-xs text-slate-600 flex-wrap">
        {min !== undefined && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> ~{min} min
          </span>
        )}
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
          route.metrics?.source === 'osrm' 
            ? 'bg-emerald-50 text-emerald-700' 
            : 'bg-amber-50 text-amber-700'
        }`}>
          {route.metrics?.source === 'osrm' ? 'OSRM' : 'Estimate'}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {route.order.length} stops
        </span>
        {selected && (
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Selected
          </span>
        )}
      </div>
    </button>
  );
}

