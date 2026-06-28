# Test Case Planning Prompt (Example)

> Synthetic example for portfolio demonstration.

## Purpose

Produces a risk-based set of manual test cases from requirements, QA memory, and browser exploration evidence.

## Template

```txt
Read the requirement, relevant QA memory, and browser exploration notes.
Create risk-based manual test cases under tests/<module>/test-cases/.

Cover these categories:
- Smoke
- Happy path
- Negative
- Edge / boundary
- Permission / role
- Search / filter / sort
- Data persistence
- API / network
- Accessibility
- Responsive
- Regression

Mark each test case with:
- ID, title, priority
- Automation eligibility (yes/no/later)
- Preconditions
- Test data
- Steps
- Expected results
- Evidence required
- Automation notes
```

## Example Output (Synthetic)

See `module-template/tests/example-module/test-cases/TC-01.md` for a sample test case document.

## Confidentiality

Synthetic template. No private wording is copied.
