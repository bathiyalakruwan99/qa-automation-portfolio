// LOAD: does expected normal traffic stay within thresholds? Ramp up, hold, ramp down.
import { sleep } from 'k6';
import { login, shipmentJourney } from './lib/shipment-journey.js';
import { thresholds } from './lib/thresholds.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '15s', target: 0 },
  ],
  thresholds,
};

export const setup = login;

export default function (data) {
  shipmentJourney(data);
  sleep(1);
}
