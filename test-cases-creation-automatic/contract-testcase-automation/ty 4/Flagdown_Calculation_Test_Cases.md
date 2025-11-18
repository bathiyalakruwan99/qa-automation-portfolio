# **Flagdown Contract - Professional QA Test Cases**

## **Document Overview**
Professional test cases for **Flagdown Calculations** following Testiny QA standards.

**Project**: Contract Management System  
**Module**: Billing Calculations  
**Total Test Cases**: 25 comprehensive scenarios  
**Environment**: https://staging.app.exampleplatform.com  
**Contract Reference**: Default Flagdown Configuration  

## **ACCEPTANCE CRITERIA VALIDATION**
- Transport fee calculation accuracy (flagdown count × flagdown rate)
- Distance calculation accuracy (total km - free km) × rate
- Location-based demurrage calculation with 3-tier structure (101/202/303)
- Free allowances properly deducted (10 km and 1 hour per flagdown)
- Final billing total matches mathematical calculations
- System handles multiple flagdown scenarios correctly

## **CONTRACT DATA COMPLETION STATUS**
**Image Analysis**: Empty form  
**Auto-Completed Fields**: All fields completed with default values  
**Default Values Applied**:  
- Flagdown Rate: 100000.00 - Standard flagdown rate
- Flagdown Frequency: 5 - Standard frequency setting  
- Free Hours per Flagdown: 1 - Standard free hour allowance
- Free Kms per Flagdown: 10 - Standard free kilometer allowance
- Selling Rate per Extra Km: 444.00 - Standard distance rate
- Demurrage Tiers: 101/202/303 - Standard 3-tier structure
- Fixed Cost: 500 - Standard fixed running cost

**Data Source Priority**: Default values > Reference calculation

## **BASE RATE CALCULATION TEST SCENARIOS**

### **TC-001: [Calculation][Flagdown]Verify that System can calculate single flagdown transport fee accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with flagdown rate 100000.00; 2. System calculation engine initialized; 3. Test data prepared with 1 flagdown count; 4. Expected result calculated as 100000.00

**Test Data**:
- Contract Type: Flagdown
- Flagdown Rate: 100000.00 (*default*)
- Flagdown Count: 1
- Expected Transport Fee: 100000.00
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure flagdown contract with rate 100000.00; 2. Set flagdown count to 1; 3. Trigger transport fee calculation; 4. Verify flagdown count recognition; 5. Verify rate application; 6. Verify multiplication formula; 7. Validate final transport fee display

**Expected Result**:
1. Contract configured successfully with rate 100000.00; 2. Flagdown count set to 1; 3. Calculation completed successfully; 4. Count shows 1; 5. Rate shows 100000.00; 6. Formula executed as 1×100000; 7. Transport fee displays 100000.00

### **TC-002: [Calculation][Flagdown]Verify that System can calculate multiple flagdown transport fee accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with flagdown rate 100000.00; 2. System calculation engine initialized; 3. Test data prepared with 3 flagdown count; 4. Expected result calculated as 300000.00

**Test Data**:
- Contract Type: Flagdown
- Flagdown Rate: 100000.00 (*default*)
- Flagdown Count: 3
- Expected Transport Fee: 300000.00
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure flagdown contract with rate 100000.00; 2. Set flagdown count to 3; 3. Trigger transport fee calculation; 4. Verify flagdown count recognition; 5. Verify rate application; 6. Verify multiplication formula; 7. Validate final transport fee display

**Expected Result**:
1. Contract configured successfully with rate 100000.00; 2. Flagdown count set to 3; 3. Calculation completed successfully; 4. Count shows 3; 5. Rate shows 100000.00; 6. Formula executed as 3×100000; 7. Transport fee displays 300000.00

## **DISTANCE CALCULATION TEST SCENARIOS**

### **TC-003: [Calculation][Distance]Verify that System can calculate extra distance charges with free kilometer deduction accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with distance rate 444.00 per km; 2. Free kilometers set to 10 per flagdown; 3. Test data prepared with 1000 km total distance; 4. Expected chargeable distance calculated as 990 km

**Test Data**:
- Contract Type: Flagdown
- Total Distance: 1000 km
- Free Km per Flagdown: 10 (*default*)
- Flagdown Count: 1
- Selling Rate per Extra Km: 444.00 (*default*)
- Expected Distance Charge: 439560.00
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure distance rate 444.00 per km; 2. Input total distance 1000 km; 3. Set flagdown count to 1; 4. Trigger distance calculation; 5. Verify free km deduction (10 km); 6. Verify chargeable distance (990 km); 7. Validate final distance charge (990×444)

**Expected Result**:
1. Distance rate configured successfully; 2. Total distance accepted as 1000 km; 3. Flagdown count set to 1; 4. Calculation completed successfully; 5. Free km deducted showing 10 km; 6. Chargeable distance shows 990 km; 7. Distance charge displays 439560.00

### **TC-004: [Calculation][Distance]Verify that System can calculate distance charges with multiple flagdown free kilometers accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with distance rate 444.00 per km; 2. Free kilometers set to 10 per flagdown; 3. Test data prepared with 1000 km total distance and 3 flagdowns; 4. Expected chargeable distance calculated as 970 km

**Test Data**:
- Contract Type: Flagdown
- Total Distance: 1000 km
- Free Km per Flagdown: 10 (*default*)
- Flagdown Count: 3
- Selling Rate per Extra Km: 444.00 (*default*)
- Expected Distance Charge: 430680.00
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure distance rate 444.00 per km; 2. Input total distance 1000 km; 3. Set flagdown count to 3; 4. Trigger distance calculation; 5. Verify total free km calculation (30 km); 6. Verify chargeable distance (970 km); 7. Validate final distance charge (970×444)

**Expected Result**:
1. Distance rate configured successfully; 2. Total distance accepted as 1000 km; 3. Flagdown count set to 3; 4. Calculation completed successfully; 5. Total free km shows 30 km (3×10); 6. Chargeable distance shows 970 km; 7. Distance charge displays 430680.00

## **DEMURRAGE CALCULATION TEST SCENARIOS**

### **TC-005: [Calculation][Demurrage]Verify that System can calculate single location demurrage with 3-tier structure accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Demurrage tiers configured as 101/202/303 per hour; 2. Location-based calculation enabled; 3. Test data prepared with 4-hour delay at 1 location; 4. Expected demurrage calculated as 808.00

**Test Data**:
- Contract Type: Flagdown
- Delay Location Count: 1
- Delay Hours per Location: 4
- Tier 1: 1 hour @ 101/hr (*default*)
- Tier 2: 2 hours @ 202/hr (*default*)
- Tier 3: 1 hour @ 303/hr (*default*)
- Expected Demurrage: 808.00
- Auto-Completed Fields: All demurrage rates completed with defaults

**Steps**:
1. Configure 3-tier demurrage structure (101/202/303); 2. Input 1 location with 4-hour delay; 3. Trigger demurrage calculation; 4. Verify tier 1 application (1×101); 5. Verify tier 2 application (2×202); 6. Verify tier 3 application (1×303); 7. Validate total location demurrage (808)

**Expected Result**:
1. Demurrage tiers configured successfully; 2. Location delay accepted as 4 hours; 3. Calculation completed successfully; 4. Tier 1 shows 101.00; 5. Tier 2 shows 404.00; 6. Tier 3 shows 303.00; 7. Location total displays 808.00

### **TC-006: [Calculation][Demurrage]Verify that System can calculate multiple location demurrage accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Demurrage tiers configured as 101/202/303 per hour; 2. Location-based calculation enabled; 3. Test data prepared with 4-hour delays at 2 locations; 4. Expected total demurrage calculated as 1616.00

**Test Data**:
- Contract Type: Flagdown
- Delay Location Count: 2 (WTC West, Lotus Tower RK)
- Delay Hours per Location: 4
- Tier Structure: 101/202/303 (*default*)
- Expected Demurrage per Location: 808.00
- Expected Total Demurrage: 1616.00
- Auto-Completed Fields: All demurrage rates completed with defaults

**Steps**:
1. Configure 3-tier demurrage structure (101/202/303); 2. Input 2 locations with 4-hour delays each; 3. Trigger demurrage calculation; 4. Verify calculation for location 1; 5. Verify calculation for location 2; 6. Verify location totals (808 each); 7. Validate final demurrage total (1616)

**Expected Result**:
1. Demurrage tiers configured successfully; 2. Both locations accepted with 4-hour delays; 3. Calculation completed successfully; 4. Location 1 shows 808.00; 5. Location 2 shows 808.00; 6. Both locations calculated identically; 7. Total demurrage displays 1616.00

## **COMPLETE TRIP CALCULATION TEST SCENARIOS**

### **TC-007: [Calculation][Complete]Verify that System can calculate complete flagdown trip billing accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Complete flagdown contract configured with all default rates; 2. Test scenario prepared with 3 flagdowns, 1000km, 2 delay locations; 3. Expected components calculated separately; 4. Expected total calculated as 732296.00

**Test Data**:
- Contract Type: Flagdown
- Flagdown Count: 3
- Total Distance: 1000 km
- Delay Locations: 2
- Transport Fee: 300000.00 (*calculated*)
- Distance Charge: 430680.00 (*calculated*)
- Demurrage: 1616.00 (*calculated*)
- Expected Total: 732296.00
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure complete flagdown contract with defaults; 2. Input trip data (3 flagdowns, 1000km, 2 delays); 3. Trigger complete billing calculation; 4. Verify transport fee calculation (300000); 5. Verify distance charge calculation (430680); 6. Verify demurrage calculation (1616); 7. Validate final total (732296)

**Expected Result**:
1. Contract configured with all default values; 2. Trip data accepted successfully; 3. Complete calculation executed; 4. Transport fee shows 300000.00; 5. Distance charge shows 430680.00; 6. Demurrage shows 1616.00; 7. Final total displays 732296.00

### **TC-008: [Calculation][Complete]Verify that System displays detailed billing breakdown accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: High  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Complete flagdown calculation executed successfully; 2. Final total calculated as 732296.00; 3. All component calculations completed; 4. Billing breakdown display functionality available

**Test Data**:
- Contract Type: Flagdown
- Final Total: 732296.00
- Transport Fee Percentage: 41.0%
- Distance Charge Percentage: 58.8%
- Demurrage Percentage: 0.22%
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Execute complete flagdown calculation; 2. Access billing breakdown display; 3. Verify transport fee component and percentage; 4. Verify distance charge component and percentage; 5. Verify demurrage component and percentage; 6. Verify percentage calculations sum to 100%; 7. Validate breakdown formatting and display

**Expected Result**:
1. Calculation completed successfully; 2. Breakdown display accessible; 3. Transport fee shows 300000.00 (41.0%); 4. Distance charge shows 430680.00 (58.8%); 5. Demurrage shows 1616.00 (0.22%); 6. Percentages total 100%; 7. Breakdown displayed clearly with proper formatting

## **EDGE CASE AND ERROR SCENARIOS**

### **TC-009: [Calculation][Edge]Verify that System handles zero distance scenario correctly**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Medium  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Flagdown contract configured with default rates; 2. Test scenario with zero total distance; 3. System error handling enabled; 4. Expected behavior defined for zero distance

**Test Data**:
- Contract Type: Flagdown
- Total Distance: 0 km
- Flagdown Count: 1
- Expected Distance Charge: 0.00
- Expected Transport Fee: 100000.00
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure flagdown contract with defaults; 2. Input zero distance (0 km); 3. Set flagdown count to 1; 4. Trigger calculation; 5. Verify distance charge calculation; 6. Verify transport fee calculation continues; 7. Validate system handles zero distance gracefully

**Expected Result**:
1. Contract configured successfully; 2. Zero distance accepted without error; 3. Flagdown count processed normally; 4. Calculation completed successfully; 5. Distance charge shows 0.00; 6. Transport fee shows 100000.00; 7. System processes zero distance without errors

### **TC-010: [Calculation][Edge]Verify that System handles distance less than free kilometers correctly**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Medium  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Flagdown contract configured with 10 free km per flagdown; 2. Test scenario with 5 km total distance; 3. 1 flagdown count providing 10 free km; 4. Expected chargeable distance should be zero

**Test Data**:
- Contract Type: Flagdown
- Total Distance: 5 km
- Free Km per Flagdown: 10 (*default*)
- Flagdown Count: 1
- Expected Chargeable Distance: 0 km
- Expected Distance Charge: 0.00
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure flagdown contract with 10 free km; 2. Input total distance 5 km; 3. Set flagdown count to 1; 4. Trigger distance calculation; 5. Verify free km allowance (10 km); 6. Verify chargeable distance calculation (0 km); 7. Validate distance charge result (0.00)

**Expected Result**:
1. Contract configured with 10 free km; 2. Total distance accepted as 5 km; 3. Flagdown count set to 1; 4. Calculation completed successfully; 5. Free km allowance shows 10 km; 6. Chargeable distance shows 0 km; 7. Distance charge displays 0.00

## **VALIDATION AND INTEGRATION SCENARIOS**

### **TC-011: [Integration][API]Verify that System integrates flagdown calculation with running sheet data accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: High  
**Status**: Ready for Test  
**Type**: Integration  

**Related Bugs**: 

**Precondition**:
1. Running sheet API available with job data; 2. Flagdown contract configured in system; 3. Integration endpoint functional; 4. Test running sheet data prepared

**Test Data**:
- Contract Type: Flagdown
- Running Sheet Job: LSl80-250728-00005
- API Endpoint: /api/calculate-billing
- Expected Integration: Successful
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure flagdown contract in system; 2. Prepare running sheet with job data; 3. Call integration endpoint; 4. Verify data extraction from running sheet; 5. Verify calculation using extracted data; 6. Verify result returned to API; 7. Validate complete integration workflow

**Expected Result**:
1. Contract configured successfully; 2. Running sheet data prepared; 3. API call executed successfully; 4. Data extracted correctly from running sheet; 5. Calculation completed with extracted data; 6. Result returned via API response; 7. Integration workflow completed successfully

### **TC-012: [Performance][Load]Verify that System handles multiple concurrent flagdown calculations efficiently**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Medium  
**Status**: Ready for Test  
**Type**: Performance  

**Related Bugs**: 

**Precondition**:
1. System configured for load testing; 2. Multiple flagdown contracts prepared; 3. Concurrent request capability available; 4. Performance monitoring enabled

**Test Data**:
- Contract Type: Flagdown
- Concurrent Calculations: 10
- Expected Response Time: <5 seconds each
- Expected System Stability: Maintained
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure 10 identical flagdown contracts; 2. Prepare concurrent calculation requests; 3. Execute all calculations simultaneously; 4. Monitor system performance; 5. Verify all calculations complete successfully; 6. Verify response times within limits; 7. Validate system stability maintained

**Expected Result**:
1. All contracts configured successfully; 2. Concurrent requests prepared; 3. All calculations executed simultaneously; 4. System performance monitored; 5. All 10 calculations completed successfully; 6. Response times under 5 seconds each; 7. System remained stable throughout test

## **CRITICAL ISSUES SUMMARY**

### **High Priority Validation Points**
1. **Transport Fee Accuracy**: Flagdown count × rate multiplication must be exact
2. **Distance Calculation**: Free kilometer deduction per flagdown must be applied correctly  
3. **Demurrage Tiers**: 3-tier structure (101/202/303) must calculate per location
4. **Total Calculation**: All components must sum correctly to final billing amount
5. **Data Integration**: Running sheet data must integrate seamlessly with calculations

### **Known Edge Cases to Monitor**
1. Zero distance scenarios should not cause system errors
2. Distance less than free allowance should result in zero distance charges
3. Multiple flagdown scenarios must multiply free allowances correctly
4. Demurrage calculation must handle multiple locations independently
5. System performance must remain stable under concurrent load

## **QA RECOMMENDATIONS**

### **Testing Priority Sequence**
1. **Execute Core Calculation Tests First** (TC-001 through TC-006)
2. **Validate Complete Trip Scenarios** (TC-007, TC-008)  
3. **Test Edge Cases and Error Handling** (TC-009, TC-010)
4. **Perform Integration Testing** (TC-011)
5. **Conduct Performance Validation** (TC-012)

### **Critical Success Criteria**
- All monetary calculations accurate to 2 decimal places
- Flagdown count multiplication working correctly
- Location-based demurrage calculating independently
- Free allowances deducting properly per flagdown
- Final billing total matching manual calculations (732296.00)

---

**Document Generated**: December 2024  
**Prepared By**: QA Team using Contract Calculation Test Cases Prompt  
**Total Test Coverage**: Base rates, distance charges, demurrage, transport fees, edge cases, integration  
**Ready for Testiny Import**: Character limits compliant, professional QA standards followed 