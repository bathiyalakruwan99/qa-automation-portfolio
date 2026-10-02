import type { APIRequestContext, APIResponse } from '@playwright/test';

export type DemoFault = 'STUCK_TASK' | 'UNKNOWN_STATE';

/** Test-only hooks of the demo app (available when it runs with DEMO_TEST_MODE=1). */
export class TestSupportClient {
  constructor(private readonly request: APIRequestContext) {}

  reset(): Promise<APIResponse> {
    return this.request.post('/api/test/reset');
  }

  injectFault(shipmentId: string, fault: DemoFault): Promise<APIResponse> {
    return this.request.post('/api/test/faults', { data: { shipmentId, fault } });
  }
}
