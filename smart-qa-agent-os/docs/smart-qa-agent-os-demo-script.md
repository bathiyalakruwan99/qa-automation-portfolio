# Smart QA Agent OS - Demo Video Script

Target length: 60-90 seconds.
Audience: QA hiring managers, QA leads, SDET interviewers.
Tone: Calm, professional, evidence-driven.

On-screen disclaimer (small text, persistent in lower-right):
> Synthetic example for portfolio demonstration. No private code, customer data, or proprietary workflows are shown.

---

## Scene 1 - Opening (0:00 - 0:10)

Visual: Portfolio repo `README.md` open in browser, scrolling slowly to the Featured Projects table.

Voice-over:
> "This is the Smart QA Agent OS, a public, sanitized showcase of how I structure modern QA. It combines a reusable automation framework with an AI QA Operating Model for agents, skills, rules, and memory."

---

## Scene 2 - Automation Framework (0:10 - 0:25)

Visual: Side-by-side - `smart-qa-agent-os/playwright-demo/` tree on the left, `playwright.config.ts` and a POM file on the right. Briefly highlight `tests/ui`, `tests/api`, `tests/hybrid`, `tests/bdd`.

Voice-over:
> "The framework layer is Playwright with TypeScript, Page Object Model, BDD scenarios, API and hybrid flows, Postman/Newman regression, and k6 performance. Everything is wired into GitHub Actions for push, PR, and nightly runs."

---

## Scene 3 - AI QA Operating Model (0:25 - 0:45)

Visual: Open `ai-qa-operating-model.md`. Show the layered Mermaid diagram. Pan slowly to `docs/agents-catalog.md` showing the six agent categories and a few capability cards.

Voice-over:
> "On top of the framework sits an AI QA Operating Model: 34 capability-level QA agents across orchestration, discovery, design, execution, reporting, and learning. They share 13 reusable skill groups, run inside 14 categories of quality rules, and write back into a 17-category continuous QA memory."

---

## Scene 4 - End-to-End Journey (0:45 - 1:05)

Visual: Open `docs/example-agent-journey.md`. Scroll through the staged flow: QA Router, Requirement Analyst, Flow Mapper, Test Data Curator, Playwright BDD/POM Builder, API Test Builder, E2E Runner, Healing and Bug Hunter, Report Writer, Release Gate, Memory Curator.

Voice-over:
> "Here is one fictional order-dispatch journey for Northstar Retail. A request enters the QA Router, gets analysed and mapped, gets test data, gets BDD and API tests, runs end-to-end, self-heals where safe, classifies real failures, produces an evidence-backed release gate decision, and feeds learnings back into memory."

---

## Scene 5 - Evidence and Confidentiality (1:05 - 1:25)

Visual: Open `sample-artifacts/sample-release-gate-report.md` then `sample-artifacts/sample-evidence-summary.md`. Briefly highlight the "Synthetic example for portfolio demonstration" label at the top.

Voice-over:
> "Every artifact is synthetic and labelled. No real prompts, selectors, customer data, internal codenames, or proprietary workflows are exposed. What is shown here is the operating model, not the private implementation."

---

## Scene 6 - Closing (1:25 - 1:30)

Visual: Return to `smart-qa-agent-os/README.md` navigation index with the AI QA Operating Model section visible.

Voice-over:
> "Smart QA Agent OS - one place for framework, agents, skills, rules, memory, and evidence."

End card:
- GitHub: `bathiyalakruwan99/qa-automation-portfolio`
- Section: `smart-qa-agent-os/`
- Persistent disclaimer remains visible.

---

## Recording Notes

- Capture at 1920x1080, 30 fps.
- Keep cursor movements slow; pause 1-2 seconds on each Mermaid diagram.
- Avoid showing any local path outside the portfolio repo.
- Do not narrate any private project name, internal tool name, or customer name.
- Stick to the fictional names used across the portfolio: Northstar Retail, TRK-101, DEMO-ORD-1001, Central Warehouse, Lakeview Store, Vehicle-001, Warehouse A, JOB-1001.

## Optional Subtitles

Provide a `.srt` file with the voice-over text above. Keep each subtitle line under 42 characters and on-screen for at least 1.5 seconds.
