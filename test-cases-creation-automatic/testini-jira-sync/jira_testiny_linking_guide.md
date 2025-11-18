# Jira-Testiny Test Case Linking Guide

## Overview
This guide provides instructions for linking Jira tickets to Testiny test cases using browser automation. This process helps maintain traceability between requirements/issues in Jira and their corresponding test cases in Testiny.

## Prerequisites
- Access to both Jira and Testiny accounts
- Appropriate permissions to view and modify test cases in Testiny
- Appropriate permissions to view tickets in Jira
- The Jira ticket ID(s) you want to link
- The Testiny test case ID(s) you want to link to

## Required Information

| Information | Example | Notes |
|-------------|---------|-------|
| Jira Ticket ID | PB-2217 | The full ID including project prefix |
| Testiny Test Case IDs | TC-962, TC-963 | Comma-separated list of test case IDs |
| Jira Issue Type | Story | Can be Story, Bug, Epic, Task, etc. |

## Login Credentials

| System | Username | Password | Notes |
|--------|----------|----------|-------|
| Testiny | qa-user@exampleplatform.com | [your_password] | Replace with actual credentials |
| Jira | [your_username] | [your_password] | Replace with actual credentials |

## Step-by-Step Process

### 1. Navigate to Testiny
```
https://app.testiny.io/TMS/testcases
```

### 2. Login to Testiny (if not already logged in)
- Enter username/email
- Enter password
- Click "Log in"

### 3. Sequential Process (For Single Worker)
1. Search for the test case ID in the search box
2. Click "Open" on the test case
3. Click on the "Requirements" tab
4. Click "Link requirement" button
5. Select the appropriate Jira project (e.g., "PLAN-B (PB)")
6. Select the appropriate issue type (e.g., "Story", "Bug", "Epic")
7. In the search box, enter the Jira ticket ID (e.g., "PB-2217")
8. Click on the Jira ticket in the search results to select it
9. Click the "Link" button
10. Verify that the Jira ticket appears in the requirements list
11. Click "Close" to return to the test cases list
12. Repeat for each test case

### 4. Parallel Process (Using 5 Workers)
For faster processing, you can use 5 workers in parallel to update multiple test cases simultaneously:

1. **Divide test cases into 5 groups**:
   - Group 1: TC-A, TC-F, TC-K, etc.
   - Group 2: TC-B, TC-G, TC-L, etc.
   - Group 3: TC-C, TC-H, TC-M, etc.
   - Group 4: TC-D, TC-I, TC-N, etc.
   - Group 5: TC-E, TC-J, TC-O, etc.

2. **Launch 5 separate browser instances**:
   - Each worker should open a new browser window
   - Each worker should log in to Testiny separately
   - Each worker will process one group of test cases

3. **For each worker**:
   - Follow steps 1-11 from the sequential process for each test case in their assigned group
   - Work independently of other workers
   - Track progress for their assigned group

4. **Coordination**:
   - Use a shared tracking system (e.g., spreadsheet) to mark completed test cases
   - Avoid duplicate work by clearly assigning test cases to specific workers
   - Have a coordinator monitor overall progress

### 5. Verification
- After linking all test cases, you can verify the links by:
  - Opening each test case and checking the Requirements tab
  - Or checking in Jira that the test cases are linked (if bidirectional integration is enabled)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Jira ticket not found | Try different issue types (Story, Bug, Epic, etc.) |
| Cannot find test case | Verify the test case ID is correct and you have access |
| Link button disabled | Make sure you've selected a ticket from the search results |
| Login fails | Verify credentials and check if account is locked |

## Example Commands

### Sequential Process
```
Link Jira ticket PB-2217 (Story type) to Testiny test cases TC-962 and TC-963
```

### Parallel Process
```
# Worker 1
Link Jira ticket PB-2217 (Story type) to Testiny test cases TC-964, TC-969, TC-974

# Worker 2
Link Jira ticket PB-2217 (Story type) to Testiny test cases TC-965, TC-970, TC-975

# Worker 3
Link Jira ticket PB-2217 (Story type) to Testiny test cases TC-966, TC-971

# Worker 4
Link Jira ticket PB-2217 (Story type) to Testiny test cases TC-967, TC-972

# Worker 5
Link Jira ticket PB-2217 (Story type) to Testiny test cases TC-968, TC-973
```

## Performance Considerations

### Parallel Processing Benefits
- **Time Efficiency**: Processing 5 test cases simultaneously can reduce total time by up to 80%
- **Resource Utilization**: Makes better use of available computing resources
- **Scalability**: Can be scaled up or down depending on available resources

### Best Practices for Parallel Processing
- **Even Distribution**: Distribute test cases evenly among workers
- **Error Handling**: Each worker should independently track and report errors
- **Session Management**: Use separate browser sessions to avoid conflicts
- **Progress Tracking**: Implement a central progress tracking mechanism
- **Rate Limiting**: Be mindful of API rate limits when automating multiple requests

## Notes
- The Jira ticket must exist and be accessible to your account
- You must have appropriate permissions in Testiny to modify test cases
- The linking is one-way from Testiny to Jira (unless bidirectional integration is configured)
- Some Jira tickets may only be visible under specific issue types
- When using parallel processing, ensure your system has sufficient resources to handle multiple browser instances