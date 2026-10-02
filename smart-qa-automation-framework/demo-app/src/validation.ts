import {
  CUSTOMERS,
  type CreateShipmentInput,
  DomainError,
  LOCATIONS,
  MAX_WEIGHT_KG,
  VEHICLE_TYPES,
  type VehicleType,
} from './domain';

const REFERENCE_PATTERN = /^[A-Z0-9][A-Z0-9-]{2,39}$/;

function fail(code: string, message: string, field: string): never {
  throw new DomainError(400, code, message, field);
}

function requireString(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  if (typeof value !== 'string' || value.trim() === '') {
    fail('REQUIRED_FIELD', `${field} is required`, field);
  }
  return value.trim();
}

/** Validates an untrusted create-shipment body and returns a typed, normalised input. */
export function validateCreateShipment(body: unknown): CreateShipmentInput {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new DomainError(400, 'INVALID_BODY', 'Request body must be a JSON object');
  }
  const input = body as Record<string, unknown>;

  const reference = requireString(input, 'reference').toUpperCase();
  if (!REFERENCE_PATTERN.test(reference)) {
    fail('INVALID_FORMAT', 'reference must be 3-40 characters of A-Z, 0-9 and "-"', 'reference');
  }

  const customerId = requireString(input, 'customerId');
  if (!CUSTOMERS.some((c) => c.id === customerId)) {
    fail('UNKNOWN_CUSTOMER', `Unknown customer ${customerId}`, 'customerId');
  }

  const vehicleType = requireString(input, 'vehicleType');
  if (!(VEHICLE_TYPES as readonly string[]).includes(vehicleType)) {
    fail('UNSUPPORTED_VEHICLE_TYPE', `vehicleType must be one of ${VEHICLE_TYPES.join(', ')}`, 'vehicleType');
  }

  const origin = requireString(input, 'origin');
  const destination = requireString(input, 'destination');
  for (const [field, value] of [
    ['origin', origin],
    ['destination', destination],
  ] as const) {
    if (!LOCATIONS.some((l) => l.id === value)) fail('UNKNOWN_LOCATION', `Unknown location ${value}`, field);
  }
  if (origin === destination) {
    fail('SAME_ORIGIN_DESTINATION', 'origin and destination must differ', 'destination');
  }

  const weightKg = input.weightKg;
  if (typeof weightKg !== 'number' || !Number.isFinite(weightKg)) {
    fail('REQUIRED_FIELD', 'weightKg is required and must be a number', 'weightKg');
  }
  if (weightKg <= 0 || weightKg > MAX_WEIGHT_KG) {
    fail('OUT_OF_RANGE', `weightKg must be greater than 0 and at most ${MAX_WEIGHT_KG}`, 'weightKg');
  }

  return { reference, customerId, vehicleType: vehicleType as VehicleType, origin, destination, weightKg };
}
