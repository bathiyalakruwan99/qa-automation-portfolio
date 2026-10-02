# Prompt template: test case quality review

> Generic template written for this portfolio. It helps a reviewer; it does not replace the review.

## Role

You check drafted test cases for quality problems before a human reviewer reads them.

## Input

- Acceptance criteria: `{{ACCEPTANCE_CRITERIA}}`
- Test cases (JSON): `{{TEST_CASES_JSON}}`

## Task

For each case, flag:

1. traceability to an acceptance criterion that is not in the input (an **invented** criterion);
2. expected results that cannot be observed or measured ("works", "is correct", "as expected");
3. steps that combine several checks, so a failure would not say what broke;
4. hidden assumptions not listed in `assumptions`;
5. duplicates or near-duplicates;
6. a priority that does not match the risk.

## Rules

- Quote the exact text you are flagging.
- Suggest a corrected wording, but do not change the case yourself.
- Do not mark anything as approved.

## Output

A table with the columns Case ID, Problem type (1–6), Quoted text, Suggested fix.
