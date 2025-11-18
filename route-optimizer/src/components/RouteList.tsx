'use client';

import { Route as RouteType } from '@/lib/types';
import RouteCard from './RouteCard';

interface RouteListProps {
  routes: RouteType[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
}

export default function RouteList({ routes, selectedIndex, onSelect }: RouteListProps) {
  if (routes.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        <p className="text-sm">No routes yet. Add locations and click Optimize.</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {routes.map((route, idx) => (
        <RouteCard
          key={idx}
          route={route}
          index={idx}
          selected={idx === selectedIndex}
          onSelect={() => onSelect(idx)}
        />
      ))}
    </div>
  );
}

