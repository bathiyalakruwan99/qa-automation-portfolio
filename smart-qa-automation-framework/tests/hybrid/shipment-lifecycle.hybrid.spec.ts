import { readJson } from '../../src/api/helpers/expect-response';
import type { Shipment, ShipmentList } from '../../src/api/models/shipment.types';
import { expect, test } from '../../src/fixtures/ui';

test.describe('API + UI hybrid', { tag: ['@hybrid', '@regression'] }, () => {
  test('HYBRID-001 shipment created by API is progressed in the UI and confirmed by API', async ({
    createShipment,
    shipments,
    shipmentsPage,
    shipmentFlow,
    shipmentDetailPage,
  }) => {
    // 1. API setup: fast, deterministic test data.
    const created = await createShipment({
      customerId: 'CUSTOMER-ALPHA',
      vehicleType: 'TRUCK',
      weightKg: 3200,
    });

    // 2. UI: the new shipment is visible in the list with the right status.
    await shipmentsPage.goto();
    await shipmentsPage.searchFor(created.reference);
    await expect(shipmentsPage.table.status(created.shipmentId)).toHaveText('CREATED');

    // 3. UI: change workflow state through the real screens.
    await shipmentsPage.openShipment(created.shipmentId);
    await shipmentDetailPage.waitUntilReady();
    await shipmentFlow.assignAndPlan('TRUCK-001');

    // 4. API: the server state matches what the UI showed.
    const afterUi = await readJson<Shipment>(await shipments.get(created.shipmentId), 200, 'shipment');
    expect(afterUi).toMatchObject({ status: 'ROUTE_PLANNED', vehicleId: 'TRUCK-001' });

    // 5. API changes state; the UI must present it after a reload (no stale client state).
    await readJson(await shipments.changeStatus(created.shipmentId, 'IN_TRANSIT'), 200, 'shipment');
    await shipmentDetailPage.goto(created.shipmentId);
    await expect(shipmentDetailPage.status).toHaveText('IN_TRANSIT');
    await expect(shipmentDetailPage.tasks.completeButton('LOADING')).toBeEnabled();
    await expect(shipmentDetailPage.tasks.completeButton('TRANSIT')).toBeDisabled();
    // 6. Cleanup: the createShipment fixture deletes the shipment after the test, pass or fail.
  });

  test('HYBRID-002 the UI list reconciles with the API for the same filter', async ({
    createShipment,
    shipments,
    shipmentsPage,
    shipmentBuilder,
  }) => {
    const tag = shipmentBuilder.nextReference('RECON');
    const ids = [];
    for (let i = 1; i <= 3; i++) ids.push((await createShipment({ reference: `${tag}-${i}` })).shipmentId);
    await readJson(await shipments.assignVehicle(ids[0] as string, 'TRUCK-001'), 200);

    const api = await readJson<ShipmentList>(await shipments.list({ q: tag }), 200, 'shipment-list');
    await shipmentsPage.goto();
    await shipmentsPage.searchFor(tag);

    await expect(shipmentsPage.table.rows).toHaveCount(api.total);
    for (const s of api.items) {
      await expect(shipmentsPage.table.status(s.shipmentId)).toHaveText(s.status);
      await expect(shipmentsPage.table.row(s.shipmentId)).toContainText(s.vehicleId ?? '—');
    }
    expect(api.items.map((s) => s.shipmentId).sort()).toEqual([...ids].sort());
  });
});
