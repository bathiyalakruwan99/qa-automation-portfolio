# **Basic Flagdown Contract - Professional QA Test Cases**

## **Document Overview**
Professional test cases for **Basic Flagdown Calculations** following Testiny QA standards.

**Project**: Contract Management System  
**Module**: Billing Calculations  
**Total Test Cases**: 12 comprehensive scenarios  
**Environment**: https://staging.app.exampleplatform.com  
**Contract Reference**: Basic Configuration - Minimal Setup  

## **ACCEPTANCE CRITERIA VALIDATION**
- Transport fee calculation accuracy with default flagdown rate
- Distance calculation accuracy with default rates (no demurrage/fixed costs)
- System handles unchecked optional features correctly
- Mathematical step-by-step validation for invoice generation
- Final invoice total matches manual calculations
- Job data integration with calculation accuracy

## **CONTRACT DATA COMPLETION STATUS**
**Image Analysis**: Partially filled form - Basic structure only  
**Auto-Completed Fields**: All primary rate fields completed with default values  
**Default Values Applied**:  
- Flagdown Rate: 100000.00 - Empty field completed with standard rate
- Flagdown Frequency: 5 - Empty field completed with standard frequency  
- Free Hours per Flagdown: 1 - Empty field completed with standard allowance
- Free Kms per Flagdown: 10 - Empty field completed with standard allowance
- Selling Rate per Extra Km: 444.00 - Empty field completed with standard rate
- Fuel Efficiency: 555 - Empty field completed with standard value

**Disabled Options from Image**:
- Demurrage: UNCHECKED - No demurrage calculations
- Use Tier: UNCHECKED - No tier-based calculations  
- Fixed Cost: UNCHECKED - No fixed cost additions

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
1. Contract configured with flagdown rate 100000.00; 2. System calculation engine initialized; 3. Job data prepared with 1 flagdown count; 4. Expected result calculated manually as 100000.00

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-001
- Flagdown Rate: 100000.00 (*default*)
- Flagdown Count: 1
- Expected Transport Fee: 100000.00
- Auto-Completed Fields: All rate fields completed with defaults

**Steps**:
1. Configure basic flagdown contract with rate 100000.00; 2. Create job TEST-FD-001 with 1 flagdown count; 3. Trigger transport fee calculation; 4. Verify calculation formula (1 × 100000.00); 5. Verify transport fee result; 6. Generate invoice; 7. Validate final invoice amount

**Expected Result**:
1. Contract configured successfully with rate 100000.00; 2. Job created with 1 flagdown count; 3. Calculation completed successfully; 4. Formula shows 1×100000=100000; 5. Transport fee displays 100000.00; 6. Invoice generated successfully; 7. Final invoice shows 100000.00

### **TC-002: [Calculation][Distance]Verify that System can calculate distance charges with free kilometer deduction accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with distance rate 444.00 per km; 2. Free kilometers set to 10 per flagdown; 3. Job data prepared with 1000 km total distance; 4. Expected chargeable distance calculated as 990 km; 5. Expected distance charge calculated as 439560.00

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-002
- Total Distance: 1000 km
- Free Km per Flagdown: 10 (*default*)
- Flagdown Count: 1
- Selling Rate per Extra Km: 444.00 (*default*)
- Expected Chargeable Distance: 990 km
- Expected Distance Charge: 439560.00
- Auto-Completed Fields: Distance rate completed with default

**Steps**:
1. Configure distance rate 444.00 per km; 2. Create job TEST-FD-002 with 1000km distance; 3. Calculate chargeable distance (1000-10); 4. Calculate distance charge (990×444); 5. Verify calculation results; 6. Generate invoice; 7. Validate distance component in invoice

**Expected Result**:
1. Distance rate configured successfully; 2. Job created with 1000km distance; 3. Chargeable distance calculated as 990km; 4. Distance charge calculated as 439560.00; 5. Calculation shows correct formula; 6. Invoice generated successfully; 7. Invoice shows distance charge 439560.00

## **COMPLETE INVOICE CALCULATION TEST SCENARIOS**

### **TC-003: [Calculation][Invoice]Verify that System can calculate complete invoice with job data accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with all extracted rates and rules; 2. Job data prepared with specific values for calculation validation; 3. Running sheet data available with following details: Job Reference: TEST-FD-003, Total Distance: 1000 km, Flagdown Count: 3, Delay Locations: 0 (no demurrage), Delay Hours: 0 (no demurrage); 4. Expected final invoice total calculated manually: 730680.00

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-003
- Total Distance: 1000 km
- Flagdown Count: 3
- Delay Locations: None (demurrage disabled)
- Delay Hours: 0 hours
- Expected Components:
  - Transport Fee: 3 × 100000 = 300000.00
  - Distance Charge: (1000 - 30) × 444 = 430680.00
  - Demurrage: 0.00 (disabled)
  - Fixed Cost: 0.00 (disabled)
  - Final Total: 730680.00
- Auto-Completed Fields: All basic fields completed with defaults

**Steps**:
1. Configure contract with extracted rates; 2. Input job data (TEST-FD-003); 3. Calculate transport fee (3×100000); 4. Calculate distance charge ((1000-30)×444); 5. Verify no demurrage applied (disabled); 6. Sum all components (300000+430680+0+0); 7. Generate invoice and validate final amount

**Expected Result**:
1. Contract configured with all rates; 2. Job data loaded correctly; 3. Transport fee calculated as 300000.00; 4. Distance charge calculated as 430680.00; 5. Demurrage shows 0.00 (disabled); 6. Final total shows 730680.00; 7. Invoice generated with accurate breakdown

### **TC-004: [Calculation][Breakdown]Verify that System displays detailed billing breakdown accurately**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: High  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Complete basic calculation executed successfully; 2. Final total calculated as 730680.00; 3. All component calculations completed; 4. Billing breakdown display functionality available

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-004
- Final Total: 730680.00
- Transport Fee Percentage: 41.1% (300000/730680)
- Distance Charge Percentage: 58.9% (430680/730680)
- Demurrage Percentage: 0.0% (disabled)
- Fixed Cost Percentage: 0.0% (disabled)
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Execute complete basic calculation; 2. Access billing breakdown display; 3. Verify transport fee component (300000.00); 4. Verify distance charge component (430680.00); 5. Verify disabled components show 0.00; 6. Calculate and verify percentages; 7. Validate breakdown formatting

**Expected Result**:
1. Calculation completed successfully; 2. Breakdown display accessible; 3. Transport fee shows 300000.00 (41.1%); 4. Distance charge shows 430680.00 (58.9%); 5. Demurrage and fixed cost show 0.00; 6. Percentages total 100.0%; 7. Breakdown displayed with proper formatting

## **MATHEMATICAL VALIDATION TEST SCENARIOS**

### **TC-005: [Validation][Math]Verify that System performs accurate mathematical calculations step by step**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Critical  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Basic contract configured with default rates; 2. Test job prepared with known values; 3. Manual calculations performed for validation; 4. Expected intermediate results calculated

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-005
- Manual Calculations:
  - Flagdown: 2 × 100000 = 200000
  - Free km: 2 × 10 = 20 km
  - Chargeable: 500 - 20 = 480 km
  - Distance: 480 × 444 = 213120
  - Total: 200000 + 213120 = 413120
- Expected Final Total: 413120.00
- Auto-Completed Fields: All basic fields completed with defaults

**Steps**:
1. Configure contract with default rates; 2. Input job with 2 flagdowns and 500km; 3. Verify flagdown calculation (2×100000); 4. Verify free km calculation (2×10); 5. Verify chargeable distance (500-20); 6. Verify distance charge (480×444); 7. Verify final sum (200000+213120)

**Expected Result**:
1. Contract configured successfully; 2. Job data accepted; 3. Flagdown shows 200000.00; 4. Free km shows 20km deduction; 5. Chargeable distance shows 480km; 6. Distance charge shows 213120.00; 7. Final total shows 413120.00

### **TC-006: [Validation][Formula]Verify that System applies correct formulas for each calculation component**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: High  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with all default rates; 2. Formula validation test data prepared; 3. Expected formula results calculated; 4. Component-wise validation planned

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-006
- Formula Validation:
  - Transport Formula: Flagdown Count × Flagdown Rate
  - Distance Formula: (Total Distance - Free Distance) × Rate per km
  - Free Distance Formula: Flagdown Count × Free km per Flagdown
- Test Values: 4 flagdowns, 2000km distance
- Expected Results: Transport=400000, Free=40km, Chargeable=1960km, Distance=870240, Total=1270240
- Auto-Completed Fields: All basic fields completed with defaults

**Steps**:
1. Configure contract with default rates; 2. Input test job (4 flagdowns, 2000km); 3. Validate transport formula (4×100000); 4. Validate free distance formula (4×10); 5. Validate chargeable distance (2000-40); 6. Validate distance charge formula (1960×444); 7. Validate total sum formula

**Expected Result**:
1. Contract configured successfully; 2. Test job data accepted; 3. Transport calculated as 400000.00; 4. Free distance calculated as 40km; 5. Chargeable distance calculated as 1960km; 6. Distance charge calculated as 870240.00; 7. Total calculated as 1270240.00

## **DISABLED OPTION VALIDATION TEST SCENARIOS**

### **TC-007: [Validation][Disabled]Verify that System correctly handles disabled demurrage option**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: High  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with demurrage option unchecked; 2. Test scenario includes significant delays; 3. System should ignore delay data completely; 4. Expected calculation excludes demurrage charges

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-007
- Demurrage Option: Unchecked
- Simulated Delays: 10 hours at 3 locations
- Expected Demurrage: 0.00
- Expected Impact on Total: None
- Transport Fee: 100000.00
- Distance Charge: 439560.00
- Expected Total: 539560.00 (no demurrage)
- Auto-Completed Fields: Basic rates only

**Steps**:
1. Configure contract with demurrage unchecked; 2. Input job with significant delays; 3. Trigger calculation; 4. Verify demurrage option status; 5. Verify delay data ignored; 6. Verify no demurrage in calculation; 7. Validate total excludes demurrage

**Expected Result**:
1. Contract configured with demurrage disabled; 2. Job with delays accepted; 3. Calculation completed successfully; 4. Demurrage option shows unchecked; 5. Delay data ignored in calculation; 6. No demurrage charges applied; 7. Total calculated as 539560.00

### **TC-008: [Validation][Disabled]Verify that System correctly handles disabled fixed cost option**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: High  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with fixed cost option unchecked; 2. Standard calculation prepared; 3. System should exclude fixed cost component; 4. Expected calculation without fixed charges

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-008
- Fixed Cost Option: Unchecked
- Expected Fixed Cost: 0.00
- Transport Fee: 200000.00 (2 flagdowns)
- Distance Charge: 439560.00 (1000km)
- Expected Total: 639560.00 (no fixed cost)
- Auto-Completed Fields: Basic rates only

**Steps**:
1. Configure contract with fixed cost unchecked; 2. Input job with 2 flagdowns and 1000km; 3. Calculate transport fee (2×100000); 4. Calculate distance charge ((1000-20)×444); 5. Verify fixed cost excluded; 6. Sum components (200000+439560); 7. Validate total excludes fixed cost

**Expected Result**:
1. Contract configured with fixed cost disabled; 2. Job data accepted successfully; 3. Transport fee calculated as 200000.00; 4. Distance charge calculated as 439560.00; 5. Fixed cost shows 0.00; 6. Total calculated as 639560.00; 7. Invoice excludes fixed cost component

## **EDGE CASE AND ERROR SCENARIOS**

### **TC-009: [Edge][Zero]Verify that System handles zero distance scenario correctly**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Medium  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Basic contract configured with default rates; 2. Test scenario with zero total distance; 3. System should handle gracefully; 4. Expected behavior defined for zero distance

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-009
- Total Distance: 0 km
- Flagdown Count: 1
- Expected Distance Charge: 0.00
- Expected Transport Fee: 100000.00
- Expected Total: 100000.00
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure basic contract with defaults; 2. Create job with zero distance; 3. Calculate transport fee (1×100000); 4. Calculate distance charge (0×444); 5. Verify zero distance handling; 6. Sum components (100000+0); 7. Validate system handles gracefully

**Expected Result**:
1. Contract configured successfully; 2. Zero distance job accepted; 3. Transport fee calculated as 100000.00; 4. Distance charge calculated as 0.00; 5. Zero distance handled without errors; 6. Total calculated as 100000.00; 7. System processes without errors

### **TC-010: [Edge][Minimum]Verify that System handles distance less than free kilometers correctly**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Medium  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with 10 free km per flagdown; 2. Test scenario with 5 km total distance; 3. 1 flagdown provides 10 free km; 4. Expected chargeable distance should be zero

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-010
- Total Distance: 5 km
- Free Km per Flagdown: 10 (*default*)
- Flagdown Count: 1
- Expected Chargeable Distance: 0 km
- Expected Distance Charge: 0.00
- Expected Transport Fee: 100000.00
- Expected Total: 100000.00
- Auto-Completed Fields: All fields completed with defaults

**Steps**:
1. Configure contract with 10 free km; 2. Create job with 5km distance; 3. Calculate free km allowance (1×10); 4. Calculate chargeable distance (5-10=0); 5. Calculate distance charge (0×444); 6. Calculate transport fee (1×100000); 7. Validate total (100000+0)

**Expected Result**:
1. Contract configured with 10 free km; 2. Job with 5km distance accepted; 3. Free km allowance shows 10km; 4. Chargeable distance calculated as 0km; 5. Distance charge shows 0.00; 6. Transport fee shows 100000.00; 7. Total shows 100000.00

## **CONSISTENCY AND ACCURACY SCENARIOS**

### **TC-011: [Accuracy][Decimal]Verify that System maintains decimal precision in all calculations**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Medium  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with default rates; 2. Test data designed for decimal precision testing; 3. Expected results calculated with precision; 4. Decimal accuracy validation planned

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-011
- Test Values: 1.5 flagdowns (rounded to 2), 1234.56 km
- Expected Calculations:
  - Transport: 2×100000 = 200000.00
  - Free: 2×10 = 20.00 km
  - Chargeable: 1234.56-20 = 1214.56 km
  - Distance: 1214.56×444 = 539264.64
  - Total: 739264.64
- Auto-Completed Fields: All basic fields completed with defaults

**Steps**:
1. Configure contract with default rates; 2. Input job with decimal values; 3. Calculate transport fee with rounding; 4. Calculate precise chargeable distance; 5. Calculate distance charge with decimals; 6. Sum all components precisely; 7. Validate decimal precision maintained

**Expected Result**:
1. Contract configured successfully; 2. Decimal job data accepted; 3. Transport fee shows 200000.00; 4. Chargeable distance shows 1214.56km; 5. Distance charge shows 539264.64; 6. Total shows 739264.64; 7. All decimals maintained accurately

### **TC-012: [Accuracy][Rounding]Verify that System applies consistent rounding rules**

**Owner**: QA Team  
**Template**: Steps  
**Priority**: Medium  
**Status**: Ready for Test  
**Type**: Functional  

**Related Bugs**: 

**Precondition**:
1. Contract configured with default rates; 2. Test scenarios with rounding requirements; 3. Rounding rules documented; 4. Expected results with proper rounding

**Test Data**:
- Contract Type: Basic Flagdown
- Job Reference: TEST-FD-012
- Rounding Test Values: 999.999 km distance, 1 flagdown
- Expected Calculations:
  - Distance rounded: 999.999 → 1000.00 km
  - Chargeable: 1000-10 = 990 km
  - Distance charge: 990×444 = 439560.00
  - Transport: 1×100000 = 100000.00
  - Total: 539560.00
- Auto-Completed Fields: All basic fields completed with defaults

**Steps**:
1. Configure contract with default rates; 2. Input job with rounding test values; 3. Verify distance rounding applied; 4. Calculate chargeable distance; 5. Calculate distance charge; 6. Calculate transport fee; 7. Validate consistent rounding throughout

**Expected Result**:
1. Contract configured successfully; 2. Rounding test data accepted; 3. Distance rounded to 1000.00km; 4. Chargeable distance shows 990km; 5. Distance charge shows 439560.00; 6. Transport fee shows 100000.00; 7. Total shows 539560.00 with consistent rounding

## **CRITICAL ISSUES SUMMARY**

### **High Priority Validation Points**
1. **Mathematical Accuracy**: All calculations must be precise to 2 decimal places
2. **Formula Application**: Correct formulas applied for each component
3. **Disabled Options**: Unchecked features completely excluded from calculations
4. **Job Data Integration**: Proper job reference and data handling
5. **Invoice Generation**: Final totals match step-by-step calculations

### **Known Considerations for Basic Configuration**
1. Default values applied consistently across all empty fields
2. Disabled options (demurrage, fixed cost, use tier) properly ignored
3. Free allowances calculated per flagdown count
4. Distance charges calculated only on chargeable kilometers
5. Transport fees calculated using simple multiplication

## **QA RECOMMENDATIONS**

### **Testing Priority Sequence**
1. **Execute Core Calculation Tests First** (TC-001, TC-002)
2. **Validate Complete Invoice Scenarios** (TC-003, TC-004)  
3. **Test Mathematical Validation** (TC-005, TC-006)
4. **Verify Disabled Option Handling** (TC-007, TC-008)
5. **Test Edge Cases** (TC-009, TC-010)
6. **Validate Accuracy and Consistency** (TC-011, TC-012)

### **Critical Success Criteria**
- All default values applied correctly to empty fields
- Disabled options completely excluded from calculations
- Mathematical calculations accurate with proper decimal precision
- Job data properly integrated with calculation process
- Final invoice totals match manual calculations
- System stability maintained with basic configuration

---

**Document Generated**: December 2024  
**Prepared By**: QA Team using Updated Contract Calculation Test Cases Prompt  
**Configuration Type**: Basic Flagdown - Minimal Setup with Defaults  
**Total Test Coverage**: Core calculations, mathematical validation, disabled options, edge cases  
**Ready for Testiny Import**: Character limits compliant, professional QA standards followed 