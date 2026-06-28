docs(portfolio): add Smart QA Agent OS architecture and supporting sample directories

Add a public, sanitized AI QA Operating Model showcase under the existing
Smart QA Agent OS area, plus supporting sample directories that mirror the
private system's folder structure with synthetic content. The showcase is
architecture-only. It does not expose private prompts, source files,
customer data, rule wording, memory content, real selectors, internal tool
names, or proprietary workflows.

What this adds:

- smart-qa-agent-os/ai-qa-operating-model.md
    Layered architecture, end-to-end orchestration, continuous-learning
    loop, evidence-first model, and public showcase boundary.

- smart-qa-agent-os/docs/agents-catalog.md
    34 capability-level specialised QA agents grouped into six categories:
    Orchestration/Strategy, Discovery/Understanding, Test Design/Automation,
    Execution/Investigation/Healing, Reporting/Documentation/Release,
    Learning/Memory. Each card describes purpose, input, output, QA value,
    shared skills used, rules followed, and memory interaction.

- smart-qa-agent-os/docs/agent-workflow-matrix.md
    Stage-by-stage matrix mapping QA stages to primary agent groups and
    example outputs.

- smart-qa-agent-os/docs/shared-skills.md
    13 shared QA skill groups with a Mermaid diagram.

- smart-qa-agent-os/docs/rules-guardrails.md
    14 quality rule categories with a Mermaid guardrail diagram and runtime
    enforcement points.

- smart-qa-agent-os/docs/qa-memory.md
    17-category continuous QA memory architecture with curation principles
    and a run-to-release Mermaid loop.

- smart-qa-agent-os/docs/example-agent-journey.md
    Fictional Northstar Retail order-dispatch journey through the full
    QA agent pipeline.

- smart-qa-agent-os/docs/smart-qa-agent-os-demo-script.md
    60-90 second portfolio walkthrough script with on-screen disclaimer.

- smart-qa-agent-os/manual-knowledge/
    Sanitized manual QA notes for a fictional Acme Demo Store checkout:
    - checkout-flow.manual.md
    - checkout-test-plan.manual.md
    - checkout-test-data.manual.md
    - checkout-locator-knowledge.md
    - checkout-selectors.manual.md
    - coupon-rules.manual.md

- smart-qa-agent-os/module-template/
    Reusable scaffold for adding a new business workflow with parallel
    tests/ and qa-output/ trees. Includes sample POM, API client, BDD
    feature, steps, spec, fixtures, test data, test case, component,
    and numbered QA output templates.

- smart-qa-agent-os/prompts/
    6 sanitized prompt templates: master orchestration, test case planning,
    BDD/POM automation, execution and healing, memory update, and manual
    bug hunt.

- smart-qa-agent-os/qa-graph-tool/
    Architecture overview and sample docker-compose.yml for a local
    visualization tool that renders the operating model as an interactive
    graph.

- smart-qa-agent-os/qa-output/
    Sample module-level QA outputs for a fictional demo-store-checkout:
    - 00_setup-and-readiness-check.md
    - 00_blockers-and-missing-details.md
    - 01_user-story-analysis.md
    - 02_test-plan.md
    - 03_exploratory-testing-results.md
    - 08_final-test-execution-report.md
    - defects/BUG-DEMO-001.md, BUG-DEMO-002.md
    - run-notes/2026-06-15-demo-checkout-run.md
    - skill-agent-reports/2026-06-15.md
    - dom-captures/selector-evidence.md, selector-recommendations.md
    - playwright-results.json (sanitized)

- smart-qa-agent-os/scripts/
    5 sample utility scripts: check-no-secrets.js, clean-qa-output.js,
    run-postman-newman.js, run-with-memory.js, create-skill-agent-report.js.

- smart-qa-agent-os/sample-artifacts/
    7 synthetic sample artifacts: test plan, BDD scenario, API validation
    result, release gate report, failure classification, memory update,
    evidence summary.

- smart-qa-agent-os/README.md
    Adds AI QA Operating Model section with navigation, repository
    structure table, supporting directories navigation, and expanded
    confidentiality note.

- README.md
    Updates the Smart QA Agent OS section to link to all supporting
    directories.

- PROJECTS.md
    Updates the Smart QA Agent OS entry with links to all supporting
    directories.

Confidentiality:

- No private agent prompts, droid filenames, internal codenames, or
  private memory content are copied.
- No customer data, real selectors, internal product names, real endpoints,
  credentials, or proprietary workflows are exposed.
- All examples use fictional names (Acme Demo Store, Northstar Retail,
  TRK-101, DEMO-ORD-1001, Central Warehouse, Lakeview Store, Vehicle-001,
  Warehouse A, JOB-1001, WELCOME10, BUG-DEMO-001) and are clearly labelled
  as synthetic for portfolio demonstration.

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>
