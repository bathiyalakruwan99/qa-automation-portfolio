import { expectApiError, readJson } from '../../src/api/helpers/expect-response';
import type { Shipment, ShipmentList } from '../../src/api/models/shipment.types';
import { expect, test } from '../../src/fixtures/test';

test.describe('Shipment API', { tag: ['@api', '@regression'] }, () => {
  test(
    'API-001 create a valid shipment',
    { tag: '@smoke' },
    async ({ shipments, shipmentBuilder, cleanup }) => {
      const payload = shipmentBuilder.build({ customerId: 'CUSTOMER-ALPHA', vehicleType: 'TRUCK' });

      const created = await readJson<Shipment>(await shipments.create(payload), 201, 'shipment');
      cleanup.track(created.shipmentId);

      expect(created).toMatchObject({ ...payload, status: 'CREATED', vehicleId: null, tasks: [] });
      expect(created.history).toEqual([{ from: null, to: 'CREATED', at: created.createdAt }]);
    },
  );

  test(
    'API-002 reject a shipment without a customer',
    { tag: '@negative' },
    async ({ shipments, shipmentBuilder }) => {
      const { customerId: _omitted, ...payload } = shipmentBuilder.build();

      await expectApiError(await shipments.create(payload), 400, 'REQUIRED_FIELD', 'customerId');
    },
  );

  test(
    'API-003 reject an unsupported vehicle type',
    { tag: '@negative' },
    async ({ shipments, shipmentBuilder }) => {
      const payload = { ...shipmentBuilder.build(), vehicleType: 'BICYCLE' };

      await expectApiError(await shipments.create(payload), 400, 'UNSUPPORTED_VEHICLE_TYPE', 'vehicleType');
    },
  );

  test('API-004 retrieve a shipment by ID', { tag: '@smoke' }, async ({ shipments, createShipment }) => {
    const created = await createShipment();

    const fetched = await readJson<Shipment>(await shipments.get(created.shipmentId), 200, 'shipment');

    expect(fetched).toEqual(created);
  });

  test('API-005 move a shipment through allowed status changes', async ({ shipments, createShipment }) => {
    const created = await createShipment({ vehicleType: 'TRUCK', weightKg: 2500 });

    const assigned = await readJson<Shipment>(
      await shipments.assignVehicle(created.shipmentId, 'TRUCK-001'),
      200,
      'shipment',
    );
    expect(assigned).toMatchObject({ status: 'ASSIGNED', vehicleId: 'TRUCK-001' });

    const planned = await readJson<Shipment>(
      await shipments.changeStatus(created.shipmentId, 'ROUTE_PLANNED'),
      200,
      'shipment',
    );
    expect(planned.status).toBe('ROUTE_PLANNED');
    expect(planned.history.map((h) => h.to)).toEqual(['CREATED', 'ASSIGNED', 'ROUTE_PLANNED']);
  });

  test(
    'API-005b reject a direct jump to DELIVERED',
    { tag: '@negative' },
    async ({ shipments, createShipment }) => {
      const created = await createShipment();

      await expectApiError(
        await shipments.changeStatus(created.shipmentId, 'DELIVERED'),
        409,
        'ILLEGAL_TRANSITION',
        'status',
      );
      // The rejected request must not have changed anything.
      expect((await readJson<Shipment>(await shipments.get(created.shipmentId), 200)).status).toBe('CREATED');
    },
  );

  test('API-006 delete a test shipment', async ({ shipments, createShipment }) => {
    const created = await createShipment();

    await readJson(await shipments.delete(created.shipmentId), 204);

    await expectApiError(await shipments.get(created.shipmentId), 404, 'NOT_FOUND');
  });

  test(
    'API-007 reject missing and invalid authentication',
    { tag: '@negative' },
    async ({ anonymousApi, playwright, env, auth }) => {
      await expectApiError(await anonymousApi.get('/api/demo/shipments'), 401, 'UNAUTHORIZED');

      const forged = await playwright.request.newContext({
        baseURL: env.baseUrl,
        extraHTTPHeaders: { Authorization: 'Bearer demo-forged-token' },
      });
      await expectApiError(await forged.get('/api/demo/shipments'), 401, 'UNAUTHORIZED');
      await forged.dispose();

      await expectApiError(await auth.login(env.username, 'wrong-password'), 401, 'INVALID_CREDENTIALS');
    },
  );

  test('API-008 return 404 for an unknown shipment ID', { tag: '@negative' }, async ({ shipments }) => {
    await expectApiError(await shipments.get('DEMO-SHP-999999'), 404, 'NOT_FOUND');
    await expectApiError(await shipments.changeStatus('DEMO-SHP-999999', 'CANCELLED'), 404, 'NOT_FOUND');
  });

  test(
    'API-009 reject a duplicate reference',
    { tag: '@negative' },
    async ({ shipments, shipmentBuilder, createShipment }) => {
      const first = await createShipment();
      const duplicate = shipmentBuilder.build({ reference: first.reference });

      await expectApiError(await shipments.create(duplicate), 409, 'DUPLICATE_REFERENCE', 'reference');
    },
  );

  test('API-010 list responses match the contract schema', async ({ shipments, createShipment }) => {
    const created = await createShipment();

    const list = await readJson<ShipmentList>(
      await shipments.list({ q: created.reference }),
      200,
      'shipment-list',
    );

    expect(list.total).toBe(list.items.length);
    expect(list.items.map((s) => s.shipmentId)).toEqual([created.shipmentId]);
  });

  test(
    'API-011 enforce vehicle capacity at and above the limit',
    { tag: '@negative' },
    async ({ shipments, createShipment }) => {
      const exact = await createShipment({ vehicleType: 'VAN', weightKg: 1500 });
      const over = await createShipment({ vehicleType: 'VAN', weightKg: 1501 });

      await readJson<Shipment>(await shipments.assignVehicle(exact.shipmentId, 'VAN-001'), 200, 'shipment');
      await expectApiError(
        await shipments.assignVehicle(over.shipmentId, 'VAN-001'),
        422,
        'CAPACITY_EXCEEDED',
        'vehicleId',
      );
    },
  );
});
