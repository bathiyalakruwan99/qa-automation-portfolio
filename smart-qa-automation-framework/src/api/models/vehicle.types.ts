import type { VehicleType } from './shipment.types';

export interface Vehicle {
  id: string;
  type: VehicleType;
  capacityKg: number;
}

export interface VehicleList {
  items: Vehicle[];
}
