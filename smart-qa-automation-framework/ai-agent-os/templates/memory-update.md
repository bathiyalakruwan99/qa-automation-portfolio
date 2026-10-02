# Template: QA memory update

> Blank template. Only verified, human-reviewed learnings enter QA memory. One sighting is a candidate, never a
> verified rule.

| Field | Value |
| --- | --- |
| Category | validation rule / flow / defect pattern / flaky area / test data |
| Title | {{short title}} |
| Module | {{module}} |
| Learning | {{what is true, in one or two sentences}} |
| Evidence | {{run IDs, trace or log paths, reply bodies}} |
| Reproduced | {{n of m runs, on which data shapes}} |
| Status | candidate / verified / superseded |
| Source of truth | observed in runs / stated by product owner (quote) |
| Reviewed by | {{name}} |
| Date | {{YYYY-MM-DD}} |

## How it will be reused

- {{e.g. a regression case to add, a check to run before similar work}}

## Rules

- A rule inferred from one data shape is marked `candidate` until it holds on every shape tested.
- A rule stated by the product owner is recorded verbatim, with who stated it and when.
- An entry that a later run contradicts is marked `superseded`, not deleted, with a link to the new evidence.
