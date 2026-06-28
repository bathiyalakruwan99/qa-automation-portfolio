# Smart QA Agent OS - Interactive Previews

Sanitized public HTML previews that visualise the architecture and the public demo-checkout-flow module as interactive force graphs.

> Synthetic demo example. Fictional product (`Acme Demo Store`). No private code, real selectors, customer data, internal screenshots, or proprietary workflows are included.

## Files

| File | What it shows |
| --- | --- |
| [`preview.htm`](preview.htm) | Index page that links to the other previews |
| [`actual-flow-preview.html`](actual-flow-preview.html) | End-to-end demo checkout flow as a force graph (pages, sub-flows, assertions, evidence) |
| [`page-object-spec-data-preview.html`](page-object-spec-data-preview.html) | Relationships between page objects, components, specs, selectors, data, fixtures, and flows, with filters per layer |
| [`memory-tabs-preview.html`](memory-tabs-preview.html) | Tabbed view of the 17 QA memory categories with synthetic example entries |
| [`reuse-flow-preview.html`](reuse-flow-preview.html) | Reuse force graph showing which sub-flows, fixtures, components, and utilities are reused across specs |

## How to view

These are static HTML files. Open any of them directly in a browser, or open `preview.htm` for the index.

The pages load [vis-network](https://github.com/visjs/vis-network) from a public CDN.

## Public Showcase Boundary

Architecture and workflow showcase only. The previews do not run any private system, do not expose private selectors or memory content, and do not represent real customer workflows.
