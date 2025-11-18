# LogisticsPlatform 100% Completion Job Checker

This prompt automates checking the LogisticsPlatform dashboard for jobs with 100% completion under the "Delivery in Progress" filter across multiple user accounts.

## Usage

Run this directly in Cursor MCP to execute the automation. The script will:
1. Log in sequentially with multiple user accounts
2. Navigate to the Job Summary section
3. Filter for "Delivery in Progress" jobs in the last 30 days
4. Scan all pagination pages
5. Identify and extract details for any jobs showing 100% completion

```javascript
// LogisticsPlatform Job Completion Checker
// Checks for 100% complete jobs in "Delivery in Progress" status

// User accounts to check
const users = [
  { username: 'USER-MANAGER-001', password: 'Password@123' },
  { username: 'USER-123456789', password: 'Password@123' }
];

// Initialize results array
const completedJobs = [];

// Main execution function
async function checkCompletedJobs() {
  try {
    // Iterate through each user account
    for (const user of users) {
      console.log(`\nChecking account: ${user.username}...`);
      
      // Navigate to the login page
      await mcp_playwright_browser_navigate({
        url: 'https://app.example-platform.com/dashboard'
      });
      
      // Wait for the login form to appear
      await mcp_playwright_browser_wait_for({
        time: 5
      });
      
      // Get page snapshot to identify form elements
      const snapshot = await mcp_playwright_browser_snapshot({
        random_string: "get-login-form"
      });
      
      // Extract login form elements
      const usernameField = snapshot.elements.find(el => 
        el.tagName === 'INPUT' && 
        (el.attributes.placeholder === 'Username' || 
         el.attributes.name === 'username' ||
         el.attributes.id === 'username')
      );
      
      const passwordField = snapshot.elements.find(el => 
        el.tagName === 'INPUT' && 
        (el.attributes.placeholder === 'Password' || 
         el.attributes.name === 'password' ||
         el.attributes.id === 'password' ||
         el.attributes.type === 'password')
      );
      
      const loginButton = snapshot.elements.find(el => 
        (el.tagName === 'BUTTON' && 
         (el.innerText?.toLowerCase().includes('login') || 
          el.innerText?.toLowerCase().includes('sign in'))) ||
        (el.tagName === 'INPUT' && 
         el.attributes.type === 'submit')
      );
      
      if (!usernameField || !passwordField || !loginButton) {
        console.error("Could not find login form elements");
        continue;
      }
      
      // Fill login form
      await mcp_playwright_browser_type({
        element: "Username field",
        ref: usernameField.ref,
        text: user.username
      });
      
      await mcp_playwright_browser_type({
        element: "Password field",
        ref: passwordField.ref,
        text: user.password
      });
      
      // Click login
      await mcp_playwright_browser_click({
        element: "Login button",
        ref: loginButton.ref
      });
      
      // Wait for dashboard to load
      await mcp_playwright_browser_wait_for({
        time: 10
      });
      
      // Navigate to Job Summary section (if needed)
      const dashboardSnapshot = await mcp_playwright_browser_snapshot({
        random_string: "get-dashboard"
      });
      
      // Look for Job Summary section or navigation
      const jobSummaryLink = dashboardSnapshot.elements.find(el => 
        el.innerText?.includes("Job Summary") || 
        el.attributes?.href?.includes("job-summary")
      );
      
      if (jobSummaryLink) {
        await mcp_playwright_browser_click({
          element: "Job Summary link",
          ref: jobSummaryLink.ref
        });
        
        await mcp_playwright_browser_wait_for({
          time: 5
        });
      }
      
      // Click "Delivery in Progress" tab
      const jobsSnapshot = await mcp_playwright_browser_snapshot({
        random_string: "get-jobs-page"
      });
      
      const deliveryInProgressTab = jobsSnapshot.elements.find(el => 
        el.innerText?.includes("Delivery in Progress")
      );
      
      if (deliveryInProgressTab) {
        await mcp_playwright_browser_click({
          element: "Delivery in Progress tab",
          ref: deliveryInProgressTab.ref
        });
        
        await mcp_playwright_browser_wait_for({
          time: 3
        });
      } else {
        console.error("Could not find 'Delivery in Progress' tab");
        continue;
      }
      
      // Select 30 Days filter
      const filterSnapshot = await mcp_playwright_browser_snapshot({
        random_string: "get-filter-options"
      });
      
      const daysFilterElement = filterSnapshot.elements.find(el => 
        el.innerText?.includes("30 Days") || 
        el.attributes?.value === "30" ||
        el.tagName === 'SELECT'
      );
      
      if (daysFilterElement) {
        if (daysFilterElement.tagName === 'SELECT') {
          await mcp_playwright_browser_select_option({
            element: "Days filter dropdown",
            ref: daysFilterElement.ref,
            values: ["30"]
          });
        } else {
          await mcp_playwright_browser_click({
            element: "30 Days filter",
            ref: daysFilterElement.ref
          });
        }
        
        await mcp_playwright_browser_wait_for({
          time: 3
        });
      } else {
        console.log("Could not find 30 Days filter, continuing with default filter");
      }
      
      // Process all pagination pages
      let hasMorePages = true;
      let currentPage = 1;
      
      while (hasMorePages) {
        console.log(`Processing page ${currentPage}...`);
        
        // Get current page of jobs
        const jobsTableSnapshot = await mcp_playwright_browser_snapshot({
          random_string: `get-jobs-page-${currentPage}`
        });
        
        // Find job rows
        const jobRows = jobsTableSnapshot.elements.filter(el => 
          el.tagName === 'TR' && 
          !el.innerText?.includes("Job Name") && // Skip header row
          el.children?.length > 3
        );
        
        // Process each job
        for (const row of jobRows) {
          try {
            // Extract completion percentage
            const completionCell = row.children?.find(cell => 
              cell.innerText?.includes("%")
            );
            
            const completionText = completionCell?.innerText?.trim();
            const completionPercentage = completionText ? 
              parseInt(completionText.replace("%", "")) : null;
            
            // Check if 100% complete
            if (completionPercentage === 100) {
              // Extract other job details
              const cells = row.children;
              
              // Extract details based on cell position or content
              const jobName = cells[0]?.innerText?.trim() || "Unknown";
              const jobRefId = cells[1]?.innerText?.trim() || "Unknown";
              const expectedEndTime = cells.find(cell => 
                cell.innerText?.includes("/") || // Date format
                /\d{2}:\d{2}/.test(cell.innerText || "") // Time format
              )?.innerText?.trim() || "Unknown";
              
              // Add to completed jobs
              completedJobs.push({
                user: user.username,
                jobName,
                jobRefId,
                completionPercentage: "100%",
                expectedEndTime
              });
              
              console.log(`Found 100% complete job: ${jobName} (${jobRefId})`);
            }
          } catch (err) {
            console.error(`Error processing job row: ${err.message}`);
          }
        }
        
        // Check for next page button
        const nextPageButton = jobsTableSnapshot.elements.find(el => 
          (el.innerText?.includes("Next") || 
           el.innerText?.includes("›") || 
           el.innerText?.includes(">")) &&
          !el.attributes.disabled
        );
        
        // Move to next page if available
        if (nextPageButton && !nextPageButton.attributes.disabled) {
          await mcp_playwright_browser_click({
            element: "Next page button",
            ref: nextPageButton.ref
          });
          
          await mcp_playwright_browser_wait_for({
            time: 3
          });
          
          currentPage++;
        } else {
          hasMorePages = false;
        }
      }
      
      // Logout before switching to next user
      try {
        const logoutSnapshot = await mcp_playwright_browser_snapshot({
          random_string: "find-logout"
        });
        
        const userMenuButton = logoutSnapshot.elements.find(el => 
          el.tagName === 'BUTTON' && 
          (el.attributes.class?.includes("user") ||
           el.innerText?.includes(user.username))
        );
        
        if (userMenuButton) {
          await mcp_playwright_browser_click({
            element: "User menu button",
            ref: userMenuButton.ref
          });
          
          await mcp_playwright_browser_wait_for({
            time: 1
          });
          
          const menuSnapshot = await mcp_playwright_browser_snapshot({
            random_string: "menu-snapshot"
          });
          
          const logoutButton = menuSnapshot.elements.find(el => 
            el.innerText?.toLowerCase().includes("logout") || 
            el.innerText?.toLowerCase().includes("sign out")
          );
          
          if (logoutButton) {
            await mcp_playwright_browser_click({
              element: "Logout button",
              ref: logoutButton.ref
            });
            
            await mcp_playwright_browser_wait_for({
              time: 5
            });
          }
        }
      } catch (error) {
        console.log("Could not perform logout, continuing...");
      }
    }
    
    // Display final results
    if (completedJobs.length > 0) {
      console.log("\n=== 100% COMPLETED JOBS ===");
      console.table(completedJobs);
      console.log(`\nTotal jobs found: ${completedJobs.length}`);
    } else {
      console.log("\nNo jobs with 100% completion found in 'Delivery in Progress' status.");
    }
    
  } catch (error) {
    console.error(`Error in job checker: ${error.message}`);
  } finally {
    console.log("\nJob check complete!");
  }
}

// Start the automation
await checkCompletedJobs();
```

## Notes

- The script handles login, navigation, and pagination automatically
- It adjusts to find UI elements based on text or attributes for better reliability
- Console output shows progress during execution
- Final results are displayed in a table format for easy reading
- Error handling is included for stability

## Customization

To modify this script:
- Add more user accounts to the `users` array
- Change the completion percentage threshold by modifying the check `completionPercentage === 100`
- Extract additional job details by identifying more table cells

## Troubleshooting

If the script fails to find elements:
1. Capture a screenshot to analyze the page structure
2. Adjust the element selectors based on actual page structure
3. Increase wait times if pages load slowly