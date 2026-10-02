import type { TestInfo } from '@playwright/test';
import { readJson } from '../../src/api/helpers/expect-response';
import type { Shipment } from '../../src/api/models/shipment.types';
import { expect, test } from '../../src/fixtures/ui';
import { ShipmentUiDriver } from '../../src/state-engine/shipment-driver';
import { type EvidenceEntry, WorkflowStop } from '../../src/state-engine/stop-reasons';
import { WorkflowEngine } from '../../src/state-engine/workflow-engine';

async function attachEvidence(testInfo: TestInfo, evidence: readonly EvidenceEntry[], extra: object = {}) {
  await testInfo.attach('workflow-evidence.json', {
    body: JSON.stringify({ ...extra, evidence }, null, 2),
    contentType: 'application/json',
  });
}

async function expectStop(engine: WorkflowEngine): Promise<WorkflowStop> {
  const error = await engine.run().then(
    () => null,
    (e: unknown) => e,
  );
  expect(error, 'the engine should have stopped').toBeInstanceOf(WorkflowStop);
  return error as WorkflowStop;
}

test.describe('State-driven workflow engine', { tag: ['@diagnostic', '@regression'] }, () => {
  test('ENGINE-001 drives a new shipment to DELIVERED from its live state', async ({
    createShipment,
    shipments,
    shipmentDetailPage,
  }, testInfo) => {
    const shipment = await createShipment({ vehicleType: 'VAN', weightKg: 700 });
    const driver = new ShipmentUiDriver(shipment.shipmentId, shipments, shipmentDetailPage, 'VAN-001');

    const result = await new WorkflowEngine(driver, { deadlineMs: 25_000 }).run();
    await attachEvidence(testInfo, result.evidence, { shipmentId: shipment.shipmentId });

    expect(result.outcome).toBe('COMPLETED');
    expect(result.evidence.map((e) => e.task)).toEqual([
      'ASSIGN_VEHICLE',
      'PLAN_ROUTE',
      'START_JOURNEY',
      'CARGO_LOADING',
      'IN_TRANSIT',
      'CARGO_UNLOADING',
    ]);
    expect((await readJson<Shipment>(await shipments.get(shipment.shipmentId), 200)).status).toBe(
      'DELIVERED',
    );
  });

  test('ENGINE-002 resumes a shipment that is already part-way through', async ({
    createShipment,
    shipments,
    shipmentDetailPage,
  }, testInfo) => {
    const shipment = await createShipment();
    // Advance by API to mid-journey, as if an earlier run or a user had stopped there.
    await readJson(await shipments.assignVehicle(shipment.shipmentId, 'TRUCK-001'), 200);
    await readJson(await shipments.changeStatus(shipment.shipmentId, 'ROUTE_PLANNED'), 200);
    await readJson(await shipments.changeStatus(shipment.shipmentId, 'IN_TRANSIT'), 200);
    await readJson(await shipments.completeTask(shipment.shipmentId, 'LOADING'), 200);

    const driver = new ShipmentUiDriver(shipment.shipmentId, shipments, shipmentDetailPage, 'TRUCK-001');
    const result = await new WorkflowEngine(driver).run();
    await attachEvidence(testInfo, result.evidence);

    expect(result.evidence.map((e) => e.task)).toEqual(['IN_TRANSIT', 'CARGO_UNLOADING']);
    expect(result.finalState.status).toBe('DELIVERED');
  });

  test('ENGINE-003 stops at the requested point with stopWhen', async ({
    createShipment,
    shipments,
    shipmentDetailPage,
  }) => {
    const shipment = await createShipment();
    const driver = new ShipmentUiDriver(shipment.shipmentId, shipments, shipmentDetailPage, 'TRUCK-001');

    const result = await new WorkflowEngine(driver, { stopWhen: (s) => s.status === 'IN_TRANSIT' }).run();

    expect(result.outcome).toBe('STOPPED_BY_CONDITION');
    expect((await readJson<Shipment>(await shipments.get(shipment.shipmentId), 200)).status).toBe(
      'IN_TRANSIT',
    );
  });

  test('ENGINE-004 reports a stall instead of forcing completion', async ({
    createShipment,
    shipments,
    shipmentDetailPage,
    testSupport,
  }, testInfo) => {
    const shipment = await createShipment();
    const driver = new ShipmentUiDriver(shipment.shipmentId, shipments, shipmentDetailPage, 'TRUCK-001');
    // Run to IN_TRANSIT, then make the app accept task completions without changing anything.
    await new WorkflowEngine(driver, { stopWhen: (s) => s.status === 'IN_TRANSIT' }).run();
    await readJson(await testSupport.injectFault(shipment.shipmentId, 'STUCK_TASK'), 200);

    const stop = await expectStop(new WorkflowEngine(driver, { stallChecks: 3, stallIntervalMs: 200 }));
    await attachEvidence(testInfo, stop.evidence, { stop: stop.reason, message: stop.message });

    expect(stop.reason).toBe('STALLED');
    expect(stop.evidence).toHaveLength(1);
    expect(stop.evidence[0]).toMatchObject({ task: 'CARGO_LOADING', outcome: 'stalled' });
    // Nothing was forced: the shipment is still in transit with every task pending.
    const after = await readJson<Shipment>(await shipments.get(shipment.shipmentId), 200);
    expect(after.status).toBe('IN_TRANSIT');
    expect(after.tasks.every((t) => t.status === 'PENDING')).toBe(true);
  });

  test('ENGINE-005 refuses to act on an undocumented state', async ({
    createShipment,
    shipments,
    shipmentDetailPage,
    testSupport,
  }, testInfo) => {
    const shipment = await createShipment();
    await readJson(await testSupport.injectFault(shipment.shipmentId, 'UNKNOWN_STATE'), 200);
    const driver = new ShipmentUiDriver(shipment.shipmentId, shipments, shipmentDetailPage, 'TRUCK-001');

    const stop = await expectStop(new WorkflowEngine(driver));
    await attachEvidence(testInfo, stop.evidence, { stop: stop.reason, message: stop.message });

    expect(stop.reason).toBe('UNKNOWN_STATE');
    expect(stop.message).toContain('ON_HOLD');
    expect(stop.evidence).toEqual([]);
    // The UI also refuses: every action is disabled for a status it does not know.
    await shipmentDetailPage.goto(shipment.shipmentId);
    await expect(shipmentDetailPage.status).toHaveText('ON_HOLD');
    await expect(shipmentDetailPage.action('Assign vehicle')).toBeDisabled();
  });
});
