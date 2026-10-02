import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 20 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://reqres.in/api';

export default function () {
  const res = http.get(`${BASE_URL}/users?page=1`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
