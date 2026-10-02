/** Fictional input and output contracts for an optimizer under test. Designed for this portfolio. */

export type VehicleType = 'TRUCK' | 'VAN' | 'REEFER';

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** If present, only these vehicle types may serve the location (e.g. a narrow-street site). */
  allowedVehicleTypes?: VehicleType[];
}

export interface Order {
  id: string;
  locationId: string;
  weightKg: number;
  volumeM3: number;
  /** Set when the goods need a specific vehicle type (e.g. chilled goods need a REEFER). */
  requiredVehicleType?: VehicleType;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  capacityKg: number;
  capacityM3: number;
  depotId: string;
  maxStops: number;
}

export interface RouteStop {
  orderId: string;
  locationId: string;
}

export interface PlannedRoute {
  vehicleId: string;
  stops: RouteStop[];
  /** Road distance the optimizer reports for depot -> stops -> depot. */
  reportedDistanceKm?: number;
}

export const UNASSIGNED_REASONS = [
  'CAPACITY',
  'NO_COMPATIBLE_VEHICLE',
  'LOCATION_RESTRICTION',
  'INVALID_LOCATION',
] as const;
export type UnassignedReason = (typeof UNASSIGNED_REASONS)[number];

export interface OptimizerOutput {
  runId: string;
  routes: PlannedRoute[];
  unassigned: { orderId: string; reasonCode?: string }[];
}

export interface ValidationInput {
  orders: Order[];
  vehicles: Vehicle[];
  locations: Location[];
  output: OptimizerOutput;
}

export type Severity = 'CRITICAL' | 'MAJOR' | 'MINOR';

export interface Issue {
  validator: string;
  code: string;
  severity: Severity;
  /** FAIL blocks acceptance; WARNING needs a human look but is not wrong by itself. */
  status: 'FAIL' | 'WARNING';
  message: string;
  refs: string[];
}

export type Validator = (input: ValidationInput) => Issue[];
