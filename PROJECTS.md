# Projects

Here's what I've built to solve real QA problems during my work at **Haulmatic Technologies** (Transport Management Systems) and **IFS R&D International** (ERP systems).

---

## Work Projects

### GPS Testing Suite

Simulates 1000+ GPS devices without needing physical hardware. Built with JavaScript and Leaflet.js.

**Why I built it:** Our TMS platform needed multi-device GPS testing, but buying physical GPS devices wasn't realistic. Manual testing with a few devices took forever and didn't catch concurrency issues.

**What it does:**
- Simulates GPS devices sending real-time location data
- Visualizes paths on a map (OpenStreetMap)
- Tests geofencing, tracking, and API integrations
- Handles up to 1000 devices simultaneously

**The challenge:** Managing hundreds of concurrent API requests without overwhelming the server or freezing the browser. Needed efficient state tracking for all active devices and real-time UI updates.

**Solutions:** Request queue management using Maps for tracking active API calls. Batch processing with Promise.allSettled for multiple devices. Staggered device startup with configurable delays. Throttled map updates to keep UI responsive.

**Tech:** JavaScript, Leaflet.js, OpenStreetMap, real-time APIs

**Impact:** Eliminated need for physical GPS hardware. QA team saves hours every sprint on GPS testing.

[Code](gps-testing-suite/) | [Demo videos](gps-testing-suite/videos/)

---

### Route Optimizer

Next.js app that solves the Traveling Salesman Problem (TSP) for validating our route optimization module.

**The problem:** Our TMS has a route optimizer that needs to handle 50+ locations efficiently. Manual validation of complex routes wasn't practical - I needed a tool to generate optimal routes and compare against our system's output.

**How it works:**
- Takes a list of addresses or coordinates
- Solves TSP using Nearest Neighbor + 2-opt + 3-opt algorithms
- Uses OSRM for real road distances (not straight-line)
- Shows multiple route alternatives for comparison
- Interactive map visualization

**What I learned:** Algorithm optimization is hard. The 3-opt improvement makes a huge difference for quality but gets slow with 30+ locations, so I added Web Workers to keep the UI responsive.

**Tech:** Next.js, React, TypeScript, OSRM (routing engine), Leaflet maps

**Still want to add:** Time window constraints, vehicle capacity limits, live deployment

[Code](route-optimizer/) | Deploy to Vercel for live demo

---

### Excel Validator (50% Error Reduction)

Python tool that validates bulk Excel uploads before they hit our TMS database.

**The pain point:** Customers would upload Excel files with wrong formats, missing data, duplicate IDs, or invalid districts. Our support team was getting flooded with tickets about failed uploads.

**My solution:**
- Built a desktop validator with Tkinter GUI
- Auto-corrects common mistakes (district names, status fields, formats)
- Handles duplicates by prefixing "DUPLICATE" to email/NIC fields
- Shows detailed error reports before upload
- Multiple GUI implementations for different use cases

**Results:** Reduced customer upload errors by 50%+. Support team loves it because tickets dropped significantly.

**Tech:** Python, Pandas, Tkinter, OpenPyXL

**What I'd do differently:** Build a web interface for easier access. Add more customizable validation rules so users can configure their own correction templates.

[Code](bulkfile-generator/excel-corrector/)

---

### Job Master Data Processor (2+ Hours Saved Daily)

Desktop app for verifying job data from TMS Excel exports. Built to solve a testing bottleneck.

**The testing problem:** Verifying job data exports was taking at least 2+ hours daily. Manual Excel filtering, calculating expected load counts for validation, and checking GPS/payment/invoice status across hundreds of test cases was killing productivity.

**Real scenario:** "Verify that all FTL-DISTRIBUTION trips with 9-16 stops calculate loads correctly and have GPS data" meant: open Excel, create multiple filters, manually calculate expected loads, compare, document findings. Every. Single. Time.

**My solution:**
- Desktop app with real-time search across all fields (type job ID → instantly see all related data)
- Automatically maps 30+ column variations (works with dev/staging/prod exports)
- Calculates job and load counts with three different methods:
  - Non FTL-DISTRIBUTION: Counts unique Load IDs
  - FTL-DISTRIBUTION (Prorated): If stops ≤ 8 = 1 load, else: (stops // 8) + (remaining / 8)
  - FTL-DISTRIBUTION (8x): ceil(stops / 8)
  - FTL-DISTRIBUTION (10x): ceil(stops / 10)
- Shows all three methods side-by-side for easy comparison and validation
- Bulk job checker: verify GPS/payment/invoice status for 100+ jobs in 30 seconds
- Smart filenames: exports include filters used (e.g., `JobMaster_Export_JobID-12345_Status-Failed_20250118.xlsx`)

**QA workflow improvements:**
- **Test data verification:** 15-20 minutes → 2 minutes (upload export, filter, validate counts)
- **Bug reporting:** Export complete job data with context embedded in filename. Developer gets exact test data, no back-and-forth.
- **Edge case testing:** Quick "what if" queries: "Show me jobs with exactly 9 stops" for boundary testing
- **Test evidence:** Multi-sheet exports (raw data + summary statistics + filters used) for documentation and audit trails

**What I learned:** Building QA tools isn't just about automation - it's about removing repetitive manual work that slows down testing. The three calculation methods were critical because stakeholders needed to compare different approaches before deciding which to implement.

**Tech:** Python, Pandas, Tkinter (background threading for large files)

**What's still hard:** Handling inconsistent column names across different export types. Current column mapping works well but needs updates when business adds new fields.

[Code](jobmaster/)

---

## AI/MCP Workflows (Not Standalone Tools)

### AI Test Case Generation Workflow (90% Time Savings)

Automated test case creation using MCP integrations, mind mapping, and AI. This is a workflow/process, not a standalone tool.

**The problem:** Writing comprehensive test cases for new TMS features was taking 2-4 hours per module. Manual copy-paste from Jira and Figma, then writing 50-100 test cases in Testiny format.

**My workflow:**
1. **Jira MCP** reads tickets automatically (PB numbers, acceptance criteria)
2. **Figma MCP** fetches design files and UI specs
3. Create **RTMS mind maps** from ticket + Figma data for test coverage visualization
4. **AI generates test cases** from mind map structure
5. **Manual review:** Cross-check with actual ticket, Figma, and development implementation
6. Refine AI output for accuracy and edge cases
7. Convert to CSV → import to Testiny

**Impact:** Reduced test case creation from 2-4 hours to ~30 minutes. That's 90% time savings. QA team now uses this workflow for every new feature.

**Tech:** Jira MCP, Figma MCP, RTMS mind mapping, ChatGPT/Claude, Python (CSV conversion)

**The catch:** You can't skip the review step. AI generates structure quickly, but I always verify against actual ticket, designs, and development before finalizing.

**Why it's a workflow:** Uses existing platforms (Jira, Figma, AI tools) with MCP integrations rather than being a standalone application.

[Workflow docs](test-cases-creation-automatic/)

---

### Agent & MCP Works

Collection of AI-powered QA workflows and automation processes.

**What it includes:**
- Invoice completion audits
- Job progress checking
- Platform data collection
- Invoice validation reports
- Job percentage analytics

**Tech:** Model Context Protocol (MCP), AI Agents, Prompt Engineering

**Why these are workflows:** They're automated processes using AI and MCP integrations, not standalone tools you install and run.

[Workflow docs](agent-and-mcp-works/)

---

### Test Automation Frameworks

UI and API automation with Playwright and Selenium using Page Object Model (POM).

**What I'm testing:**
- Load Management module (create loads, assign routes, validate constraints)
- Route Optimization workflows (TSP validation, constraint checking)
- Contract Execution (pricing rules, invoice generation)
- GPS tracking features (device management, geofencing)
- API validations (backend consistency checks)

**Framework setup:**
- POM design pattern for maintainability
- Playwright for modern UI testing (faster, more reliable than Selenium)
- Selenium for legacy browser support
- Integrated with Testiny for test management
- Jira integration for defect tracking

**Current coverage:** Managing 1000+ test cases across all modules. Run full regression before each release.

**What works well:** POM pattern makes maintenance easy when UI changes. Playwright's auto-wait is a game changer.

**What's hard:** Keeping tests stable across environments. Flaky tests are still a challenge with network-dependent features.

**Note:** This code is proprietary (Haulmatic's codebase), so not in this public repo.

---

## Personal/Side Tools

Quick utilities I built for testing workflows:

### Geo Coordinate Converter
Batch converts addresses to GPS coordinates (and reverse). Useful when you need to generate test data with realistic locations.

**Tech:** Python, Geocoding APIs, Tkinter

[Code](geo-coordinate-converter/)

---

### Excel Diff Tool
Compares two Excel files sheet-by-sheet and generates a detailed diff report. Saved me hours when validating data migrations.

**Tech:** Python, Pandas, OpenPyXL

[Code](excel-master-diff/)

---

### Excel Job Highlighter
Color-codes Excel rows based on job IDs. Makes it easy to spot patterns in large datasets during manual review.

**Tech:** Python, Pandas, OpenPyXL

[Code](excel-job-highlighter/)

---

### Order Data Generator
Generates realistic test order data (customer info, products, dates, statuses). Built it when I needed 1000+ test orders for performance testing.

**Tech:** Python, Faker library, Tkinter

[Code](order-data-generator/)

---

## Previous Work (IFS R&D International)

During my time as a QA trainee at IFS, I worked on:

**IFS Apps 10 Testing:** System testing across multiple releases (21R2 to 24R1) in 5+ environments. Built Cypress automation suites enhanced with Cucumber BDD for better readability.

**Page Designer QA:** Created comprehensive test suite with 200+ scenarios covering conditional logic, layouts, and data binding. Built RTMs (Requirements Traceability Matrix) and mind maps for requirement visualization.

**Cypress Stabilization:** Fixed 30+ flaky tests in the legacy Cypress suite. Improved wait strategies, updated selectors, and introduced a test tagging system that reduced regression filtering time.

**What I learned:** Working on an enterprise ERP system taught me how to test complex business logic, handle multi-environment deployments, and write maintainable automation that lasts across releases.

**Note:** IFS work is proprietary, so code isn't included here.

---

## Stats

- **8 standalone tools built** (in this repo)
- **AI/MCP workflows implemented** (test case generation, invoice audits, job analysis)
- **1000+ GPS devices** simulated simultaneously
- **50% error reduction** with Excel validator
- **2+ hours saved daily** with Job Master data processor
- **90% time saved** with AI workflow for test case generation
- **1000+ test cases** managed in Testiny
- **2+ years** professional QA experience
- **Tech stack:** Playwright, Selenium, Cypress, Python, JavaScript, TypeScript, Next.js, React

---

## What I'm Working On Next

- **Deploy Route Optimizer** to Vercel for live demo
- **Add CI/CD integration** to test frameworks (GitHub Actions)
- **Improve GPS suite** with better error handling at scale
- **Explore AI for test data generation** (next evolution after test case gen)

---

## Contact

Want to chat about QA automation, testing tools, or how to scale test infrastructure?

**Email:** bathiyalakruwan99@gmail.com  
**Website:** [bathiya-qa.vercel.app](https://bathiya-qa.vercel.app/)  
**LinkedIn:** [linkedin.com/in/bathiyalakruwan](https://www.linkedin.com/in/bathiyalakruwan/)

---

*Most of these tools were built to solve actual problems I faced in QA work. If you're dealing with similar challenges, feel free to use or adapt any of this code. That's why it's MIT licensed.*
