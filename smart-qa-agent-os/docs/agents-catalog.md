# Specialised QA Agent Catalog

A public, architecture-level catalog of the specialised QA agents in the Smart QA Agent OS. Each card describes purpose, typical input, typical output, QA value, shared skills used, rules followed, and memory interaction.

> **Public Showcase Boundary.** This section presents the architecture and operating model only. It does not expose private agent prompts, source code, internal rules, private memory content, customer data, credentials, system endpoints, test selectors, proprietary workflows, or confidential automation assets.

Where multiple specialised implementations of the same capability exist privately (for example, several API-test builders for different platform layers), they are presented here under one public capability card. The agent count below describes capability-level roles, not internal file counts.

---

## A. Orchestration and Strategy Agents

### QA Router

**Purpose:** Understands the QA request, identifies the type of work needed, and routes it to the correct specialist agents.
**Typical input:** A requirement, change request, release scope, or failed-run signal.
**Typical output:** A routed plan that names which specialised agents will participate and in what order.
**QA value:** Removes "where do I even start" friction; keeps work consistent across releases.
**Uses:** Requirement-to-Test Design, QA Investigation.
**Governed by:** Evidence-First Verification, Documentation Rules.
**Memory interaction:** Reads Project, Module, and Flow memory; writes a Run note on routing decisions.

### QA Strategist

**Purpose:** Converts a requirement or release scope into a risk-based QA strategy.
**Typical input:** Acceptance criteria, dependencies, prior release memory.
**Typical output:** Coverage plan, risk list, priority matrix.
**QA value:** Focuses effort on the riskiest areas first.
**Uses:** Requirement-to-Test Design, Release and Regression Gate.
**Governed by:** Evidence-First Verification.
**Memory interaction:** Reads Known Bugs, Defect Pattern, Release memory.

### QA Test Architect

**Purpose:** Defines the test approach, coverage model, test layers, and reusable automation design.
**Typical input:** Strategy, modules in scope, integration points.
**Typical output:** Layered test plan (UI, API, hybrid, performance), reuse map.
**QA value:** Makes downstream automation maintainable and reduces duplication.
**Uses:** Playwright/BDD/POM Patterns, API-Only and Hybrid Validation, Performance Testing Patterns.
**Governed by:** Automation Quality Rules, BDD and POM Standards.
**Memory interaction:** Reads Automation, Flow, Page/Component memory.

### Smart QA Workbench

**Purpose:** Coordinates the overall QA workflow and keeps tasks organised from request to evidence.
**Typical input:** Active QA tasks, run results, blockers.
**Typical output:** Coordinated task list, status tracking, escalation hints.
**QA value:** Removes coordination overhead during busy release cycles.
**Uses:** Evidence and Reporting.
**Governed by:** Documentation Rules.
**Memory interaction:** Reads Run memory; writes Run notes.

### QA Worker Agent

**Purpose:** Handles scoped supporting tasks delegated by the orchestration layer (e.g. fetch, format, transform, summarise).
**Typical input:** A focused sub-task with clear boundaries.
**Typical output:** The sub-task's deliverable, attached to the parent task.
**QA value:** Frees specialist agents to focus on judgement work.
**Uses:** Any relevant skill the task requires.
**Governed by:** Evidence-First Verification.
**Memory interaction:** Reads as needed; rarely writes long-term memory.

### Continuous Learning Orchestrator

**Purpose:** Coordinates how verified QA learning is captured after a run or investigation.
**Typical input:** Run summaries, investigation outcomes.
**Typical output:** A queue of approved learnings ready for the Memory Curator.
**QA value:** Prevents knowledge loss between releases.
**Uses:** Memory Management.
**Governed by:** Continuous Learning Rules, Memory Quality Rules.
**Memory interaction:** Triggers Memory Curator updates.

### Release Manager

**Purpose:** Organises release-readiness inputs, validation status, risks, and communication needs.
**Typical input:** Run reports, defect status, risk list.
**Typical output:** Release-readiness package and stakeholder summary.
**QA value:** Makes go/hold conversations evidence-based and traceable.
**Uses:** Release and Regression Gate, Evidence and Reporting.
**Governed by:** Release Gate Rules.
**Memory interaction:** Reads and writes Release memory.

---

## B. Discovery and Understanding Agents

### Requirement Analyst

**Purpose:** Converts requirements, user stories, and change requests into testable acceptance criteria and risks.
**Typical input:** Ticket, design, written description.
**Typical output:** Acceptance criteria, risk list, open questions.
**QA value:** Removes ambiguity before any test is written.
**Uses:** Requirement-to-Test Design.
**Governed by:** Evidence-First Verification.
**Memory interaction:** Reads Glossary, Validation Rules, Module memory.

### Browser Knowledge Capture Agent

**Purpose:** Captures safe high-level knowledge about pages, workflows, UI structure, and observed behavior.
**Typical input:** A page or flow under test.
**Typical output:** A high-level page/flow note (no private selectors exposed publicly).
**QA value:** Builds long-term UI understanding for stable automation.
**Uses:** QA Investigation, Documentation and Knowledge Transfer.
**Governed by:** Locator-DOM Capture Rules.
**Memory interaction:** Writes Page/Component and Flow memory.

### Selector and DOM Capture Agent

**Purpose:** Supports locator and page-structure understanding for stable automation design without exposing private selectors publicly.
**Typical input:** A page that needs automation.
**Typical output:** Recommended stable identification strategy (role, label, test-id preferred).
**QA value:** Reduces flaky tests caused by brittle selectors.
**Uses:** Playwright/BDD/POM Patterns.
**Governed by:** Locator Stability Rules.
**Memory interaction:** Writes Locator Healing memory.

### Flow Mapper Agent

**Purpose:** Maps end-to-end user journeys, decision points, statuses, dependencies, and expected outcomes.
**Typical input:** A workflow or user journey.
**Typical output:** A flow map with stages, branches, and validations.
**QA value:** Makes coverage gaps and edge cases visible.
**Uses:** Requirement-to-Test Design.
**Governed by:** Documentation Rules.
**Memory interaction:** Writes Flow memory.

### Domain Explorer

**Purpose:** Explores domain workflows and translates business behavior into QA understanding.
**Typical input:** A domain area (operations, scheduling, billing, etc.).
**Typical output:** A domain note tied to QA risks and validations.
**QA value:** Aligns QA with business expectations.
**Uses:** Requirement-to-Test Design, QA Investigation.
**Governed by:** Documentation Rules.
**Memory interaction:** Reads/writes Module memory.

### Test Data Curator

**Purpose:** Identifies the data conditions required for positive, negative, edge-case, and regression testing.
**Typical input:** A scenario or feature in scope.
**Typical output:** A test-data matrix with cleanup notes.
**QA value:** Prevents false positives caused by missing or invalid data.
**Uses:** Test Data Management.
**Governed by:** Test Data Rules.
**Memory interaction:** Writes Test Data memory.

### Accessibility and Responsive QA Agent

**Purpose:** Reviews accessibility, layout, responsive behavior, usability risks, and device-view coverage.
**Typical input:** A page, component, or flow.
**Typical output:** Accessibility findings and device-coverage notes.
**QA value:** Catches inclusive-UX defects before release.
**Uses:** Accessibility and Responsive QA.
**Governed by:** Documentation Rules.
**Memory interaction:** Writes Page/Component memory.

### Security QA Auditor

**Purpose:** Identifies safe security validation areas such as authentication, access control, input handling, and data exposure risks.
**Typical input:** A feature or API in scope.
**Typical output:** Security validation checklist and risk note.
**QA value:** Catches common security defects early; never includes exploit payloads in public docs.
**Uses:** Security QA, API-Only and Hybrid Validation.
**Governed by:** Security and Sensitive Data Rules.
**Memory interaction:** Reads Defect Pattern memory; writes Known Bugs notes.

### API and Network QA Agent

**Purpose:** Reviews API behavior, network responses, request risks, error handling, and UI-to-API consistency.
**Typical input:** A network trace or API in scope.
**Typical output:** API observation note and risk list.
**QA value:** Catches contract and consistency defects faster than UI-only testing.
**Uses:** API-Only and Hybrid Validation.
**Governed by:** API Validation Rules.
**Memory interaction:** Writes API/Network memory.

---

## C. Test Design and Automation Agents

### Test Case Planning Agent

**Purpose:** Creates structured scenarios, test conditions, expected results, edge cases, and regression coverage.
**Typical input:** Acceptance criteria, flow map.
**Typical output:** A scenario list with positive, negative, boundary, and regression items.
**QA value:** Drives coverage consistency.
**Uses:** Requirement-to-Test Design.
**Governed by:** BDD and POM Standards.
**Memory interaction:** Reads Validation Rules and Flow memory.

### Playwright Automation Engineer

**Purpose:** Designs and implements browser automation using reusable patterns and evidence capture.
**Typical input:** Scenario list, page/flow map.
**Typical output:** A Playwright automation design with POM and fixtures.
**QA value:** Keeps automation maintainable as the product evolves.
**Uses:** Playwright/BDD/POM Patterns.
**Governed by:** Automation Quality Rules.
**Memory interaction:** Writes Automation memory.

### Playwright BDD and POM Builder

**Purpose:** Translates business flows into BDD scenarios, page objects, reusable steps, and maintainable automation structure.
**Typical input:** Scenario list, flow map.
**Typical output:** BDD feature files and matching POM design.
**QA value:** Makes tests readable for product owners and reusable for QA.
**Uses:** Playwright/BDD/POM Patterns.
**Governed by:** BDD and POM Standards.
**Memory interaction:** Writes Automation and Flow memory.

### Playwright Test Planner

**Purpose:** Plans automation candidates, prioritises coverage, and identifies what should remain manual.
**Typical input:** Scenario list, risk plan.
**Typical output:** Automation vs manual map.
**QA value:** Stops the team from automating low-value or unstable areas.
**Uses:** Playwright/BDD/POM Patterns, Release and Regression Gate.
**Governed by:** Automation Quality Rules.
**Memory interaction:** Reads Flaky Area memory.

### Playwright Test Generator

**Purpose:** Produces structured automation drafts from approved scenarios and architecture standards.
**Typical input:** Approved scenarios, POM and fixture standards.
**Typical output:** Draft automation skeletons aligned to the architecture.
**QA value:** Accelerates the boring parts; humans review before merge.
**Uses:** Playwright/BDD/POM Patterns.
**Governed by:** Automation Quality Rules, BDD and POM Standards.
**Memory interaction:** Reads Page/Component, Automation memory.

### API Test Builder (multiple specialised implementations)

**Purpose:** Designs API validation scenarios, including positive, negative, authentication, schema, and contract checks. Specialised variants exist for API-only flows, platform-level APIs, and contract diffs.
**Typical input:** Endpoint(s) in scope, sample payloads.
**Typical output:** Structured API test design with status, schema, and error coverage.
**QA value:** Catches contract defects without waiting for UI.
**Uses:** API-Only and Hybrid Validation.
**Governed by:** API Validation Rules.
**Memory interaction:** Reads/writes API/Network memory.

### Postman Test Builder

**Purpose:** Designs collection-based API validation workflows and reusable request/assertion patterns.
**Typical input:** Endpoints, environment expectations.
**Typical output:** A Postman collection design (concept only in the public showcase).
**QA value:** Makes API regression repeatable in CI via Newman.
**Uses:** Postman and Newman Patterns.
**Governed by:** API Validation Rules.
**Memory interaction:** Writes API/Network memory.

### Newman CI Reporting Agent

**Purpose:** Converts collection execution results into clear CI-ready summaries and report artifacts.
**Typical input:** Newman raw run output.
**Typical output:** HTML/Markdown summary suitable for stakeholders.
**QA value:** Makes API run results easy to read in PR / release reviews.
**Uses:** Evidence and Reporting, Postman and Newman Patterns.
**Governed by:** Documentation Rules.
**Memory interaction:** Writes Run memory.

### k6 Performance Suite Builder

**Purpose:** Designs smoke, load, stress, and soak-test structures for performance validation.
**Typical input:** Performance scope and thresholds.
**Typical output:** k6 scenario design with thresholds.
**QA value:** Catches regressions in latency and error rate before customers do.
**Uses:** Performance Testing Patterns.
**Governed by:** Automation Quality Rules.
**Memory interaction:** Reads Release memory.

### Performance Test Engineer

**Purpose:** Helps interpret performance behavior, bottlenecks, response patterns, and test-scope risks.
**Typical input:** k6 run output, baseline.
**Typical output:** Interpretation note and recommended actions.
**QA value:** Turns raw numbers into actionable QA conclusions.
**Uses:** Performance Testing Patterns, QA Investigation.
**Governed by:** Evidence-First Verification.
**Memory interaction:** Reads/writes Release memory.

### k6 Baseline Curator

**Purpose:** Maintains safe baseline expectations for performance comparison and trend analysis.
**Typical input:** Historical k6 runs.
**Typical output:** Baseline ranges with confidence levels.
**QA value:** Prevents flaky pass/fail by anchoring thresholds in data.
**Uses:** Performance Testing Patterns, Memory Management.
**Governed by:** Memory Quality Rules.
**Memory interaction:** Writes Release memory.

### Classic Workflow Test Builder

**Purpose:** Supports reusable automation design for complex multi-step operational workflows.
**Typical input:** A multi-stage business flow.
**Typical output:** Reusable workflow automation pattern.
**QA value:** Reduces duplication across long flows.
**Uses:** Playwright/BDD/POM Patterns.
**Governed by:** Automation Quality Rules, BDD and POM Standards.
**Memory interaction:** Writes Automation and Flow memory.

---

## D. Execution, Investigation, and Healing Agents

### End-to-End Runner

**Purpose:** Coordinates test execution, captures results, and records run outcomes.
**Typical input:** A test plan or run trigger.
**Typical output:** A run report with evidence artefacts.
**QA value:** Single source of truth for "what happened" on this run.
**Uses:** Evidence and Reporting.
**Governed by:** Evidence-First Verification.
**Memory interaction:** Writes Run memory.

### Manual Bug Hunter

**Purpose:** Performs exploratory and risk-based investigation to find functional, workflow, usability, and edge-case defects.
**Typical input:** A risk area or charter.
**Typical output:** Defect candidates with evidence and reproduction steps.
**QA value:** Catches what automation misses.
**Uses:** QA Investigation.
**Governed by:** Defect Reporting Rules, No Fake Verification.
**Memory interaction:** Reads Defect Pattern memory.

### Bug Pattern Miner

**Purpose:** Identifies repeated issue types, recurring failure patterns, high-risk areas, and regression candidates.
**Typical input:** Defect history, run results.
**Typical output:** Pattern note (e.g. "timeouts cluster around bulk-upload").
**QA value:** Directs the next release's regression scope.
**Uses:** Memory Management, QA Investigation.
**Governed by:** Memory Quality Rules.
**Memory interaction:** Writes Defect Pattern memory.

### Automation Healing Agent

**Purpose:** Investigates automation failures and classifies them (product / locator / timing / data / environment / requirement gap).
**Typical input:** A failed automation run.
**Typical output:** A structured classification and next action.
**QA value:** Stops flaky tests from being silently re-run forever.
**Uses:** QA Investigation, Playwright/BDD/POM Patterns.
**Governed by:** Automation Quality Rules, Locator Stability Rules.
**Memory interaction:** Reads Flaky Area; writes Locator Healing memory.

### Playwright Test Healer

**Purpose:** Supports structured recovery of failed browser tests using safe locator, timing, and flow-review methods.
**Typical input:** A failing Playwright test.
**Typical output:** Recommended safe fix or quarantine flag.
**QA value:** Keeps regression suites green without hiding real defects.
**Uses:** Playwright/BDD/POM Patterns.
**Governed by:** Locator Stability Rules.
**Memory interaction:** Writes Locator Healing memory.

### Locator Healing Agent

**Purpose:** Analyses locator stability and recommends safer identification strategies without exposing private selectors publicly.
**Typical input:** A flaky element or locator.
**Typical output:** Recommendation (role / label / test-id alternative).
**QA value:** Reduces flake at the root.
**Uses:** Playwright/BDD/POM Patterns.
**Governed by:** Locator-DOM Capture Rules.
**Memory interaction:** Writes Locator Healing memory.

### QA Code Reviewer

**Purpose:** Reviews automation changes for maintainability, correctness, readability, and QA standards.
**Typical input:** A pull request touching automation.
**Typical output:** Review comments tied to QA standards.
**QA value:** Keeps the test code healthy.
**Uses:** Playwright/BDD/POM Patterns, Documentation and Knowledge Transfer.
**Governed by:** Automation Quality Rules, BDD and POM Standards.
**Memory interaction:** Reads Automation memory.

### Code Reviewer

**Purpose:** Reviews supporting code changes for quality, risk, documentation, and test impact.
**Typical input:** Non-test code PR with QA implications.
**Typical output:** Review note flagging QA impact.
**QA value:** Catches QA-relevant risks before they merge.
**Uses:** Documentation and Knowledge Transfer.
**Governed by:** Documentation Rules.
**Memory interaction:** Reads Module and Validation Rules memory.

---

## E. Reporting, Documentation, and Release Agents

### Jira Defect Writer

**Purpose:** Converts verified findings into structured defect reports with clear reproduction, severity, evidence, and expected versus actual behavior.
**Typical input:** A verified defect candidate.
**Typical output:** A defect report ready for the tracker.
**QA value:** Removes ambiguity and back-and-forth with developers.
**Uses:** Evidence and Reporting.
**Governed by:** Defect Reporting Rules, No Fake Verification.
**Memory interaction:** Reads Run memory.

### Report Writer

**Purpose:** Produces test summaries, execution reports, evidence reports, and stakeholder-friendly quality updates.
**Typical input:** Run results, evidence.
**Typical output:** Stakeholder-readable QA summary.
**QA value:** Makes QA work visible and decision-ready.
**Uses:** Evidence and Reporting.
**Governed by:** Documentation Rules.
**Memory interaction:** Reads Run, Release memory.

### Release Gate Agent

**Purpose:** Evaluates evidence, test status, risks, blockers, known issues, and regression confidence to support release decisions.
**Typical input:** All release evidence.
**Typical output:** A clear recommendation (proceed / monitor / hold) with reasons.
**QA value:** Converts test data into a defensible release decision.
**Uses:** Release and Regression Gate, Evidence and Reporting.
**Governed by:** Release Gate Rules.
**Memory interaction:** Reads/writes Release memory.

### QA Documentation Maintainer

**Purpose:** Keeps public-safe QA documentation, process notes, and testing guidance current.
**Typical input:** New process or change in scope.
**Typical output:** Updated doc with version note.
**QA value:** Prevents knowledge loss and "stale doc" defects.
**Uses:** Documentation and Knowledge Transfer.
**Governed by:** Documentation Rules.
**Memory interaction:** Reads Glossary memory.

### Code Change Documentation Agent

**Purpose:** Explains QA impact when code or automation changes occur.
**Typical input:** A PR or change set.
**Typical output:** A QA-impact note appended to the PR.
**QA value:** Keeps QA in the loop on relevant changes automatically.
**Uses:** Documentation and Knowledge Transfer.
**Governed by:** Documentation Rules.
**Memory interaction:** Reads Module memory.

### Intern Knowledge Transfer Agent

**Purpose:** Creates structured learning material, examples, and QA onboarding guidance for team knowledge sharing.
**Typical input:** Onboarding scope.
**Typical output:** Structured learning path with public-safe examples.
**QA value:** Faster team ramp-up.
**Uses:** Documentation and Knowledge Transfer.
**Governed by:** Documentation Rules.
**Memory interaction:** Reads Learning memory.

---

## F. Learning and Memory Agents

### Memory Curator (with stronger-review variant)

**Purpose:** Reviews approved evidence and converts useful findings into reusable QA knowledge. A stronger-review variant applies extra quality checks before knowledge enters long-term QA memory.
**Typical input:** Approved learnings from runs and investigations.
**Typical output:** A memory update with source, evidence, confidence, and owner.
**QA value:** Keeps QA memory accurate, attributed, and useful.
**Uses:** Memory Management.
**Governed by:** Memory Quality Rules, Continuous Learning Rules.
**Memory interaction:** Writes to the appropriate memory category.

### Continuous Learning Orchestrator

(See Section A — also acts as the trigger that hands work to the Memory Curator.)

---

## Capability count

The public catalog above documents **34 capability-level QA agent roles** grouped into six categories:

- Orchestration and Strategy
- Discovery and Understanding
- Test Design and Automation
- Execution, Investigation, and Healing
- Reporting, Documentation, and Release
- Learning and Memory

Multiple specialised internal implementations exist for some capabilities (for example, several API-test builders, several test healers, and curator variants). They are presented here under unified public capability cards to avoid leaking internal structure.
