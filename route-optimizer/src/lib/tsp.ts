import { OptimizationOptions, Point, Route } from './types';
import { createRoute } from './utils';

/**
 * Nearest Neighbor TSP algorithm
 */
export function nearestNeighbor(matrix: number[][], start: number = 0): number[] {
  const n = matrix.length;
  if (n === 0) return [];
  if (n === 1) return [0];

  const visited = new Set<number>();
  const path = [start];
  visited.add(start);
  let current = start;

  while (visited.size < n) {
    let nearest = -1;
    let minDistance = Infinity;

    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && matrix[current][i] < minDistance) {
        minDistance = matrix[current][i];
        nearest = i;
      }
    }

    if (nearest === -1) break; // No unvisited nodes

    path.push(nearest);
    visited.add(nearest);
    current = nearest;
  }

  return path;
}

/**
 * 2-opt improvement algorithm
 */
export function twoOpt(order: number[], matrix: number[][], maxIterations: number = 1000): number[] {
  const n = order.length;
  if (n < 4) return order; // 2-opt needs at least 4 points

  let improved = true;
  let iterations = 0;
  let bestOrder = [...order];
  let bestCost = calculateRouteCost(order, matrix);

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 1; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const newOrder = twoOptSwap(bestOrder, i, j);
        const newCost = calculateRouteCost(newOrder, matrix);

        if (newCost < bestCost) {
          bestOrder = newOrder;
          bestCost = newCost;
          improved = true;
        }
      }
    }
  }

  return bestOrder;
}

/**
 * Perform 2-opt swap
 */
function twoOptSwap(order: number[], i: number, j: number): number[] {
  const newOrder = [...order];
  // Reverse the segment between i and j
  while (i < j) {
    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    i++;
    j--;
  }
  return newOrder;
}

/**
 * 3-opt improvement algorithm (for smaller datasets)
 */
export function threeOpt(order: number[], matrix: number[][], maxIterations: number = 500): number[] {
  const n = order.length;
  if (n < 6) return twoOpt(order, matrix, maxIterations); // Fall back to 2-opt

  let improved = true;
  let iterations = 0;
  let bestOrder = [...order];
  let bestCost = calculateRouteCost(order, matrix);

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 1; i < n - 4; i++) {
      for (let j = i + 2; j < n - 2; j++) {
        for (let k = j + 2; k < n; k++) {
          const newOrder = threeOptSwap(bestOrder, i, j, k);
          const newCost = calculateRouteCost(newOrder, matrix);

          if (newCost < bestCost) {
            bestOrder = newOrder;
            bestCost = newCost;
            improved = true;
          }
        }
      }
    }
  }

  return bestOrder;
}

/**
 * Perform 3-opt swap
 */
function threeOptSwap(order: number[], i: number, j: number, k: number): number[] {
  const newOrder = [...order];
  
  // Try different 3-opt moves
  const moves = [
    // Move 1: reverse segment i-j
    () => {
      const result = [...newOrder];
      let a = i, b = j;
      while (a < b) {
        [result[a], result[b]] = [result[b], result[a]];
        a++;
        b--;
      }
      return result;
    },
    // Move 2: reverse segment j-k
    () => {
      const result = [...newOrder];
      let a = j, b = k;
      while (a < b) {
        [result[a], result[b]] = [result[b], result[a]];
        a++;
        b--;
      }
      return result;
    },
    // Move 3: reverse segment i-k
    () => {
      const result = [...newOrder];
      let a = i, b = k;
      while (a < b) {
        [result[a], result[b]] = [result[b], result[a]];
        a++;
        b--;
      }
      return result;
    }
  ];

  // Return the best move
  let bestOrder = newOrder;
  let bestCost = calculateRouteCost(newOrder, matrix);

  for (const move of moves) {
    const moved = move();
    const cost = calculateRouteCost(moved, matrix);
    if (cost < bestCost) {
      bestOrder = moved;
      bestCost = cost;
    }
  }

  return bestOrder;
}

/**
 * Calculate total route cost
 */
export function calculateRouteCost(order: number[], matrix: number[][], roundTrip: boolean = true): number {
  if (order.length < 2) return 0;

  let cost = 0;
  const legDistances: number[] = [];
  
  for (let i = 0; i < order.length - 1; i++) {
    const legDistance = matrix[order[i]][order[i + 1]];
    cost += legDistance;
    legDistances.push(legDistance);
  }

  // Add return cost for round trip
  if (roundTrip && order.length > 1) {
    const returnDistance = matrix[order[order.length - 1]][order[0]];
    cost += returnDistance;
    legDistances.push(returnDistance);
  }

  // Debug logging for route cost calculation
  console.log('🔍 Route Cost Calculation Debug:');
  console.log('  Order:', order);
  console.log('  Round trip:', roundTrip);
  console.log('  Leg distances:', legDistances.map(d => d.toFixed(1)).join(' + '));
  console.log('  Total cost:', cost.toFixed(1), 'km');

  return cost;
}

/**
 * Multi-start TSP with different starting strategies
 */
export function multiStartTsp(
  matrix: number[][],
  points: Point[],
  options: OptimizationOptions
): { order: number[]; cost: number; route: Route }[] {
  const n = matrix.length;
  if (n === 0) return [];
  if (n === 1) return [{ order: [0], cost: 0, route: createRoute([0], matrix, points, options.roundTrip) }];

  console.log('🚀 TSP Optimization starting with diversity improvements... [FORCED UPDATE ' + Date.now() + ']');
  console.log('📍 Points count:', n);
  console.log('🎯 Max alternatives requested:', options.maxAlternatives);
  console.log('🔄 Round trip:', options.roundTrip);
  
  const results: { order: number[]; cost: number; route: Route }[] = [];

  // Check if user specified a starting point
  if (options.startPoint !== undefined && options.startPoint >= 0 && options.startPoint < n) {
    console.log('🎯 USER SELECTED STARTING POINT:', options.startPoint, '(', points[options.startPoint]?.label, ')');
    
    const fixedStart = options.startPoint;
    
    // Generate multiple routes ALL starting from the selected point
    // Strategy 1: Nearest Neighbor from the selected start
    try {
      let order = nearestNeighbor(matrix, fixedStart);
      console.log(`🔍 NN generated order starting from ${fixedStart}: [${order.join(',')}]`);
      
      // FORCE the starting point to be first
      if (order[0] !== fixedStart) {
        console.log(`⚠️ NN order doesn't start with ${fixedStart}, fixing...`);
        const startIndex = order.indexOf(fixedStart);
        order = [fixedStart, ...order.filter((_, idx) => idx !== startIndex)];
        console.log(`✅ Fixed NN order: [${order.join(',')}]`);
      }
      
      const cost = calculateRouteCost(order, matrix, options.roundTrip);
      const route = createRoute(order, matrix, points, options.roundTrip);
      
      console.log(`📍 NN from fixed start ${fixedStart}: [${order.join(',')}] Cost: ${cost.toFixed(1)}km`);
      results.push({ order, cost, route });
    } catch (error) {
      console.warn(`NN failed for fixed start ${fixedStart}:`, error);
    }
    
    // Strategy 2: Greedy Insertion from the selected start
    try {
      let order = greedyInsertion(matrix, fixedStart);
      console.log(`🔍 GI generated order starting from ${fixedStart}: [${order.join(',')}]`);
      
      // FORCE the starting point to be first
      if (order[0] !== fixedStart) {
        console.log(`⚠️ GI order doesn't start with ${fixedStart}, fixing...`);
        const startIndex = order.indexOf(fixedStart);
        order = [fixedStart, ...order.filter((_, idx) => idx !== startIndex)];
        console.log(`✅ Fixed GI order: [${order.join(',')}]`);
      }
      
      const cost = calculateRouteCost(order, matrix, options.roundTrip);
      const route = createRoute(order, matrix, points, options.roundTrip);
      
      console.log(`🎯 GI from fixed start ${fixedStart}: [${order.join(',')}] Cost: ${cost.toFixed(1)}km`);
      results.push({ order, cost, route });
    } catch (error) {
      console.warn(`GI failed for fixed start ${fixedStart}:`, error);
    }
    
    // Strategy 3: Create variations that ALL start from the selected point
    if (results.length > 0) {
      const bestOrder = results[0].order;
      
      // Ensure the best order starts with the selected point
      if (bestOrder[0] !== fixedStart) {
        console.log('⚠️ Best order does not start with selected point, rotating...');
        const startIndex = bestOrder.indexOf(fixedStart);
        const rotated = [...bestOrder.slice(startIndex), ...bestOrder.slice(0, startIndex)];
        const cost = calculateRouteCost(rotated, matrix, options.roundTrip);
        const route = createRoute(rotated, matrix, points, options.roundTrip);
        console.log(`🔄 Rotated to start from ${fixedStart}: [${rotated.join(',')}] Cost: ${cost.toFixed(1)}km`);
        results[0] = { order: rotated, cost, route };
      }
      
      // Create variations that maintain the starting point
      const remaining = options.maxAlternatives - results.length;
      console.log(`🎲 Creating ${remaining} more variations starting from ${fixedStart}`);
      
      for (let i = 1; i <= remaining && i < n - 1; i++) {
        // Try different permutations while keeping the start fixed
        const variation = [fixedStart, ...bestOrder.filter((_, idx) => idx > 0).slice(i), ...bestOrder.filter((_, idx) => idx > 0).slice(0, i)];
        const cost = calculateRouteCost(variation, matrix, options.roundTrip);
        const route = createRoute(variation, matrix, points, options.roundTrip);
        console.log(`🔄 Variation ${i} from ${fixedStart}: [${variation.join(',')}] Cost: ${cost.toFixed(1)}km`);
        results.push({ order: variation, cost, route });
      }
    }
    
  } else {
    console.log('🎯 NO FIXED STARTING POINT - using auto-optimization');
    
    // Original logic for auto-optimization
    const starts = [0, 1, 2, 3, 4].filter(i => i < n);
    console.log('📍 Using starting points:', starts);
    
    for (const start of starts) {
      try {
        let order = nearestNeighbor(matrix, start);
        const cost = calculateRouteCost(order, matrix, options.roundTrip);
        const route = createRoute(order, matrix, points, options.roundTrip);
        
        console.log(`📍 NN Start ${start}: [${order.join(',')}] Cost: ${cost.toFixed(1)}km`);
        results.push({ order, cost, route });
      } catch (error) {
        console.warn(`NN failed for start ${start}:`, error);
      }
    }
  }
  
  // Duplicate code removed - logic is now above

  // Sort by cost and remove duplicates
  results.sort((a, b) => a.cost - b.cost);
  
  // FINAL CHECK: Ensure ALL routes start with the selected point if specified
  if (options.startPoint !== undefined && options.startPoint >= 0 && options.startPoint < n) {
    console.log('🔍 FINAL CHECK: Ensuring all routes start with selected point', options.startPoint);
    results.forEach((result, index) => {
      if (result.order[0] !== options.startPoint) {
        console.log(`⚠️ Route ${index} doesn't start with ${options.startPoint}, fixing...`);
        const startIndex = result.order.indexOf(options.startPoint);
        result.order = [options.startPoint, ...result.order.filter((_, idx) => idx !== startIndex)];
        result.cost = calculateRouteCost(result.order, matrix, options.roundTrip);
        result.route = createRoute(result.order, matrix, points, options.roundTrip);
        console.log(`✅ Fixed route ${index}: [${result.order.join(',')}]`);
      }
    });
  }
  
  // Remove duplicate routes and ensure we have the requested number
  const uniqueResults: { order: number[]; cost: number; route: Route }[] = [];
  const seenOrders = new Set<string>();
  
  console.log('🔄 Processing', results.length, 'total routes...');
  
  for (const result of results) {
    const orderKey = result.order.join(',');
    
    if (!seenOrders.has(orderKey)) {
      uniqueResults.push(result);
      seenOrders.add(orderKey);
      console.log(`✅ Added unique route: [${result.order.join(',')}] Cost: ${result.cost.toFixed(1)}km`);
      
      if (uniqueResults.length >= options.maxAlternatives) {
        break;
      }
    } else {
      console.log(`❌ Skipped duplicate route: [${result.order.join(',')}]`);
    }
  }

  // Generate strategic variations for diversity
  if (uniqueResults.length < options.maxAlternatives && uniqueResults.length > 0) {
    const needed = options.maxAlternatives - uniqueResults.length;
    console.log('🎲 Need', needed, 'more diverse routes - generating strategic variations');
    
    const bestOrder = uniqueResults[0].order;
    
    // Strategy 1: Generate systematic variations
    const alternatives = generateForcedAlternatives(bestOrder, matrix, points, options);
    
    for (const alt of alternatives) {
      if (uniqueResults.length >= options.maxAlternatives) break;
      
      const orderKey = alt.order.join(',');
      if (!seenOrders.has(orderKey)) {
        const cost = calculateRouteCost(alt.order, matrix, options.roundTrip);
        const route = createRoute(alt.order, matrix, points, options.roundTrip);
        console.log(`🎲 Added variation: [${alt.order.join(',')}] Cost: ${cost.toFixed(1)}km`);
        uniqueResults.push({ order: alt.order, cost, route });
        seenOrders.add(orderKey);
      }
    }
    
    // Strategy 2: Generate strategic swaps (adjacent pair swaps)
    if (uniqueResults.length < options.maxAlternatives) {
      for (let i = 0; i < bestOrder.length - 1 && uniqueResults.length < options.maxAlternatives; i++) {
        const swapped = [...bestOrder];
        [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
        
        const orderKey = swapped.join(',');
        if (!seenOrders.has(orderKey)) {
          const cost = calculateRouteCost(swapped, matrix, options.roundTrip);
          const route = createRoute(swapped, matrix, points, options.roundTrip);
          console.log(`🎲 Added swap ${i}-${i+1}: [${swapped.join(',')}] Cost: ${cost.toFixed(1)}km`);
          uniqueResults.push({ order: swapped, cost, route });
          seenOrders.add(orderKey);
        }
      }
    }
  }

  // FINAL CHECK: Ensure ALL routes start/end with the selected points if specified
  if (options.startPoint !== undefined && options.startPoint >= 0 && options.startPoint < n) {
    console.log('🔍 FINAL CHECK: Ensuring all routes start with selected point', options.startPoint);
    uniqueResults.forEach((result, index) => {
      if (result.order[0] !== options.startPoint) {
        console.log(`⚠️ Route ${index} doesn't start with ${options.startPoint}, fixing...`);
        const startIndex = result.order.indexOf(options.startPoint);
        result.order = [options.startPoint, ...result.order.filter((_, idx) => idx !== startIndex)];
        result.cost = calculateRouteCost(result.order, matrix, options.roundTrip);
        result.route = createRoute(result.order, matrix, points, options.roundTrip);
        console.log(`✅ Fixed route ${index}: [${result.order.join(',')}]`);
      }
    });
  }
  
  if (options.endPoint !== undefined && options.endPoint >= 0 && options.endPoint < n) {
    console.log('🔍 FINAL CHECK: Ensuring all routes end with selected point', options.endPoint);
    uniqueResults.forEach((result, index) => {
      if (result.order[result.order.length - 1] !== options.endPoint) {
        console.log(`⚠️ Route ${index} doesn't end with ${options.endPoint}, fixing...`);
        result.order = result.order.filter(p => p !== options.endPoint);
        result.order.push(options.endPoint);
        result.cost = calculateRouteCost(result.order, matrix, options.roundTrip);
        result.route = createRoute(result.order, matrix, points, options.roundTrip);
        console.log(`✅ Fixed route ${index}: [${result.order.join(',')}]`);
      }
    });
  }

  // FINAL SORT: Sort all results by distance (lowest to highest)
  uniqueResults.sort((a, b) => a.cost - b.cost);
  
  // FINAL DEDUPLICATION: Remove any remaining duplicates
  const finalResults: { order: number[]; cost: number; route: Route }[] = [];
  const finalSeenOrders = new Set<string>();
  
  for (const result of uniqueResults) {
    const orderKey = result.order.join(',');
    if (!finalSeenOrders.has(orderKey)) {
      finalResults.push(result);
      finalSeenOrders.add(orderKey);
    }
  }
  
  console.log('✅ TSP Optimization complete. Final results:', finalResults.length);
  finalResults.forEach((result, index) => {
    console.log(`Route ${index + 1}:`, result.order, `Cost: ${result.cost.toFixed(1)}km`);
  });

  return finalResults;
}

/**
 * Generate random route alternatives
 */
function generateRandomAlternatives(
  baseOrder: number[],
  n: number,
  maxAlternatives: number
): number[][] {
  const alternatives: number[][] = [];
  const base = baseOrder.length > 0 ? [...baseOrder] : Array.from({ length: n }, (_, i) => i);
  
  // Generate random permutations
  for (let i = 0; i < maxAlternatives; i++) {
    const shuffled = [...base];
    
    // Fisher-Yates shuffle
    for (let j = shuffled.length - 1; j > 0; j--) {
      const randomIndex = Math.floor(Math.random() * (j + 1));
      [shuffled[j], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[j]];
    }
    
    alternatives.push(shuffled);
  }
  
  return alternatives;
}

/**
 * Generate forced alternatives when optimization converges to same route
 */
function generateForcedAlternatives(
  bestOrder: number[],
  matrix: number[][],
  points: Point[],
  options: OptimizationOptions
): { order: number[] }[] {
  const alternatives: { order: number[] }[] = [];
  const n = bestOrder.length;
  
  if (n < 3) return alternatives;
  
  const fixedStart = options.startPoint;
  const fixedEnd = options.endPoint;
  
  // Get indices to work with (excluding fixed start/end)
  const startIdx = fixedStart !== undefined ? 1 : 0;
  const endIdx = fixedEnd !== undefined ? n - 1 : n;
  
  // Strategy 1: Reverse segments of the route (but preserve start/end)
  for (let i = startIdx + 1; i < endIdx - 1; i++) {
    for (let j = i + 1; j < endIdx; j++) {
      const newOrder = [...bestOrder];
      // Reverse segment from i to j (middle part only)
      const segment = newOrder.slice(i, j + 1).reverse();
      newOrder.splice(i, j - i + 1, ...segment);
      alternatives.push({ order: newOrder });
      
      if (alternatives.length >= 3) break;
    }
    if (alternatives.length >= 3) break;
  }
  
  // Strategy 2: Swap adjacent pairs (but not start/end)
  if (alternatives.length < 3 && n >= 4) {
    for (let i = startIdx; i < endIdx - 1; i += 2) {
      // Don't swap if it would affect start or end
      if (fixedStart !== undefined && i === 0) continue;
      if (fixedEnd !== undefined && i >= n - 2) continue;
      
      const newOrder = [...bestOrder];
      [newOrder[i], newOrder[i + 1]] = [newOrder[i + 1], newOrder[i]];
      alternatives.push({ order: newOrder });
      
      if (alternatives.length >= 3) break;
    }
  }
  
  // Strategy 3: Rotate middle section only
  if (alternatives.length < 3 && endIdx - startIdx > 2) {
    const middleSection = bestOrder.slice(startIdx, endIdx);
    for (let shift = 1; shift < middleSection.length && alternatives.length < 3; shift++) {
      const rotated = [...middleSection.slice(shift), ...middleSection.slice(0, shift)];
      const newOrder = [
        ...(fixedStart !== undefined ? [bestOrder[0]] : []),
        ...rotated,
        ...(fixedEnd !== undefined ? [bestOrder[n - 1]] : [])
      ];
      alternatives.push({ order: newOrder });
    }
  }
  
  return alternatives.slice(0, 3);
}

/**
 * Generate starting points for multi-start
 */
function generateStartingPoints(n: number, maxStarts: number): number[] {
  const starts = new Set<number>();
  
  // Always include first point
  starts.add(0);
  
  // Add strategic points
  if (n > 2) starts.add(Math.floor(n / 2));
  if (n > 4) starts.add(n - 1);
  if (n > 6) starts.add(Math.floor(n / 4));
  if (n > 8) starts.add(Math.floor(3 * n / 4));
  
  // Add some random starts for diversity
  const randomCount = Math.min(maxStarts - starts.size, Math.floor(n / 3));
  while (starts.size < Math.min(maxStarts, n) && starts.size < n) {
    const random = Math.floor(Math.random() * n);
    starts.add(random);
  }

  return Array.from(starts);
}

/**
 * Check if two arrays are equal
 */
function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Find the farthest point from a given point
 */
export function findFarthestPoint(matrix: number[][], fromPoint: number): number {
  let farthest = -1;
  let maxDistance = -1;

  for (let i = 0; i < matrix.length; i++) {
    if (i !== fromPoint && matrix[fromPoint][i] > maxDistance) {
      maxDistance = matrix[fromPoint][i];
      farthest = i;
    }
  }

  return farthest;
}

/**
 * Greedy insertion algorithm
 */
export function greedyInsertion(matrix: number[][], start: number = 0): number[] {
  const n = matrix.length;
  if (n === 0) return [];
  if (n === 1) return [0];

  const unvisited = new Set(Array.from({ length: n }, (_, i) => i));
  const path = [start];
  unvisited.delete(start);

  while (unvisited.size > 0) {
    let bestInsertion = -1;
    let bestPosition = -1;
    let bestCost = Infinity;

    for (const point of unvisited) {
      for (let pos = 0; pos <= path.length; pos++) {
        const cost = calculateInsertionCost(path, point, pos, matrix);
        if (cost < bestCost) {
          bestCost = cost;
          bestInsertion = point;
          bestPosition = pos;
        }
      }
    }

    if (bestInsertion !== -1) {
      path.splice(bestPosition, 0, bestInsertion);
      unvisited.delete(bestInsertion);
    } else {
      break; // No valid insertion found
    }
  }

  return path;
}

/**
 * Calculate cost of inserting a point at a specific position
 */
function calculateInsertionCost(
  path: number[],
  point: number,
  position: number,
  matrix: number[][]
): number {
  if (position === 0) {
    return matrix[point][path[0]];
  }
  if (position === path.length) {
    return matrix[path[path.length - 1]][point];
  }
  
  const prev = path[position - 1];
  const next = path[position];
  const originalCost = matrix[prev][next];
  const newCost = matrix[prev][point] + matrix[point][next];
  
  return newCost - originalCost;
}

/**
 * Optimize route using multiple algorithms and return best result
 */
export function optimizeRoute(
  matrix: number[][],
  points: Point[],
  options: OptimizationOptions
): { best: Route; alternatives: Route[] } {
  const results = multiStartTsp(matrix, points, options);
  
  if (results.length === 0) {
    throw new Error('No valid routes found');
  }

  const best = results[0].route;
  const alternatives = results.slice(1).map(r => r.route);

  return { best, alternatives };
}
