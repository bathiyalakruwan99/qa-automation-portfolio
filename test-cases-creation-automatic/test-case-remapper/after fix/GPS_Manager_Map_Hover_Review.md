# GPS Manager - Map Hover Details - Test Case Review

## Source File Analysis
- **File**: GPS Manager-map hover details.xlsx
- **Test Cases**: 3 cases
- **Module**: GPS Manager-map hover details (will standardize to "GPS Manager")
- **Focus**: Map hover functionality and tooltip displays for various map elements

## ✅ UPDATED: Step-by-Step Expected Result Pairing Applied
This review has been enhanced with the new **Step-by-Step Expected Result Pairing methodology** where each test step has its corresponding expected result immediately paired for better test execution and validation.

## Current Structure Issues Found

### 1. Column Mapping Required
- **Different Column**: "Tooltip Example" instead of "Test Data" - will map to Test Data field
- All other columns present and mappable to target format

### 2. Missing Required Columns
- **Owner**: Will add "QA Team"
- **Folder**: Will add "GPS Manager"

### 3. Title Format Updates Needed
Current titles need professional formatting:
- `[GPS Manager][Map Interaction]Verify that User can hover on vehicle path successfully`
- `[GPS Manager][Route Points]Verify that User can hover on start/end points successfully`
- `[GPS Manager][Unplanned Stops]Verify that User can hover on unplanned stop icon successfully`

### 4. Data Quality Observations
- **Tooltip Examples**: Detailed tooltip content with formatting challenges
- **Date Formats**: Multiple date/time formats need standardization
- **Vehicle Consistency**: VEH-3500 (consistent with previous files)
- **Duration Data**: Parking duration in minutes format

### 5. Character Limit Compliance
- All content appears to be well under limits
- Tooltip examples are detailed but manageable
- Date/time strings are reasonably sized

## Test Cases Summary

| Test Case | Focus Area | Priority | Current Title |
|-----------|------------|----------|---------------|
| TC-MHT-001 | Path Hover | High | Hover on Map Path |
| TC-MHT-002 | Route Points | Medium | Hover on Start/End Points |
| TC-MHT-003 | Stop Icons | High | Hover on Unplanned Stop |

## Special Formatting Needs

### Tooltip Content Standardization
Need to format complex tooltip examples for CSV compatibility:

#### TC-MHT-001 Tooltip
- **Original**: "Time: 1/2/2025, 7:03:18 AMVehicle Reg Number: VEH-3500"
- **Issue**: No line break between time and vehicle number
- **Formatted**: "Time: 1/2/2025 7:03:18 AM; Vehicle Reg Number: VEH-3500"

#### TC-MHT-002 Tooltip
- **Original**: "Path End PointDate & Time: Jan 1, 2025, 03:43:29 PM"
- **Issue**: No space between label and date
- **Formatted**: "Path End Point; Date & Time: Jan 1 2025 03:43:29 PM"

#### TC-MHT-003 Tooltip
- **Original**: "Parking Duration: 88 minutesStart: Jan 1, 2025, 07:15:53 PMEnd: Jan 1, 2025, 08:44:22 PM"
- **Issue**: No line breaks, multiple timestamps
- **Formatted**: "Parking Duration: 88 minutes; Start: Jan 1 2025 07:15:53 PM; End: Jan 1 2025 08:44:22 PM"

### Steps Enhancement Required
All test cases need verification steps:
- "Move mouse over path" → Need tooltip appearance confirmation
- "Hover over start/end icons" → Need content verification
- "Hover over parking icon" → Need duration and timestamp verification

## Planned Transformations

### Example: TC-MHT-001 Transformation
**Before:**
- Title: "Hover on Map Path"
- Steps: "Move mouse over a GPS-tracked vehicle path"
- Expected Result: "Tooltip shows time and reg number"

**After:**
- Title: "[GPS Manager][Map Interaction]Verify that User can hover on vehicle path successfully"
- Steps: "1. Locate GPS-tracked vehicle path on map; 2. Move mouse cursor over path line; 3. Observe tooltip appearance; 4. Verify tooltip content accuracy"
- Expected Result: "1. Tooltip appears on hover; 2. Tooltip displays accurate timestamp; 3. Vehicle registration number is shown; 4. Tooltip disappears when mouse moves away"

### Example: TC-MHT-003 Complex Tooltip
**Before:**
- Title: "Hover on Unplanned Stop"
- Tooltip Example: Complex multi-line content with timestamps

**After:**
- Title: "[GPS Manager][Unplanned Stops]Verify that User can hover on unplanned stop icon successfully"
- Test Data: "Parking Duration: 88 minutes; Start: Jan 1 2025 07:15:53 PM; End: Jan 1 2025 08:44:22 PM"

## Quality Checks
- ✅ All character limits will be respected
- ✅ Professional QA title format applied
- ✅ Semicolon separation for multi-line fields
- ✅ Required fields populated
- ✅ CSV-safe formatting (no problematic quotes/line breaks)
- ✅ Tooltip examples properly formatted
- ✅ Date/time formats standardized
- ✅ Vehicle data consistency maintained

## UI Interaction Coverage Analysis
This focused test suite covers essential map hover interactions:
1. **Path Hover** → Vehicle path tooltip with time and registration
2. **Route Points** → Start/end point tooltips with timestamps
3. **Stop Icons** → Unplanned stop tooltips with duration details

## ✅ COMPLETED: CSV Conversion with Step-by-Step Pairing
This file has been successfully converted to CSV format with the new Step-by-Step Expected Result Pairing methodology applied. Each test case now has 7 steps with 7 corresponding expected results, enabling immediate validation and improved test execution clarity. 