/**
 * Wrapper for TSP Web Worker
 * Provides a clean interface for running 2-opt optimization in a separate thread
 */

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

export class TSPWorkerWrapper {
  private worker: Worker | null = null;
  private isAvailable = false;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    try {
      // Create worker from the worker file
      this.worker = new Worker(new URL('./workers/tspWorker.ts', import.meta.url), {
        type: 'module'
      });
      this.isAvailable = true;
    } catch (error) {
      console.warn('Web Worker not available, falling back to main thread:', error);
      this.isAvailable = false;
    }
  }

  /**
   * Optimize route using 2-opt in Web Worker
   */
  async optimize(
    order: number[],
    matrix: number[][],
    maxIterations: number = 1000
  ): Promise<{ order: number[]; cost: number }> {
    if (!this.isAvailable || !this.worker) {
      // Fall back to main thread implementation
      return this.optimizeInMainThread(order, matrix, maxIterations);
    }

    return new Promise((resolve, reject) => {
      const message: WorkerMessage = {
        type: 'optimize',
        data: { order, matrix, maxIterations }
      };

      const handleMessage = (e: MessageEvent<WorkerResponse>) => {
        const { type, data } = e.data;

        if (type === 'result') {
          this.worker?.removeEventListener('message', handleMessage);
          resolve({
            order: data.order!,
            cost: data.cost!
          });
        } else if (type === 'error') {
          this.worker?.removeEventListener('message', handleMessage);
          reject(new Error(data.error || 'Worker optimization failed'));
        }
      };

      this.worker.addEventListener('message', handleMessage);
      this.worker.postMessage(message);

      // Timeout after 30 seconds
      setTimeout(() => {
        this.worker?.removeEventListener('message', handleMessage);
        reject(new Error('Worker optimization timeout'));
      }, 30000);
    });
  }

  /**
   * Fallback optimization in main thread
   */
  private optimizeInMainThread(
    order: number[],
    matrix: number[][],
    maxIterations: number
  ): { order: number[]; cost: number } {
    const optimizedOrder = this.twoOptMainThread(order, matrix, maxIterations);
    const cost = this.calculateRouteCost(optimizedOrder, matrix);
    
    return { order: optimizedOrder, cost };
  }

  /**
   * 2-opt implementation for main thread
   */
  private twoOptMainThread(order: number[], matrix: number[][], maxIterations: number): number[] {
    const n = order.length;
    if (n < 4) return order;

    let improved = true;
    let iterations = 0;
    let bestOrder = [...order];
    let bestCost = this.calculateRouteCost(order, matrix);

    while (improved && iterations < maxIterations) {
      improved = false;
      iterations++;

      for (let i = 1; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
          const newOrder = this.twoOptSwap(bestOrder, i, j);
          const newCost = this.calculateRouteCost(newOrder, matrix);

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

  private twoOptSwap(order: number[], i: number, j: number): number[] {
    const newOrder = [...order];
    while (i < j) {
      [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
      i++;
      j--;
    }
    return newOrder;
  }

  private calculateRouteCost(order: number[], matrix: number[][], roundTrip: boolean = true): number {
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

  /**
   * Check if Web Worker is available
   */
  isWorkerAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Terminate the worker
   */
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isAvailable = false;
    }
  }
}

// Create a singleton instance
export const tspWorker = new TSPWorkerWrapper();
