import { type CreateShipmentInput, DomainError, type Shipment, VEHICLES } from './domain';
import { assignVehicle, changeStatus, completeTask } from './workflow';

/** Faults the test-support API can inject for one shipment, to exercise the framework's guards. */
export type Fault = 'STUCK_TASK' | 'UNKNOWN_STATE';

export interface ListFilter {
  status?: string;
  q?: string;
}

/**
 * In-memory store. Each shipment is isolated, so parallel tests that create their own
 * shipments never interfere; faults are keyed per shipment for the same reason.
 */
export class ShipmentStore {
  private shipments = new Map<string, Shipment>();
  private faults = new Map<string, Fault>();
  private sequence = 1000;

  constructor(private readonly clock: () => Date = () => new Date()) {}

  reset(): void {
    this.shipments.clear();
    this.faults.clear();
    this.sequence = 1000;
  }

  private now(): string {
    return this.clock().toISOString();
  }

  create(input: CreateShipmentInput): Shipment {
    if ([...this.shipments.values()].some((s) => s.reference === input.reference)) {
      throw new DomainError(
        409,
        'DUPLICATE_REFERENCE',
        `A shipment with reference ${input.reference} already exists`,
        'reference',
      );
    }
    this.sequence += 1;
    const now = this.now();
    const shipment: Shipment = {
      shipmentId: `DEMO-SHP-${this.sequence}`,
      ...input,
      status: 'CREATED',
      vehicleId: null,
      tasks: [],
      history: [{ from: null, to: 'CREATED', at: now }],
      createdAt: now,
      updatedAt: now,
    };
    this.shipments.set(shipment.shipmentId, shipment);
    return structuredClone(shipment);
  }

  list(filter: ListFilter = {}): Shipment[] {
    const q = filter.q?.trim().toLowerCase();
    return [...this.shipments.values()]
      .filter((s) => !filter.status || s.status === filter.status)
      .filter(
        (s) =>
          !q || [s.shipmentId, s.reference, s.customerId].some((value) => value.toLowerCase().includes(q)),
      )
      .map((s) => structuredClone(s));
  }

  get(id: string): Shipment {
    return structuredClone(this.require(id));
  }

  delete(id: string): void {
    this.require(id);
    this.shipments.delete(id);
    this.faults.delete(id);
  }

  assign(id: string, vehicleId: unknown): Shipment {
    const shipment = this.require(id);
    if (typeof vehicleId !== 'string' || vehicleId === '') {
      throw new DomainError(400, 'REQUIRED_FIELD', 'vehicleId is required', 'vehicleId');
    }
    const vehicle = VEHICLES.find((v) => v.id === vehicleId);
    if (!vehicle) throw new DomainError(404, 'UNKNOWN_VEHICLE', `Unknown vehicle ${vehicleId}`, 'vehicleId');
    assignVehicle(shipment, vehicle, this.now());
    return structuredClone(shipment);
  }

  changeStatus(id: string, target: unknown): Shipment {
    const shipment = this.require(id);
    if (typeof target !== 'string' || target === '') {
      throw new DomainError(400, 'REQUIRED_FIELD', 'status is required', 'status');
    }
    changeStatus(shipment, target, this.now());
    return structuredClone(shipment);
  }

  completeTask(id: string, taskType: string): Shipment {
    const shipment = this.require(id);
    // Simulated stall: the request "succeeds" but nothing changes.
    if (this.faults.get(id) === 'STUCK_TASK') return structuredClone(shipment);
    completeTask(shipment, taskType, this.now());
    return structuredClone(shipment);
  }

  injectFault(id: string, fault: Fault): Shipment {
    const shipment = this.require(id);
    this.faults.set(id, fault);
    if (fault === 'UNKNOWN_STATE') {
      // A status the documented contract does not contain.
      shipment.history.push({
        from: shipment.status as Shipment['history'][number]['from'],
        to: 'ON_HOLD',
        at: this.now(),
      });
      shipment.status = 'ON_HOLD';
    }
    return structuredClone(shipment);
  }

  private require(id: string): Shipment {
    const shipment = this.shipments.get(id);
    if (!shipment) throw new DomainError(404, 'NOT_FOUND', `Shipment ${id} not found`, 'shipmentId');
    return shipment;
  }
}
