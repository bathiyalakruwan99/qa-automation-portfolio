# Sample Failure Classification (Synthetic example for portfolio demonstration)

> Synthetic example. Not from any real run.

## Failure context

- Test: `dispatch.spec.ts > dispatcher can confirm dispatch`
- Run ID (fictional): `run-2026-06-28-001`
- Symptom: Dispatch confirmation dialog occasionally times out before the confirm button is enabled.

## Classification

| Dimension          | Verdict                                                             |
| ------------------ | ------------------------------------------------------------------- |
| Product defect     | No — application behavior is correct when given enough time         |
| Locator issue      | No — locator resolved correctly                                     |
| Timing issue       | Yes — confirm button enable state is asynchronous after API call    |
| Test data issue    | No                                                                  |
| Environment issue  | Partial — slower demo environment increased the asynchronous delay  |
| Requirement gap    | No                                                                  |

## Recommended safe action

- Replace fixed wait with deterministic state-based wait on the confirm button enabled state.
- Add evidence capture on timeout.
- Do not retry blindly.

## Required follow-up

- Confirm fix in next run.
- Memory Curator records a Locator Healing / Flaky Area learning if it remains stable for three consecutive runs.

## Confidentiality note

All references are fictional.
