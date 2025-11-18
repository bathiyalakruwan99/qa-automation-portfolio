'use client';

import { useEffect, useState } from 'react';

export default function DensityToggle() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ui-density');
    const isCompact = saved === 'compact';
    setCompact(isCompact);
    document.body.dataset.density = isCompact ? 'compact' : 'comfortable';
  }, []);

  function onChange(checked: boolean) {
    setCompact(checked);
    document.body.dataset.density = checked ? 'compact' : 'comfortable';
    localStorage.setItem('ui-density', checked ? 'compact' : 'comfortable');
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <span className="text-xs text-slate-600">Compact</span>
      <input
        type="checkbox"
        checked={compact}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

