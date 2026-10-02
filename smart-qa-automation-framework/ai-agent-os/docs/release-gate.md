# Release-Gate Checklist

Used at the end of every release cycle. Each item must be ticked or formally waived.

## 1. Build & Environment
- [ ] Release build deployed to the QA environment
- [ ] Environment health checks pass (services, DB, queues)
- [ ] Test data and credentials prepared

## 2. Automated Suites
- [ ] Playwright smoke suite — 100% pass on PR and release build
- [ ] Playwright regression suite — no critical failures
- [ ] Newman API regression — no contract breaks
- [ ] k6 performance smoke — p95 latency and error rate within threshold

## 3. Manual & Exploratory
- [ ] Exploratory charter completed for changed areas
- [ ] UAT scenarios validated and signed off
- [ ] Cross-browser spot checks for high-traffic flows
- [ ] Android assistance / mobile spot checks where relevant

## 4. Data & Reporting
- [ ] Job, load, GPS, payment, invoice calculation checks pass
- [ ] Reports match expected values for sample dataset
- [ ] Excel / bulk-upload validations pass

## 5. Release Decision
- [ ] **Release-Ready** — all green, ship.
- [ ] **Release with Known Risks** — non-critical issues, risk accepted with owner, workaround, and ETA.
- [ ] **Blocked** — critical defect open; do not release.

## 6. Post-Release
- [ ] Post-release smoke executed in production
- [ ] Defects discovered post-release captured with reproduction steps
- [ ] Lessons learned added to `qa-knowledge-memory.md`
