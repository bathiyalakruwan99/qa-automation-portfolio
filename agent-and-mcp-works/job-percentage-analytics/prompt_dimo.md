# Job Status Checker - LogisticsPlatform Automation (ClientA)

## Overview
This automation tool checks job status, completion percentages, and load details from the LogisticsPlatform system for ClientA jobs listed in `ClientA JObs`. It automatically updates a markdown report and manages the job list to avoid duplicate checks.

## Workflow Steps

### 1. Initial Setup
- Navigate to LogisticsPlatform: `https://app.example-platform.com/reports/job-master`
- Login with credentials: `USER-123456789` / `Password@123`
- Set date range: `7/26/2025, 01:00:03` to `8/26/2025, 23:59:10`
- Select "Select Date Range" filter option
- **CRITICAL**: Date range only needs to be set once per batch; if already correctly configured, do not re-set for subsequent job checks within the same batch
- **IMPORTANT**: Never click "Clear Search" button as it resets the date filter to "Today's" instead of maintaining the custom date range

### 2. Date Range and Filter Management
**CRITICAL RULES FOR EFFICIENT PROCESSING:**
- **Date Range**: Set to `7/26/2025, 01:00:03` to `8/26/2025, 23:59:10` only once per batch
- **Clear Search Button**: NEVER click this button as it resets the date filter to "Today's" instead of maintaining the custom date range
- **Efficient Job Switching**: Instead of clearing search, directly type new job ID in the "Job Title" field and click "Filter"
- **Date Filter Persistence**: The custom date range will be maintained across multiple job searches within the same session
- **If Date Range Gets Reset**: Only re-set the date range if the current filter cannot find the target job

### 3. Job Processing
For each job in `ClientA JObs`:
- Type job ID in "Job Title" field (do NOT click "Clear Search")
- Click "Filter" button
- Click dropdown icon (expand_more) for each job result
- Extract the following information:
  - Job ID
  - Status (Completed, In-Progress, Planning, etc.)
  - Completion percentage
  - Customer reference
  - **Load IDs** (critical - each load has unique ID)
  - Created date
  - Job type
  - Number of containers

### 4. Duplicate Job Handling
**IMPORTANT**: If the same job appears multiple times with different statuses/times:
- Check ALL instances of the same job name
- Expand each instance to see all loads
- Record ALL loads for that job
- Update the markdown with complete information

### 5. Load ID Management
**CRITICAL RULE**: If checking the same job again and load IDs are identical:
- **DO NOT** create duplicate entries
- **UPDATE** the previous entry with new information
- **MERGE** any new loads that weren't in the previous check
- This prevents duplicate entries in the report

### 6. Data Recording
Update `job_status_report_dimo.md` with:
- Job ID
- Status
- Percentage
- Customer reference
- **Load ID** (unique identifier for each load)
- Created date
- Job type details

### 7. Job List Management
**AFTER** successfully checking a job:
- **REMOVE** the checked job from `ClientA JObs`
- This prevents re-checking the same jobs
- Ensures efficient processing of remaining jobs

## File Structure

### Input Files
- `ClientA JObs` - List of ClientA jobs to check (gets updated as jobs are processed)

### Output Files
- `job_status_report_dimo.md` - Comprehensive report with all ClientA job details and load IDs

## Example Job Entry Format
```markdown
## Job: SWA10128-August-2025

| Date Checked | Job ID | Status | Percentage | Customer Reference | Load ID | Created Date |
|------------|--------|--------|------------|-------------------|---------|--------------|
| 2023-08-26 | SWA10128-August-2025 | In-Progress | 75% | SWA1012 | ADV3PL-250815-00001 - 1 | 15 August 2025 9:00 AM |

### Details:
- Job Type: LF-DO-FTL
- Number of Containers: 1
- **Load 1**: ADV3PL-250815-00001 - 1 (In-Progress, 75%)
```

## Key Rules
1. **Always check ALL instances** of the same job name
2. **Record ALL load IDs** for each job
3. **Update existing entries** if load IDs match (don't duplicate)
4. **Remove checked jobs** from ClientA JObs after processing
5. **Maintain data integrity** by avoiding duplicate entries
6. **Focus on load IDs** as the unique identifier for each load
7. **Date Range Management**: Never click "Clear Search" - maintain custom date range for efficiency
8. **100% Completion Jobs**: Jobs with 100% completion but In-Progress status should be tracked separately for follow-up

## Special Job Categories

### 100% Completion - In-Progress Jobs
- **Identification**: Jobs that show 100% completion but remain marked as "In-Progress"
- **Action Required**: These jobs may need status updates in the LogisticsPlatform system
- **Tracking**: Move these jobs to a separate file (`100_percent_inprogress_jobs_dimo.md`) for follow-up
- **Reason**: Jobs with 100% completion should typically be marked as "Completed" in the system

## Error Handling
- If a job is not found, note it in the report as "Not Found"
- If login fails, retry with credentials: `USER-123456789` / `Password@123`
- If date range doesn't work, try alternative date formats
- Always verify load information before recording
- If "Clear Search" is accidentally clicked, re-set the date range to the correct values

## ClientA-Specific Notes
- **Job Source**: All jobs are from the `ClientA JObs` file
- **Login Credentials**: Use `USER-123456789` / `Password@123` for ClientA access
- **Date Range**: Same as main system: `7/26/2025, 01:00:03` to `8/26/2025, 23:59:10`
- **Output File**: Use `job_status_report_dimo.md` for ClientA job reports
- **100% Jobs File**: Use `100_percent_inprogress_jobs_dimo.md` for ClientA 100% completion jobs
