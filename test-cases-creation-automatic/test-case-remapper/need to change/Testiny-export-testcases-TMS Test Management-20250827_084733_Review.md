# Testiny Export Test Cases Review & Optimization Plan

## 📋 File Analysis
**Source File**: `Testiny-export-testcases-TMS Test Management-20250827_084733.csv`
**Total Test Cases**: 12
**Module**: Dashboard > Customer KM Metrics

## 🔍 Current Structure Analysis

### Column Mapping Issues
- **Source Columns**: `parent_folder_name`, `testcase_id`, `title`, `owner`, `precondition`, `steps`, `expected_results`, `priority`, `status`, `testcase_type`, `expectedresult`, `testdata`, `actualresult`, `bug`, `stepdescription`, `folderdescription`, `requirements`
- **Target Columns**: `Module`, `Title`, `Description`, `Precondition`, `Steps`, `Expected Result`, `Priority`, `Owner`, `Status`, `Type`, `Bug`, `Test Data`, `Folder`, `Actual Result`

### Critical Issues Identified
1. **Line Breaks**: Precondition, steps, and expected_results contain internal line breaks
2. **Column Duplication**: `expected_results` and `expectedresult` both exist
3. **Missing Required Fields**: No `Description` column, `Folder` needs standardization
4. **Status Values**: All cases are "DRAFT" - need to change to "Ready for Test"
5. **Owner Standardization**: Need to change from "qa-team-user" to "QA Team"
6. **Step Structure**: Current steps are too simple (only 1 step each) - need 7-step structure
7. **Expected Results**: Need to implement step-by-step pairing methodology

## 🎯 Planned Optimizations

### 1. Column Structure Standardization
```
Source → Target Mapping:
- parent_folder_name → Module (standardize to "Dashboard")
- title → Title (apply professional format)
- owner → Owner (change to "QA Team")
- precondition → Precondition (remove line breaks, add semicolon separation)
- steps → Steps (expand to 7-step structure)
- expected_results → Expected Result (implement step-by-step pairing)
- priority → Priority (map 1=High, 2=Medium, 3=Low)
- status → Status (change from "DRAFT" to "Ready for Test")
- testcase_type → Type (standardize values)
- bug → Bug (keep empty if none)
- testdata → Test Data (standardize format)
- actualresult → Actual Result (keep "TBD" for new cases)
```

### 2. Title Format Standardization
**Current**: Simple descriptive titles
**Target**: `[Dashboard][Customer KM Metrics]Verify that User can [Action] successfully`

**Examples**:
- `[Dashboard][Customer KM Metrics]Verify that User can load Top Customers by Total KM Bar Chart successfully`
- `[Dashboard][Customer KM Metrics]Verify that User can view Vehicle Type KM Chart when no customer selected successfully`

### 3. Step-by-Step Expected Result Pairing Implementation
**Current**: Single step with single expected result
**Target**: 7-step structure with 7 corresponding expected results

**Example Structure**:
```
Steps: 1. Navigate to dashboard; 2. Locate Customer KM Metrics widget; 3. Click on widget to expand; 4. Wait for chart to load; 5. Verify chart displays top 5 customers; 6. Check chart data accuracy; 7. Confirm chart responsiveness

Expected Results: 1. Dashboard loads successfully; 2. Customer KM Metrics widget is visible; 3. Widget expands to show detailed view; 4. Chart loads within acceptable time; 5. Top 5 customers by total KM are displayed; 6. Chart data matches expected values; 7. Chart responds to user interactions
```

### 4. Data Standardization
- **Module**: Standardize to "Dashboard" (remove "Dashbord" typo)
- **Priority Mapping**: 1=High, 2=Medium, 3=Low
- **Status**: All cases to "Ready for Test"
- **Owner**: All cases to "QA Team"
- **Type**: Standardize UI/FUNCTIONAL values

### 5. Character Limit Compliance
- **Steps**: Target ≤2000 characters (7 steps with semicolon separation)
- **Expected Result**: Target ≤1000 characters (7 results with semicolon separation)
- **Precondition**: Target ≤1000 characters (remove line breaks)
- **Actual Result**: Keep "TBD" (under 255 character limit)

## 📊 Test Case Breakdown

### High Priority (1) - 6 test cases
- Load Top Customers by Total KM Bar Chart
- Click Customer Bar Loads Vehicle Type KM Chart
- Time Filter Tabs Control Chart Period
- Vehicle Types Derived from Container Management
- Exclude FCL Jobs from Vehicle Type KM Breakdown
- Load KM Data from Actual Trip Start Time

### Medium Priority (2) - 4 test cases
- Vehicle Type KM Chart Empty Until Customer Selected
- Custom Date Filter and Period Comparison
- Typable Dropdown for Selecting Customers
- Axis and Scale Auto Adjust for Bar Chart

### Low Priority (3) - 2 test cases
- Positive Comparison Colored Green
- Negative Comparison Colored Red

## 🚀 Implementation Plan

### Phase 1: Structure Analysis ✓
- [x] Analyze current file structure
- [x] Identify column mapping issues
- [x] Document planned changes

### Phase 2: CSV Optimization
- [ ] Create optimized CSV with proper column structure
- [ ] Implement 7-step step-by-step pairing methodology
- [ ] Apply professional title formatting
- [ ] Standardize all data fields
- [ ] Remove line breaks and fix CSV formatting

### Phase 3: Quality Validation
- [ ] Verify character limit compliance
- [ ] Check CSV structure integrity
- [ ] Validate step-to-expected-result alignment
- [ ] Confirm import compatibility

## 📝 Notes
- All test cases are currently in "DRAFT" status and need to be changed to "Ready for Test"
- Current step structure is too simplistic for comprehensive testing
- Need to implement the proven 7-step methodology for better test coverage
- Priority values need proper mapping (1=High, 2=Medium, 3=Low)
- Module name has typo ("Dashbord" → "Dashboard")
