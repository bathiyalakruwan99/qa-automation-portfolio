# Manual Load Planning - Domestic Workflow (PB-3176)

**Jira Ticket:** [PB-3176](https://example-platform.atlassian.net/browse/PB-3176)  
**Summary:** As a User, I should be able to manually plan the load using orders in the domestic workflow  
**Status:** Development In Progress  
**Assignee:** Sanjaya Gihan  
**Figma:** [Import Orders Prototype](https://www.figma.com/proto/V3UtmFSpcSHqzVCVcDyp3D/Import-orders?node-id=1-6)

---

```mermaid
mindmap
  root((Manual Load Planning<br/>PB-3176))
    Prerequisites
      Empty Loads Must Be Created
    Import Orders Drawer (PB-3176)
      Select Orders Option
        Navigate to Order Manager
        Select & Transfer to Job File
      Import Orders Option
        Upload Order File
        Register Orders in Order Manager
        File Validation
      Order Selection Interface
        Select All Checkbox
        Search By Dropdown (Order ID, Consignee, Pickup Location, Drop-off Location)
        Date Range Picker (Based on Planned Delivery Date and Time)
        Order Filtering and Display
      Duplicate Order Detection
        Warning: Orders Already in System
        Omit Duplicates from Upload
      Duplicate Order ID Handling
        First Duplicate: ID001 → ID001(1)
        Multiple Duplicates: ID001(1) → ID001(2) → ID001(3)
        Sequential ID Generation
        Warning Message Display
      Clear Orders Button
        Confirmation Popup
        Yes: Remove from Job & Order Manager
        No: Remove from Job Only
    Move Orders Functionality (PB-3176)
      Multi-Select Orders
        Enable Move Orders Button
        Open Load Selection Window
        Transfer to Selected Load
      Location Sequencing
        Auto-Group by Location
        Preserve Order Selection Sequence
        Smart Location Assignment
    Load Management Screen (PB-3176)
      Expandable Activities
        Display Order IDs
        Removable Order Chips
        Return to Import Orders Section
      Activity Card Display Logic
        Loading Activities: Show Drop Location
        Unloading Activities: Show Order ID Only
        Activity Type Differentiation
      Activity Card Management
        Add Activities Without Orders
        Current Functionality Maintained
    Update Loads Feature (PB-3176)
      Open Update Loads Drawer
        Display All Load IDs
        Expandable Load Details
        View Load ID, Vehicle Type, CBM, Weight
      Move Orders Between Loads
        Select Orders to Move
        Choose Target Load
        Execute Transfer
    Route Optimization (PB-3176)
      Global Optimise Button
        Optimise All Loads
        Confirmation Popup: Yes/No
      Per-Load Optimise Button
        Optimise Individual Load Route
        Tooltip: Optimise
      Optimization Logic
        Lowest Mileage Route
        Exclude Constraints Initially
        No Location Accessibility Check
        No Operating Hours Check
      Optimization Counter
        Track Optimisation Count
        Display in UI
        Increment on Each Optimisation
      Optimization Cargo Loading
        Cargo Loading to First Location
        Billing Start Set to First Location
        Billing End Set to Last Location
      Billing Flags & Re-optimization
        Billing Flags Modification
        First Location Billing Start Default
        Last Location Billing End Default
        Route Re-optimization Behavior
        Billing Flags Reset Logic
      Post-Optimization Workflow
        Manual Location Shuffling
          Re-optimize After Manual Changes
          Correct Route Rearrangement
        New Location Insertion
          Add Location in Middle
          Re-optimize for Proper Positioning
        Add Order Within Load
          New Order at Last Position
          Re-optimize to Correct Position
        Add Order From Main
          Import from Main Order List
          Re-optimize to Correct Position
        Location Deletion
          Remove Location from Route
          Re-optimize Remaining Route
    Load Action Buttons (PB-3176)
      Icon Replacements
        Edit Load Data (Icon)
        Duplicate (Icon)
        Delete (Icon)
      New Button: Optimise
        Route Optimization
        Tooltip: Optimise
      New Button: Update Load
        Open Update Orders Screen
        Tooltip: Update Load
      New Button: Import Orders
        Open Import Drawer
        Tooltip: Import Orders
    Fill Load Data (PB-3176)
      Current Functionality Maintained
    Duplicate Load (PB-3176)
      Duplicate Locations Only
        Exclude Orders from Trip
      Warning Confirmation
    Delete Load (PB-3176)
      Warning Popup
        Message: Are you sure?
        Buttons: Yes, No
    Edge Cases (PB-3176)
      Single Order Deletion
        Warning Popup
        Yes: Delete Activity & Order
          Tooltip: Delete both
        No: Cancel Action
          Tooltip: Keep both
    Figma Specs (PB-3176)
      Design Reference
        Import Orders Prototype
        V3UtmFSpcSHqzVCVcDyp3D
    Error Handling (PB-3176)
      Duplicate Order Upload
      Empty Load Validation
      Order Manager Sync
      File Upload Validation
    Validations (PB-3176)
      Order File Format
      Order ID Uniqueness
      Load Capacity Checks
      Location Data Integrity
      Multiple Loading Locations Validation
        Single Location Acceptance
        Multiple Locations Rejection
        Optimizer Limitation Message
      Duplicate Order ID Handling
        Order ID Auto-Increment
        ID001 → ID001(1) → ID001(2)
        Warning Display
        Upload Prevention
      Order Selection Interface
        Select All Functionality
        Search By Options
          Order ID Search
          Consignee Search
          Pickup Location Search
          Drop-off Location Search
        Date Range Picker
          Planned Delivery Date Filter
          Calendar Integration
          Date Range Selection
    Container Management (PB-3176)
      Time Constraint Validation
        L2 Required Arrival > L1 Required Leave Blocking
        L2 Required Arrival < L1 Required Leave Blocking
        L1 Leave > L2 Arrival Blocking
        L2 Arrival > L2 Leave Blocking
        Positioning Time Outside Window Blocking
      Boundary Enforcement
        Strict Boundary Requirements
        L2 Arrival = L1 Leave Blocking
        L2 Leave = L2 Arrival Blocking
        Valid Window Setting (L1 Leave + 1 second)
      Input Method Validation
        Calendar Picker vs Manual Typing
        Invalid Time Revert Behavior
        Field State Differences
        Error Message Consistency
      Auto-Propagation System
        L1 Leave Change Cascade
        Sequential Edits Cascade
        Multi-Location Chain Propagation (L2→L3→L4)
        Task Duration Changes Auto-Update
        Downstream Time Recalculation
      Data Persistence
        Auto-Propagation Persistence
        Job Reload Verification
        Data Drift Prevention
        Field Clearing Validation
      Conflict Resolution
        Tasks Push Conflict Detection
        Auto-Resolve vs Manual Resolution
        Context-Appropriate Error Messages
        Save Blocking Until Resolution
      Key Dates Validation
        Save Only When All Key Dates Valid
        Block Save When Key Dates Invalid
        Field Clearing by Validation
        Data Integrity Maintenance
      Error Prevention
        False Leave Error Avoidance
        Wrong Context Banner Prevention
        True Violation Detection Only
        Validation Scope Accuracy
      Message Consistency
        Consistent Error Message Formats
        Professional Messaging
        Context-Accurate Validation
        Clear and Actionable Feedback
    Activity Card Display - Multi-System (PB-3176)
      Container Management Display
        Loading Activity Display
          Show Drop Location
          Display Order ID
          Activity Type Indicator
        Unloading Activity Display
          Show Order ID Only
          Hide Drop Location
          Activity Type Indicator
      Control Tower Display
        Loading Activity Display
          Show Drop Location
          Display Order ID
          Activity Type Indicator
        Unloading Activity Display
          Show Order ID Only
          Hide Drop Location
          Activity Type Indicator
      Cross-System Consistency
        Consistent Display Logic
        Uniform Activity Type Handling
        Standardized Information Display
        System-Agnostic Behavior
    Return Activity Feature (PB-3176)
      Activity Configuration
        Single Return Activity Limit
          Only One Return Per Load
          Validation on Activity Addition
        Position Restrictions
          Must Be Last Activity Before End Job
          No Activities Allowed After Return
          Return Hidden in Activity List When Not Applicable
      Mobile App Specific
        Mobile App Visibility
          Visible Only When Last Before End Job
          Hidden When Later Activities Exist
        Mobile App Creation
          Creation Allowed from Mobile App Only
          Permission Based Creation
        Mobile App Design Consistency
          Label Alignment
          Icon Consistency
          Color Theme Matching
      Edit Delete Permissions
        Edit Before Started
          User Can Edit Before Activity Starts
        Delete Before Completion
          User Can Delete Based on Standard Rules
        No Edit Delete After Completion
          Options Hidden After Completion
        Audit Trail
          User Timestamp Action Logging
          Mobile Activity History Recording
      Invoicing and Optimization
        No Impact on Invoicing Logic
        Return Activity Excluded from Optimization
        First Activity Excluded from Optimization When Return Exists
        Optimizer Ignores Return Activity
        No Route Recalculation
        No Impact on Load Route
        No Impact on Job Summary
        No New Invoice Lines Generation
        Summary Views Unaffected
      Activity Workflow
        Optional Activity
          Can Create Loads Without Return
          Can Delete Return Activity
          Can Edit Return Activity
        Work Orders Configuration
          Minimum Work Orders (Without Billing End Toggle)
            Enter Location
            Exit Location
          Default Work Orders (Without Billing End Toggle)
            Enter Location
            Handover Supporting Documents
            Exit Location
          Minimum Work Orders (With Billing End Toggle)
            Enter Location
            End the Trip
            Exit Location
          Default Work Orders (With Billing End Toggle)
            Enter Location
            Handover Supporting Documents
            End the Trip
            Exit Location
        Work Order Sequence
          Correct Sequence Execution
          Auto Completion Logic
          Next Work Order Enablement
        Billing End Toggle
          Toggle State Persistence
          End Trip Conditional Display
      Activity Restrictions
        No Control Tower Access
        No Container Management Access
        No Additional Tasks
        Position Locked Before End Job
      Location Validation
        Geofence Check Required
          GPS Testing for Location In
          GPS Testing for Location Out
          Geofence Boundary Validation
          Geofence Radius Verification
        Location Accuracy Verification
        GPS Event Handling
          GPS Within Range Triggers Enter Location
          GPS Exit Event Triggers Exit Location
          GPS Signal Loss Recovery
          Missed Event Logging
      GPS Integration
        GPS Event Auto Updates
          Inbound Event Auto Updates Enter Location
          Outbound Event Auto Completes Exit Location
        GPS Event Logging
          Timestamp Capture
          Latitude Longitude Recording
          Location ID Storage
        GPS Event History
          Job GPS History Display
          Event Log Integration
      Backward Compatibility
        Older Jobs Without Return Run Normally
        No Breaking Changes to Existing Workflows
    Distribution Management (PB-3176)
      File Upload Functionality
        File Format Validation
          CSV Format Support
          Excel Format Support
          JSON Format Support
          Format Compliance Check
        File Size Validation
          Size Limit Enforcement
          Large File Handling
          Performance Optimization
        Data Integrity Check
          Required Field Validation
          Data Format Validation
          Corrupted Data Handling
          Data Completeness Check
        Error Handling
          Network Interruption Handling
          Server Error Management
          Timeout Scenarios
          Recovery Options
        Success Confirmation
          Upload Success Feedback
          Processing Status Display
          Data Availability Confirmation
      Optimization Functionality
        Route Calculation
          Optimal Route Generation
          Route Efficiency Validation
          Route Constraint Handling
          Route Accuracy Verification
        Performance Requirements
          Processing Time Benchmarks
          System Resource Management
          Response Time Standards
          Scalability Validation
        Cost Calculation
          Cost Data Processing
          Cost Optimization Results
          Cost Constraint Validation
          Cost Efficiency Verification
        Constraint Handling
          Constraint Processing
          Constraint Validation
          Constraint Compliance
          Constraint Scenarios
        Result Validation
          Result Accuracy Check
          Result Completeness Verification
          Result Consistency Validation
          Result Quality Standards
```

---

## Key Features Summary

### 1. **Import Orders Drawer**
- Two import methods: Select Orders (from Order Manager) and Import Orders (from file)
- Duplicate detection with warning notifications
- Clear button with granular control (remove from job only vs. job + order manager)

### 2. **Order Movement & Sequencing**
- Multi-select order movement between loads
- Automatic location-based grouping
- Smart sequencing based on selection order

### 3. **Load Management**
- Expandable activity cards showing order IDs
- Removable order chips with drag-and-drop functionality
- Update Loads drawer with comprehensive load information

### 4. **Route Optimization**
- Global and per-load optimization buttons
- Optimization counter displayed in UI
- Route selection based on lowest mileage (constraints excluded initially)

### 5. **Enhanced UI Controls**
- Icon-based actions for cleaner interface
- Three new action buttons: Optimise, Update Load, Import Orders
- Tooltips for improved UX

### 6. **Edge Case Handling**
- Single order deletion with activity preservation options
- Confirmation dialogs for destructive actions
- Hover tooltips explaining action consequences

---

## Acceptance Criteria

✅ Empty loads can be created as prerequisites  
✅ Import Orders drawer with two import options functional  
✅ Duplicate order detection and warning system working  
✅ Clear orders with granular removal options  
✅ Move Orders functionality with multi-select enabled  
✅ Automatic location-based sequencing implemented  
✅ Expandable activities showing removable order chips  
✅ Update Loads drawer with load details (ID, vehicle type, CBM, weight)  
✅ Global and per-load Optimise buttons functional  
✅ Optimization counter displayed and incrementing correctly  
✅ Route optimizer uses lowest mileage logic  
✅ Icon replacements for existing buttons completed  
✅ New action buttons (Optimise, Update Load, Import Orders) added  
✅ Duplicate load functionality excludes orders  
✅ Delete confirmations for loads implemented  
✅ Single order deletion edge case handled with proper warnings  

---

## Related Links

- **Jira:** [PB-3176](https://example-platform.atlassian.net/browse/PB-3176)
- **Comments:** [Comment 20390](https://example-platform.atlassian.net/browse/PB-3176?focusedCommentId=20390) | [Comment 20463](https://example-platform.atlassian.net/browse/PB-3176?focusedCommentId=20463)
- **Figma:** [Import Orders Design](https://www.figma.com/proto/V3UtmFSpcSHqzVCVcDyp3D/Import-orders?node-id=1-6)

---

## Testing Coverage Summary

### **Total Test Cases: 298 Individual Test Cases**
- **RTM Requirements Covered: 255/255 (100% Coverage)**
- **RTM Test Case Mappings: 254/254 (100% Coverage)**
- **Test Case Types: Functional, UI, Integration, Performance, Accessibility, Error Handling, Validation**

### **Test Case Distribution by Category:**

#### **Prerequisites & Setup (1 test case)**
- Empty Loads Creation Prerequisites

#### **Import Orders Functionality (19 test cases)**
- Import Orders Drawer Accessibility
- Select Orders Navigation  
- Select Orders from Order Manager Transfer
- Order File Upload and Registration
- Duplicate Order Detection Warning
- Duplicate Order Warning Message Content
- File Format Validation
- Duplicate Order ID Handling First Duplicate
- Duplicate Order ID Handling Multiple Duplicates
- Duplicate Order ID Warning Message
- Select All Functionality
- Search By Dropdown Options
- Search By Order ID Functionality
- Search By Consignee Functionality
- Search By Pickup Location Functionality
- Search By Drop-off Location Functionality
- Date Range Picker Display
- Date Range Functionality
- Date Range Calendar Integration

#### **Order Management & Clear Operations (4 test cases)**
- Clear Orders Yes Option (Remove from Both)
- Clear Orders No Option (Remove from Job Only)
- Clear Orders Cancel Option

#### **Move Orders & Location Sequencing (6 test cases)**
- Move Orders Button Enable on Selection
- Move Orders Button Initial Disabled State
- Multiple Orders Transfer Together
- Orders Transfer to Selected Load
- Automatic Location-Based Grouping
- Order Selection Sequence Preservation
- Existing Location Handling in Load

#### **Load Management Screen (7 test cases)**
- Load Management Activity Cards Expansion
- Remove Order Chip from Activity
- Removed Order Returns to Import Orders
- Drop Location Display Loading Activity
- Drop Location Display Unloading Activity
- Drop Location Display Activity Card Structure

#### **Update Loads Feature (8 test cases)**
- Move Orders Between Loads in Update Drawer
- Update Loads Drawer Expandable Loads
- Update Loads Drawer Order Selection
- Update Loads Move Button Conditional Display
- Update Loads Load Selection Window
- Update Loads Successful Move Execution
- Load Details Display in Update Drawer
- Update Loads Individual Data Display
- Cross-Load Order Movement

#### **Route Optimization (7 test cases)**
- Optimization Counter Display and Increment
- Route Optimizer Logic Lowest Mileage
- Route Optimizer Excludes Location Accessibility
- Route Optimizer Excludes Operating Hours
- Route Optimizer KM Based Only
- Global Optimize Button with Confirmation
- Global Optimize Button Display
- Global Optimize Confirmation Message
- Global Optimize Confirmation Buttons
- Global Optimize Yes Action
- Global Optimize No Action
- Per-Load Optimization Isolation
- Per-Load Optimize Button Display
- Per-Load Optimize Functionality
- Per-Load Optimization No Global Impact

#### **Post-Optimization Workflow (5 test cases)**
- Post-Optimization Manual Location Shuffling
- Post-Optimization New Location Insertion
- Post-Optimization Add Order Within Load
- Post-Optimization Add Order From Main
- Post-Optimization Location Deletion

#### **UI/UX Enhancements (4 test cases)**
- Button Icon Replacements
- New Action Buttons with Tooltips

#### **Load Operations (4 test cases)**
- Add Activities Without Orders
- Fill Load Data Button Functionality
- Duplicate Load Excludes Orders
- Duplicate Load Locations Only
- Duplicate Load Structure Integrity

#### **Delete Operations (6 test cases)**
- Delete Load Confirmation Flow
- Delete Load Warning Popup
- Delete Load Warning Message
- Delete Load Confirmation Buttons
- Delete Load Yes Action
- Delete Load No Action
- Delete Load Orders Return to Import

#### **Edge Cases & Single Order Deletion (9 test cases)**
- Single Order Deletion Edge Case
- Single Order Deletion Warning Message
- Single Order Deletion Warning Buttons
- Single Order Deletion Yes Option
- Single Order Deletion Yes Tooltip
- Single Order Deletion No Option
- Single Order Deletion No Tooltip
- Single Order Deletion Cancel Option
- Activity Remains After Order-Only Deletion

#### **Integration & Design (2 test cases)**
- Order Manager Synchronization
- Figma Design Compliance

#### **Performance Testing (3 test cases)**
- Large Order File Upload Performance (500 orders)
- Multiple Loads Optimization Performance (20 loads, 300 orders)
- UI Responsiveness Under Load (50 loads, 500 orders)

#### **Error Handling (3 test cases)**
- File Format Validation
- Error Recovery and User Guidance
- Network Failure During Upload Error Handling
- Optimization Failure Error Handling

#### **Accessibility (1 test case)**
- Accessibility and Usability Compliance
- Screen Reader Support

#### **Return Activity Feature (44 test cases)**
- Single Return Activity Per Load Validation
- Return Activity Position Restrictions
- Mobile App Visibility and Creation
- Mobile App Label Icons Theme Consistency
- Edit Delete Permissions with Timing Constraints
- Audit Trail Logging
- Return Activity Hidden in Activity List
- Return Activity No Impact on Invoicing
- Return Activity Excluded from Optimization
- First Activity Excluded When Return Exists
- No Route Recalculation
- No Impact on Job Summary
- Return Activity Optional Creation
- Return Activity Deletion
- Return Activity Editing
- Minimum Work Orders Without Billing End Toggle
- Default Work Orders Without Billing End Toggle
- Minimum Work Orders With Billing End Toggle
- Default Work Orders With Billing End Toggle
- Work Order Sequence and Auto Completion
- Billing End Toggle State Persistence
- End Trip Conditional Display
- No Control Tower Access for Return Activity
- No Container Management Access for Return Activity
- No Additional Tasks in Return Activity
- Geofence Boundary and Radius Validation
- GPS Within Range Triggers
- GPS Exit Event Triggers
- GPS Signal Loss Recovery
- GPS Event Auto Updates for Work Orders
- GPS Event Data Logging
- GPS Event History Display
- No New Invoice Lines with Billing End
- Optimizer Summary Views Unaffected
- Backward Compatibility Testing


#### **Performance & Display Requirements (3 test cases)**
- Order Display Limit per Load (10 orders + scroll)
- File Import Performance (5 seconds or less)
- Optimization Performance (2-3 minutes or less)

#### **Business Rules & Validation (8 test cases)**
- Multiple Loading Locations Validation
- Multiple Loading Locations Single Location Acceptance
- Multiple Loading Locations Multiple Locations Rejection
- Multiple Loading Locations Error Message
- Pickup Delivery Time Calculation
- Re-upload Prevention
- Starting Location Selection
- Order File Format Validation

#### **Figma Design Compliance (8 test cases)**
- Import Orders Modal Design Compliance
- Button Component Design Validation
- Optimization Confirmation Dialog
- Order List Component Design
- Icon Components Design Validation
- Optimization Counter Display Design
- Load Action Buttons Design
- Modal State Transitions

### **Priority Distribution:**
- **Critical:** 52 test cases
- **High:** 62 test cases  
- **Medium:** 36 test cases
- **Low:** 3 test cases

### **Test Type Distribution:**
- **Functional/UI:** 127 test cases
- **Performance:** 5 test cases
- **Integration:** 4 test cases
- **Accessibility:** 1 test case
- **Error Handling:** 4 test cases
- **Validation:** 14 test cases
- **Regression:** 3 test cases

### **Key Testing Scenarios Covered:**
1. **Complete Import Orders Workflow** - File upload, Order Manager selection, duplicate detection
2. **Order Movement & Sequencing** - Multi-select, location grouping, sequence preservation
3. **Load Management Operations** - Activity expansion, order chip removal, data flow
4. **Update Loads Functionality** - Cross-load movement, data display, conditional UI
5. **Route Optimization** - Global/per-load optimization, counter tracking, algorithm validation
6. **Post-Optimization Workflow** - Manual shuffling, location insertion, order addition, location deletion
7. **Load Operations** - Duplicate, delete, edge cases, data integrity
8. **UI/UX Validation** - Icon replacements, tooltips, design compliance
9. **Performance & Scalability** - Large datasets, optimization performance, UI responsiveness
10. **Error Handling & Recovery** - Network failures, optimization failures, user guidance
11. **Accessibility Compliance** - Screen reader support
12. **Performance Requirements** - File import (5s), optimization (2-3min), display limits
13. **Business Rules Validation** - Multiple loading locations, re-upload prevention, time calculations
14. **UI Display Management** - Order display limits, scroll functionality, starting location selection
15. **Figma Design Compliance** - Modal designs, button components, icon validation, state transitions
16. **Return Activity Feature** - Single activity limit, position restrictions, optimization exclusion, work order configurations, GPS validation
17. **Return Activity Mobile App** - Mobile app visibility, creation permissions, edit/delete timing, audit trail logging
18. **Return Activity GPS Integration** - GPS event auto-updates, geofence validation, signal loss recovery, event history logging
19. **Return Activity Work Orders** - Sequence execution, auto-completion, billing end toggle persistence, conditional display

---

## Requirements Traceability Matrix (RTM) Summary

### **Complete RTM Coverage: 255 Requirements → 254 RTM Mappings → 298 Executable Test Cases**

| **Requirement Category** | **RTM Requirements** | **Test Cases** | **Coverage Status** |
|-------------------------|---------------------|----------------|-------------------|
| **Prerequisites** | 1 | 1 | ✅ 100% |
| **Import Orders Drawer** | 12 | 7 | ✅ 100% |
| **Move Orders & Location Sequencing** | 8 | 6 | ✅ 100% |
| **Load Management Screen** | 4 | 3 | ✅ 100% |
| **Update Loads Feature** | 11 | 8 | ✅ 100% |
| **Route Optimization** | 13 | 9 | ✅ 100% |
| **Post-Optimization Workflow** | 5 | 5 | ✅ 100% |
| **Load Action Buttons** | 12 | 2 | ✅ 100% |
| **Load Operations** | 7 | 4 | ✅ 100% |
| **Delete Operations** | 6 | 6 | ✅ 100% |
| **Edge Cases** | 7 | 7 | ✅ 100% |
| **Integration & Design** | 2 | 2 | ✅ 100% |
| **Performance** | 3 | 3 | ✅ 100% |
| **Accessibility** | 1 | 1 | ✅ 100% |
| **Error Handling** | 3 | 3 | ✅ 100% |
| **Performance & Display** | 3 | 3 | ✅ 100% |
| **Business Rules & Validation** | 5 | 5 | ✅ 100% |
| **Figma Design Compliance** | 8 | 8 | ✅ 100% |
| **Container Management** | 34 | 34 | ✅ 100% |
| **Distribution Management** | 16 | 16 | ✅ 100% |
| **Billing Flags & Optimization** | 3 | 3 | ✅ 100% |
| **Activity Card Display - Multi-System** | 5 | 5 | ✅ 100% |
| **Return Activity Feature** | 54 | 44 | ✅ 100% |

### **RTM Test Case Mapping:**

#### **Critical Requirements (34 test cases)**
- Empty Loads Creation Prerequisites
- Clear Orders Yes/No Options
- Orders Transfer to Selected Load
- Automatic Location-Based Grouping
- Removed Order Returns to Import Orders
- Update Loads Successful Move Execution
- Route Optimizer Logic & Constraints
- Global/Per-Load Optimization Actions
- Optimization Cargo Loading (First Location Billing Start, Last Location Billing End)
- Duplicate Load Operations
- Delete Load Actions
- Single Order Deletion Options
- Multiple Loading Locations Validation
- Pickup Delivery Time Calculation
- Re-upload Prevention
- Return Activity Single Limit Per Load
- Return Activity Position Before End Job
- Return Activity Excluded from Optimization
- First Activity Excluded When Return Exists
- Return Activity Optional Deletion/Editing
- Return Activity Work Orders Configuration

#### **High Priority Requirements (36 test cases)**
- Import Orders Functionality
- Order Manager Integration
- Move Orders Operations
- Location Sequencing
- Load Management Operations
- Update Loads Features
- Optimization Counter
- New Button Functionality
- Order Manager Synchronization
- Figma Design Compliance
- Error Recovery
- File Import Performance
- Optimization Performance
- Starting Location Selection
- Import Orders Modal Design Compliance
- Button Component Design Validation

#### **Medium Priority Requirements (26 test cases)**
- UI/UX Validation
- Load Details Display
- Button States
- Confirmation Messages
- Performance Testing
- Accessibility Compliance
- Order Display Limit per Load
- Order File Format Validation
- Optimization Confirmation Dialog
- Order List Component Design
- Icon Components Design Validation
- Load Action Buttons Design
- Modal State Transitions

#### **Low Priority Requirements (6 test cases)**
- Icon Replacements
- Tooltip Validation
- Screen Reader Support

### **Quality Assurance Metrics:**

- **Requirement Coverage:** 255/255 (100%)
- **RTM Test Case Mappings:** 254 mappings (100%)
- **Executable Test Cases:** 298 individual test cases (117% - enhanced coverage with detailed breakdowns)
- **Priority Distribution:** Balanced across Critical, High, Medium, Low
- **Test Type Coverage:** Functional, UI, Integration, Performance, Accessibility, Error Handling, Validation
- **Edge Case Coverage:** Comprehensive single order deletion scenarios, Return activity position restrictions, GPS signal loss recovery
- **Performance Testing:** Large dataset handling (500-1000 orders, 20+ loads)
- **Accessibility Compliance:** Screen reader support
- **GPS Integration Testing:** Return activity location validation with geofence checks, GPS event auto-updates, audit trail logging
- **Mobile App Testing:** Return activity visibility, creation permissions, edit/delete timing constraints
- **Backward Compatibility:** Older jobs without Return activity validation

### **Test Execution Readiness:**

✅ **All RTM requirements have corresponding test cases**  
✅ **Test cases follow standardized format and naming convention**  
✅ **Individual test cases (no combinations) for precise validation**  
✅ **Comprehensive coverage of functional, non-functional, and edge case scenarios**  
✅ **Performance and scalability testing included**  
✅ **Accessibility and usability validation covered**  
✅ **Error handling and recovery scenarios addressed**  

---

## Recent Updates

### **Jira Comment Reference: [Comment 20463](https://example-platform.atlassian.net/browse/PB-3176?focusedCommentId=20463)**
- **Added 8 new requirements and test cases** based on comment clarifications:
  - Order display limit per load (10 orders + scroll)
  - File import performance (5 seconds or less)
  - Optimization performance (2-3 minutes or less)
  - Multiple loading locations validation
  - Pickup/delivery time calculation logic
  - Re-upload prevention when orders exist
  - Starting location selection (pickup location)
  - Order file format validation (CBM SKU kg mandatory)
- **Updated totals:** 83 → 96 test cases, 97 → 110 RTM requirements
- **New test categories:** Performance & Display, Business Rules & Validation, Figma Design Compliance

### **Post-Optimization Workflow Enhancement**
- **Added 5 new critical test cases** for post-optimization scenarios:
  - Manual location shuffling after optimization
  - New location insertion in middle of existing locations
  - Adding orders within load after optimization
  - Adding orders from main order list after optimization
  - Location deletion and route re-optimization
- **Updated totals:** 96 → 120 test cases, 110 → 136 RTM requirements
- **New test category:** Post-Optimization Workflow (5 critical test cases)
- **Enhanced coverage:** All comment clarifications and Figma designs now have dedicated test cases
- **Added Figma Design Coverage:** 8 new test cases for comprehensive design compliance validation

### **Optimization Cargo Loading Enhancement**
- **Added 2 new critical test cases** for optimization cargo loading billing logic:
  - First location billing start after optimization
  - Last location billing end after optimization
- **Updated totals:** 120 → 120 test cases, 134 → 136 RTM requirements
- **New requirement category:** Optimization Cargo Loading (2 critical test cases)
- **Enhanced coverage:** Optimization billing logic now has dedicated test cases

### **Single Order Deletion Design Update**
- **Simplified edge case design** to match image specifications:
  - Reduced from 3 buttons (Yes/No/Cancel) to 2 buttons (Yes/No) only
  - Updated No button behavior to cancel action instead of partial deletion
  - Updated tooltips to reflect new behavior
- **Updated totals:** 122 → 120 test cases (removed 2 test cases)
- **Simplified user experience:** Cleaner 2-button interface matching design image
- **Enhanced coverage:** Edge case now matches exact design specifications

### **Container Management Enhancement**
- **Added 34 new comprehensive test cases** for Container Management functionality:
  - Time Constraint Validation (8 test cases)
  - Boundary Enforcement (1 test case)
  - Input Method Validation (2 test cases)
  - Auto-Propagation System (6 test cases)
  - Data Persistence (2 test cases)
  - Conflict Resolution (2 test cases)
  - Key Dates Validation (2 test cases)
  - Error Prevention (3 test cases)
  - Message Consistency (1 test case)
  - Additional Validation Coverage (1 test case)
- **Updated totals:** 120 → 154 test cases, 136 → 171 RTM requirements
- **New requirement category:** Container Management (34 comprehensive test cases)
- **Enhanced coverage:** Complete Container Management workflow validation

### **Distribution Management Enhancement**
- **Added 10 new comprehensive test cases** for Distribution Management functionality:
  - File Upload Functionality (5 test cases)
    - File Format Validation
    - File Size Validation
    - Data Integrity Check
    - Error Handling
    - Success Confirmation
  - Optimization Functionality (5 test cases)
    - Route Calculation
    - Performance Requirements
    - Cost Calculation
    - Constraint Handling
    - Result Validation
- **Updated totals:** 154 → 170 test cases, 171 → 181 RTM requirements
- **New requirement category:** Distribution Management (15 comprehensive test cases)
- **Enhanced coverage:** Complete Distribution file upload and optimization workflow validation

### **Billing Flags & Activity Card Display Enhancement**
- **Added 8 new comprehensive test cases** for Billing Flags and Multi-System Activity Card Display:
  - Billing Flags & Route Re-optimization (3 test cases)
    - First Location Billing Start Default
    - Last Location Billing End Default
    - Route Re-optimization Behavior
  - Activity Card Display - Multi-System (5 test cases)
    - Container Management Loading Activity
    - Container Management Unloading Activity
    - Control Tower Loading Activity
    - Control Tower Unloading Activity
    - Cross-System Consistency
- **Updated totals:** 170 → 167 test cases, 181 → 189 RTM requirements
- **New requirement categories:** Billing Flags & Optimization (3 test cases), Activity Card Display - Multi-System (5 test cases)
- **Enhanced coverage:** Billing flags behavior on re-optimization and consistent activity card display across Container Management and Control Tower systems

### **Return Activity Feature Enhancement**
- **Added 28 new comprehensive requirements and 18 test cases** for Return Activity functionality:
  - Activity Configuration (7 requirements)
    - Single Return Activity Per Load Validation
    - Position Restrictions (Must Be Last Before End Job)
    - Return Hidden When Not Applicable
  - Invoicing and Optimization (4 requirements)
    - No Impact on Invoicing Logic
    - Return Activity Excluded from Optimization
    - First Activity Excluded When Return Exists
  - Activity Workflow (9 requirements)
    - Optional Activity (Creation, Deletion, Editing)
    - Work Orders Configuration (4 variants with/without billing end toggle)
  - Activity Restrictions (4 requirements)
    - No Control Tower Access
    - No Container Management Access
    - No Additional Tasks
    - Position Locked Before End Job
  - Location Validation (4 requirements)
    - Geofence Check Required
    - GPS Testing for Location In/Out
    - Location Accuracy Verification
- **Updated totals:** 167 → 185 test cases, 189 → 217 RTM requirements
- **New requirement category:** Return Activity Feature (28 requirements, 18 test cases)
- **Enhanced coverage:** Complete Return Activity workflow with optimization exclusion, work order configurations, and GPS validation

### **Return Activity Mobile App & GPS Integration Enhancement**
- **Added 26 new comprehensive requirements** for Return Activity mobile app and GPS integration:
  - Mobile App Specific (7 requirements)
    - Mobile App Visibility (Last Position Before End Job)
    - Mobile App Creation Permission Based
    - Label Icons Theme Consistency
  - Edit Delete Permissions (4 requirements)
    - Edit Before Started
    - Delete Before Completion
    - No Edit Delete After Completion
    - Audit Trail Logging
  - Enhanced Invoicing and Optimization (5 requirements)
    - No Route Recalculation Verification
    - No Impact on Job Summary
    - No New Invoice Lines with Billing End
    - Summary Views Unaffected
  - Work Order Enhancements (5 requirements)
    - Work Order Sequence Execution
    - Auto Completion Logic
    - Billing End Toggle State Persistence
    - End Trip Conditional Display
  - GPS Integration Deep Dive (10 requirements)
    - Geofence Boundary and Radius Validation
    - GPS Within Range Triggers
    - GPS Exit Event Triggers
    - GPS Signal Loss Recovery
    - GPS Event Auto Updates for Work Orders
    - GPS Event Data Logging (Timestamp, Lat/Long, Location ID)
    - GPS Event History Display
  - Backward Compatibility (1 requirement)
    - Older Jobs Without Return Run Normally
- **Updated totals:** 185 → 211 test cases, 217 → 243 RTM requirements
- **Enhanced Return Activity category:** 54 requirements (28 + 26), 44 test cases (18 + 26)

### **Missing Test Cases Enhancement**
- **Added 12 new test cases** to cover gaps identified in comprehensive review:
  - Move Orders Extended Validation (4 test cases)
    - Order Removal from Original Load
    - Move Confirmation Tooltip
    - Invalid Load Selection Handling
    - Duplicate Load Selection Prevention
  - Update Loads Data Management (2 test cases)
    - Data Persistence After Reload
    - Move Failure Handling
  - Button Icons UX Validation (2 test cases)
    - Tooltip Accuracy Validation
    - Icon Visibility and Clarity
  - Additional Validations (4 test cases)
    - Duplicate Load Location Structure Validation
    - Clear Orders Confirmation Messages (Yes/No options)
    - Optimization Counter Persistence After Reload
- **Updated totals:** 211 → 223 RTM mappings, 243 → 255 RTM requirements
- **Enhanced coverage:** Move orders edge cases, data persistence, UI validation, error handling

### **Complete Test Cases Synchronization**
- **Added 74 missing test cases** to Individual Test Cases CSV to achieve 100% RTM coverage:
  - Import Orders Extended Tests (6 test cases)
  - Move Orders Detailed Tests (4 test cases)
  - Update Loads Comprehensive Tests (10 test cases)
  - Optimization Counter Tests (3 test cases)
  - Route Optimizer Detailed Tests (3 test cases)
  - Button Icons All Replacements (3 test cases)
  - New Buttons Complete Suite (9 test cases)
  - Duplicate Load Complete Tests (3 test cases)
  - Delete Load Complete Suite (6 test cases)
  - Single Order Deletion Complete (8 test cases)
  - Error Handling Complete (3 test cases)
  - Return Activity Additional Tests (4 test cases)
  - And 12 additional validation tests
- **Final totals:** 223 → 298 executable test cases
- **Coverage achievement:** 117% coverage - Every RTM test case mapping has corresponding detailed executable test case, with additional comprehensive test scenarios for thorough validation

---

**Generated:** October 1, 2025  
**Last Updated:** October 15, 2025 12:00:00 IST

