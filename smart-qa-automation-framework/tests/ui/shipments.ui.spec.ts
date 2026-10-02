import { readJson } from '../../src/api/helpers/expect-response';
import type { Shipment } from '../../src/api/models/shipment.types';
import { expect, test } from '../../src/fixtures/ui';

test.describe('Shipments UI', { tag: ['@ui', '@regression'] }, () => {
  test.describe('signed out', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('UI-001 sign in opens the shipment list', { tag: '@smoke' }, async ({ page, loginPage, env }) => {
      await loginPage.goto();
      await loginPage.login(env.username, env.password);

      await expect(page).toHaveURL(/\/shipments\.html$/);
      await expect(page.getByRole('heading', { name: 'Shipments', level: 1 })).toBeVisible();
    });
  });

  test(
    'UI-002 create a shipment from the form',
    { tag: '@smoke' },
    async ({ shipmentsPage, shipmentBuilder, shipments, cleanup }) => {
      const form = shipmentBuilder.build({ customerId: 'CUSTOMER-BETA', vehicleType: 'VAN', weightKg: 900 });

      await shipmentsPage.goto();
      const id = cleanup.track(await shipmentsPage.createShipment(form));

      await expect(shipmentsPage.table.row(id)).toContainText(form.reference);
      await expect(shipmentsPage.table.row(id)).toContainText('Customer Beta');
      await expect(shipmentsPage.table.status(id)).toHaveText('CREATED');
      // The UI claimed success; confirm the server stored exactly what was entered.
      expect(await readJson<Shipment>(await shipments.get(id), 200, 'shipment')).toMatchObject({ ...form });
    },
  );

  test('UI-003 search narrows the list to matching shipments', async ({ shipmentsPage, createShipment }) => {
    const target = await createShipment();
    const other = await createShipment();

    await shipmentsPage.goto();
    await shipmentsPage.searchFor(target.reference);

    await expect(shipmentsPage.table.row(target.shipmentId)).toBeVisible();
    await expect(shipmentsPage.table.row(other.shipmentId)).toHaveCount(0);

    await shipmentsPage.searchFor('NO-SUCH-REFERENCE-XYZ');
    await expect(shipmentsPage.emptyState).toBeVisible();
  });

  test('UI-004 deliver and close a shipment through the journey', async ({
    shipmentFlow,
    createShipment,
    shipments,
  }) => {
    const shipment = await createShipment({ vehicleType: 'TRUCK', weightKg: 4000 });

    await shipmentFlow.deliver(shipment.shipmentId, 'TRUCK-002');
    await shipmentFlow.close();

    const final = await readJson<Shipment>(await shipments.get(shipment.shipmentId), 200, 'shipment');
    expect(final.history.map((h) => h.to)).toEqual([
      'CREATED',
      'ASSIGNED',
      'ROUTE_PLANNED',
      'IN_TRANSIT',
      'DELIVERED',
      'CLOSED',
    ]);
    expect(final.tasks.every((t) => t.status === 'DONE')).toBe(true);
  });

  test('UI-005 only actions valid for the current status are enabled', async ({
    shipmentDetailPage,
    createShipment,
  }) => {
    const shipment = await createShipment();

    await shipmentDetailPage.goto(shipment.shipmentId);

    await expect(shipmentDetailPage.status).toHaveText('CREATED');
    await expect(shipmentDetailPage.action('Assign vehicle')).toBeEnabled();
    await expect(shipmentDetailPage.action('Cancel shipment')).toBeEnabled();
    for (const name of ['Plan route', 'Start journey', 'Close shipment'] as const) {
      await expect(shipmentDetailPage.action(name)).toBeDisabled();
    }
  });
});
