import type { CreateShipmentRequest, VehicleType } from '../api/models/shipment.types';
import { type Random, seededRandom, seedFromEnv } from '../utils/seeded-random';

/** Synthetic reference data that exists in the demo app's seed. */
export const DEMO_CUSTOMERS = ['CUSTOMER-ALPHA', 'CUSTOMER-BETA'] as const;
export const DEMO_LOCATIONS = ['WAREHOUSE-ALPHA', 'CUSTOMER-SITE-BETA', 'CENTRAL-HUB'] as const;
export const DEMO_VEHICLES: Record<VehicleType, { id: string; capacityKg: number }> = {
  TRUCK: { id: 'TRUCK-001', capacityKg: 10000 },
  VAN: { id: 'VAN-001', capacityKg: 1500 },
  REEFER: { id: 'REEFER-001', capacityKg: 8000 },
};

/**
 * Builds valid, unique create-shipment payloads. References are unique per builder instance
 * (run tag + counter), so parallel workers never collide on the duplicate-reference rule.
 */
export class ShipmentBuilder {
  private counter = 0;
  private readonly random: Random;
  readonly runTag: string;

  constructor(
    readonly seed: number = seedFromEnv(),
    tag?: string,
  ) {
    this.random = seededRandom(seed);
    this.runTag = (tag ?? seed.toString(36)).toUpperCase().slice(-8);
  }

  nextReference(prefix = 'DEMO'): string {
    this.counter += 1;
    return `${prefix}-${this.runTag}-${String(this.counter).padStart(3, '0')}`;
  }

  build(overrides: Partial<CreateShipmentRequest> = {}): CreateShipmentRequest {
    const vehicleType = overrides.vehicleType ?? 'TRUCK';
    const origin = overrides.origin ?? this.random.pick(DEMO_LOCATIONS);
    const destination = overrides.destination ?? this.random.pick(DEMO_LOCATIONS.filter((l) => l !== origin));
    const capacity = DEMO_VEHICLES[vehicleType].capacityKg;
    return {
      reference: this.nextReference(),
      customerId: this.random.pick(DEMO_CUSTOMERS),
      vehicleType,
      origin,
      destination,
      // Always fits the default vehicle of that type unless a test overrides the weight.
      weightKg: this.random.int(100, Math.floor(capacity * 0.8)),
      ...overrides,
    };
  }
}
