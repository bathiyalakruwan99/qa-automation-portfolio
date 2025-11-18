# Testiny Test Case CSV Files

This folder contains test case exports from Testiny for documentation and tracking.

## File Naming Convention
- `Testiny_Export_[Feature]_[JIRA-ID]_[Date].csv`
- Example: `Testiny_Export_Manual_Load_Planning_PB-3176_20251001.csv`

## Testiny CSV Structure
Standard Testiny export includes:
- **ID** - Test case ID in Testiny
- **Title** - Test case name
- **Description** - Detailed test steps
- **Preconditions** - Prerequisites for test execution
- **Expected Result** - Expected outcome
- **Priority** - Critical, High, Medium, Low
- **Type** - Manual, Automated
- **Status** - Active, Deprecated, Draft
- **Tags** - Feature tags, sprint tags
- **Assigned To** - QA engineer name
- **Requirements** - Linked Jira tickets

## Import/Export Workflow
1. **Export from Testiny:**
   - Navigate to test suite
   - Click Export > CSV
   - Save to this folder with proper naming

2. **Import to Testiny:**
   - Prepare CSV in Testiny format
   - Use Testiny Import feature
   - Map columns correctly

## Integration with RTM
- Cross-reference test case IDs with RTM files
- Ensure all requirements have corresponding test cases
- Update both RTM and Testiny exports when changes occur

---
**Last Updated:** October 1, 2025

