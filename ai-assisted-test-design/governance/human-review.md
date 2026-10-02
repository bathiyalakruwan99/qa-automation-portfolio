# Human review governance

AI speeds up the first draft. It does not own any QA decision.

## Rules

1. **AI drafts. Human QA reviews. Human QA approves.**
2. **AI does not decide release readiness.** No AI output is a go/no-go decision.
3. **AI does not invent acceptance criteria.** Cases trace only to criteria stated in the requirement. A case that
   needs a missing criterion becomes an open question for the product owner.
4. **AI must state its uncertainty.** Assumptions, open questions and confidence are part of every case.
5. **An AI-generated case is not verified until a named human has reviewed it.** `reviewStatus: APPROVED` requires a
   reviewer and an `approve` decision on every case.
6. **Uncertainty is resolved before approval.** A low-confidence case or a case with open questions needs reviewer
   notes saying how it was resolved.
7. **Expected results are checked against real behaviour or a stated rule,** never against what the AI wrote.

Rules 3, 5 and 6, and coverage of every criterion, are enforced by
[`../tools/validate_cases.py`](../tools/validate_cases.py), so they cannot be skipped silently.

## Review checklist

- [ ] Every case traces to a stated acceptance criterion (no invented IDs)
- [ ] Every acceptance criterion has at least one case, including a negative or boundary case
- [ ] Expected results are observable and specific (codes, messages, values)
- [ ] Assumptions are listed and either confirmed or turned into open questions
- [ ] Boundaries are exact (at, just inside, just outside)
- [ ] Duplicates removed; priorities match risk
- [ ] Open questions answered by the product owner, with the answer recorded in review notes
- [ ] Reviewer name and decision recorded on every case
- [ ] `validate_cases.py` passes with no errors

## What happened in the example

`examples/ai-draft.json` was marked `APPROVED` by the drafter itself. The validator rejects it:

| Problem in the draft | Rule broken | Reviewer action |
| --- | --- | --- |
| TC-003 traces to `AC-9`, which does not exist (Fahrenheit conversion was never asked for) | 3 | Case rejected and removed |
| AC-4 (row and column in every rejection) had no case | Coverage | TC-006 added |
| AC-2 had a positive case only; no exact boundaries | Coverage | TC-005 boundary case added |
| TC-004 had an open question, no notes | 6 | Answer from the product owner recorded |
| `APPROVED` with no reviewer on any case | 5 | Every case reviewed and signed |

`examples/reviewed.json` is the result. Its expected results were checked against the demo bulk upload validator,
not taken from the draft.
