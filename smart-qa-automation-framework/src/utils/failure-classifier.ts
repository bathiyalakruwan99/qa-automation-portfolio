export const FAILURE_CATEGORIES = [
  'PRODUCT_DEFECT',
  'TEST_DEFECT',
  'LOCATOR_CHANGE',
  'TIMING',
  'TEST_DATA',
  'ENVIRONMENT',
  'NETWORK',
  'REQUIREMENT_GAP',
  'UNKNOWN',
] as const;
export type FailureCategory = (typeof FAILURE_CATEGORIES)[number];

export interface FailureInput {
  message: string;
  stack?: string;
}

export interface Classification {
  classification: FailureCategory;
  reason: string;
  recommendedAction: string;
  /** Which rule matched; "fallback" when none did. */
  rule: string;
  /** Automated triage is a suggestion. A human confirms it from the trace before acting. */
  confirmed: false;
}

interface Rule {
  name: string;
  test: (text: string) => boolean;
  classification: FailureCategory;
  reason: string;
  recommendedAction: string;
}

const has = (re: RegExp) => (text: string) => re.test(text);

/** Ordered: the first matching rule wins, so the most specific evidence is checked first. */
const RULES: readonly Rule[] = [
  {
    name: 'unsafe-target',
    test: has(/UnsafeTargetError|Refusing to run against/),
    classification: 'ENVIRONMENT',
    reason: 'The configured base URL is not an allowed local/test host',
    recommendedAction: 'Fix DEMO_BASE_URL; do not bypass the guard for systems you do not own',
  },
  {
    name: 'connection-refused',
    test: has(/ECONNREFUSED|Demo store reset failed|net::ERR_CONNECTION_REFUSED/),
    classification: 'ENVIRONMENT',
    reason: 'The system under test was not reachable or not in test mode',
    recommendedAction: 'Check the demo app started (webServer log) and DEMO_TEST_MODE=1; rerun once',
  },
  {
    name: 'network',
    test: has(/ENOTFOUND|ETIMEDOUT|ECONNRESET|socket hang up|net::ERR_/),
    classification: 'NETWORK',
    reason: 'A network-level error interrupted the request',
    recommendedAction: 'Rerun once; if it repeats, record it as flaky infrastructure with the run IDs',
  },
  {
    name: 'workflow-stalled',
    test: has(/\[(STALLED|UNEXPECTED_TRANSITION|MAX_ACTIONS)\]/),
    classification: 'PRODUCT_DEFECT',
    reason: 'The workflow accepted an action but did not progress as specified',
    recommendedAction: 'Candidate defect: confirm from workflow-evidence.json and the trace, then file it',
  },
  {
    name: 'workflow-unknown-state',
    test: has(/\[UNKNOWN_STATE\]/),
    classification: 'REQUIREMENT_GAP',
    reason: 'The system reported a state the documented workflow does not contain',
    recommendedAction: 'Ask product whether the state is valid; add a rule only after it is specified',
  },
  {
    name: 'workflow-terminal',
    test: has(/\[TERMINAL_STATE\]/),
    classification: 'TEST_DATA',
    reason: 'The test started from data that can never reach the goal',
    recommendedAction: 'Create fresh test data for the scenario instead of reusing a finished record',
  },
  {
    name: 'workflow-timeout',
    test: has(/\[TIMEOUT\]/),
    classification: 'TIMING',
    reason: 'The workflow did not finish within its deadline',
    recommendedAction: 'Compare step durations in the evidence; raise the deadline only with evidence',
  },
  {
    name: 'server-error',
    test: has(/returned 5\d\d \(expected/),
    classification: 'PRODUCT_DEFECT',
    reason: 'The server answered a request with a 5xx error',
    recommendedAction: 'Capture the request summary and server log; file a defect if it reproduces',
  },
  {
    name: 'contract-drift',
    test: has(/does not match the "[\w-]+" schema/),
    classification: 'PRODUCT_DEFECT',
    reason: 'A response no longer matches the contract schema',
    recommendedAction:
      'Diff the response against the schema; confirm whether the contract or the API changed',
  },
  {
    name: 'rule-not-enforced',
    test: has(/returned 2\d\d \(expected 4\d\d\)/),
    classification: 'PRODUCT_DEFECT',
    reason: 'A request that should have been rejected was accepted',
    recommendedAction: 'Candidate defect: a validation or business rule is not enforced',
  },
  {
    name: 'unexpected-client-error',
    test: has(/returned (404|409|422) \(expected 2\d\d\)/),
    classification: 'TEST_DATA',
    reason: 'A setup or lookup request failed on missing, duplicate or unsuitable data',
    recommendedAction: 'Check the referenced synthetic record exists and fits the scenario',
  },
  {
    name: 'strict-mode',
    test: has(/strict mode violation/),
    classification: 'TEST_DEFECT',
    reason: 'A locator matched more than one element',
    recommendedAction: 'Make the locator specific from a DOM snapshot; do not use .first() to hide it',
  },
  {
    name: 'locator-not-found',
    test: (t) =>
      /waiting for (getBy|locator)/.test(t) && /(element\(s\) not found|resolved to 0 elements)/.test(t),
    classification: 'LOCATOR_CHANGE',
    reason: 'An expected element was not found on the page',
    recommendedAction: 'Compare the trace DOM with the locator; check whether the UI changed or never loaded',
  },
  {
    name: 'timeout',
    test: has(/Timeout \d+ms exceeded|Test timeout of \d+ms exceeded/),
    classification: 'TIMING',
    reason: 'An action or the test exceeded its timeout',
    recommendedAction: 'Find in the trace what the page was waiting on; wait for that state, not longer',
  },
  {
    name: 'test-code-error',
    test: has(/\b(TypeError|ReferenceError|SyntaxError)\b/),
    classification: 'TEST_DEFECT',
    reason: 'The test or framework code threw a programming error',
    recommendedAction: 'Fix the test code; add a unit test for the helper involved',
  },
];

export function classifyFailure(input: FailureInput): Classification {
  const text = `${input.message}\n${input.stack ?? ''}`;
  for (const rule of RULES) {
    if (rule.test(text)) {
      return {
        classification: rule.classification,
        reason: rule.reason,
        recommendedAction: rule.recommendedAction,
        rule: rule.name,
        confirmed: false,
      };
    }
  }
  return {
    classification: 'UNKNOWN',
    reason: 'No rule matched (e.g. a plain assertion mismatch, which can be product or test)',
    recommendedAction:
      'Triage from the trace: action vs request timeline, response bodies, state before/after',
    rule: 'fallback',
    confirmed: false,
  };
}
