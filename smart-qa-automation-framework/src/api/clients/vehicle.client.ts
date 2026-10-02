import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { VehicleType } from '../models/shipment.types';

export class VehicleClient {
  constructor(private readonly request: APIRequestContext) {}

  list(type?: VehicleType): Promise<APIResponse> {
    return this.request.get('/api/demo/vehicles', { params: type ? { type } : {} });
  }
}
