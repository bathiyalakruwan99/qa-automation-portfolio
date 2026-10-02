import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import errorSchema from '../schemas/error.schema.json';
import shipmentListSchema from '../schemas/shipment-list.schema.json';
import shipmentSchema from '../schemas/shipment.schema.json';

export type SchemaName = 'shipment' | 'shipment-list' | 'error';

const ajv = new Ajv({ allErrors: true, strict: true, allowUnionTypes: true });
addFormats(ajv);
ajv.addSchema([shipmentSchema, shipmentListSchema, errorSchema]);

export interface SchemaResult {
  valid: boolean;
  errors: string[];
}

/** Validates data against a named contract schema and returns readable error lines. */
export function validateSchema(name: SchemaName, data: unknown): SchemaResult {
  const validate = ajv.getSchema(name);
  if (!validate) throw new Error(`Unknown schema ${name}`);
  const valid = validate(data) as boolean;
  const errors = (validate.errors ?? []).map(
    (e) =>
      `${e.instancePath || '(root)'} ${e.message ?? 'is invalid'}${e.params ? ` ${JSON.stringify(e.params)}` : ''}`,
  );
  return { valid, errors };
}
