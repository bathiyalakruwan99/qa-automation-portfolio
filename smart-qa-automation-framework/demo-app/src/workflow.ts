import {
  DomainError,
  type Shipment,
  type ShipmentStatus,
  TASK_TYPES,
  type TaskType,
  type Vehicle,
} from './domain';

/**
 * Status changes allowed through PATCH /status. DELIVERED is deliberately absent:
 * a shipment is delivered only by completing every journey task, never by a direct jump.
 */
const PATCH_TRANSITIONS: Readonly<Record<ShipmentStatus, readonly ShipmentStatus[]>> = {
  CREATED: ['CANCELLED'],
  ASSIGNED: ['ROUTE_PLANNED', 'CANCELLED'],
  ROUTE_PLANNED: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: [],
  DELIVERED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
};

export function allowedPatchTargets(status: string): readonly ShipmentStatus[] {
  return PATCH_TRANSITIONS[status as ShipmentStatus] ?? [];
}

function illegal(shipment: Shipment, target: string): never {
  throw new DomainError(
    409,
    'ILLEGAL_TRANSITION',
    `Cannot change ${shipment.shipmentId} from ${shipment.status} to ${target}`,
    'status',
  );
}

function record(shipment: Shipment, to: string, now: string): void {
  shipment.history.push({ from: shipment.status as ShipmentStatus, to, at: now });
  shipment.status = to;
  shipment.updatedAt = now;
}

export function assignVehicle(shipment: Shipment, vehicle: Vehicle, now: string): void {
  if (shipment.status !== 'CREATED') illegal(shipment, 'ASSIGNED');
  if (vehicle.type !== shipment.vehicleType) {
    throw new DomainError(
      422,
      'VEHICLE_TYPE_MISMATCH',
      `${vehicle.id} is a ${vehicle.type}; shipment needs a ${shipment.vehicleType}`,
      'vehicleId',
    );
  }
  if (shipment.weightKg > vehicle.capacityKg) {
    throw new DomainError(
      422,
      'CAPACITY_EXCEEDED',
      `${shipment.weightKg} kg exceeds ${vehicle.id} capacity of ${vehicle.capacityKg} kg`,
      'vehicleId',
    );
  }
  shipment.vehicleId = vehicle.id;
  record(shipment, 'ASSIGNED', now);
}

export function changeStatus(shipment: Shipment, target: string, now: string): void {
  if (!allowedPatchTargets(shipment.status).includes(target as ShipmentStatus)) illegal(shipment, target);
  if (target === 'IN_TRANSIT') {
    shipment.tasks = TASK_TYPES.map((type) => ({ type, status: 'PENDING', completedAt: null }));
  }
  record(shipment, target, now);
}

export function nextPendingTask(shipment: Shipment): TaskType | null {
  return shipment.tasks.find((t) => t.status === 'PENDING')?.type ?? null;
}

/** Completes a journey task. Tasks must be completed in order; the last one delivers the shipment. */
export function completeTask(shipment: Shipment, type: string, now: string): void {
  if (shipment.status !== 'IN_TRANSIT') {
    throw new DomainError(409, 'NOT_IN_TRANSIT', `${shipment.shipmentId} is ${shipment.status}`, 'status');
  }
  const task = shipment.tasks.find((t) => t.type === type);
  if (!task) throw new DomainError(404, 'UNKNOWN_TASK', `Unknown task ${type}`, 'taskType');
  if (task.status === 'DONE')
    throw new DomainError(409, 'TASK_ALREADY_DONE', `${type} is already done`, 'taskType');
  const expected = nextPendingTask(shipment);
  if (expected !== type) {
    throw new DomainError(409, 'TASK_OUT_OF_ORDER', `Complete ${expected} before ${type}`, 'taskType');
  }
  task.status = 'DONE';
  task.completedAt = now;
  shipment.updatedAt = now;
  if (nextPendingTask(shipment) === null) record(shipment, 'DELIVERED', now);
}
