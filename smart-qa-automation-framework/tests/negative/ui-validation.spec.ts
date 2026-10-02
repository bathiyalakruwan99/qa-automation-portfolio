import { readJson } from '../../src/api/helpers/expect-response';
import type { Shipment, ShipmentList } from '../../src/api/models/shipment.types';
import { expect, test } from '../../src/fixtures/ui';

test.describe('UI negative and validation', { tag: ['@ui', '@negative', '@regression'] }, () => {
  test.describe('signed out', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('NEG-001 wrong password shows an error and stays on sign in', async ({ page, loginPage, env }) => {
      await loginPage.goto();
      await loginPage.login(env.username, 'not-the-password');

      await expect(loginPage.error).toHaveText('Invalid email or password');
      await expect(page).toHaveURL(/\/index\.html$/);
    });

    test('NEG-002 opening the list without signing in redirects to sign in', async ({ page }) => {
      await page.goto('/shipments.html');

      await expect(page).toHaveURL(/\/index\.html$/);
    });
  });

  test('NEG-003 missing weight is rejected and nothing is created', async ({
    shipmentsPage,
    shipmentBuilder,
    shipments,
  }) => {
    const form = { ...shipmentBuilder.build(), weightKg: '' as const };

    await shipmentsPage.goto();
    await shipmentsPage.fillCreateForm(form);
    await shipmentsPage.createButton.click();

    await expect(shipmentsPage.formError).toHaveText('weightKg is required and must be a number');
    const list = await readJson<ShipmentList>(await shipments.list({ q: form.reference }), 200);
    expect(list.total).toBe(0);
  });

  test('NEG-004 same origin and destination is rejected and nothing is created', async ({
    shipmentsPage,
    shipmentBuilder,
    shipments,
  }) => {
    const form = shipmentBuilder.build({ origin: 'CENTRAL-HUB', destination: 'CENTRAL-HUB' });

    await shipmentsPage.goto();
    await shipmentsPage.fillCreateForm(form);
    await shipmentsPage.createButton.click();

    await expect(shipmentsPage.formError).toHaveText('origin and destination must differ');
    const list = await readJson<ShipmentList>(await shipments.list({ q: form.reference }), 200);
    expect(list.total).toBe(0);
  });

  test('NEG-005 assigning an over-capacity vehicle shows an error and keeps the status', async ({
    shipmentDetailPage,
    createShipment,
    shipments,
  }) => {
    // REEFER-001 holds 8000 kg, so a 9000 kg reefer shipment cannot be assigned to it.
    const shipment = await createShipment({ vehicleType: 'REEFER', weightKg: 9000 });

    await shipmentDetailPage.goto(shipment.shipmentId);
    await shipmentDetailPage.assignVehicle('REEFER-001');

    await expect(shipmentDetailPage.error).toHaveText('9000 kg exceeds REEFER-001 capacity of 8000 kg');
    await expect(shipmentDetailPage.status).toHaveText('CREATED');
    expect((await readJson<Shipment>(await shipments.get(shipment.shipmentId), 200)).status).toBe('CREATED');
  });
});
