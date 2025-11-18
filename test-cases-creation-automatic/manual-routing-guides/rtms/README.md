# Requirements Traceability Matrix (RTM) Files

This folder contains RTM files for tracking requirements to test case mappings.

## File Naming Convention
- `RTM_[Feature]_[JIRA-ID].csv`
- Example: `RTM_Manual_Load_Planning_PB-3176.csv`

## RTM Structure
Standard columns should include:
- **Requirement ID** - Jira ticket ID (e.g., PB-3176)
- **Requirement Description** - Feature/story summary
- **Test Case ID** - Testiny test case ID
- **Test Case Description** - Test scenario description
- **Test Type** - Functional, Integration, Regression, etc.
- **Priority** - High, Medium, Low
- **Status** - Not Started, In Progress, Completed
- **Coverage** - Covered, Partially Covered, Not Covered
- **Notes** - Additional comments

## Usage
1. Create RTM CSV files in this folder
2. Update RTM as test cases are created/modified
3. Use for sprint reviews and QA reporting
4. Track coverage gaps and missing test scenarios

---
**Last Updated:** October 1, 2025

