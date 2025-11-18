// Web Worker for TSP optimization
// This runs in a separate thread to avoid blocking the UI

interface WorkerMessage {
  type: 'optimize';
  data: {
    order: number[];
    matrix: number[][];
    maxIterations: number;
  };
}

interface WorkerResponse {
  type: 'result' | 'error';
  data: {
    order?: number[];
    cost?: number;
    error?: string;
  };
}

// 2-opt optimization function
function twoOpt(order: number[], matrix: number[][], maxIterations: number = 1000): number[] {
  const n = order.length;
  if (n < 4) return order;

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

function twoOptSwap(order: number[], i: number, j: number): number[] {
  const newOrder = [...order];
  while (i < j) {
    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    i++;
    j--;
  }
  return newOrder;
}

function calculateRouteCost(order: number[], matrix: number[][], roundTrip: boolean = true): number {
  if (order.length < 2) return 0;

  let cost = 0;
  for (let i = 0; i < order.length - 1; i++) {
    cost += matrix[order[i]][order[i + 1]];
  }

  if (roundTrip && order.length > 1) {
    cost += matrix[order[order.length - 1]][order[0]];
  }

  return cost;
}

// Handle messages from main thread
self.onmessage = function(e: MessageEvent<WorkerMessage>) {
  const { type, data } = e.data;

  if (type === 'optimize') {
    try {
      const { order, matrix, maxIterations } = data;
      const optimizedOrder = twoOpt(order, matrix, maxIterations);
      const cost = calculateRouteCost(optimizedOrder, matrix);

      const response: WorkerResponse = {
        type: 'result',
        data: {
          order: optimizedOrder,
          cost
        }
      };

      self.postMessage(response);
    } catch (error) {
      const response: WorkerResponse = {
        type: 'error',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };

      self.postMessage(response);
    }
  }
};

// Export for TypeScript
export { };

