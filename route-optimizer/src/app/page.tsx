'use client';

import ClientOnly from '@/components/ClientOnly';
import DensityToggle from '@/components/DensityToggle';
import InputPanel from '@/components/InputPanel';
import MapView from '@/components/MapView';
import RouteDetails from '@/components/RouteDetails';
import RouteList from '@/components/RouteList';
import { ToastContainer } from '@/components/Toast';
import { batchGeocode, validateGeocodeResults } from '@/lib/geocode';
import { estimateKm, getDistanceMatrix, getDistanceServiceName, getRoadMetricsForOrder } from '@/lib/osrm';
import { optimizeRoute } from '@/lib/tsp';
import { OptimizationOptions, Point, Route, ToastMessage } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { Navigation } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function HomePage() {
  const [points, setPoints] = useState<Point[]>([]);
  const [bestRoute, setBestRoute] = useState<Route | undefined>();
  const [alternatives, setAlternatives] = useState<Route[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);

  const [options, setOptions] = useState<OptimizationOptions>({
    maxAlternatives: 12,  // Increased to show 12 alternative routes
    roundTrip: false,     // Disabled round trip - routes end at last location
    useWebWorker: false   // Temporarily disabled to ensure our changes are used
  });
  
  const [isCalculatingMetrics, setIsCalculatingMetrics] = useState(false);

  // Calculate road metrics for all routes using OSRM
  const calculateRoadMetrics = useCallback(async (routes: Route[], points: Point[]) => {
    if (routes.length === 0) return routes;
    
    setIsCalculatingMetrics(true);
    addToast({
      type: 'info',
      message: 'Calculating road metrics...',
      duration: 2000
    });

    try {
      await Promise.all(routes.map(async (r) => {
        try {
          // Validate that all points in the route exist and have valid coordinates
          const validOrder = r.order.filter(idx => {
            const point = points[idx];
            return point && 
                   typeof point.lat === 'number' && 
                   typeof point.lng === 'number' && 
                   !isNaN(point.lat) && 
                   !isNaN(point.lng);
          });

          if (validOrder.length < 2) {
            console.warn('Route has insufficient valid points, using estimate:', r.order);
            const km = estimateKm(points, r.order);
            r.metrics = { km, source: 'estimate' };
            return;
          }

          const { km, minutes } = await getRoadMetricsForOrder(points, validOrder);
          r.metrics = { km, minutes, source: 'osrm' };
        } catch (e) {
          const km = estimateKm(points, r.order);
          r.metrics = { km, source: 'estimate' };
          console.warn('OSRM route failed for route, using estimate:', r.order, e);
        }
      }));

      addToast({
        type: 'success',
        message: 'Road metrics updated',
        duration: 2000
      });

      return routes;
    } catch (error) {
      console.error('Failed to calculate road metrics:', error);
      addToast({
        type: 'error',
        message: 'Failed to calculate road metrics'
      });
      return routes;
    } finally {
      setIsCalculatingMetrics(false);
    }
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = generateId();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleOptimize = useCallback(async () => {
    if (points.length < 2) {
      addToast({
        type: 'warning',
        message: 'Please add at least 2 locations to optimize'
      });
      return;
    }

    setIsOptimizing(true);
    setShowResults(false);
    setBestRoute(undefined);
    setAlternatives([]);
    setSelectedRouteIndex(0);

    try {
      addToast({
        type: 'info',
        message: 'Starting optimization...'
      });

      // Step 1: Check if we need to geocode or if coordinates are already available
      let validPoints: Point[];
      let invalidPoints: Point[] = [];
      
      // Check if all points already have valid coordinates
      const pointsWithCoords = points.filter(p => p.lat !== 0 && p.lng !== 0 && !isNaN(p.lat) && !isNaN(p.lng));
      
      console.log('🔍 Points analysis:', {
        totalPoints: points.length,
        pointsWithCoords: pointsWithCoords.length,
        points: points.map(p => ({ label: p.label, lat: p.lat, lng: p.lng, address: p.address }))
      });
      
      if (pointsWithCoords.length === points.length) {
        // All points have coordinates, no need to geocode
        console.log('✅ Using existing coordinates - skipping geocoding');
        addToast({
          type: 'info',
          message: 'Using existing coordinates...'
        });
        validPoints = points;
      } else {
        // Need to geocode some or all points
        addToast({
          type: 'info',
          message: 'Geocoding addresses...'
        });

        const inputs = points.map(p => p.label);
        const { results: geocodeResults, errors: geocodeErrors } = await batchGeocode(
          inputs,
          (completed, total, current) => {
            if (current) {
              addToast({
                type: 'info',
                message: `Geocoding ${completed}/${total}: ${current}`,
                duration: 1000
              });
            }
          },
          (error) => {
            addToast({
              type: 'warning',
              message: error,
              duration: 3000
            });
          }
        );

        // Validate geocoding results and convert to Points
        const { valid: validGeocodeResults, invalid: invalidGeocodeResults } = validateGeocodeResults(geocodeResults);
        
        // Convert GeocodeResults to Points
        validPoints = validGeocodeResults.map((result, index) => ({
          id: points[index].id,
          label: result.label,
          lat: result.lat,
          lng: result.lng,
          address: result.address
        }));
        
        invalidPoints = invalidGeocodeResults.map((result, index) => ({
          id: points[index].id,
          label: result.label,
          lat: result.lat,
          lng: result.lng,
          address: result.address
        }));
      }
      
      if (invalidPoints.length > 0) {
        addToast({
          type: 'warning',
          message: `${invalidPoints.length} locations could not be geocoded`
        });
      }

      if (validPoints.length < 2) {
        addToast({
          type: 'error',
          message: 'Need at least 2 valid locations to optimize'
        });
        return;
      }

      // Update points with geocoded coordinates (only if we did geocoding)
      if (pointsWithCoords.length !== points.length) {
        setPoints(validPoints);
      }

      // Step 2: Get distance matrix
      const serviceName = getDistanceServiceName();
      addToast({
        type: 'info',
        message: `Calculating distances using ${serviceName}...`
      });

      const matrix = await getDistanceMatrix(validPoints);
      
      if (matrix.length === 0) {
        addToast({
          type: 'error',
          message: 'Failed to calculate distance matrix'
        });
        return;
      }

      // Step 3: Solve TSP
      addToast({
        type: 'info',
        message: 'Finding optimal route...'
      });

      console.log('🎯 Starting route optimization with options:', options);
      const { best, alternatives: routeAlternatives } = optimizeRoute(
        matrix,
        validPoints,
        options
      );
      console.log('🎯 Optimization complete. Best route:', best?.totalKm.toFixed(1), 'km');
      console.log('🎯 Alternatives:', routeAlternatives.map(alt => alt.totalKm.toFixed(1) + 'km'));

      const distanceService = getDistanceServiceName();
      addToast({
        type: 'success',
        message: `Route optimized! ${best.totalKm.toFixed(1)}km via ${distanceService}`
      });

      // Calculate real road metrics using OSRM /route endpoint
      const allRoutes = [best, ...routeAlternatives];
      await calculateRoadMetrics(allRoutes, validPoints);

      // Sort routes by actual OSRM metrics (minimum to maximum distance)
      allRoutes.sort((a, b) => {
        const aDistance = a.metrics?.km ?? a.totalKm;
        const bDistance = b.metrics?.km ?? b.totalKm;
        return aDistance - bDistance; // Ascending: shortest first (best)
      });

      console.log('📊 Routes sorted by distance (min to max):');
      allRoutes.forEach((route, idx) => {
        const distance = route.metrics?.km ?? route.totalKm;
        console.log(`  ${idx + 1}. ${distance.toFixed(1)} km (${route.metrics?.source || 'matrix'})`);
      });

      const [sortedBest, ...sortedAlternatives] = allRoutes;
      setBestRoute(sortedBest);
      setAlternatives(sortedAlternatives);
      setSelectedRouteIndex(0); // Select first (best) route
      setShowResults(true);

    } catch (error) {
      console.error('Optimization failed:', error);
      addToast({
        type: 'error',
        message: `Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsOptimizing(false);
    }
  }, [points, options, addToast]);

  const allRoutes = bestRoute ? [bestRoute, ...alternatives] : [];
  const selectedRoute = allRoutes[selectedRouteIndex];

  const handleShowOnMap = useCallback(() => {
    // Map view will use selectedRoute
  }, []);

  const handleExportCSV = useCallback((route: Route) => {
    const csvContent = [
      'Order,Label,Latitude,Longitude,Distance_to_Next',
      ...route.order.map((pointIndex, index) => {
        const point = points[pointIndex];
        const leg = route.legs.find(l => l.from === pointIndex);
        const distance = leg ? leg.distance.toFixed(2) : '0.00';
        return `${index + 1},"${point.label}",${point.lat},${point.lng},${distance}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `route-${generateId()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      message: 'Route exported to CSV'
    });
  }, [points, addToast]);


  // Function to load default sample locations
  const loadDefaultLocations = useCallback(() => {
    const samplePoints: Point[] = [
      { id: generateId(), label: 'Colombo', lat: 6.9271, lng: 79.8612, address: 'Colombo, Sri Lanka' },
      { id: generateId(), label: 'Kandy', lat: 7.2906, lng: 80.6337, address: 'Kandy, Sri Lanka' },
      { id: generateId(), label: 'Galle', lat: 6.0329, lng: 80.2170, address: 'Galle, Sri Lanka' },
      { id: generateId(), label: 'Anuradhapura', lat: 8.3114, lng: 80.4037, address: 'Anuradhapura, Sri Lanka' },
      { id: generateId(), label: 'Trincomalee', lat: 8.5874, lng: 81.2152, address: 'Trincomalee, Sri Lanka' },
      { id: generateId(), label: 'Jaffna', lat: 9.6615, lng: 80.0255, address: 'Jaffna, Sri Lanka' },
      { id: generateId(), label: 'Negombo', lat: 7.2086, lng: 79.8358, address: 'Negombo, Sri Lanka' },
      { id: generateId(), label: 'Batticaloa', lat: 7.7102, lng: 81.6924, address: 'Batticaloa, Sri Lanka' }
    ];
    setPoints(samplePoints);
    // Clear any existing start/end selections and results
    setOptions(prev => ({ ...prev, startPoint: undefined, endPoint: undefined }));
    setBestRoute(undefined);
    setAlternatives([]);
    setShowResults(false);
    setSelectedRouteIndex(0);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="grid h-full grid-cols-12 gap-4 p-4 min-h-0">
        {/* Left Panel - Controls */}
        <aside className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 h-full min-h-0">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex-none sticky top-0 z-10 border-b bg-white/80 backdrop-blur px-4 py-3 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-900">Route Optimizer</h2>
          </div>
            <div className="flex-1 min-h-0 overflow-auto px-4 py-3 space-y-3" id="left-scroll">
              <ClientOnly fallback={<div className="animate-pulse space-y-3"><div className="h-6 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded"></div></div>}>
              <InputPanel
                points={points}
                onPointsChange={setPoints}
                onOptimize={handleOptimize}
                  isOptimizing={isOptimizing || isCalculatingMetrics}
                options={options}
                onOptionsChange={setOptions}
                onStartPointChange={(startPoint) => setOptions(prev => ({ ...prev, startPoint }))}
                onEndPointChange={(endPoint) => setOptions(prev => ({ ...prev, endPoint }))}
                onLoadDefaults={loadDefaultLocations}
                hasResults={!!bestRoute}
              />
            </ClientOnly>
          </div>
          </div>
        </aside>

        {/* Right Panel - Results */}
        <main className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9 h-full min-h-0">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="flex-none sticky top-0 z-10 border-b bg-white/80 backdrop-blur px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-gray-900">Route Results</h2>
                {allRoutes.length > 0 && (
                  <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                    Found {allRoutes.length} routes
                  </span>
                )}
                {options.startPoint !== undefined && (
                  <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
                    Start: {points[options.startPoint]?.label || `Point ${options.startPoint + 1}`}
                  </span>
                )}
                {options.endPoint !== undefined && (
                  <span className="text-xs rounded-full bg-red-50 text-red-700 px-2 py-0.5">
                    End: {points[options.endPoint]?.label || `Point ${options.endPoint + 1}`}
                  </span>
                )}
              </div>
              <DensityToggle />
            </div>

            {showResults && allRoutes.length > 0 ? (
              <div className="grid flex-1 min-h-0 grid-cols-12">
                {/* Route List */}
                <section className="col-span-12 xl:col-span-5 flex min-h-0 flex-col border-r">
                  <div className="flex-1 min-h-0 overflow-auto" id="routes-scroll">
                    <RouteList
                      routes={allRoutes}
                      selectedIndex={selectedRouteIndex}
                      onSelect={setSelectedRouteIndex}
                    />
                  </div>
                </section>

                {/* Route Details + Map */}
                <section className="col-span-12 xl:col-span-7 flex min-h-0 flex-col">
                  <div className="flex-1 min-h-0 overflow-auto" id="details-scroll">
                    {selectedRoute ? (
                      <div className="space-y-3 p-3">
                        <RouteDetails
                          route={selectedRoute}
                          points={points}
                          onShowMap={handleShowOnMap}
                          onExportCSV={() => handleExportCSV(selectedRoute)}
                        />

            {/* Map View */}
                        <div className="rounded-xl border overflow-hidden">
                          <div className="sticky top-0 z-10 border-b bg-white px-4 py-2.5 text-sm font-semibold text-gray-900">
                            Map View
                          </div>
                          <ClientOnly fallback={<div className="h-80 flex items-center justify-center bg-slate-50"><p className="text-slate-500">Loading map...</p></div>}>
                <MapView
                  points={points}
                  selectedRoute={selectedRoute}
                  isVisible={true}
                              className="h-80"
                  startPoint={options.startPoint}
                  endPoint={options.endPoint}
                />
              </ClientOnly>
            </div>
          </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500">
                        <p className="text-sm">Select a route to see details</p>
                      </div>
                    )}
                  </div>
                </section>
        </div>
            ) : (
              <div className="flex-1 min-h-0 flex items-center justify-center text-slate-500">
          <div className="text-center px-4">
                  <Navigation className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">Add locations and click Optimize to generate routes</p>
                  <p className="text-xs text-slate-400 mt-1">Using {getDistanceServiceName()}</p>
                </div>
            </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Minimal Footer */}
      <div className="fixed bottom-0 right-0 p-2 text-xs text-slate-400">
        © 2024 Free Route Optimizer
      </div>
    </div>
  );
}
