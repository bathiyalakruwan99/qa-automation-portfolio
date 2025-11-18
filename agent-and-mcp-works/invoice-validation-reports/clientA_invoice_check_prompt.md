# ClientA Job Name Matching Process - LogisticsPlatform Invoice System

## Overview
This process automates ClientA job name matching using MCP browser automation. The goal is to match ClientA jobs with companies that have completed loads in the Invoice Management system of LogisticsPlatform, and document the findings in Markdown and CSV formats.

## Required Links and Credentials

### 1. Google Sheet (Source Data)
- **URL**: https://docs.example.com/spreadsheets/d/12kErDQ_pZa44k84mwCiOV5IHrj4uFZXsx5PKXH3Cke4/edit?gid=2071411314#gid=2071411314
- **Purpose**: Extract ClientA job names from column C (jobname column)
- **Access**: Public access, no login required

### 2. LogisticsPlatform Dashboard
- **URL**: https://app.example-platform.com/dashboard
- **Login Credentials**:
  - Username: `USER-123456789`
  - Password: `Password@123`
- **Purpose**: Access the main dashboard to navigate to Invoice Management

### 3. Invoice Management Section
- **URL**: https://app.example-platform.com/invoice-management/invoice-receivables/other-contracts?tabIndex=NaN&fromDate=Tue%20Jul%2001%202025%2011:31:43%20GMT%2B0530%20(India%20Standard%20Time)&toDate=Fri%20Aug%2001%202025%2011:31:43%20GMT%2B0530%20(India%20Standard%20Time)
- **Purpose**: View companies with completed loads ready for invoicing

## 🔄 Optimized ClientA Job Matching Process
This is an efficient matching process focusing specifically on ClientA jobs and their patterns.

### 📝 File Update Sequence
After completing each search session and updating the tracking files, the process must include:

1. **Update Tracking Files First**:
   - **DO NOT create new MD or CSV files** for different job types
   - Always update the existing tracking files:
     - Update `dimo_job_names_and_companies.csv` with new findings including counts
     - Update `dimo_job_names_and_companies.md` with new findings, counts, and summary
   - Group findings by job type (ClientA, ClientB, Vijith, etc.) within the same files
   - This maintains a single source of truth for all job findings

2. **Clean Source File After Verification**:
   - After confirming jobs are found in the system and properly documented:
     - Create a backup of the original file before removal (e.g., `ClientA jobs.bak`)
     - Remove all found jobs from the `ClientA jobs` file
     - Use exact pattern matching to ensure correct removal
     - For jobs with multiple instances, ensure all instances are removed
   - Keep only jobs that still need to be processed
   - This ensures the source file remains current and focused on remaining jobs

3. **Removal Verification**:
   - After removing found jobs, verify the `ClientA jobs` file no longer contains them
   - Use search tools (e.g., grep) to confirm complete removal
   - Document the count of jobs removed and jobs remaining
   - This provides an audit trail of processing progress

4. **File Synchronization**:
   - All files must be synchronized after each update
   - The source file should only contain unprocessed jobs
   - The tracking files must reflect all processed jobs with accurate counts
   - This prevents duplicate searches and maintains process efficiency

### 🔁 Pattern Recognition and Counting Methodology
1. **Job Pattern Analysis**
   - First analyze all job names containing specific prefixes (ClientA, ClientB, etc.) in each company
   - Record all job names and their formats in each company
   - Identify recurring patterns specific to job types (e.g., date formats, prefixes)
   - Count instances of each unique job name pattern in the source file
   - Create a pattern catalog that maps companies to their typical job name formats
   - Document the count of each job pattern found in both source file and invoice system

2. **Pattern-Based Job Grouping and Counting**
   - Analyze job names to identify common prefixes (ClientA, ClientB, etc.)
   - Group jobs with similar patterns together
   - Count multiple instances of the same job name
   - Process jobs in these logical groups rather than arbitrary batches
   - Match new jobs against previously identified patterns in each company
   - Compare counts between source file and invoice system for verification
   - Prioritize companies where similar patterns were previously found (especially CompanyC Cement Ltd - ClientB)

3. **Company-First Search Strategy with Pagination Handling**
   - Open LogisticsPlatform Dashboard and log in
   - Navigate to Invoice → Other Contracts → READY TO INVOICE
   - For each company listed:
     - Click "Create Invoice"
     - Search by prefix (like "ClientA", "ClientB", etc.) rather than full job names
     - **Pagination Handling:**
       - Check the total number of pages displayed at the bottom of the results
       - Process all pages systematically using the pagination controls
       - On each page, focus ONLY on entries with "Completed" status in the "Load Status" column
       - Extract job details from completed loads only
       - Use the "Next Page" button ('>') to navigate through all pages
       - Track current page position to ensure complete coverage
       - Count instances of each unique job name found in the system
     - Document all matching jobs found in that company at once, including counts
     - Compare counts between source file and invoice system for verification
     - This approach is much more efficient than searching each job individually

4. **Comprehensive Documentation with Count Verification**
   - Update both tracking files simultaneously:
     - dimo_job_names_and_companies.csv
     - dimo_job_names_and_companies.md
   - Include detailed information:
     - Job Name
     - Company Name
     - Count in Source File (how many instances in the original file)
     - Count in Invoice System (how many instances found in the system)
     - Match Status (✅, 🔍, or ❌)
     - Any pattern variations or notes
     - Count verification status (✅ if counts match, ⚠️ if counts differ)

5. **Systematic Coverage**
   - After completing one pattern group, move to the next group
   - Ensure all ClientA job patterns are searched in all relevant companies
   - Check new jobs against previously identified patterns in each company
   - Prioritize searching in CompanyC Cement Ltd - ClientB where ClientA patterns were previously found
   - This method significantly reduces search time while improving accuracy

**Expected ClientA Job Name Patterns:**
- ClientA MONTH DD YYYY (e.g., "ClientA JULY 25 2025")
- ClientA DD-MM-YYYY
- ClientA - [Additional Identifier]

**Expected Companies for ClientA Jobs:**
- CompanyC Cement Ltd - ClientB (primary)
- Other companies to check:
  - CompanyA Roofing Ltd
  - CompanyE Pvt Ltd
  - CompanyF Paints (Pvt) Ltd
  - CompanyG Garments Private Limited
  - ClientB Ecocycle Lanka (Private) Limited
  - CompanyB Packaging (Pvt) Ltd
  - CompanyI International Ltd

## Current Results Summary

### ✅ Successful Matches Found:
- **ClientA JULY 25 2025** → CompanyC Cement Ltd - ClientB

### 🔍 Partial Matches:
- None identified yet

### ❌ Still Need to Search:
- New ClientA jobs from the source file

## File Structure

### dimo_job_names_and_companies.md
```markdown
# ClientA Job Names and Companies Mapping

## Summary
[Summary statistics]

## Job Names Processed
[List of ClientA job names from the sheet]

## Companies Found in LogisticsPlatform System
[List of companies with completed ClientA loads]

## Matched Jobs Found
[Successful matches with ✅]

## Next Steps
[Remaining tasks]
```

### dimo_job_names_and_companies.csv
```csv
Job Name,Company Name,Status,Notes
[ClientA job name],[Company],[Found/Not Found/Partial Match],[Details]
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
| Wait for Element | `mcp_playwright_browser_wait_for` |
| Pagination Navigation | `mcp_playwright_browser_click` with pagination controls |

### Pagination Handling with MCP Tools

1. **Checking Total Pages**:
   - Use `mcp_playwright_browser_snapshot` to capture the page state
   - Locate pagination information showing "Page X of Y" 
   - Note the total number of pages (Y)

2. **Processing Each Page**:
   - Use `mcp_playwright_browser_snapshot` to capture the current page content
   - Look for the table with load information
   - Identify rows with "Completed" status in the appropriate column
   - Extract job information ONLY from completed loads
   - Filter for job names containing "ClientA"
   - Document all matches found on the current page

3. **Navigating Pages**:
   - Use `mcp_playwright_browser_click` with the next page button selector
   - Use `mcp_playwright_browser_wait_for` to ensure the next page loads
   - Use `mcp_playwright_browser_snapshot` to verify page content changed
   - Repeat the process for each page

Optimization Tips:
- Use "ClientA" as a prefix search term for more efficient searching
- Search each company for all ClientA jobs at once
- Document all matches found during a single search session
- Wait for elements to load after each navigation (use `mcp_playwright_browser_wait_for`)
- Close the invoice dialog before proceeding to next company
- Use stable selectors or data attributes for targeting elements
- Focus search efforts on CompanyC Cement Ltd - ClientB first
- Track pagination state to ensure all pages are processed
- Filter for "Completed" status before extracting job details
- Store page position in case of interruptions to enable resuming

## 📄 File Output Structure

### ✅ dimo_job_names_and_companies.md
```markdown
# ClientA Job Names and Companies Mapping

## ✅ Matches with Count Verification
- Job: `ClientA JULY 25 2025` → Company: `CompanyC Cement Ltd - ClientB`
  - Source Count: 1 | System Count: 1 | Count Match: ✅

- Job: `ClientB July 28 2025` → Company: `CompanyC Cement Ltd - ClientB`
  - Source Count: 9 | System Count: 9 | Count Match: ✅
  - All 9 instances verified in the system

## 🔍 Partial Matches
- Job: `ClientA [Pattern]` → Found as "[Variation]"
  - Source Count: 1 | System Count: 1 | Count Match: ✅
  - Pattern variation details

## ❌ Not Found
- Job: `ClientA [Job Name]` → Not available in current period
  - Source Count: 1 | System Count: 0 | Count Match: ❌

## ⚠️ Count Discrepancies
- Job: `[Job Name]` → Company: `[Company]`
  - Source Count: X | System Count: Y | Count Mismatch: ⚠️
  - Possible reasons for count discrepancy
```

### 📊 dimo_job_names_and_companies.csv
```csv
Job Name,Company Name,Source Count,System Count,Status,Count Match,Notes
ClientA JULY 25 2025,CompanyC Cement Ltd - ClientB,1,1,Found,✅,Exact match
ClientB July 28 2025,CompanyC Cement Ltd - ClientB,9,9,Found,✅,All instances verified
ClientA [Job Name],,1,0,Not Found,❌,No match in READY TO INVOICE
```

## 🧪 Success Criteria
- Pattern inventory is created for each company with job counts
- Jobs are grouped and searched by common patterns for maximum efficiency
- All job names with similar patterns are searched together in each company
- Count verification is performed for all job names
- Source file counts are compared with system counts for each job name
- Count discrepancies are documented with possible explanations
- New jobs are matched against previously identified patterns in each company
- CompanyC Cement Ltd - ClientB is prioritized for searching
- Both .md and .csv files are incrementally updated with new findings including counts
- Found jobs are systematically removed from ClientA jobs file after verification
- Removal is verified to ensure no found jobs remain in the source file
- A backup of the original file is maintained before removal
- Source file is cleaned after each update session to contain only unprocessed jobs
- All files remain synchronized and current with accurate count information
- No jobs skipped or overlooked
- Complete documentation of all matches found during search sessions with counts
- Pattern catalog is maintained and updated with new discoveries and count information
- Only MCP automation is used — no manual steps

## 🔍 Troubleshooting Tips
| Issue | Resolution |
| ----- | ---------- |
| Login failure | Re-check credentials and login sequence |
| No results for specific job | Try searching by prefix (ClientA, ClientB, etc.) instead of full job name |
| No results for any jobs | Try different prefix variations |
| Dialog not opening | Wait for UI stability before clicking "Create Invoice" |
| Page crashes | Restart MCP browser context |
| Too many search results | Refine search pattern to be more specific |
| Files out of sync | Ensure all files are updated in sequence: CSV → MD → Source |
| Duplicate searches | Clean source file after each update session |
| Pagination issues | Use explicit wait for page elements to load before processing |
| Missing pagination controls | Check if results fit on a single page (no pagination needed) |
| Incomplete page processing | Store last processed page number to enable resuming |
| Non-completed loads included | Double-check status filter to ensure only completed loads are processed |
| Table structure changes | Adjust column selectors in the code to match the current table structure |
| Count discrepancies | Verify counts in both source file and system, document differences |
| Multiple instances not counted | Ensure counting logic handles duplicate job names correctly |
| Count verification failures | Document possible reasons for count mismatches |
| Pattern variations affecting counts | Check for case sensitivity or formatting differences |
| Job removal failures | Use exact pattern matching for removal; check for whitespace or case differences |
| Incomplete job removal | Verify removal with search tools after cleaning the source file |
| Missing backup before removal | Always create a backup file (e.g., `ClientA jobs.bak`) before removing entries |
| Removal of wrong jobs | Double-check job names before removal; use precise pattern matching |

## Data Quality and Count Verification

### Variations Found:
1. **Case Sensitivity**: "ClientA" appears in all caps consistently, while "ClientB" has first letter capitalized
2. **Month Format**: Month names appear in different cases ("JULY" vs "July")
3. **Associated Company**: ClientA and ClientB jobs are consistently found in CompanyC Cement Ltd - ClientB
4. **Multiple Instances**: Some job names appear multiple times in both source file and system

### Identified Patterns:
1. **ClientA Date Pattern**: Jobs with format "ClientA MONTH DD YYYY" are found in CompanyC Cement Ltd - ClientB
2. **ClientB Date Pattern**: Jobs with format "ClientB Month DD YYYY" are found in CompanyC Cement Ltd - ClientB
3. **Company-Specific Association**: Both job types appear to be exclusively associated with CompanyC Cement Ltd - ClientB
4. **Count Patterns**: Multiple instances of the same job name indicate repeated deliveries or services

### Count Verification Recommendations:
1. **Pattern Inventory with Counts**: Begin by systematically cataloging all job patterns and their counts
2. **Use Pattern-Based Counting**: Count instances of each job name in both source file and system
3. **Company-First Approach**: Search CompanyC Cement Ltd - ClientB first for all jobs
4. **Pattern Matching with Count Verification**: Check new jobs against previously identified patterns and verify counts
5. **Prioritize Known Patterns**: Focus on companies where patterns were previously found
6. **Count Documentation**: Document all matches found with their counts during a single search session
7. **Count Discrepancy Analysis**: Investigate and document reasons for any count mismatches
8. **Data Quality**: Consider standardizing job naming conventions for easier counting and matching

## 📊 Established Pattern Catalog with Counts

### Company-Specific Patterns:

1. **CompanyC Cement Ltd - ClientB**:
   - ClientA Date Pattern: "ClientA MONTH DD YYYY" (e.g., "ClientA JULY 25 2025")
     - Count in Source File: 1
     - Count in System: 1
     - Count Match: ✅
   - ClientB Date Pattern: "ClientB Month DD YYYY" (e.g., "ClientB July 28 2025")
     - Count in Source File: Multiple instances (9 for July 28, 11 for July 29, etc.)
     - Count in System: Matching counts verified
     - Count Match: ✅
   - Found in: Other Contracts section with Completed status
   - Examples: 
     - ClientA JULY 25 2025 (1 instance)
     - ClientB July 28 2025 (9 instances)
     - ClientB July 29 2025 (11 instances)
     - ClientB July 30 2025 (3 instances)
     - ClientB July 31 2025 (1 instance)
     - ClientB August 4 2025 (2 instances)
     - ClientB August 5 2025 (2 instances)

## 🔄 Data Extraction Procedure

### Systematic Pagination Data Extraction
To ensure thorough and efficient data extraction from the invoice module:

1. **Initial Setup**:
   - Log in to the LogisticsPlatform system
   - Navigate to Invoice Management → Other Contracts → READY TO INVOICE
   - Configure date range to cover the relevant period

2. **For Each Company**:
   - Click on "Create Invoice" for the company
   - Verify that the company's loads page has loaded properly

3. **Pagination Analysis**:
   - Check if pagination controls are present
   - Determine total number of pages (look for "Page X of Y" indicator)
   - Initialize tracking variables to store current position

4. **Per-Page Processing Using MCP Tools**:
   - For each page:
     1. Use `mcp_playwright_browser_wait_for` for table data to fully load
     2. Use `mcp_playwright_browser_snapshot` to capture the page content
     3. Visually identify rows with "Completed" status only
     4. Extract job details ONLY from completed rows
     5. Match job names against ClientA patterns
     6. Record matching results with company and status details
     7. Use `mcp_playwright_browser_click` on "Next Page" button if not on last page
     8. Use `mcp_playwright_browser_wait_for` before processing the next page

5. **Completed Load Filtering**:
   - Identify the "Load Status" column (typically 4th column)
   - Only process rows where status is "Completed"
   - Skip rows with other statuses like "Pending" or "In Progress"

6. **Data Storage Strategy**:
   - Create temporary storage to hold all matches from all pages
   - Include metadata: job name, status, company, page found on
   - At the end of all pages, consolidate results into CSV and MD formats

7. **Recovery Mechanism**:
   - Save progress after each page is processed
   - Record last successfully processed page and company
   - Implement resume capability to continue from last processed page

   ## Recommendations:
1. **Pattern Inventory with Count Tracking**: Begin by systematically cataloging all job patterns and their counts in each company
2. **Use Pattern-Based Searching and Counting**: Group jobs by common prefixes (ClientA, ClientB, SW, SWA, CS) for efficient searching and count verification
3. **Company-First Approach with Count Verification**: Search each company for all relevant job patterns at once and verify counts match
4. **Pattern Matching with Count Comparison**: Check new jobs against previously identified patterns and compare counts between source and system
5. **Prioritize Known Patterns**: Focus on companies where similar patterns were previously found
6. **Reference Existing Documentation**: Use MD files and job lists to identify established patterns and expected counts
7. **Partial Matches with Count Analysis**: Review manually for confirmation and analyze any count discrepancies
8. **Not Found Jobs**: Search in other tabs (DRAFT, UNPAID, PAID, OVERDUE) and document count differences
9. **Data Quality with Count Standardization**: Consider standardizing job naming conventions for more accurate counting
10. **Documentation with Count Verification**: Document all matches found during a single search session with their counts and update pattern catalog accordingly
11. **Count Discrepancy Investigation**: For any count mismatches, document possible reasons (date filtering, status differences, naming variations)
12. **Systematic Job Removal**: After verifying jobs in the system and updating documentation:
    - Create a backup of the ClientA jobs file
    - Remove all found jobs from the file using exact pattern matching
    - Verify removal was successful using search tools
    - Document the count of jobs removed and remaining
13. **Incremental Processing**: Process jobs in batches, removing found jobs after each batch to maintain a clean source file
