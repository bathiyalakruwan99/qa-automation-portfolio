// SMOKE: does the system respond correctly under minimal load? Run first; if it fails, nothing else matters.
import { sleep } from 'k6';
import { login, shipmentJourney } from './lib/shipment-journey.js';
import { thresholds } from './lib/thresholds.js';

export const options = {
  vus: 1,
  duration: __ENV.DURATION || '20s',
  thresholds,
};

export const setup = login;

export default function (data) {
  shipmentJourney(data);
  sleep(1);
}
