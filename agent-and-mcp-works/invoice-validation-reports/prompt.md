# Job Name Matching Process - LogisticsPlatform Invoice System

## Overview
This process automates job name matching using MCP browser automation, based on job names listed in a Google Sheet. The goal is to match jobs with companies that have completed loads in the Invoice Management system of LogisticsPlatform, and document the findings in Markdown and CSV formats.

## Required Links and Credentials

### 1. Google Sheet (Source Data)
- **URL**: https://docs.example.com/spreadsheets/d/12kErDQ_pZa44k84mwCiOV5IHrj4uFZXsx5PKXH3Cke4/edit?gid=2071411314#gid=2071411314
- **Purpose**: Extract job names from column C (jobname column)
- **Access**: Public access, no login required

### 2. LogisticsPlatform Dashboard
- **URL**: https://app.example-platform.com/dashboard
- **Login Credentials**:
  - Username: `USER-MANAGER-001`
  - Password: `Password@123`
- **Purpose**: Access the main dashboard to navigate to Invoice Management

### 3. Invoice Management Section
- **URL**: https://app.example-platform.com/invoice-management/invoice-receivables/other-contracts?tabIndex=NaN&fromDate=Tue%20Jul%2001%202025%2011:31:43%20GMT%2B0530%20(India%20Standard%20Time)&toDate=Fri%20Aug%2001%202025%2011:31:43%20GMT%2B0530%20(India%20Standard%20Time)
- **Purpose**: View companies with completed loads ready for invoicing

## 🔄 Optimized Job Matching Process
This is an efficient matching process that first identifies patterns in each company and then matches jobs based on these patterns.

### 📝 File Update Sequence
After completing each search session and updating the tracking files, the process must include updating the source "ClientC job" file:

1. **Update Tracking Files First**:
   - Update `advantis_july-august.csv` with new findings
   - Update `advantis_july-august_fixed.md` with new findings and summary

2. **Clean Source File**:
   - Remove all found jobs from the `ClientC job` file
   - Keep only jobs that still need to be processed
   - This ensures the source file remains current and focused

3. **File Synchronization**:
   - All three files must be synchronized after each update
   - The source file should only contain unprocessed jobs
   - This prevents duplicate searches and maintains process efficiency

### 🔁 Enhanced Pattern Recognition Methodology
1. **Company Inventory Analysis**
   - First go through all jobs in each company systematically
   - Record all job names and their formats in each company
   - Identify recurring patterns specific to each company (e.g., date formats, prefixes, numbering systems)
   - Create a pattern catalog that maps companies to their typical job name formats

2. **Pattern-Based Job Grouping**
   - Analyze job names to identify common prefixes (SW, SWA, CS, etc.)
   - Group jobs with similar prefixes together
   - Process jobs in these logical groups rather than arbitrary batches
   - Match new jobs against previously identified patterns in each company
   - Prioritize companies where similar patterns were previously found

3. **Company-First Search Strategy**
   - Open LogisticsPlatform Dashboard and log in
   - Navigate to Invoice → Other Contracts → READY TO INVOICE
   - For each company listed:
     - Click "Create Invoice"
     - Search by job prefix (e.g., "SW" or "SWA") rather than full job names
     - Document all matching jobs found in that company at once
     - This approach is much more efficient than searching each job individually

4. **Comprehensive Documentation**
   - Update both tracking files simultaneously:
     - job_names_and_companies.csv
     - job_names_and_companies.md
   - Include detailed information:
     - Job Name
     - Company Name
     - Match Status (✅, 🔍, or ❌)
     - Any pattern variations or notes

5. **Systematic Coverage**
   - After completing one prefix group, move to the next group
   - Ensure all job prefixes are searched in all relevant companies
   - Check new jobs against previously identified patterns in each company
   - Prioritize searching in companies where similar patterns were previously found
   - Reference existing MD files and job lists to identify established patterns
   - This method significantly reduces search time while improving accuracy

**Expected Job Names from Sheet (First Batch):**
- ProductB
- Dummy Kaushika-Job Traning-24th July
- ClientB JULY 25 2025
- ClientA JULY 25 2025
- ProductB July 25 2025
- ClientB July 25 2025
- Vijith LL-2883 ProductB trips CS0936
- Vijith LL-2883 ProductB trips CS0937
- Vijith LL-2883 ProductB trips CS0930
- 1010288811

**Expected Companies in LogisticsPlatform:**
- CompanyA Roofing Ltd
- CompanyE Pvt Ltd
- CompanyF Paints (Pvt) Ltd
- CompanyG Garments Private Limited
- ClientB Ecocycle Lanka (Private) Limited
- CompanyB Packaging (Pvt) Ltd
- CompanyI International Ltd
- CompanyC Cement Ltd - ClientB

## Current Results Summary

### ✅ Successful Matches Found:
- **ProductA July 30 2025** → CompanyA Roofing Ltd
- **ProductB** → CompanyB Packaging (Pvt) Ltd
- **ClientA JULY 25 2025** → CompanyC Cement Ltd - ClientB
- **ClientB JULY 25 2025** → CompanyC Cement Ltd - ClientB
- **ClientB July 25 2025** → CompanyC Cement Ltd - ClientB
- **Vijith LL-2883 ProductB trips CS0930** → CompanyB Packaging (Pvt) Ltd

### 🔍 Partial Matches:
- **Vijith LL-2883 ProductB trips CS0936/CS0937** → "Vijith LB-1882 ProductB trips" in CompanyB Packaging (Pvt) Ltd
- **ClientB July 29 2025** → "Eco July 30 2025" and "ClientB eco" in ClientB Ecocycle Lanka (Private) Limited

### ❌ Still Need to Search:
- Dummy Kaushika-Job Traning-24th July
- ProductB July 25 2025
- 1010288811
- SW10042-July-2025

## File Structure

### job_names_and_companies.md
```markdown
# Job Names and Companies Mapping

## Job Names from Google Sheet
[List of job names from the sheet]

## Companies Found in LogisticsPlatform System
[List of companies with completed loads]

## Matched Jobs Found
[Successful matches with ✅]

## Next Steps
[Remaining tasks]
```

### job_names_and_companies.csv
```csv
Job Name,Company Name,Status,Notes
[Job name],[Company],[Found/Not Found/Partial Match],[Details]
```

## 🧠 MCP Automation Command Guidelines
Use the following MCP automation functions for efficient pattern-based searching:

| Action | MCP Command |
| ------ | ----------- |
| Open URL | `mcp_playwright_browser_navigate` |
| Click Menu / Buttons | `mcp_playwright_browser_click` |
| Search by Pattern/Prefix | `mcp_playwright_browser_type` |
| Extract & Snapshot Results | `mcp_playwright_browser_snapshot` |
| Logic or Evaluation (if needed) | `mcp_playwright_browser_evaluate` |

Optimization Tips:
- Use prefix patterns (SW, SWA, CS) instead of full job names for more efficient searching
- Search each company for all jobs with similar prefixes at once
- Document all matches found during a single search session
- Wait for elements to load after each navigation
- Close the invoice dialog before proceeding to next company
- Use stable selectors or data attributes for targeting elements

## 📄 File Output Structure

### 🔄 Complete File Update Workflow
The process must follow this sequence to maintain file synchronization:

1. **Search and Document**: Complete systematic search using MCP automation
2. **Update CSV**: Add new findings to `advantis_july-august.csv`
3. **Update Markdown**: Add new findings to `advantis_july-august_fixed.md`
4. **Clean Source**: Remove found jobs from `ClientC job` file
5. **Verify Sync**: Ensure all three files are consistent

**Important**: The source file "ClientC job" must be updated after each search session to prevent duplicate searches and maintain process efficiency.

### ✅ job_names_and_companies.md
```markdown
# Job Name Matching – Summary

## ✅ Matches
- Job: `ProductB` → Company: `CompanyB Packaging (Pvt) Ltd`

## 🔍 Partial Matches
- Job: `ClientB July 29 2025` → Found as "ClientB eco"

## ❌ Not Found
- Job: `SW10042-July-2025` → Not available in current period

## Notes
- Only 10 jobs processed per round
- Data is updated incrementally
```

### 📊 job_names_and_companies.csv
```csv
Job Name,Company Name,Status,Notes
ProductB,CompanyB Packaging (Pvt) Ltd,Found,Exact match
SW10042-July-2025,,Not Found,No match in READY TO INVOICE
ClientB July 29 2025,ClientB Ecocycle Lanka (Private) Limited,Partial,Found as "ClientB eco"
```

## 🧪 Success Criteria
- Pattern inventory is created for each company to identify job naming conventions
- Jobs are grouped and searched by common prefix patterns for maximum efficiency
- All job names with similar prefixes are searched together in each company
- New jobs are matched against previously identified patterns in each company
- Companies with similar patterns are prioritized for searching
- Both .md and .csv files are incrementally updated with new findings
- **Source file "ClientC job" is cleaned after each update session**
- **All three files remain synchronized and current**
- No jobs skipped or overlooked
- Complete documentation of all matches found during search sessions
- Pattern catalog is maintained and updated with new discoveries
- Only MCP automation is used — no manual steps
- Significant time savings compared to individual job name searches

## 🔍 Troubleshooting Tips
| Issue | Resolution |
| ----- | ---------- |
| Login failure | Re-check credentials and login sequence |
| No results for specific job | Try searching by prefix pattern instead of full job name |
| No results for any jobs | Try different prefix variations (SW vs SWA) |
| Dialog not opening | Wait for UI stability before clicking "Create Invoice" |
| Page crashes | Restart MCP browser context |
| Too many search results | Refine prefix pattern to be more specific |
| Files out of sync | Ensure all three files are updated in sequence: CSV → MD → Source |
| Duplicate searches | Clean source file after each update session |

## Data Quality Observations

### Variations Found:
1. **Case Sensitivity**: Some job names appear with different case variations
2. **Number Variations**: "Vijith LL-2883" vs "Vijith LB-1882" (data entry variations)
3. **Date Variations**: "ClientB July 29 2025" vs "Eco July 30 2025"

### Identified Patterns:
1. **Company-Specific Patterns**: Each company tends to use consistent job naming conventions
2. **Date-LP Pattern**: Jobs with format "DDMMMYY-LP-NNNN-XX" are found in SPAR SL(PVT) LTD commitment contracts
3. **GSK Pattern**: Jobs starting with "GSK" followed by month-number are found in HALEON PVT
4. **Letter-Number Pattern**: Jobs with format "XX-NNNN-DD-MM-YYYY" are found in The Swadeshi Industrial Works PLC
5. **GB/LE Pattern**: Jobs starting with "GB-" or "LE-" followed by numbers and dates are found in The Swadeshi Industrial Works PLC
6. **Section-Specific Patterns**: Some job patterns are only found in specific sections (e.g., commitment contracts vs. other contracts)

### Recommendations:
1. **Pattern Inventory First**: Begin by systematically cataloging all job patterns in each company
2. **Use Pattern-Based Searching**: Group jobs by common prefixes (SW, SWA, CS) for efficient searching
3. **Company-First Approach**: Search each company for all relevant job patterns at once
4. **Pattern Matching**: Check new jobs against previously identified patterns in each company
5. **Prioritize Known Patterns**: Focus on companies where similar patterns were previously found
6. **Reference Existing Documentation**: Use MD files and job lists to identify established patterns
7. **Partial Matches**: Review manually for confirmation
8. **Not Found Jobs**: Search in other tabs (DRAFT, UNPAID, PAID, OVERDUE)
9. **Data Quality**: Consider standardizing job naming conventions
10. **Documentation**: Document all matches found during a single search session and update pattern catalog

## 📊 Established Pattern Catalog

### Company-Specific Patterns:

1. **SPAR SL(PVT) LTD**:
   - Date-LP Pattern: "DDMMMYY-LP-NNNN-XX" (e.g., 31JULY25-LP-2161-02)
   - Found in: Commitment Contracts section
   - Examples: 26JULY25-LP-2161-02, 31JULY25-LP-1701-05, 04AUG25-LP-2161-03

2. **HALEON PVT**:
   - GSK Pattern: "GSK MM-NN" (e.g., GSK 07-84)
   - Found in: Other Contracts section
   - Examples: GSK 07-84, GSK 07-85, GSK 08-01

3. **The Swadeshi Industrial Works PLC**:
   - Letter-Number Pattern: "XX-NNNN-DD-MM-YYYY" (e.g., DAH-4269-26-07-2025)
   - GB/LE Pattern: "XX-NNNN-DD-MMM-YYYY-NNXXX" (e.g., GB-7711-JULY-2025-01FAC)
   - Found in: Other Contracts section
   - Examples: LP-3498-24-07-2025, DAH-4269-26-07-2025, GB-7711-29-JULY-2025-01FAC 