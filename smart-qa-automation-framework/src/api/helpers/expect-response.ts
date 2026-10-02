import { type APIResponse, expect } from '@playwright/test';
import type { ApiErrorBody } from '../models/error.types';
import { summarize } from './redact';
import { type SchemaName, validateSchema } from './schema-validator';

async function body(response: APIResponse): Promise<unknown> {
  if (response.status() === 204) return null;
  const text = await response.text();
  try {
    return text === '' ? null : JSON.parse(text);
  } catch {
    return text;
  }
}

function where(response: APIResponse): string {
  const url = new URL(response.url());
  return `${url.pathname}${url.search}`;
}

/**
 * Asserts the status (and optionally the contract schema) and returns the parsed body.
 * Failure messages carry only the path, status and a redacted body summary.
 */
export async function readJson<T>(
  response: APIResponse,
  expectedStatus: number,
  schema?: SchemaName,
): Promise<T> {
  const parsed = await body(response);
  expect(
    response.status(),
    `${where(response)} returned ${response.status()} (expected ${expectedStatus}): ${summarize(parsed)}`,
  ).toBe(expectedStatus);
  if (schema) {
    const result = validateSchema(schema, parsed);
    expect(result.errors, `${where(response)} does not match the "${schema}" schema`).toEqual([]);
  }
  return parsed as T;
}

/** Asserts a contract-conformant error response with a specific status and code. */
export async function expectApiError(
  response: APIResponse,
  expectedStatus: number,
  expectedCode: string,
  expectedField?: string,
): Promise<ApiErrorBody> {
  const error = await readJson<ApiErrorBody>(response, expectedStatus, 'error');
  expect(error.error.code, `${where(response)} error code`).toBe(expectedCode);
  if (expectedField !== undefined)
    expect(error.error.field, `${where(response)} error field`).toBe(expectedField);
  return error;
}
