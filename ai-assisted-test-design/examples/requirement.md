# REQ-UPLOAD-REEFER: Temperature for chilled shipments in bulk upload

> Fictional requirement written for this portfolio. It matches the demo
> [bulk upload validator](../../bulk-upload-validator/) so the drafted cases can be checked against real behaviour.

**As** a planner uploading shipments in bulk,
**I want** chilled (REEFER) shipments to carry a valid temperature,
**so that** they are never dispatched without temperature instructions.

## Acceptance criteria

- **AC-1:** A row with `vehicle_type` = `REEFER` and an empty `temperature_c` is rejected.
- **AC-2:** `temperature_c` must be a number from -25 to 8 °C inclusive.
- **AC-3:** A `TRUCK` or `VAN` row with a `temperature_c` value is accepted, with a warning that the value is ignored.
- **AC-4:** Every rejection names the row number and the column.

## Out of scope

- Temperature units other than °C.
- Temperature ranges per customer.
