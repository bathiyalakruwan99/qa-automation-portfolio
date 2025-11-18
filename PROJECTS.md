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

### AI Test Case Generator (90% Time Savings)

Automated test case generation using MCP integrations, mind mapping, and AI.

**The problem:** Writing comprehensive test cases for new TMS features was taking 2-4 hours per module. Manual copy-paste from Jira and Figma, then writing 50-100 test cases in Testiny format.

**My workflow:**
1. **Jira MCP** reads tickets automatically (PB numbers, acceptance criteria)
2. **Figma MCP** fetches design files and UI specs
3. Create **RTMS mind maps** from ticket + Figma data for test coverage visualization
4. **AI generates test cases** from mind map structure
5. **Manual review:** Cross-check with actual ticket, Figma, and development implementation
6. Refine AI output for accuracy and edge cases
7. Convert to CSV → import to Testiny

**Impact:** Reduced test case creation from 2-4 hours to ~30 minutes. That's 90% time savings. QA team now uses this for every new feature.

**Tech:** Jira MCP, Figma MCP, RTMS mind mapping, ChatGPT/Claude, Python (CSV conversion)

**The catch:** You can't skip the review step. AI generates structure quickly, but I always verify against actual ticket, designs, and development before finalizing.

[Code](test-cases-creation-automatic/)

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

- **10+ tools built** (8 in this repo, 2+ at previous companies)
- **500+ GPS devices** simulated simultaneously
- **50% error reduction** with Excel validator
- **90% time saved** with AI test case generator
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
