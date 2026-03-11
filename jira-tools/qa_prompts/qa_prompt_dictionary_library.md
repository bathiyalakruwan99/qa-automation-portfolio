# QA Prompt Dictionary — Full Library

**Source:** [QA Prompt Dictionary](https://promptqa.vercel.app/library)
**Total:** 76 prompts

---

## 1. API Test Case Generator

**Category:** API Testing

### Full Prompt

```
Act as a Senior SDET specializing in API Architecture. Your goal is to design a bulletproof test suite for the {endpoint_name} endpoint. 

### Requirements:
1. **Functional Scenarios**: Cover all standard CRUD operations (GET, POST, PUT, PATCH, DELETE) relevant to this endpoint.
2. **Parameter Validation**: Test missing required fields, invalid data types, boundary values (empty strings, max-length, negative numbers).
3. **Negative & Error Handling**: Verify system behavior for 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), and 500 (Server Error).
4. **Security & Auth**: Validate JWT expiration, role-based access control (RBAC), and session fixation.
5. **Edge Cases**: Rate limiting, concurrent requests, and large payload handling.

### Output Format:
Provide the test cases in a **Markdown Table** with the following columns: [ID, Test Description, Input Data, Expected Status Code, Expected Response Body Snippet]. 

**Constraints**: Do not use generic examples; tailor everything to the specific context of {endpoint_name}.
```

---

## 2. API Contract Testing Strategy

**Category:** API Testing

### Full Prompt

```
Act as a Lead QA Architect. Given the following API specification (OpenAPI/Swagger/JSON Schema): {spec}, perform a rigorous contract validation analysis. 

### Task List:
- **Schema Compliance**: Check for field type mismatches, nullability constraints, and enum violations.
- **Data Formats**: Validate specific formats like ISO-8601 dates, UUIDs, and email regex.
- **Strict Mode**: Ensure the API does not return undocumented fields (No 'shadow' data).
- **Header Validation**: Verify 'Content-Type', 'Cache-Control', and custom security headers.

### Expected Output:
A detailed **Technical Audit Report** listing: 
1. Primary Schema Risks
2. Mandatory Assertion List for Automation
3. Suggested JSON Schema for validation scripts.

**Note**: Focus on the 'Fail-Fast' principle for API stability.
```

---

## 3. Idempotency & State Safety

**Category:** API Testing

### Full Prompt

```
Act as a Backend Reliability Engineer. Analyze the idempotency requirements for {endpoint}. 

### Objectives:
1. **Retry Logic**: If a client retries a request due to a timeout, how does the system ensure no duplicate side-effects (e.g., double payments)?
2. **Idempotency-Key**: Design a test flow using an 'Idempotency-Key' or 'X-Correlation-ID' header.
3. **Post-Condition Check**: After 10 identical calls, what is the exact state of the database? 
4. **Status Code Consistency**: Should subsequent calls return 200 (OK), 201 (Created), or 204 (No Content)?

### Output Format:
Provide a **Step-by-Step Test Execution Plan** including curl commands for reproduction and a verification checklist for backend state.
```

---

## 4. API Chaos & Negative Testing

**Category:** API Testing

### Full Prompt

```
Act as a Security-Focused QA Engineer. Your mission is to attempt to 'crash' or 'compromise' the {endpoint} endpoint through malformed input. 

### Attack Vectors:
- **Payload Manipulation**: Send deeply nested JSON (100+ levels), oversized strings (1MB+), and unexpected characters (Unicode, Emojis).
- **Protocol Attacks**: Use unsupported 'Content-Type' (e.g., text/xml on a JSON API), invalid encoding, and malformed headers.
- **Input Injection**: Inject SQL fragments, NoSQL operators, and Shell command patterns into every parameter.
- **Resource Exhaustion**: Send a flurry of requests without a cooldown period to trigger rate limiting.

### Output Format:
A list of **High-Risk Test Scenarios** formatted as: [Vector Name | Input Payload | Risk Impact | Expected Safe Error Response].
```

---

## 5. Complex Data Filtering Logic

**Category:** API Testing

### Full Prompt

```
Act as a Senior QA Analyst. Design a rigorous test plan for a high-volume list endpoint: {endpoint}. 

### Test Scopes:
- **Pagination Boundary**: Request page 0, page 1, and 'page = totalPages + 1'. Test with size=1 and size=1000.
- **Multi-Sort**: Sort by {fields} (ascending/descending). Test sorting by multiple fields simultaneously (e.g., sort=date,desc;priority,asc).
- **Filter Combinations**: Test complex logical queries (e.g., ?status=active&created_after=2023-01-01&category=retail).
- **Data Integrity**: Verify that the 'totalElements' and 'totalPages' fields update correctly when items are added/deleted.

### Output Format:
A **Test Scenario Matrix** with specific query parameters and the expected count/order of results.
```

---

## 6. E2E API Workflow Chaining

**Category:** API Testing

### Full Prompt

```
Act as an E2E Integration Architect. Create a complex workflow test that links the following services: {api_list}. 

### Workflow Details:
1. **Data Extraction**: Extract dynamic IDs or tokens from the response of {api_1}.
2. **Transformation**: Process the data (if needed) and inject it into {api_2}.
3. **State Persistence**: Verify that changes made in {api_2} are reflected when calling {api_3} (GET).
4. **Cleanup**: Ensure the workflow ends with a DELETE or Reset to maintain environment cleanliness.

### Output Format:
A **Flow Diagram (Mermaid style)** followed by a technical description of each 'Hand-off' point and required assertions.
```

---

## 7. SLA & Rate Limit Verification

**Category:** API Testing

### Full Prompt

```
Act as a DevOps/Performance QA. Your task is to verify the rate-limiting (WAF/API Gateway) implementation for {endpoint}. 

### Scenarios to Test:
- **Burst Capacity**: Can the API handle 10 requests in 1 second if the limit is 100/min?
- **Throttling Threshold**: Verify exactly at which request the API returns 429 (Too Many Requests).
- **Retry-After Header**: Read the 'Retry-After' or 'X-RateLimit-Reset' header and ensure it provides a valid timestamp.
- **Tiered Access**: If the system has free/pro tiers, verify that Pro keys have higher limits than Free keys.

### Output Format:
A **Throttling Test Plan** including a shell script snippet for automated load-bursting and a verification checklist.
```

---

## 8. GraphQL Depth & Complexity

**Category:** API Testing

### Full Prompt

```
Act as a GraphQL SDET. Perform a deep audit of the {operation} operation. 

### Audit Goals:
1. **Field level Auth**: Verify that requesting sensitive fields (e.g., 'email', 'ssn') without permission returns a partial error or null.
2. **Query Complexity**: Attempt to request 10+ levels of nested related objects to trigger a 'Query Depth' error.
3. **Variable Injection**: Test invalid types or oversized integers in the variables object.
4. **Mutation Side-Effects**: For mutations, verify that the 'id' returned is valid and the data is actually updated in the DB.

### Output Format:
A **Structured GraphQL Query List** (Success, Error, and Unauthorized cases) with expected partial response JSON.
```

---

## 9. Webhook Reliability & Security

**Category:** API Testing

### Full Prompt

```
Act as an Integration Engineer. Design a test suite for the {webhook_event} triggering mechanism. 

### Security & Reliability Checks:
- **HMAC Signature**: Verify the 'X-Hub-Signature' or similar header contains a valid hash. Attempt to send a forged payload to see if the listener rejects it.
- **Retry Policy**: If the listener returns a 503 or 408, does the system retry? What is the backoff strategy (Exponential/Linear)?
- **Order of Delivery**: Does the system ensure events are delivered in order (e.g., created -> updated -> deleted)?
- **Timeout Handling**: How does the system react if the listener is 'hanging' for 30+ seconds?

### Output Format:
A **Webhook Integration Checklist** and a setup guide for a mock endpoint (e.g., RequestBin/Webhook.site) for validation.
```

---

## 10. Cache Integrity & ETags

**Category:** API Testing

### Full Prompt

```
Act as a Senior Performance QA. Analyze the cache-control strategy for {endpoint}. 

### Verification Items:
1. **ETag Consistency**: Perform a GET, store the 'ETag', and perform another GET with 'If-None-Match'. Expected: 304 Not Modified.
2. **Cache-Control Headers**: Verify 'max-age', 'public/private', and 'no-cache' directives match the business requirements for {data_type}.
3. **Cache Busting**: Update the resource via PUT/PATCH and verify that the next GET returns a new ETag and fresh data (Cache Invalidation).
4. **Proxy/CDN Check**: Verify the 'X-Cache' header (HIT vs MISS) if applicable.

### Output Format:
A **Cache behavior report table** showing the interaction between headers and expected browser/proxy behavior.
```

---

## 11. API Breaking Change Audit

**Category:** API Testing

### Full Prompt

```
Act as a Release Quality Gatekeeper. Conduct a backward compatibility audit for the upcoming changes: {changes}. 

### Audit Scope:
- **Request Schema**: Are any mandatory fields added? Are any existing fields removed or renamed?
- **Response Structure**: Did any field change type (e.g., integer to string)? Is the root object still an Array/Object as before?
- **Enumerations**: Are new enum values handled by old clients (or do they cause crashes)?
- **Status Codes**: Did a successful operation switch from 200 to 201 or 204 in a way that might break some parsers?

### Output Format:
A **Risk Assessment Report** with a 'Go/No-Go' recommendation for the release.
```

---

## 12. Binary Data & File Handling

**Category:** API Testing

### Full Prompt

```
Act as a Senior QA specialist. Design a test plan for the file handling endpoint {endpoint}. 

### Testing Scenarios:
- **MIME Hijacking**: Upload a .txt file renamed to .pdf. Does the server correctly identify the actual file type?
- **Size Limits**: Test 1 byte below, exactly at, and 1 byte above the maximum allowed size (e.g., 10MB).
- **Concurrency**: Upload 5 large files simultaneously from the same account.
- **Corruption**: Upload a partially downloaded/corrupted binary and check for graceful error handling.
- **Malicious Content**: Test for 'Zip Slip' or 'Zip Bomb' attacks if the system decompresses files.

### Output Format:
A **File-Handling Test Matrix** including [Filename | Content-Type | Size | Expected Result | Pass/Fail Criteria].
```

---

## 13. SQL Injection Deep-Dive

**Category:** Security Testing

### Full Prompt

```
Act as a Senior Penetration Tester. Your target is {field} on {location}. 

### Methodology:
1. **Blind Testing**: Use timing-based payloads (e.g., `SLEEP(10)`) to detect backend response delays.
2. **Error-Based**: Use payloads that force the DB to leak its version or table names in the error message (e.g., `GROUP BY`, `EXTRACTVALUE`).
3. **Union-Based**: Attempt to join data from the `information_schema` with the primary result set.
4. **OOB (Out-of-Band)**: Use DNS/HTTP requests (e.g., Burp Collaborator) to receive exfiltrated data.

### Output format:
A **Security Vulnerability Report** containing: [Vulnerability Type | Payload Used | Response Observation | Severity | Remediation Strategy].
```

---

## 14. Cross-Site Scripting (XSS) Audit

**Category:** Security Testing

### Full Prompt

```
Act as an AppSec Researcher. Analyze {feature_description} for Cross-Site Scripting (XSS). 

### Attack Surface:
- **Reflected XSS**: Inject scripts into URL parameters that are echoed back in the page (e.g., search queries).
- **Stored XSS**: Inject scripts into permanent storage (e.g., comments, profiles) to target other users.
- **DOM-based XSS**: Malicious scripts executed via client-side code without hitting the server (e.g., `eval()`, `innerHTML`).
- **Filter Bypass**: Use polyglot payloads and encoding (Base64, URL encoding) to bypass basic WAF filters.

### Output Format:
A **PoC (Proof of Concept) Payload List** and a description of the 'Blast Radius' for each vulnerability.
```

---

## 15. Authentication & Session Integrity

**Category:** Security Testing

### Full Prompt

```
Act as a Red Team Security Expert. Perform a session integrity audit on {auth_system}. 

### Audit Checklist:
- **Session Fixation**: Verify that the Session ID is regenerated *immediately* after a successful login.
- **JWT Security**: Check for 'None' algorithm Support, signature verification, and sensitive info in public claims.
- **Insecure Logout**: Does the session token actually expire on the server-side, or is it just deleted from the browser cookie?
- **Brute Force**: Test for account lockout or CAPTCHA triggers after 5 failed attempts.

### Output Format:
A **Session Security Analysis** with specific curl commands to test token expiration and forgery.
```

---

## 16. IDOR (Insecure Direct Object Reference)

**Category:** Security Testing

### Full Prompt

```
Act as an Ethical Hacker. Your goal is to find an IDOR vulnerability in {endpoint}. 

### Testing Logic:
1. **Horizontal Escalation**: Can User A access User B's record by changing `user_id=123` to `user_id=124`?
2. **Vertical Escalation**: Can a 'Guest' user access an 'Admin' record by guessing the resource ID?
3. **ID Guessing**: Are IDs sequential (1, 2, 3) or non-enumerable (UUID)? Test if non-enumerable IDs are leaked in other API responses.
4. **Method Tampering**: If GET is blocked, does POST/PATCH/DELETE on the same ID work?

### Output Format:
A **Privilege Escalation Matrix** showing which user roles can access which resources via ID manipulation.
```

---

## 17. CORS & Header Hardening

**Category:** Security Testing

### Full Prompt

```
Act as an Infrastructure Security Auditor. Evaluate the security headers for {domain}. 

### Header Checklist:
- **CORS Misconfig**: Test if `Access-Control-Allow-Origin: *` is present. Try sending an 'Origin' header from `evil.com` to see if it's accepted.
- **CSP (Content Security Policy)**: Is the policy too broad (e.g., `script-src *`)? Does it prevent inline scripts?
- **HSTS**: Is 'Strict-Transport-Security' enabled with `includeSubDomains` and `preload`? 
- **Clickjacking**: Verify that `X-Frame-Options` or `frame-ancestors` prevents the site from being loaded in an iframe on another domain.

### Output Format:
A **Header Security Scorecard** [Header Name | Current Value | Severity | Recommended Policy].
```

---

## 18. PII & Sensitive Data Leakage

**Category:** Security Testing

### Full Prompt

```
Act as a Data Privacy & Compliance Officer. Scan the {process} flow for potential sensitive data exposure. 

### Audit Points:
- **Response Masking**: Are credit card numbers masked (e.g., ****-****-****-1234)? Are PII fields like SSN or Phone Number hashed or hidden?
- **URL Leaks**: Are session tokens or PII passed as query parameters (which show up in server logs and browser history)?
- **Error Verbosity**: Do 500 errors leak internal IP addresses, stack traces, or DB queries?
- **Logs & Audit**: Verify that API keys or passwords are NEVER written to the application logs.

### Output Format:
A **Privacy Compliance Scan Report** identifying 'At-Risk' data fields and suggested masking logic.
```

---

## 19. Structured Bug Report Writer

**Category:** Bug Report Writing

### Full Prompt

```
Convert the following technical observations into a professional bug report format:

Observations: {observations}

The bug report should include:
- Title: Clear and concise
- Severity/Priority: Based on the impact
- Environment: Details provided or generic placeholder
- Steps to Reproduce: Numbered list
- Expected Result: What should happen
- Actual Result: What is happening
- Technical Details: Logs, error codes, if provided.
```

---

## 20. Playwright: Advanced UI Automation

**Category:** Automation Testing

### Full Prompt

```
Act as a Senior SDET specializing in Playwright. Your task is to write a robust automation script in TypeScript for {scenario}. 

### Technical Requirements:
1. **Page Object Model (POM)**: Structure the code into reusable Page classes with clear method names.
2. **Locators**: Prioritize user-facing locators (getByRole, getByText, getByLabel) over fragile CSS/XPath.
3. **Assertions**: Use web-first assertions (`expect(locator).toBeVisible()`) for automatic retries.
4. **Handling Popups**: Include logic to handle dynamic modals or window popups if they appear during the flow.
5. **Environment Configuration**: Use `process.env` for credentials and base URLs.

### Output Format:
Provide the **Page Object Class** and the **Test Specification File** in separate code blocks. Add comments explaining the 'Why' behind complex logic.
```

---

## 21. Cypress: Component Level validation

**Category:** Automation Testing

### Full Prompt

```
Act as a Frontend Developer/QA. Create a Cypress Component Test for the {component_name} component. 

### Requirements:
- **Mounting**: Show how to mount the component with different React props (e.g., `loading=true` vs `loading=false`).
- **Mocking**: Use `cy.intercept` to mock all external API calls returning from the component.
- **Interaction**: Simulate 'Real' user events using `@cypress/code-coverage` for tracking.
- **Assertions**: Verify accessibility attributes (ARIA labels) and visual states (Tailwind classes/CSS).

### Output Format:
A single **Cypress spec file** with a `describe` block covering happy path, empty state, and error handling for the component.
```

---

## 22. Appium: Native Mobile E2E

**Category:** Automation Testing

### Full Prompt

```
Act as a Mobile Automation Lead. Write an Appium script (Java/JUnit) for {scenario} on {platform}. 

### Requirements:
- **Capabilities**: Define the mandatory Appium options (DeviceName, Udid, AppPackage, AutomationName).
- **Accessibility locators**: Explain how to use 'Accessibility IDs' for stable identification on both iOS and Android.
- **Gestures**: Implement a 'Swipe to Refresh' or 'Long Press' action using the W3C Actions API.
- **App Lifecycle**: Include logic to background the app and bring it back to verify session persistence.

### Output Format:
A **Java Class** with the setup (@Before) and the test logic, including clean teardown.
```

---

## 23. Automation Architect: POM Refactoring

**Category:** Automation Testing

### Full Prompt

```
Act as an Automation Architect. Refactor the following unstructured script: {script}. 

### Mission:
1. **Extraction**: Identify all hardcoded selectors and move them to a 'Constants' or 'Locators' objects.
2. **Abstraction**: Wrap repetitive actions (e.g., Login, Logout, Search) into high-level methods.
3. **Parameterization**: Ensure the script can run against different environments (QA, Staging, Prod) by abstracting URLs.
4. **Readability**: Apply 'Clean Code' principles (No magic numbers, descriptive naming).

### Output Format:
A comparison of **Before vs After** code structure with a brief explanation of the architectural benefits.
```

---

## 24. SDET: Flaky Test Forensic Analysis

**Category:** Automation Testing

### Full Prompt

```
Act as a Senior SDET. Analyze the provided failure logs: {logs}. 

### Investigation Steps:
- **Race Conditions**: Is the test clicking an element before the JS event listener is attached?
- **Dynamic Data**: Is the test failing due to stale data from a previous run? Suggest a 'Cleanup' or 'Randomization' strategy.
- **Network Blips**: Recommend a 'Smart Retry' logic at the test-step level vs global level.
- **DOM Instability**: Identify if animations (Fade-ins/Sliders) are causing 'Element intercepted' errors.

### Output Format:
A **Debug Action Plan** with code fixes (e.g., adding `waitForResponse` or `force: true`) and infrastructure suggestions.
```

---

## 25. DevOps: Selenium Grid 4 Scaling

**Category:** Automation Testing

### Full Prompt

```
Act as a DevOps Engineer for QA. Generate a `docker-compose.yml` for a production-ready Selenium Grid 4. 

### Infrastructure Requirements:
- **Dynamic Nodes**: Include Chrome (v110+), Firefox, and Edge nodes.
- **Resource Management**: Assign CPU and Memory limits (e.g., 2GB RAM per node) to prevent host crashes.
- **VNC Support**: Enable video recording and live VNC previews for debugging.
- **Session Management**: Set the 'SE_NODE_MAX_SESSIONS' to optimize for a 16GB RAM server.

### Output Format:
A **Docker Compose file** and a shell command to scale the Chrome nodes to 5 instances.
```

---

## 26. CI/CD: GitHub Actions Test Workflow

**Category:** Automation Testing

### Full Prompt

```
Act as a CI/CD Expert. Design a GitHub Actions workflow for {framework}. 

### Pipeline Features:
- **Triggers**: Run on every Pull Request and nightly on the 'Main' branch.
- **Dependency Caching**: Cache `node_modules` or `maven m2` to speed up builds by 50%.
- **Matrix Testing**: Run tests across Chrome, Webkit, and Firefox simultaneously.
- **Report Hosting**: Upload HTML reports and failure screenshots to GitHub Artifacts.
- **Slack Notification**: Send a summary of (Passed / Failed / Skipped) to a Slack webhook.

### Output Format:
A complete **YAML configuration** with step-by-step comments.
```

---

## 27. Architect: Data-Driven Scaling

**Category:** Automation Testing

### Full Prompt

```
Act as a QA Architect. Design a 'Data-Driven' framework for {scenario} using {framework}. 

### Design Pattern:
- **External Source**: Create a sample JSON/CSV file with 5 different data sets (e.g., [Standard User, Admin user, Blocked user]).
- **Iterator**: Write a wrapper that reads the file and dynamically spawns test cases for each row.
- **Assertion Mapping**: Show how to parameterize the 'Expected' results (not just the input).
- **Maintenance**: Explain how to add new data rows without touching the code.

### Output Format:
1. **The Data File (JSON/CSV)**
2. **The Script Wrapper Logic**.
```

---

## 28. SDET: Hybrid 'API-First' UI Testing

**Category:** Automation Testing

### Full Prompt

```
Act as a Senior SDET. Propose a hybrid testing strategy for {flow}. 

### Strategy:
1. **Pre-requisite (API)**: Use `fetch` or `request` hooks to create a user and populate a shopping cart via API (bypass 5 UI pages).
2. **The UI Test**: Log in directly and verify only the 'Final Confirmation' page UI.
3. **Post-requisite (API)**: Delete the created data via API to ensure a clean state for the next run.
- **Benchmark**: Compare the time taken for 'Pure UI' vs 'Hybrid' approach.

### Output Format:
A code snippet showing the `beforeAll` API setup and the `test` UI logic.
```

---

## 29. Visual QA: Pixel-Perfect Regression

**Category:** Automation Testing

### Full Prompt

```
Act as a Visual QA Expert. Configure {tool} (Applitools / Percy / Playwright) to test {component}. 

### Configuration Tasks:
- **Baseline Management**: Explain how to 'Approve' a new baseline when a design change is intentional.
- **Masking**: Show how to ignore dynamic areas (e.g., 'Current Date' or 'User ID') to prevent false failures.
- **Cross-Resolution**: Verify the component at 3 sizes: Mobile (390x844), Tablet (820x1180), and Desktop (1920x1080).
- **Thresholds**: Set the 'misMatchThreshold' (e.g., 0.1%) to ignore insignificant anti-aliasing differences.

### Output Format:
A **Configuration Snippet** and a **Test Code block** showing the visual assertion.
```

---

## 30. Technical QA: Shadow DOM Penetration

**Category:** Automation Testing

### Full Prompt

```
Act as a Technical QA Lead. Provide a solution to automate interactions with elements inside a **Shadow DOM** for {framework}. 

### Scenarios:
- **Open Shadow Root**: Use deep selectors (e.g., `>>` in Playwright) to pierce the shadow boundary.
- **Closed Shadow Root**: Explain how to use `executeScript` to access elements if the shadow root is mode: 'closed'.
- **Recursion**: How to handle 'Nested' Shadow DOMs (Shadow inside a Shadow).
- **Verify Integrity**: Check if component properties (props) are correctly reflected in the shadow tree.

### Output Format:
A **Helper function** or **Custom Command** for your framework that makes Shadow DOM interaction transparent.
```

---

## 31. SDET: Multi-Context & Iframe Logic

**Category:** Automation Testing

### Full Prompt

```
Act as an Automation Expert. Design a test for {scenario} which spans multiple contexts. 

### Logic Steps:
1. **Switching**: Identify the `frameLocator` or `switchTo` command to enter the iframe.
2. **Hand-off**: Perform an action in the iframe that opens a *new* browser tab.
3. **Validation**: Switch focus to the new tab, verify content, close it, and return to the main document.
4. **Race Conditions**: Handle scenarios where the iframe takes 5+ seconds to load its internal assets.

### Output Format:
A **Playwright or Selenium script** demonstrating the 'Context Switching' flow.
```

---

## 32. A11y QA: Automated WCAG Audits

**Category:** Automation Testing

### Full Prompt

```
Act as an Accessibility (a11y) Expert. Integrate **axe-core** into {framework} to audit {page_url}. 

### Audit Requirements:
- **Ruleset**: Filter for 'wcag2aa' and 'wcag21aa' violations only.
- **Exclusion**: Show how to 'exclude' internal components (like a 3rd-party chatbot) that you can't fix.
- **Report Generation**: Output the violations in a human-readable format or a JSON file for the developers.
- **Assertion**: Fail the build IF there are any 'Critical' or 'Serious' violations.

### Output Format:
A **Setup Script** followed by an example of how a failure looks in the console.
```

---

## 33. BDD Expert: Gherkin to Code

**Category:** Automation Testing

### Full Prompt

```
Act as a BDD Specialist. Convert the requirement: {requirement} into a high-quality automation suite. 

### Steps:
1. **Feature File**: Write a Gherkin feature using Background, Scenario Outline, and Examples table.
2. **Step Definitions**: Provide the boilerplate code for {framework} to map the Gherkin steps to actions.
3. **Glue Logic**: Show how to share state (e.g., 'User ID') between different steps without global variables.
4. **Optimization**: Use Tags (@smoke, @regression) to filter scenarios.

### Output Format:
1. **Feature File (.feature)**
2. **Step Definitions file**.
```

---

## 34. Perf Engineer: k6 Load-Testing-as-Code

**Category:** Automation Testing

### Full Prompt

```
Act as a Performance Engineer. Write a k6 script to stress test {endpoint}. 

### Script Requirements:
- **Options**: Define a 'Ramping' load profile (5m: 50 VUs, 10m: 200 VUs, 5m: 0 VUs).
- **Checks**: Implement functional assertions (e.g., Status is 200, JSON contains 'id').
- **Thresholds**: Define 'Pass/Fail' criteria (e.g., p95 response time must be < 500ms).
- **Mock Data**: Use an external data file to provide unique payloads for each Virtual User.

### Output Format:
A single **k6 JS script** with clear section headers.
```

---

## 35. Resilience Lead: Error Recovery Patterns

**Category:** Automation Testing

### Full Prompt

```
Act as a Lead SDET. Design a 'Resilient' automation pattern for {scenario}. 

### Patterns to Implement:
- **Global Hook**: If *any* test fails, take a screenshot and dump the console logs immediately.
- **Conditional Step**: If a 'Random Popup' appears during the flow, close it and continue the test (don't fail).
- **Soft Assertions**: Perform 5 UI checks, report all failures, but don't stop the test until the final step.
- **Cleanup**: Regardless of pass/fail, ensure the 'Logout' method is called to clear the session.

### Output Format:
A code snippet showing the **Try/Catch/Finally** logic or the framework's 'Retry' feature configuration.
```

---

## 36. Frontend QA: GraphQL Mocking

**Category:** Automation Testing

### Full Prompt

```
Act as a Frontend SDET. Show how to mock the GraphQL mutation {mutation_name} for integration testing. 

### Requirements:
- **Alias**: Use an alias to intercept the specific operation name.
- **Dynamic Response**: Return a 'Success' JSON for one test and a 'Specific Error' (e.g., 403 Forbidden) for another.
- **Delay**: Simulate a 'Slow Network' (2s delay) to test the UI loading spinner.
- **Verification**: Assert that the outgoing request payload contains the correct variables.

### Output Format:
A **Cypress or Playwright script** showing the `intercept` or `route` logic.
```

---

## 37. Architect: Test Sharding & Parallelization

**Category:** Automation Testing

### Full Prompt

```
Act as an Automation Architect. Propose a sharding strategy for a suite of 2000+ tests that currently takes 4 hours. 

### Proposals:
- **Vertical Sharding**: Split by feature (Checkout vs Search vs Profile).
- **Horizontal Sharding**: Use 'CircleCI' or 'GitHub Actions' matrix to run 20 agents in parallel.
- **Data Isolation**: How to ensure 20 agents don't 'Collide' on the same database record.
- **Orchestration**: Describe how to merge 20 individual XML reports back into one master 'Allure' report.

### Output Format:
A **Technical Roadmap** for the DevOps team to implement the sharding.
```

---

## 38. Integration QA: Email E2E Validation

**Category:** Automation Testing

### Full Prompt

```
Act as an Integration QA. Automate the end-to-end flow: 'Request Password Reset -> Check Email -> Click Link'. 

### Tools & Methods:
- **API-based**: Use 'Mailosaur' or 'Mailtrap' API to poll for the latest email sent to {temp_email}.
- **Regex Extraction**: Extract the 'Activation Token' from the HTML body of the email.
- **UI Validation**: Open the extracted link in a browser and verify the 'New Password' form appears.
- **Cleanup**: Delete the email from the mailbox via API after verification.

### Output Format:
A **Node.js script** using an email-testing library and a UI automation framework.
```

---

## 39. QA Lead: Cloud Device Farm Config

**Category:** Automation Testing

### Full Prompt

```
Act as a QA Lead. Configure {framework} to run on **BrowserStack/SauceLabs**. 

### Config Details:
- **Tunneling**: Setup 'Local Testing' to allow the cloud devices to access your `localhost` development server.
- **Capabilities Matrix**: Configure a test to run on: Latest Chrome (Windows), Safari 16 (macOS), and iPhone 14 (iOS 16).
- **Debugging**: Enable 'Console Logs', 'Network Logs', and 'Video Recording' for failed tests.
- **Custom Branding**: Tag the build with current CI Build Number and Project Name.

### Output Format:
A **Configuration file (json/js)** and a sample execution command.
```

---

## 40. Reporting Expert: Allure Dashboards

**Category:** Automation Testing

### Full Prompt

```
Act as a Reporting Specialist. Setup **Allure Reports** for {framework}. 

### Requirements:
- **Annotations**: Show how to add `@Severity`, `@Description`, and `@Link` to your tests.
- **Attachments**: Automatically attach the `page.screenshot()` and `request.json()` on every failure.
- **Step-by-Step**: Wrap long test blocks into `@Step` methods for a cleaner visual hierarchy in the report.
- **CI Integration**: Provide the command to serve the report locally and the bash script to generate it in Jenkins/GitHub.

### Output Format:
A **Tutorial** for the team on how to use the 'Allure' decorators in their code.
```

---

## 41. WDIO specialist: Modern Async Patterns

**Category:** Automation Testing

### Full Prompt

```
Act as a WebdriverIO specialist. Write a script to handle {scenario} using the latest **Async/Await** mode. 

### Technical Goals:
- **Implicit vs Explicit**: Show why `browser.pause` is bad and how to use `element.waitForDisplayed` instead.
- **Custom Commands**: Create a custom `browser.login()` command that handles 2FA entry.
- **Multiremote**: How to run a test that requires *two* browsers (e.g., a Chat app where User A talks to User B).
- **Mobile Emulation**: Run the same script in 'Mobile Emulation' mode using devtools.

### Output Format:
A **WDIO test file** and a snippet for the `wdio.conf.js` file.
```

---

## 42. QA Manager: Testing Debt Audit

**Category:** Automation Testing

### Full Prompt

```
Act as a QA Manager. Perform an audit of the current automation repository: {repo_url}. 

### Audit Criteria:
- **Dead Code**: Identify tests for features that have been removed from the product.
- **Duplicate Coverage**: Find where Unit, Integration, and E2E tests are testing the exact same logic (The Test Pyramid efficiency).
- **Locator Tech Debt**: Flag brittle XPath selectors that should be migrated to Data-Test-IDs.
- **Performance**: Identify 'Slow' tests that contribute to 80% of the build time.

### Output Format:
A **Testing Debt Scorecard** with a prioritized 'Refactoring Backlog' for the next 3 sprints.
```

---

## 43. Selenium Expert: Synchronization Mastery

**Category:** Automation Testing

### Full Prompt

```
Act as a Selenium Specialist. Explain and demonstrate the 'Wait' strategy for {scenario}. 

### Scenarios to Solve:
1. **Invisible Loading**: Waiting for a loader to DISAPPEAR before clicking.
2. **Stale Element**: Handling `StaleElementReferenceException` during a DOM refresh.
3. **Fluent Wait**: Configure a wait that polls every 500ms for 20 seconds, ignoring `NoSuchElementException`.
4. **Execution Speed**: Explain the impact of `Implicit Wait` on failure reporting time.

### Output Format:
A **Java/Python helper class** called `WaitUtils` with reusable static methods.
```

---

## 44. SRE: Enterprise Load Strategy

**Category:** Automation Testing

### Full Prompt

```
Act as a Site Reliability Engineer (SRE). Design a comprehensive Performance Test Strategy for {system_description}. 

### Strategic Pillars:
1. **Load Profile**: Define the 'Normal' vs 'Peak' vs 'Stress' load (e.g., 100 vs 1k vs 10k users/sec).
2. **KPIs**: Beyond 200 OK, define thresholds for p95/p99 latency, CPU usage, and memory pressure.
3. **Test Types**: Detail the plan for Soak (Endurance), Spike (Sudden burst), and Scalability tests.
4. **Infrastructure**: Suggest a toolset (k6/JMeter/Gatling) and the monitoring stack (Prometheus/Grafana/Datadog).

### Output Format:
A **Technical Strategy Document** with a 'Performance Acceptance Criteria' table.
```

---

## 45. Architect: API Latency Profiling

**Category:** Automation Testing

### Full Prompt

```
Act as a Performance Architect. Breakdown the request-response latency for the {endpoint} service. 

### Investigation Areas:
- **Network**: DNS Lookup, TCP Handshake, and TLS Negotiation time.
- **TTFB (Time to First Byte)**: Analyze backend processing, DB query execution, and serialization time.
- **Payload Size**: Impact of large JSON bodies on 'Content Download' time.
- **Headers**: Use 'Server-Timing' headers to expose internal microservice hops.

### Output Format:
A **Latency Audit Report** showing a waterfall-style breakdown and suggestions for 'Low-Hanging Fruit' optimizations (e.g., Gzip, Keep-Alive).
```

---

## 46. Reliability: 24h Soak (Endurance)

**Category:** Automation Testing

### Full Prompt

```
Act as a Reliability Engineer. Design a 24-hour **Soak Test** for {system}. 

### Objectives:
- **Memory Leak Detection**: Monitor the Heap size (RSS) for a steady upward trend without cleanup.
- **Connection Pools**: Verify if DB or Redis connections are being leaked/not closed.
- **File Descriptors**: Check for 'Too many open files' errors under sustained load.
- **Fragmentation**: Check for disk usage or log-rotation issues over time.

### Output Format:
A **Monitoring Dashboard Spec** (what metrics to plot) and a 'Termination Criteria' for the test.
```

---

## 47. Chaos: Traffic Spike Resilience

**Category:** Automation Testing

### Full Prompt

```
Act as a Chaos Engineer. Design a **Spike Test** that injects 50x the normal traffic into {app_description} in under 10 seconds. 

### Verification Goals:
1. **Auto-scaling lag**: How many seconds does it take for a new pod/instance to become 'Ready'?
2. **Graceful Degradation**: Does the system return 503 (Service Unavailable) or does it crash entirely?
3. **Recovery Time**: How fast does the latency return to normal once the spike subsides?
4. **Circuit Breaking**: Verify if 3rd-party dependencies are blocked to prevent cascading failures.

### Output Format:
A **Resilience Report** with a 'Stress-Recovery' graph description.
```

---

## 48. DBA: SQL Performance Profiling

**Category:** Performance Testing

### Full Prompt

```
Act as a Database Performance Expert. Analyze {service} for DB-level bottlenecks. 

### Audit Plan:
- **Concurrency**: Test behavior with 100 concurrent write operations vs 1000 read operations.
- **Slow Queries**: Identify queries where `time > 100ms`. Recommend indexes or query refactors (e.g., avoiding `SELECT *`).
- **Locks**: Detect rows or tables locked for > 1 second during high-volume updates.
- **Buffer Pool**: Check the 'Cache Hit Ratio' to ensure the DB isn't thrashing the disk.

### Output Format:
A **DB Optimization Guide** including `EXPLAIN ANALYZE` results and suggested index definitions.
```

---

## 49. Frontend: Core Web Vitals Audit

**Category:** Performance Testing

### Full Prompt

```
Act as a Frontend Performance Specialist. Conduct a **Core Web Vitals** audit for {page_url}. 

### KPIs to Measure:
- **LCP (Largest Contentful Paint)**: Is the main image/header visible in < 2.5s?
- **CLS (Cumulative Layout Shift)**: Are elements jumping around during page load (Target < 0.1)?
- **INP (Interaction to Next Paint)**: Is the page responsive to clicks (Target < 200ms)?
- **TBT (Total Blocking Time)**: How long is the main thread busy with heavy JS?

### Output Format:
A **Performance Scorecard** with specific recommendations (e.g., 'Preload LCP image', 'Set width/height on images').
```

---

## 50. QA: Step-Load Stress Testing

**Category:** Performance Testing

### Full Prompt

```
Act as a Performance Tester. Conduct a **Step-Load Stress Test** for {service}. 

### Methodology:
- **The Step**: Increase traffic by 100 Users every 2 minutes until failure.
- **Failure Definition**: Define 'Saturation' (CPU at 100% or Error rate over 5%).
- **Safety Valve**: Verify if the Load Balancer begins 'Health-Check' failing and removing nodes.
- **Post-Failure**: Does the system auto-recover or require a manual restart?

### Output Format:
A **Breaking Point Analysis** stating the maximum stable throughput (RPS) and the first component to fail.
```

---

## 51. Release Gate: Perf Benchmarking

**Category:** Performance Testing

### Full Prompt

```
Act as a Lead QA. Execute a **Performance Regression Benchmark** for the new release vs the 'Golden Baseline'. 

### Comparison Points:
- **Latency**: Did the average response time increase by > 10%?
- **Throughput**: Can the new build handle the same max RPS as the previous one?
- **Resource Footprint**: Has the idle memory usage increased (potential baseline leak)?
- **Tolerance**: Define the 'Pass/Fail' gate (e.g., 'Must be within 5% of Baseline').

### Output Format:
A **Comparison Table** [Metric | Baseline | New Build | Delta | Result (Pass/Fail)].
```

---

## 52. UI Auditor: Responsive Integrity

**Category:** Performance Testing

### Full Prompt

```
Act as a Design-Focused QA. Audit the responsive layout of {page}. 

### Viewport Matrix:
- **Mobile (390px)**: Check for font-size scale, hamburger menu functionality, and multi-column to single-column stacking.
- **Tablet (820px)**: Verify iPad 'Split View' compatibility and side-bar collapse behavior.
- **Desktop (1920px)**: Check for maximum width constraints and image resolution (preventing blur).
- **Orientation**: Verify layout doesn't break when rotating from Portrait to Landscape on mobile.

### Output Format:
A **UI Bug Report** with annotated screenshots (simulated) and CSS fix suggestions (e.g., media query adjustments).
```

---

## 53. A11y Specialist: Manual UX Audit

**Category:** Performance Testing

### Full Prompt

```
Act as an Accessibility Consultant. Perform a manual **WCAG 2.1 AA** audit on {feature}. 

### Manual Checklist:
- **Keyboard Only**: Can you complete the entire flow without a mouse? (Check for focus traps).
- **Focus Visible**: Is the current active element clearly outlined (e.g., no `outline: none`)?
- **Screen Reader**: Use VoiceOver/NVDA to verify 'Hidden' labels and 'Aria-Live' announcements for dynamic updates.
- **Color Contrast**: Verify that all text has a minimum ratio of 4.5:1 (Normal) or 3:1 (Large).

### Output Format:
A **Compliance Scorecard** with prioritized remediation steps for developers.
```

---

## 54. Visual QA: Cross-Browser CSS

**Category:** Performance Testing

### Full Prompt

```
Act as a Visual QA Expert. Detect 'Engine-Specific' UI bugs in {component}. 

### Focus Areas:
- **Safari (WebKit)**: Check for Flexbox gaps, custom scrollbars, and date-input rendering.
- **Firefox (Gecko)**: Check for input field padding defaults and distinct CSS 'backdrop-filter' behavior.
- **Older Browsers**: Verify graceful degradation for modern CSS features like ':has()' or 'container queries'.
- **Transparency**: Check consistency of blurs and shadows across engines.

### Output Format:
A **Compatibility matrix** showing the component state in each browser engine.
```

---

## 55. Interaction: UI State & Motion

**Category:** Performance Testing

### Full Prompt

```
Act as a Product Designer/QA. Test the micro-interactions and motion for {element}. 

### State Checklist:
- **Hover/Active**: Does the transition feel 'Snappy' (e.g., < 200ms)? Is There a focus state for keyboard users?
- **Loading**: Verify the transition from 'Skeleton' -> 'Actual Content'. Is there any layout shift?
- **Success/Error**: Check the timing and 'Dismissibility' of feedback toasts.
- **Animation**: Ensure 60fps smoothness during entry/exit transitions (no 'jank').

### Output Format:
A **UX Feedback Log** with specific timing and animation curve (cubic-bezier) suggestions.
```

---

## 56. L10n Expert: Global UI Integrity

**Category:** UI Testing

### Full Prompt

```
Act as a Globalization QA Manager. Audit the {app_name} for international support. 

### Key Scenarios:
- **Text Expansion**: Test German/Russian versions where text is 40% longer. Does it wrap or truncate (dots)?
- **RTL Support**: Flip the entire UI for Arabic/Hebrew. Are icons (like 'Back' arrows) also flipped correctly?
- **Formatting**: Verify local currency ($, €, ₹) and Date formats (MM/DD/YY vs DD.MM.YY).
- **Input**: Ensure Unicode characters (Emojis, Accents, Hanzi) don't crash the database or UI.
```

---

## 57. UX Writer: Error Clarity Audit

**Category:** UI Testing

### Full Prompt

```
Act as a UX Copywriter & QA. Audit the error-handling experience for {user_flow}. 

### Criteria:
- **Tone**: Is the message helpful ('Please enter a valid email') or robotic ('Error 405 occurred')?
- **Actionability**: Does it tell the user *how* to fix the problem?
- **Visual Prompt**: Is the field outlined in red? Is there an icon for color-blind users to notice the error?
- **A11y**: Is the error message programmatically linked to the input via `aria-describedby`?

### Output Format:
A **Copy & Design Audit** with 'Current' vs 'Proposed' error flows.
```

---

## 58. Visual QA: Dark Mode Contrast

**Category:** UI Testing

### Full Prompt

```
Act as a UI Designer/QA. Conduct a **Dark Mode Audit** for {component}. 

### Verification:
- **Contrast**: Check text (Primary/Secondary) against the dark background for WCAG compliance.
- **Borders**: Are subtle shadows replaced with borders to ensure element separation?
- **Assets**: Does the logo need a 'Light' version for Dark mode? Are icons visible against deep grays?
- **System Toggle**: Does the app respect the OS-level 'Prefers-color-scheme' setting?

### Output Format:
A **High-Resolution UI Review** specifying hex codes for dark-mode-specific tokens.
```

---

## 59. Frontend QA: Live Validation UI

**Category:** UI Testing

### Full Prompt

```
Act as a Frontend SDET. Test the 'Live Validation' logic for {form}. 

### Scenarios:
- **Debounce**: Does validation trigger only after the user stops typing for 500ms (to prevent flickering)?
- **Inline Status**: Show Green/Red icons *inside* the input field based on validity.
- **Submit Locking**: Is the 'Submit' button disabled until all mandatory fields are valid?
- **Scroll to Error**: If the user clicks submit on a long form, does the page smoothly scroll to the first error?

### Output Format:
A **Logic Verification Matrix** for each field and its validation states.
```

---

## 60. Mobile UX: Gesture & Touch Audit

**Category:** UI Testing

### Full Prompt

```
Act as a Mobile UI Guru. Test the touch-friendliness of {module}. 

### Touch Checklist:
- **Tap Targets**: Are all buttons at least 44x44 points (Apple Human Interface Guidelines)?
- **Gestures**: Test 'Swipe to delete', 'Pinch to zoom' (on images), and 'Long press' for context menus.
- **Tapping**: Verify 'Double-tap to zoom' doesn't interfere with fast buttons.
- **Hover Absence**: Ensure no critical info is hidden behind 'Hover-only' states (since mobile has no hover).

### Output Format:
A **Mobile UX Audit Report** with specific focus on 'Fat Finger' error prevention.
```

---

## 61. CSS Expert: Print-Friendly UI

**Category:** UI Testing

### Full Prompt

```
Act as a Web Stylist. Audit the **Print Output** of {page}. 

### CSS Print Goals:
- **Cleanup**: Remove sidebars, ads, and navigation menus (use `@media print { display: none }`).
- **Typography**: Force text to high-contrast black on a white background for ink savings.
- **Links**: Automatically append the full URL next to anchor tags (e.g., 'Google [https://google.com]').
- **Breaks**: Ensure page breaks don't happen in the middle of a table row or a header.

### Output Format:
A **PDF Preview Checklist** and the required CSS snippet to fix layout breaks.
```

---

## 62. Product QA: Zero Data (Empty States)

**Category:** UI Testing

### Full Prompt

```
Act as a Product-Minded QA. Design the 'Empty State' experience for {dashboard_section}. 

### UX Requirements:
- **Value Prop**: Explain *why* this section is empty (e.g., 'You haven't made any sales yet').
- **The CTA**: Provide a primary 'Call to Action' button to get started (e.g., 'Create your first product').
- **Visuals**: Suggest a subtle illustration or icon to prevent the screen from looking 'Broken'.
- **Tone**: Ensure a welcoming and encouraging voice.

### Output Format:
A **Zero-Data UX Spec** with copy and layout suggestions.
```

---

## 63. Performance UX: Skeleton Loading

**Category:** UI Testing

### Full Prompt

```
Act as a Performance UX Specialist. Audit the 'Skeleton Loading' implementation for {page}. 

### Checkpoint:
- **Similarity**: Do the gray skeletons match the *exact* layout of the upcoming content?
- **Motion**: Is the 'Shimmer' effect smooth (linear movement, not too fast)?
- **Transition**: Does the content 'Fade-in' over 300ms to prevent an aggressive 'Flash' of data?
- **Duration**: If the data loads in < 200ms, should we skip the skeleton to prevent a 'Flicker'?

### Output Format:
A **Skeleton UX Review** with specific CSS transition timing suggestions.
```

---

## 64. A11y: Tooltip & Popover Logic

**Category:** UI Testing

### Full Prompt

```
Act as an Accessibility SDET. Test the tooltip / popover logic for {section}. 

### A11y Rules:
- **Trigger**: Tooltip must appear on both 'Hover' (Mouse) AND 'Focus' (Keyboard).
- **Dismiss**: The user must be able to dismiss the tooltip using the 'ESC' key.
- **Hover-over**: The user must be able to move the mouse *over* the tooltip without it disappearing (for links inside).
- **Contrast**: Ensure tooltip text is readable against the background.

### Output Format:
A **Compliance Check** and a code snippet for proper ARIA attributes (`aria-describedby`).
```

---

## 65. Frontend: Infinite Scroll

**Category:** UI Testing

### Full Prompt

```
Act as a Lead Frontend QA. Design a test plan for the 'Infinite Scroll' module on {list_page}. 

### Test Scenarios:
- **Loading Trigger**: Reach 80% scroll depth and verify the next batch begins fetching.
- **Footer Reach**: Verify that a 'No more results' message appears at the end of the collection.
- **Scroll Memory**: If a user clicks an item and then clicks 'Back', are they returned to the *exact* scroll position?
- **Virtualization**: If there are 5000+ items, is 'Windowing' used to keep the DOM footprint small (60fps scrolling)?

### Output Format:
A **Performance & UX Matrix** for high-volume list scrolling.
```

---

## 66. A11y: Modal Focus Management

**Category:** UI Testing

### Full Prompt

```
Act as an Accessibility Consultant. Audit the focus management for the {modal_name} component. 

### Technical Goals:
1. **Open State**: Focus should move to the first interactive element or the 'Close' button automatically.
2. **The Trap**: Tabbing past the last element must wrap focus back to the first element in the modal.
3. **Screen Reader**: Set `aria-modal='true'` and `role='dialog'` to prevent reading the background content.
4. **The Return**: On close, focus must return to the *exact* button that triggered the modal.

### Output Format:
A **Step-by-Step Focus Audit** and a 'A11y Refactor' code snippet.
```

---

## 67. Database QA: Schema Integrity

**Category:** UI Testing

### Full Prompt

```
Act as a Database QA Expert. Design a validation suite for the `{table_name}` table. 

### Integrity Checks:
1. **Schema Check**: Type-check all columns (e.g., ensuring `UUID` vs `String`, `Decimal` for currencies).
2. **Constraints**: Verify `NOT NULL`, `DEFAULT` values, and `UNIQUE` indexes are enforced at the DB level.
3. **Relational**: Audit `FOREIGN KEY` cascades. If a parent is deleted, what happens to the children?
4. **Optimization**: Check for missing indexes on columns used in `WHERE` or `JOIN` clauses.

### Output Format:
A **SQL Audit Script** with comments explaining each constraint verification.
```

---

## 68. Data Warehouse: ETL Reconciliation

**Category:** UI Testing

### Full Prompt

```
Act as a Data Warehouse engineer. Design a data reconciliation test for an ETL job from {source} to {target}. Include: 
- Row count checks
- Sum/Average validation for numeric columns
- Verifying data transformations (e.g., date formats, currency conversion)
- Null handling for required fields in the target.
```

---

## 69. Financial QA: Calculation Accuracy

**Category:** UI Testing

### Full Prompt

```
Act as a financial QA. Design a test suite to verify calculation accuracy in {module}. Include: 
- Rounding to 2 vs 4 decimal places
- Handling of very large numbers (overflow) and very small numbers (underflow)
- Consistency of totals across different reports/screens
- Handling of 'NaN' or 'Infinity' in formulas.
```

---

## 70. BVA: Boundary Value Analysis

**Category:** UI Testing

### Full Prompt

```
Act as a senior QA. Generate Boundary Value Analysis (BVA) test cases for {input_field}. Include: 
- Minimum value, Minimum-1, Minimum+1
- Maximum value, Maximum-1, Maximum+1
- Middle/Average value
- Null or empty input behavior.
```

---

## 71. Data Integrity: Duplicate Submissions

**Category:** Data Validation

### Full Prompt

```
Act as a data integrity officer. Design a test to verify how {process} handles duplicate submissions. Detail: 
- Submitting the same form twice rapidly (double-click)
- Verifying 'Unique' constraints at the DB level
- Testing 'Upsert' logic (update if exists, else insert)
- User-friendly error message for duplicate entries.
```

---

## 72. RegEx: Pattern Validation

**Category:** Data Validation

### Full Prompt

```
Act as a senior QA expert. Provide a test suite for a RegEx pattern used for {field_type}. Include: 
- Positive matches (valid strings)
- Negative matches (invalid but similar strings)
- Testing for 'ReDoS' (Regular Expression Denial of Service) vulnerabilities with complex patterns.
```

---

## 73. Backend: Optional Fields

**Category:** Data Validation

### Full Prompt

```
Act as a backend tester. Design a test case for a complex object {object_name} with multiple optional fields. Verify: 
- Saving without any optional fields
- Partial population of optional fields
- Default values being applied correctly when fields are missing
- API response omitting null fields vs returning them with null values.
```

---

## 74. Search QA: Sort & Filter

**Category:** Data Validation

### Full Prompt

```
Act as a search quality QA. Design a test for {search_feature}. Verify: 
- Alphanumeric sorting logic (A-Z, Z-A)
- Case-sensitivity of search terms
- Correct handling of special characters (e.g., & , @) in search
- Verification that results match the filter criteria exactly.
```

---

## 75. Migration: Post-Migration Audit

**Category:** Data Validation

### Full Prompt

```
Act as a migration lead. Design a post-migration data audit for {system}. Outline the 'Health Check' queries to verify: 
- Column mapping accuracy between Old and New systems
- Integrity of 'Blob' or 'Binary' data
- Checksum verification for large data sets
- Validation of created/modified timestamps preservation.
```

---

## 76. E2E: Three-Way Reconciliation

**Category:** Data Validation

### Full Prompt

```
Act as an E2E QA specialist. Design a 'Three-Way Reconciliation' test for {process}. Explain how to verify that: 
1. User input in Frontend matches API request payload
2. API response matches Database records
3. Frontend UI displays Database data without truncation or formatting errors.
```

---
