import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { CreateShipmentRequest } from '../models/shipment.types';

/**
 * Thin wrapper over the demo shipment endpoints. Methods return the raw APIResponse so specs
 * can assert positive and negative outcomes alike; use readJson() to assert + parse.
 */
export class ShipmentClient {
  constructor(private readonly request: APIRequestContext) {}

  create(payload: CreateShipmentRequest | Record<string, unknown>): Promise<APIResponse> {
    return this.request.post('/api/demo/shipments', { data: payload });
  }

  get(id: string): Promise<APIResponse> {
    return this.request.get(`/api/demo/shipments/${encodeURIComponent(id)}`);
  }

  list(filter: { status?: string; q?: string } = {}): Promise<APIResponse> {
    return this.request.get('/api/demo/shipments', { params: filter });
  }

  delete(id: string): Promise<APIResponse> {
    return this.request.delete(`/api/demo/shipments/${encodeURIComponent(id)}`);
  }

  assignVehicle(id: string, vehicleId: string): Promise<APIResponse> {
    return this.request.post(`/api/demo/shipments/${encodeURIComponent(id)}/assign`, { data: { vehicleId } });
  }

  changeStatus(id: string, status: string): Promise<APIResponse> {
    return this.request.patch(`/api/demo/shipments/${encodeURIComponent(id)}/status`, { data: { status } });
  }

  completeTask(id: string, taskType: string): Promise<APIResponse> {
    return this.request.post(
      `/api/demo/shipments/${encodeURIComponent(id)}/tasks/${encodeURIComponent(taskType)}/complete`,
    );
  }
}
