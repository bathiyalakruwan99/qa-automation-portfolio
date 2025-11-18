# Testiny Export CSV Review & Optimization Plan

## 📋 File Analysis
**Source File**: `Testiny-export-testcases-TMS Test Management-20250827_090814.csv`
**Total Test Cases**: 31
**Module**: Dashboard > Job Summary

## 🔍 Current Structure Analysis

### Column Mapping Issues
- **Missing Required Columns**: Module, Description, Folder, Actual Result
- **Duplicate Columns**: `expected_results` and `expectedresult` (redundant)
- **Non-Standard Columns**: `stepdescription`, `folderdescription`, `requirements`
- **Unnecessary Columns**: `testcase_id`, `created_at`, `created_by`, `modified_at`, `modified_by`, `attachments`

### Data Quality Issues
1. **Line Breaks**: Multiple line breaks in precondition, steps, and expected_results fields
2. **Inconsistent Formatting**: Mixed use of quotes and line breaks
3. **Missing Professional Structure**: No standardized test case titles
4. **Incomplete Test Cases**: Missing essential fields for Testiny import
5. **Priority Inconsistency**: Priority 1, 2, 3 values need standardization

### Character Limit Analysis
- **Precondition**: Most entries under 1000 chars ✓
- **Steps**: Most entries under 2000 chars ✓  
- **Expected Results**: Most entries under 1000 chars ✓
- **Test Data**: Most entries under 500 chars ✓

## 🎯 Planned Optimizations

### 1. Column Structure Standardization
**Target CSV Structure:**
```csv
Module,Title,Description,Precondition,Steps,Expected Result,Priority,Owner,Status,Type,Bug,Test Data,Folder,Actual Result
```

**Column Mappings:**
- `parent_folder_name` → `Module` (standardize to "Job Summary")
- `title` → `Title` (apply professional format)
- `stepdescription` → `Description` (if available, otherwise create from title)
- `precondition` → `Precondition` (fix line breaks)
- `steps` → `Steps` (fix line breaks, implement 7-step structure)
- `expected_results` → `Expected Result` (fix line breaks, implement 7-step pairing)
- `priority` → `Priority` (convert 1→High, 2→Medium, 3→Low)
- `owner` → `Owner` (change to "QA Team")
- `status` → `Status` (change from "DRAFT" to "Ready for Test")
- `testcase_type` → `Type` (standardize FUNCTIONAL/UI/PERFORMANCE)
- `bug` → `Bug` (keep existing references)
- `testdata` → `Test Data` (standardize format)
- `parent_folder_name` → `Folder` (standardize to "Job Summary")
- Add `Actual Result` column (empty for new test cases)

### 2. Test Case Title Standardization
**Current Format**: Generic validation titles
**Target Format**: `[Job Summary][Feature]Verify that User can [Action] successfully`

**Examples:**
- `[Job Summary][Widget Visibility]Verify that User can view Job Summary widget successfully`
- `[Job Summary][Drag and Drop]Verify that User can reposition widget successfully`
- `[Job Summary][Time Filter]Verify that User can apply time range filters successfully`

### 3. Step-by-Step Expected Result Pairing Implementation
**Current Issue**: Single step with single expected result
**Target**: 7-step structure with 7 corresponding expected results

**Example Transformation:**
```
Current:
Steps: "Navigate to landing page"
Expected: "Job Summary widget should be visible by default and non-removable"

Target:
Steps: "1. Navigate to dashboard landing page; 2. Locate Job Summary widget area; 3. Observe widget visibility; 4. Check widget removal options; 5. Verify widget positioning; 6. Confirm widget functionality; 7. Validate widget persistence"

Expected Result: "1. Dashboard landing page loads successfully; 2. Job Summary widget area is clearly visible; 3. Widget displays with proper content; 4. No removal options are available; 5. Widget is positioned correctly; 6. Widget functions as expected; 7. Widget remains visible after page refresh"
```

### 4. Data Standardization
- **Priority Mapping**: 1 → High, 2 → Medium, 3 → Low
- **Status Update**: All "DRAFT" → "Ready for Test"
- **Owner Standardization**: All → "QA Team"
- **Type Standardization**: FUNCTIONAL → Functional, UI → UI-UX, PERFORMANCE → Performance
- **Module Standardization**: "Dashbord > Job Summary" → "Job Summary"

### 5. Line Break Removal
- Convert all internal line breaks to semicolon separation
- Remove excessive whitespace
- Ensure CSV compatibility

## 🚨 Critical Issues to Fix

### Priority 1: Character Limit Compliance
- All fields must be under their respective limits
- Steps: ≤2000 characters
- Expected Result: ≤1000 characters
- Precondition: ≤1000 characters

### Priority 2: CSV Formatting
- Remove all line breaks
- Fix quote escaping
- Ensure proper comma separation

### Priority 3: Professional Standards
- Implement step-by-step pairing
- Standardize test case titles
- Apply consistent formatting

## 📊 Test Case Categories

### UI Test Cases (11)
- Widget visibility and positioning
- Drag and drop functionality
- Time filter options
- Custom date picker
- Pagination and sorting
- Loading animations
- Multi-vehicle job expansion
- Popup functionality

### Functional Test Cases (18)
- Planned jobs functionality
- In-progress jobs management
- Notified jobs display
- Contracted jobs handling
- Completed jobs validation
- Field verification across tabs
- Navigation functionality
- Data formatting validation

### Performance Test Cases (2)
- Load time validation
- Pagination animation performance

## 📊 Expected Outcome
- **Clean CSV file** ready for Testiny import
- **Professional test case structure** following QA best practices
- **Step-by-step validation capability** for enhanced test execution
- **Consistent formatting** across all test cases
- **Character limit compliance** for all fields

## 🔄 Next Steps
1. Create optimized CSV with proper column structure
2. Implement step-by-step expected result pairing
3. Apply professional title formatting
4. Standardize all data fields
5. Validate character limits and CSV compatibility
