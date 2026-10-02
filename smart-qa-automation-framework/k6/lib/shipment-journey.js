// One user journey against the Northstar Logistics demo API, shared by every k6 scenario.
import http from 'k6/http';
import { check, group } from 'k6';

export const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3000';

// Refuse non-local targets unless explicitly allowed: load tests must never hit a system you do not own.
const host = BASE_URL.replace(/^https?:\/\//, '').split(/[:/]/)[0];
if (!['127.0.0.1', 'localhost'].includes(host) && __ENV.ALLOW_EXTERNAL_TARGET !== '1') {
  throw new Error(`Refusing to load-test ${BASE_URL}. Set ALLOW_EXTERNAL_TARGET=1 only for a target you own.`);
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** k6 setup(): log in once and share the token with all virtual users. */
export function login() {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: __ENV.DEMO_USERNAME || 'demo.user@example.test',
      password: __ENV.DEMO_PASSWORD || 'demo-password',
    }),
    { headers: JSON_HEADERS, tags: { op: 'login' } },
  );
  if (res.status !== 200) throw new Error(`Demo login failed with HTTP ${res.status}; is the demo app running?`);
  return { token: res.json('token') };
}

/** Create -> read -> list -> delete. Every created shipment is deleted, so runs leave no data behind. */
export function shipmentJourney(data) {
  const headers = { ...JSON_HEADERS, Authorization: `Bearer ${data.token}` };
  const reference = `K6-${__VU}-${__ITER}-${Date.now() % 1e6}`;

  group('shipment journey', () => {
    const created = http.post(
      `${BASE_URL}/api/demo/shipments`,
      JSON.stringify({
        reference,
        customerId: 'CUSTOMER-ALPHA',
        vehicleType: 'TRUCK',
        origin: 'WAREHOUSE-ALPHA',
        destination: 'CUSTOMER-SITE-BETA',
        weightKg: 1200,
      }),
      { headers, tags: { op: 'create' } },
    );
    const ok = check(created, {
      'create: 201': (r) => r.status === 201,
      'create: has id': (r) => /^DEMO-SHP-\d+$/.test(r.json('shipmentId') || ''),
    });
    if (!ok) return;
    const id = created.json('shipmentId');

    check(http.get(`${BASE_URL}/api/demo/shipments/${id}`, { headers, tags: { op: 'read' } }), {
      'read: 200': (r) => r.status === 200,
      'read: same reference': (r) => r.json('reference') === reference,
    });

    check(http.get(`${BASE_URL}/api/demo/shipments?q=${reference}`, { headers, tags: { op: 'list' } }), {
      'list: 200': (r) => r.status === 200,
      'list: found once': (r) => r.json('total') === 1,
    });

    check(http.del(`${BASE_URL}/api/demo/shipments/${id}`, null, { headers, tags: { op: 'delete' } }), {
      'delete: 204': (r) => r.status === 204,
    });
  });
}
