# 00 - Blockers and Missing Details

> Synthetic example. Fictional `example-module`.

## Blockers

| ID | Description | Owner | Status |
| --- | --- | --- | --- |
| B-01 | Demo payment gateway returns 500 on `Express` shipping | Backend | Open |

## Missing Details

| ID | Question | Asked of | Status |
| --- | --- | --- | --- |
| Q-01 | Should coupon apply before or after shipping fee? | Product | Awaiting answer |
| Q-02 | Is order id format documented? | API team | Awaiting answer |

## Risks of Proceeding Without Answers

- May produce tests that lock in the wrong behaviour.
- May misclassify a defect as expected behaviour.
