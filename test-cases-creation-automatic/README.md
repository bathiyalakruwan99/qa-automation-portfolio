# AI-Powered Test Case Generation

Automated test case generation using ChatGPT/Claude with custom prompts. Reduces test case creation from 2-4 hours to 15-30 minutes (90% time savings).

---

## What This Does

Uses AI (ChatGPT, Claude) with specialized prompts to automatically generate comprehensive test cases from requirements.

**Workflow:**
```
Jira MCP → Figma MCP → RTMS Mind Maps → AI Test Cases → Manual Review → CSV → Testiny Import
```

**Impact:** 90% time reduction in test case creation for new features

---

## Why I Built This

Writing test cases for new TMS features was taking 2-4 hours per module. Get a Jira ticket with requirements, manually write 50-100 test cases in Testiny format. Repeat every sprint.

**The pain:** Slow, repetitive, boring work that AI could handle better.

**Solution:** Create specialized prompts that generate test cases matching our format, then auto-convert to CSV for Testiny import.

**Result:** Test case creation now takes 15-30 minutes instead of hours. QA team uses this for every new feature.

---

## How It Works

### Step 1: Gather Requirements with MCPs
- **Jira MCP:** Read tickets directly (PB numbers, acceptance criteria, user stories)
- **Figma MCP:** Fetch design files and UI specs automatically
- **Context:** Get complete picture without manual copy-paste

### Step 2: Create RTMS Mind Maps
- Build mind maps using ticket + Figma data
- Structure test scenarios visually
- Map user flows and edge cases
- Create test coverage matrix

### Step 3: AI Test Case Generation
- Feed mind maps to AI (ChatGPT, Claude, Cursor AI)
- AI generates structured test cases from mind map nodes
- Uses specialized prompts for different test types
- Outputs in Markdown format

### Step 4: Manual Review & Refinement
- Read actual Jira ticket thoroughly
- Check Figma files for UI details
- Review actual development implementation
- Refine AI-generated test cases for accuracy
- Add domain-specific edge cases AI might miss

### Step 5: Format & Import
- Convert refined Markdown to CSV
- Apply Testiny character limits
- Import to Testiny and link to Jira
- Assign and execute

---

## What's Included

### `contract-testcase-automation/`
Generate test cases for contract verification, billing, invoice calculations.

**Use case:** Contract rules, pricing validation, invoice workflows

### `manual-routing-guides/`
Comprehensive test documentation for routing and load planning.

**Use case:** Transport planning features, route optimization

### `test-case-remapper/`
Transform and optimize test cases between formats.

**Use case:** Cleaning up exported test cases, applying character limits

### `testini-jira-sync/`
Synchronize test cases between Testiny and Jira.

**Use case:** Bidirectional sync, test execution tracking

---

## Quick Example

### Input (Jira Ticket):
```
Feature: GPS Device Management
- Add new GPS device
- View device list
- Edit device details
- Delete device
```

### AI Prompt Used:
```
Generate test cases for GPS device management with CRUD operations.
Include positive, negative, and edge cases.
Format for Testiny with these fields: Title, Description, Steps, Expected Result, Priority.
```

### Output Generated:
- 20-30 test cases covering all scenarios
- Positive cases (happy path)
- Negative cases (validation errors)
- Edge cases (boundary conditions)
- Already formatted for Testiny import

**Time:** 15-20 minutes (vs 3-4 hours manually)

---

## Test Case Standards

### Naming Convention:
```
[Module][Feature]Verify that User can [Action] successfully
```

**Examples:**
- `[GPS Manager][Device List]Verify that User can view all devices successfully`
- `[Route Planning][Load Assignment]Verify that User can assign load to route successfully`

### Required Fields:
- Module
- Title
- Description (max 500 chars)
- Precondition (max 1000 chars)
- Steps (max 2000 chars, use semicolons)
- Expected Result (max 1000 chars)
- Priority (Critical/High/Medium/Low)
- Type (Functional/UI-UX/Data Validation)

---

## Character Limits (Testiny)

The prompts automatically enforce these:
- **Actual Result:** 255 characters (strict)
- **Description:** 500 characters
- **Precondition:** 1000 characters
- **Steps:** 2000 characters (use `;` not line breaks)
- **Expected Result:** 1000 characters
- **Test Data:** 500 characters

---

## Benefits

### Time Savings
- Traditional: 2-4 hours for 20 test cases
- AI-powered: 15-30 minutes for 50+ test cases
- **90% reduction** in creation time

### Quality Improvements
- Consistent structure across all test cases
- Complete requirement coverage
- Professional formatting
- Platform-ready (Testiny/Jira)

### Scalability
- Generate test cases for multiple features simultaneously
- Process large test suites quickly
- Maintain standards across projects
- Reusable templates

---

## Tech Stack

- **MCPs:** Jira MCP (ticket reading), Figma MCP (design access)
- **Mind Mapping:** RTMS for visual test planning
- **AI Assistants:** ChatGPT, Claude, Cursor AI
- **Format:** Markdown → CSV
- **Test Management:** Testiny
- **Issue Tracking:** Jira
- **Automation:** Python scripts for CSV conversion

---

## Best Practices

1. **Start with Markdown** - Easier to read and edit
2. **Use specific prompts** - Different prompts for different test types
3. **Review AI output** - AI is great but not perfect, always review
4. **Test with small batch first** - Verify format before bulk import
5. **Iterate prompts** - Improve prompts based on results

---

## Common Workflows

### New Feature Testing:
```
1. Use Jira MCP to read ticket (PB number)
2. Use Figma MCP to fetch design files
3. Create RTMS mind map from ticket + Figma
4. AI generates test cases from mind map
5. Manually review ticket, Figma, and actual dev implementation
6. Refine AI test cases for accuracy
7. Convert to CSV and import to Testiny
8. Assign and execute
```

### Contract Testing:
```
1. Get contract document
2. Use contract-testcase-automation prompts
3. Generate calculation test cases
4. Export CSV
5. Import to Testiny
```

### Test Case Cleanup:
```
1. Export existing test cases
2. Use test-case-remapper prompts
3. AI optimizes and formats
4. Import cleaned version
```

---

## What I Learned

**What works well:**
- MCP integration eliminates manual copy-paste from Jira/Figma
- Mind maps provide better structure than raw requirements
- AI generates comprehensive test cases from structured input
- Saves massive amounts of time (90% reduction)

**What needs attention:**
- AI sometimes misses domain-specific edge cases
- Manual refinement is essential (10-15 min review)
- Must verify against actual development, not just specs
- Character limits need careful prompt engineering

**The process:**
1. MCPs gather data automatically (saves 5-10 min)
2. Mind mapping helps visualize test coverage (10 min)
3. AI generates 50+ test cases (5 min)
4. Manual review and refinement (10-15 min)
5. Total: ~30 min vs 3-4 hours manually

**The catch:** 
You can't just blindly use AI output. Always cross-check with actual ticket, Figma designs, and development implementation. But even with this review, it's still 90% faster than manual writing.

---

## Folder Structure

```
test-cases-creation-automatic/
├── contract-testcase-automation/   # Contract test generation
├── manual-routing-guides/          # Routing test docs
├── test-case-remapper/             # Format optimization
├── testini-jira-sync/              # Platform sync
└── README.md                       # This file
```

Each subfolder has its own README with specific instructions.

---

## Future Improvements

- Add more specialized prompts (API testing, performance testing)
- Automate CSV conversion completely
- Direct Testiny API integration (skip manual import)
- Test data generation with AI
- Intelligent test selection based on code changes

---

*Built to eliminate repetitive test case writing. Now the QA team can focus on actual testing instead of documentation.*
