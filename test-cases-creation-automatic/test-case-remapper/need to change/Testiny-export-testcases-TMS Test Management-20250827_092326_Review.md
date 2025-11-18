# Testiny Export CSV File Review & Optimization Plan

## 📋 File Analysis: Testiny-export-testcases-TMS Test Management-20250827_092326.csv

### Current Structure Analysis
- **Total Test Cases**: 10
- **Source Format**: Testiny export with non-standard column structure
- **Module**: Dashboard > KPI and Widget Store (needs standardization)
- **Current Status**: All test cases in DRAFT status

### Column Mapping Issues
**Current Columns (Non-Standard):**
- `parent_folder_name` → Should map to `Module`
- `testcase_id` → Remove (not needed for import)
- `title` → Keep but needs professional formatting
- `owner` → Should be standardized to "QA Team"
- `created_at`, `created_by`, `modified_at`, `modified_by` → Remove (not needed)
- `precondition` → Keep but needs formatting fixes
- `steps` → Keep but needs step-by-step pairing implementation
- `expected_results` → Keep but needs step-by-step pairing implementation
- `parent_folder_description` → Remove (not needed)
- `priority` → Keep but needs standardization
- `status` → Change from "DRAFT" to "Ready for Test"
- `testcase_type` → Map to `Type` with standardization
- `expectedresult`, `testdata`, `actualresult` → Duplicate/conflicting columns
- `bug` → Keep but needs formatting
- `stepdescription`, `folderdescription`, `requirements`, `attachments` → Remove (not needed)

### Target CSV Structure
```csv
Module,Title,Description,Precondition,Steps,Expected Result,Priority,Owner,Status,Type,Bug,Test Data,Folder,Actual Result
```

### Critical Issues Identified

#### 1. Character Limit Violations
- **Precondition**: Contains line breaks that need semicolon separation
- **Steps**: Need step-by-step pairing implementation (currently single steps)
- **Expected Results**: Need step-by-step pairing implementation (currently single results)
- **Test Data**: Complex multi-line data needs semicolon separation

#### 2. Formatting Issues
- **Line Breaks**: Multiple line breaks in precondition, steps, and test data fields
- **Module Name**: "Dashbord > KPI and Widget Store" needs standardization
- **Status**: All cases in "DRAFT" need to be "Ready for Test"
- **Owner**: Should be standardized to "QA Team"

#### 3. Step-by-Step Pairing Implementation Needed
- **Current**: Single step with single expected result
- **Target**: 7-step structure with 7 corresponding expected results
- **Benefit**: Immediate validation capability for each step

### Planned Optimizations

#### Phase 1: Column Restructuring
1. Map `parent_folder_name` to `Module` with standardization
2. Remove unnecessary columns (testcase_id, timestamps, etc.)
3. Standardize `owner` to "QA Team"
4. Change `status` from "DRAFT" to "Ready for Test"
5. Map `testcase_type` to `Type` with proper values

#### Phase 2: Content Optimization
1. **Precondition**: Convert line breaks to semicolon separation
2. **Steps**: Implement 7-step structure with step-by-step pairing
3. **Expected Results**: Implement 7-step structure with immediate validation outcomes
4. **Test Data**: Format complex data with semicolon separation
5. **Bug References**: Standardize format (WGT-001, WGT-002, etc.)

#### Phase 3: Professional Standards
1. **Title Format**: Apply `[Module][Feature]Verify that User can [Action] successfully`
2. **Priority**: Standardize to Critical/High/Medium/Low
3. **Type**: Standardize to Functional/UI/Responsive/Access Control
4. **Module**: Standardize to "Dashboard" (fix typo)

### Step-by-Step Pairing Implementation Plan

#### Example Transformation (Test Case 880):
**Current:**
- Steps: "[1] Click expand (↗) inside expanded overlay"
- Expected: "[1] Expand icon should be disabled or hidden in expanded state"

**Target (7-Step Structure):**
- Steps: "1. Navigate to KPI dashboard; 2. Locate KPI widget with expand icon; 3. Click expand icon to open overlay; 4. Verify overlay expands successfully; 5. Attempt to click expand icon again; 6. Check expand icon state; 7. Verify no duplicate overlays created"
- Expected Results: "1. Dashboard loads with KPI widgets visible; 2. Expand icon is visible and accessible; 3. Overlay expands and displays content; 4. Overlay is fully expanded and functional; 5. Expand action is triggered; 6. Expand icon is disabled or hidden; 7. Only single overlay exists"

### Data Consistency Standards
- **Module**: Standardize to "Dashboard" across all test cases
- **Priority**: Map 1→Critical, 2→High, 3→Medium
- **Type**: Map FUNCTIONAL→Functional, UI→UI, Responsive→UI, Access Ctrl→Access Control
- **Status**: All cases → "Ready for Test"
- **Owner**: All cases → "QA Team"

### Quality Validation Checklist
- [ ] All fields under character limits
- [ ] No internal line breaks
- [ ] Step-by-step pairing implemented (7 steps + 7 results)
- [ ] Professional QA terminology applied
- [ ] CSV structure matches Testiny requirements
- [ ] Data consistency maintained across all test cases
- [ ] Import compatibility verified

### Expected Outcome
- Clean, importable CSV file with professional QA standards
- Each test step paired with its immediate expected result
- All character limits respected
- Consistent formatting and terminology
- Ready for Testiny import without errors

