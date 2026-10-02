# Agent Role Details

> Moved unchanged from the AI QA operating model README, which now shows a ten-role summary.
> See [`advanced-agent-catalog.md`](advanced-agent-catalog.md) for the full capability catalog.

# Specialised QA Agent Catalog

Public-safe, capability-level descriptions only. Private agent filenames, prompts, and implementation details are not exposed.

## Discovery and Understanding Agents

### Requirement Analyst

| Field | Detail |
| --- | --- |
| Maturity | Actively Used |
| Purpose | Converts requirements, user stories, defects, and change requests into testable acceptance criteria, risks, assumptions, and open questions. |
| Typical input | A feature request, user story, change request, defect, or release scope. |
| Typical output | Acceptance criteria, risk list, exploratory ideas, missing-information questions, and candidate test scenarios. |
| QA value | Helps QA start with clearer understanding and stronger coverage before execution begins. |
| Human QA responsibility | A QA engineer reviews the identified risks, confirms requirements, and decides final test coverage. |
| Memory interaction | Reads previous flow, risk, validation-rule, and known-issue knowledge where approved. |

---

### Browser and Flow Discovery Agent

| Field | Detail |
| --- | --- |
| Maturity | Actively Used |
| Purpose | Supports exploratory testing by helping document screens, workflows, dependencies, user actions, expected results, and automation candidates. |
| Typical input | A new feature, changed workflow, release scope, or exploratory testing request. |
| Typical output | Workflow map, page understanding, dependencies, risk notes, scenario ideas, and automation candidates. |
| QA value | Reduces time needed to understand complex workflows and improves test coverage before automation begins. |
| Human QA responsibility | A QA engineer validates findings before they are used in test cases, defects, or memory. |
| Memory interaction | Can read approved flow knowledge and update verified workflow observations. |

---

### Test Data Curator

| Field | Detail |
| --- | --- |
| Maturity | Actively Used |
| Purpose | Identifies required positive, negative, boundary, dependency-aware, and cleanup-aware test data conditions. |
| Typical input | A requirement, workflow, test scenario, or automation candidate. |
| Typical output | Test-data checklist, dependency notes, negative-data ideas, and precondition requirements. |
| QA value | Reduces false failures caused by missing, invalid, or incomplete test data. |
| Human QA responsibility | A QA engineer confirms that data conditions are valid for the test objective. |
| Memory interaction | Reads and updates approved test-data dependency knowledge. |

## Planning and Automation Design Agents

### Test Case Planning Agent

| Field | Detail |
| --- | --- |
| Maturity | Actively Used |
| Purpose | Creates structured test conditions, scenarios, expected results, edge cases, and regression coverage ideas. |
| Typical input | A requirement, workflow map, product change, or risk list. |
| Typical output | Test scenarios, priority recommendations, coverage matrix, and exploratory charters. |
| QA value | Improves consistency between requirements, testing, regression coverage, and release confidence. |
| Human QA responsibility | A QA engineer reviews and finalises cases before execution. |
| Memory interaction | Uses approved flow, validation-rule, defect-pattern, and release-risk knowledge. |

---

### Playwright Test Design Agent

| Field | Detail |
| --- | --- |
| Maturity | Actively Used |
| Purpose | Supports planning of Playwright tests using business-readable scenarios, Page Object Model responsibilities, reusable flow ideas, fixtures, test-data needs, and tags. |
| Typical input | Approved test scenarios, workflow knowledge, risk areas, and automation candidates. |
| Typical output | BDD scenario drafts, Page Object Model plan, test-flow design, fixture suggestions, tag recommendations, and automation prerequisites. |
| QA value | Helps convert manual QA understanding into structured, maintainable automation design. |
| Human QA responsibility | A QA engineer reviews every automation design before implementation or execution. |
| Memory interaction | Reads approved flow, component, test-data, and automation-stability knowledge. |

---

### API and Hybrid Test Design Agent

| Field | Detail |
| --- | --- |
| Maturity | In Development / Learning |
| Purpose | Explores API-only and API + UI validation patterns for future automation coverage. |
| Typical input | A workflow, API behavior expectation, integration point, or proposed hybrid test scenario. |
| Typical output | High-level API test ideas, negative-test scenarios, hybrid-flow design suggestions, and validation checkpoints. |
| QA value | Supports future coverage beyond browser-only testing. |
| Human QA responsibility | A QA engineer validates API assumptions, test scope, security boundaries, and implementation choices. |
| Memory interaction | Will use approved API and integration behavior knowledge as this capability matures. |

---

### Performance Test Design Agent

| Field | Detail |
| --- | --- |
| Maturity | Learning / Experimentation |
| Purpose | Explores smoke, load, stress, and soak-test patterns using k6 and controlled targets. |
| Typical input | A performance-sensitive workflow, endpoint category, or performance-testing question. |
| Typical output | High-level performance test plan, workload model, metric ideas, and baseline-learning notes. |
| QA value | Builds structured performance-testing understanding for future QA coverage. |
| Human QA responsibility | A QA engineer confirms safe test targets, load limits, performance expectations, and interpretation of results. |
| Memory interaction | Can capture approved performance-learning notes and baseline concepts. |

## Investigation and Healing Agents

### Manual Bug Hunter

| Field | Detail |
| --- | --- |
| Maturity | Actively Used |
| Purpose | Supports exploratory and risk-based investigation to identify functional, workflow, usability, data, and edge-case issues. |
| Typical input | A feature under test, failed workflow, user complaint, release candidate, or risk area. |
| Typical output | Potential findings, reproduction ideas, impact notes, evidence checklist, and defect-report draft. |
| QA value | Improves exploratory coverage and helps identify risks outside predefined scripts. |
| Human QA responsibility | A QA engineer verifies every finding before it is reported as a defect. |
| Memory interaction | Reads known-risk and defect-pattern knowledge and can update verified findings. |

---

### Locator Healing Agent

| Field | Detail |
| --- | --- |
| Maturity | Actively Used / Learning |
| Purpose | Supports investigation of failed browser automation by analysing locator stability, page or DOM changes, timing issues, visibility conditions, and workflow changes. |
| Typical input | A failed Playwright test, an unstable locator, a changed UI element, a timeout, or a browser execution result. |
| Typical output | A structured suggestion showing whether the issue may be related to a locator, timing, test data, environment, workflow change, or a possible product defect. |
| Current use | Used to support locator investigation, automation maintenance, and safer locator-selection decisions while the healing approach continues to be refined through real QA work and learning. |
| QA value | Reduces time spent manually investigating unstable automation and helps separate automation-maintenance issues from genuine product defects. |
| Human QA responsibility | The agent does not silently change locators or approve a test result. Every suggested locator or automation change requires human QA review, validation, and evidence before it is applied. |
| Memory interaction | Can update approved automation-stability knowledge with safe patterns such as recurring locator risks, stable element-identification approaches, timing dependencies, and known page-change areas. |
| Public Showcase Boundary | This describes the architecture and workflow only. It does not expose real selectors, DOM structures, private application screens, test code, or internal locator-healing rules. |

---

### Failure Classification Agent

| Field | Detail |
| --- | --- |
| Maturity | Implemented Prototype |
| Purpose | Helps classify failed test outcomes into product defect, automation issue, locator issue, timing issue, environment issue, test-data issue, or requirement gap. |
| Typical input | A failed execution, screenshot, report, trace summary, or manual QA observation. |
| Typical output | A structured classification suggestion, evidence status, confidence level, and recommended next action. |
| QA value | Speeds up triage and reduces confusion between product failures and automation-maintenance failures. |
| Human QA responsibility | A QA engineer confirms the classification before creating a defect or changing automation. |
| Memory interaction | Reads known defect patterns and approved automation-stability knowledge. |

## Reporting, Learning, and Release Agents

### Report Writer

| Field | Detail |
| --- | --- |
| Maturity | Actively Used / Implemented Prototype |
| Purpose | Creates structured QA summaries, exploratory reports, evidence summaries, execution notes, and stakeholder-friendly quality updates. |
| Typical input | Test results, exploratory notes, evidence, risks, findings, and release scope. |
| Typical output | QA summary, evidence report, risk summary, and recommended next actions. |
| QA value | Improves transparency and makes QA outcomes easier for teams and stakeholders to understand. |
| Human QA responsibility | A QA engineer validates report content and final conclusions. |
| Memory interaction | Can create approved run summaries and release-learning records. |

---

### Release Gate Agent

| Field | Detail |
| --- | --- |
| Maturity | Planned / In Development |
| Purpose | Supports future evidence-based release assessment using test status, risks, blockers, known issues, and coverage information. |
| Typical input | Test results, defect status, regression notes, evidence summaries, and release scope. |
| Typical output | A draft recommendation such as proceed, proceed with known risks, monitor, hold, or block. |
| QA value | Creates a more consistent release-quality decision process. |
| Human QA responsibility | Final release decisions remain with QA leads, product owners, engineering leaders, and relevant stakeholders. |
| Memory interaction | Will use approved release history, known risks, and regression-learning data as the capability matures. |

---

### Memory Curator

| Field | Detail |
| --- | --- |
| Maturity | Implemented Prototype |
| Purpose | Reviews verified QA findings and converts useful, reusable knowledge into structured QA memory. |
| Typical input | Approved workflow findings, test results, defect patterns, validation rules, automation lessons, and release learnings. |
| Typical output | A proposed memory update with evidence reference, confidence level, source context, and ownership. |
| QA value | Allows future QA planning and exploration to start with better context and fewer repeated investigations. |
| Human QA responsibility | Only a QA-approved and evidence-backed finding can be added to long-term memory. |
| Memory interaction | Creates or updates approved flow, rule, risk, defect, test-data, and automation-stability knowledge. |

---

