/**
 * Northstar Logistics demo domain. Entirely fictional and designed for this portfolio:
 * a shipment is created, assigned to a vehicle, route-planned, driven through three
 * journey tasks, delivered and closed.
 */

export const VEHICLE_TYPES = ['TRUCK', 'VAN', 'REEFER'] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

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

export const TASK_TYPES = ['LOADING', 'TRANSIT', 'UNLOADING'] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export interface Customer {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  capacityKg: number;
}

export interface JourneyTask {
  type: TaskType;
  status: 'PENDING' | 'DONE';
  completedAt: string | null;
}

export interface StatusChange {
  from: ShipmentStatus | null;
  to: string;
  at: string;
}

export interface Shipment {
  shipmentId: string;
  reference: string;
  customerId: string;
  vehicleType: VehicleType;
  origin: string;
  destination: string;
  weightKg: number;
  /** Normally a ShipmentStatus; the fault-injection hook can set an undocumented value. */
  status: string;
  vehicleId: string | null;
  tasks: JourneyTask[];
  history: StatusChange[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateShipmentInput {
  reference: string;
  customerId: string;
  vehicleType: VehicleType;
  origin: string;
  destination: string;
  weightKg: number;
}

export const CUSTOMERS: readonly Customer[] = [
  { id: 'CUSTOMER-ALPHA', name: 'Customer Alpha' },
  { id: 'CUSTOMER-BETA', name: 'Customer Beta' },
];

export const LOCATIONS: readonly Location[] = [
  { id: 'WAREHOUSE-ALPHA', name: 'Warehouse Alpha' },
  { id: 'CUSTOMER-SITE-BETA', name: 'Customer Site Beta' },
  { id: 'CENTRAL-HUB', name: 'Central Distribution Hub' },
];

export const VEHICLES: readonly Vehicle[] = [
  { id: 'TRUCK-001', type: 'TRUCK', capacityKg: 10000 },
  { id: 'TRUCK-002', type: 'TRUCK', capacityKg: 10000 },
  { id: 'VAN-001', type: 'VAN', capacityKg: 1500 },
  { id: 'REEFER-001', type: 'REEFER', capacityKg: 8000 },
];

export const MAX_WEIGHT_KG = 30000;

/** Error with an HTTP status and a stable machine-readable code. */
export class DomainError extends Error {
  constructor(
    readonly httpStatus: number,
    readonly code: string,
    message: string,
    readonly field?: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
