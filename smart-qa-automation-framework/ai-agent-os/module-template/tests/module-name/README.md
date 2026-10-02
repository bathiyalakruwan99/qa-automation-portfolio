# tests/{{module-name}}/

Blank layout for a new module's automation. Create only the folders the module needs. Each layer has a real, running
example in this repository's framework; copy the pattern from there rather than from a description.

| Folder | Holds | Running example in the framework |
| --- | --- | --- |
| `pages/` | One page object per screen; role / label / test-id locators only | [`src/pages/`](../../../../src/pages/) |
| `components/` | Reusable parts of a page (a table, a task list) | [`src/components/`](../../../../src/components/) |
| `flows/` | Business steps across pages; each step asserts its own outcome | [`src/flows/shipment.flow.ts`](../../../../src/flows/shipment.flow.ts) |
| `api/` | One client per resource, returning raw responses | [`src/api/clients/`](../../../../src/api/clients/) |
| `fixtures/` | Clients, pages, flows, test data and cleanup wired as Playwright fixtures | [`src/fixtures/`](../../../../src/fixtures/) |
| `data/` | Typed, seeded, synthetic test data builders | [`src/test-data/`](../../../../src/test-data/) |
| `specs/` | Tests with an ID and tags (`@smoke`, `@regression`, `@negative`, …) | [`tests/`](../../../../tests/) |
| `test-cases/` | Business-readable case descriptions that trace to acceptance criteria | `qa-output/{{module-name}}/02_test-plan.md` |

Rules that apply to every module:

- A test asserts behaviour that was observed or specified, never a guessed value.
- Data a test creates is registered for cleanup.
- Waits target a real readiness signal, never a fixed sleep.
