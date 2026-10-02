/** Contract types for the demo shipment API, as the test framework expects it. */

export const SHIPMENT_STATUSES = [
  'CREATED',
  'ASSIGNED',
  'ROUTE_PLANNED',
  'IN_TRANSIT',
  'DELIVERED',
  'CLOSED',
  'CANCELLED',
] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export type VehicleType = 'TRUCK' | 'VAN' | 'REEFER';
export type TaskType = 'LOADING' | 'TRANSIT' | 'UNLOADING';

export interface CreateShipmentRequest {
  reference: string;
  customerId: string;
  vehicleType: VehicleType;
  origin: string;
  destination: string;
  weightKg: number;
}

export interface JourneyTask {
  type: TaskType;
  status: 'PENDING' | 'DONE';
  completedAt: string | null;
}

export interface Shipment extends CreateShipmentRequest {
  shipmentId: string;
  /** Typed as string: the framework must cope with values outside the documented enum. */
  status: string;
  vehicleId: string | null;
  tasks: JourneyTask[];
  history: { from: string | null; to: string; at: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentList {
  items: Shipment[];
  total: number;
}

export function isKnownStatus(status: string): status is ShipmentStatus {
  return (SHIPMENT_STATUSES as readonly string[]).includes(status);
}
