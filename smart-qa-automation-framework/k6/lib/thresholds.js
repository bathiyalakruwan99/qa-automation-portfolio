// Thresholds turn a k6 run into a pass/fail check. Each one states WHY it exists.
// Numbers are starting points for a local demo app, not production SLAs: re-baseline them
// from measured runs of the real system before trusting them.

export const thresholds = {
  // Errors matter more than speed: under 1% of requests may fail. A fast API that errors is broken.
  http_req_failed: ['rate<0.01'],

  // p95 = what almost every user experiences; p99 catches the slow tail that averages hide.
  http_req_duration: ['p(95)<500', 'p(99)<1000'],

  // Functional checks inside the load script (status codes, body shape) must keep passing under load.
  checks: ['rate>0.99'],

  // Writes are usually the first to degrade, so they get their own budget.
  'http_req_duration{op:create}': ['p(95)<800'],
};

/** Stress runs look for the breaking point, so only errors are enforced; latency is observed. */
export const stressThresholds = {
  http_req_failed: ['rate<0.05'],
  checks: ['rate>0.95'],
};
