// STRESS: where does degradation begin? Step load well past normal and watch latency and errors per stage.
import { sleep } from 'k6';
import { login, shipmentJourney } from './lib/shipment-journey.js';
import { stressThresholds } from './lib/thresholds.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 25 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: stressThresholds,
};

export const setup = login;

export default function (data) {
  shipmentJourney(data);
  sleep(0.5);
}
