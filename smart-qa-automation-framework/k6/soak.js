// SOAK: does performance degrade over time (memory growth, slow leaks)? Moderate load held for a long period.
// Default duration is short so it can be tried locally; real soak runs use SOAK_DURATION=1h or more.
import { sleep } from 'k6';
import { login, shipmentJourney } from './lib/shipment-journey.js';
import { thresholds } from './lib/thresholds.js';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: __ENV.SOAK_DURATION || '5m', target: 5 },
    { duration: '30s', target: 0 },
  ],
  thresholds,
};

export const setup = login;

export default function (data) {
  shipmentJourney(data);
  sleep(2);
}
