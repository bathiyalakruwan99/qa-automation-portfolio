# Contract Calculation Test Cases Generation Prompt

## 🎯 PRIMARY OBJECTIVE
Generate comprehensive test cases for contract calculation scenarios by analyzing contract images and creating detailed validation test cases for billing accuracy, rate applications, and calculation compliance.

## 📋 WORKFLOW PROCESS

### Phase 1: Contract Image Analysis
When provided with a contract image, extract the following details:

#### **Contract Structure Analysis:**
1. **Contract Type**: Flagdown, Fixed Rate, Time-based, Distance-based
2. **Rate Structure**: 
   - Base rates (flagdown rate, hourly rate, etc.)
   - Frequency settings (flagdown frequency, billing intervals)
   - Free allowances (free hours, free kilometers)
   - Additional charges (extra km rates, demurrage rates)
3. **Calculation Methods**:
   - Demurrage calculation type (complete trip, location-based)
   - Transport fee calculations
   - Tiered rate structures
4. **Special Conditions**:
   - Fixed costs and running costs
   - Use tier selections
   - Public/private location differentials

#### **Handling Incomplete Contract Images:**
When contract image shows empty fields or partial data, complete missing information using these defaults:

##### **Default Values for Empty/Missing Fields:**
```yaml
# Base Configuration
Flagdown Rate: 100000.00
Flagdown Frequency: 5 (No of Hours)
Free Hours per Flagdown: 1 (No of Hours)
Free Kms per Flagdown: 10 (Number of Kms)
Selling Rate per Extra Km: 444.00 (Rate of Charge)
Fuel Efficiency: 555

# Demurrage Configuration
Demurrage Type: "Location Based Demurrage Calculation"
Calculate Demurrage for Public Location: true
Calculate Demurrage for Private Location: true

# Demurrage Tiers (Default 3-Tier Structure)
First Tier: 
  Duration: 1 hours
  Rate: 101 (Rate per hr)
Next Tier:
  Duration: 2 hours  
  Rate: 202 (Rate per hr)
Until Clearance Per Hour: 303 (Rate per hr)

# Costs
Use Tier: "Select Tier" (enabled)
Fixed Cost: 500 (Fixed Running Cost per Km)
```

##### **Completion Rules:**
1. **If field is completely empty**: Use default value above
2. **If field has partial data**: Keep existing data, fill missing parts with defaults
3. **If rate structure is unclear**: Default to flagdown contract structure
4. **If demurrage tiers missing**: Use 3-tier structure (101/202/303)
5. **If calculation method unclear**: Default to "Location Based Demurrage Calculation"

##### **Example Completion Process:**
```
Input Image Shows:
- Flagdown Rate: [Empty]
- Free Hours: 2
- Selling Rate: [Empty]
- Demurrage: [Some tiers missing]

Completed Configuration:
- Flagdown Rate: 100000.00 (default applied)
- Free Hours: 2 (keep existing)
- Selling Rate: 444.00 (default applied)  
- Demurrage: Complete 3-tier structure (101/202/303)
```

### Phase 2: Test Case Creation Process

#### **2.1 Create Comprehensive Markdown File First**
**File Name Format**: `[ContractType]_[Feature]_Test_Cases.md`

**Document Structure:**
```markdown
# **[Contract Type] - Professional QA Test Cases**

## **Document Overview**
Professional test cases for **[Contract Type] Calculations** following Testiny QA standards.

**Project**: Contract Management System
**Module**: Billing Calculations
**Total Test Cases**: [Number] comprehensive scenarios
**Environment**: [Environment URL]
**Contract Reference**: [Contract ID]

## **ACCEPTANCE CRITERIA VALIDATION**
- [Rate calculation accuracy requirements]
- [Billing compliance requirements]
- [System calculation validation rules]
- [Known calculation issues/edge cases]

## **CONTRACT DATA COMPLETION STATUS**
**Image Analysis**: [Fully populated/Partially filled/Empty form]
**Auto-Completed Fields**: [List any fields filled with default values]
**Default Values Applied**: 
- [Field Name]: [Default Value] - [Reason for default]
- [Field Name]: [Default Value] - [Reason for default]

**Data Source Priority**: Image data > Default values > Reference calculation

## **CALCULATION VALIDATION TEST SCENARIOS**

### **TC-[ID]: [Module][Feature]Verify that System can calculate [Specific Calculation] accurately**

**Owner**: QA Team
**Template**: Steps
**Priority**: Critical
**Status**: Ready for Test
**Type**: Functional

**Related Bugs**: [JIRA References if any]

**Precondition**:
1. Contract rates configured as per contract image
2. System has access to running sheet data
3. Calculation engine is properly initialized
4. Test data prepared with known expected results

**Test Data**:
- Contract Type: [Type]
- Base Rate: [Amount] (*default/extracted*)
- Distance: [Value] km
- Duration: [Value] hours
- Flagdown Count: [Number]
- Delay Hours: [Value] hours
- Expected Total: [Calculated Amount]
- Auto-Completed Fields: [List fields completed with defaults]

**Steps**:
1. Load contract configuration with extracted rates
2. Input running sheet data (distance, time, delays)
3. Trigger calculation process
4. Capture calculated amounts for each component
5. Verify base rate application
6. Verify distance calculation (if applicable)
7. Verify demurrage calculation (if applicable)

**Expected Result**:
1. Base rate applied correctly per contract terms
2. Distance charges calculated accurately (actual km - free km) × rate
3. Demurrage calculated per location/tier structure
4. Transport fees calculated per flagdown count
5. Final total matches expected calculation
6. All intermediate calculations displayed correctly
7. Calculation breakdown matches contract terms
```

#### **2.3 Complete Invoice Calculation Test Template**
**Use this template for comprehensive end-to-end calculation validation:**

```markdown
### **TC-[ID]: [Calculation][Invoice]Verify that System can calculate complete invoice with job data accurately**

**Owner**: QA Team
**Template**: Steps
**Priority**: Critical
**Status**: Ready for Test
**Type**: Functional

**Related Bugs**: [JIRA References if any]

**Precondition**:
1. Contract configured with all extracted rates and rules
2. Job data prepared with specific values for calculation validation
3. Running sheet data available with following details:
   - Job Reference: [Reference Number]
   - Total Distance: [Distance] km
   - Flagdown Count: [Count]
   - Delay Locations: [Number] locations
   - Delay Hours: [Hours] per location
4. Expected final invoice total calculated manually: [Amount]

**Test Data**:
- Contract Type: [Type]
- Job Reference: [Job Number]
- Total Distance: [Distance] km
- Flagdown Count: [Count]
- Delay Locations: [Location Names]
- Delay Hours: [Hours] per location
- Expected Components:
  - Transport Fee: [Count] × [Rate] = [Amount]
  - Distance Charge: ([Distance] - [Free km]) × [Rate] = [Amount]
  - Demurrage: [Locations] × [Per location amount] = [Amount]
  - Final Total: [Calculated Total]
- Auto-Completed Fields: [List fields completed with defaults]

**Steps**:
1. Configure contract with extracted rates; 2. Input job data ([Job Reference]); 3. Calculate transport fee ([Count] × [Rate]); 4. Calculate distance charge (([Distance] - [Free km]) × [Rate]); 5. Calculate demurrage ([Locations] × [Amount per location]); 6. Sum all components for final total; 7. Generate invoice and validate final amount

**Expected Result**:
1. Contract configured successfully with all rates; 2. Job data loaded correctly; 3. Transport fee calculated as [Expected Transport Fee]; 4. Distance charge calculated as [Expected Distance Charge]; 5. Demurrage calculated as [Expected Demurrage]; 6. Final total shows [Expected Final Total]; 7. Invoice generated with accurate breakdown
```
```

#### **2.2 Test Case Categories to Generate**

##### **A. Base Rate Calculation Tests**
- Single flagdown calculation
- Multiple flagdown calculations
- Rate frequency validation
- Base rate application accuracy

##### **B. Distance Calculation Tests**
- Free kilometers deduction
- Extra kilometers charging
- Distance rate application
- Zero distance scenarios
- Maximum distance scenarios

##### **C. Time-Based Calculation Tests**
- Free hours deduction
- Overtime calculations
- Duration calculation accuracy
- Time-based rate applications

##### **D. Demurrage Calculation Tests**
- Location-based demurrage
- Tiered demurrage calculation
- Multiple location demurrage
- Demurrage rate application
- Complete trip vs location-based

##### **E. Transport Fee Calculation Tests**
- Flagdown count multiplication
- Transport fee accuracy
- Multiple flagdown transport fees

##### **F. Complete Invoice Calculation Tests**
- End-to-end calculation with job data
- Final invoice validation with detailed steps
- Component breakdown verification
- Mathematical accuracy validation

##### **G. Edge Case & Error Scenarios**
- Zero values handling
- Negative values validation
- Maximum limit testing
- Calculation overflow scenarios
- Missing data handling

### Phase 3: CSV Extraction with Testiny Compliance

#### **3.1 Character Limit Optimization**
Apply these limits during CSV extraction:
- **Actual Result**: MAX 255 characters
- **Description**: MAX 500 characters  
- **Precondition**: MAX 1000 characters
- **Steps**: MAX 2000 characters
- **Expected Result**: MAX 1000 characters
- **Test Data**: MAX 500 characters

#### **3.2 CSV Structure Requirements**
```csv
Module,Title,Description,Precondition,Steps,Expected Result,Priority,Owner,Status,Type,Bug,Test Data,Folder,Actual Result
```

#### **3.3 Test Case Pairing Strategy** [[memory:4329239]]
**CRITICAL**: Each test step must have corresponding expected result:
- Step 1 → Expected Result 1
- Step 2 → Expected Result 2
- Step 3 → Expected Result 3
- Continue pairing for immediate validation capability

#### **3.4 CSV Optimization Rules**
```
Steps Format: "1. Load contract with [rate]; 2. Input distance [value] km; 3. Trigger calculation; 4. Verify base rate [amount]; 5. Verify distance charge [calculation]; 6. Verify total [amount]; 7. Validate breakdown display"

Expected Results Format: "1. Contract loaded successfully; 2. Distance data accepted; 3. Calculation completed; 4. Base rate shows [amount]; 5. Distance charge shows [calculation]; 6. Total displays [amount]; 7. Breakdown shows all components"
```

#### **3.5 Character Encoding for CSV Compatibility**
**CRITICAL**: Always use simple ASCII characters for mathematical operations in CSV files to avoid encoding issues:

```yaml
Mathematical Symbols (Use These):
- Multiplication: "x" or "*" (NOT ×)
- Division: "/" (NOT ÷)
- Addition: "+" 
- Subtraction: "-"
- Equals: "="
- Parentheses: "(" and ")" 
- Arrow: "->" (NOT →)

Examples of Correct CSV Mathematical Expressions:
✅ Good: "Calculate transport fee (3x100000)"
❌ Bad: "Calculate transport fee (3×100000)" 
✅ Good: "Distance formula: (Total-Free)xRate"
❌ Bad: "Distance formula: (Total-Free)×Rate"
✅ Good: "Expected: 999.999->1000km"
❌ Bad: "Expected: 999.999→1000km"

Reason: Unicode symbols (×, ÷, →) appear as "Ã—", "Ã·", "â†'" in CSV files causing readability issues
```

## 📊 CALCULATION TEST CASE TEMPLATES

### **Template 1: Basic Flagdown Calculation**
```
Title: [Calculation][Flagdown]Verify that System can calculate single flagdown billing accurately
Description: Validate single flagdown rate application with basic distance and time charges
Test Data: Contract: Flagdown 100000; Distance: 1000km; Free: 10km; Rate: 444/km; Expected: [calculated total]
Steps: 1. Configure flagdown contract; 2. Input 1000km distance; 3. Calculate billing; 4. Verify flagdown charge; 5. Verify distance charge; 6. Verify total; 7. Validate breakdown
Expected: 1. Contract configured; 2. Distance accepted; 3. Calculation completed; 4. Flagdown shows 100000; 5. Distance shows 990x444=439560; 6. Total shows calculated amount; 7. Breakdown displays correctly
```

### **Template 2: Demurrage Calculation**
```
Title: [Calculation][Demurrage]Verify that System can calculate location-based demurrage accurately
Description: Validate tiered demurrage calculation applied per location with proper rate structure
Test Data: Locations: 2; Delay: 4hrs each; Tiers: 101/202/303; Expected: 2x808=1616
Steps: 1. Configure demurrage tiers; 2. Input 2 locations with 4hr delays; 3. Calculate demurrage; 4. Verify tier 1 rate; 5. Verify tier 2 rate; 6. Verify tier 3 rate; 7. Verify total per location
Expected: 1. Tiers configured; 2. Location delays accepted; 3. Demurrage calculated; 4. Tier 1 shows 101x1=101; 5. Tier 2 shows 202x2=404; 6. Tier 3 shows 303x1=303; 7. Location total shows 808
```

### **Template 3: Complete Invoice Calculation**
```
Title: [Calculation][Invoice]Verify that System can calculate complete invoice with job data accurately
Description: Validate complete invoice calculation with all components using specific job data
Test Data: Job: LSl80-250728-00005; Distance: 1000km; Flagdowns: 3; Delays: 2 locations; Transport: 300000; Distance: 430680; Demurrage: 1616; Total: 732296
Steps: 1. Configure contract with all rates; 2. Input job data (LSl80-250728-00005); 3. Calculate transport fee (3x100000); 4. Calculate distance charge ((1000-30)x444); 5. Calculate demurrage (2x808); 6. Sum components (300000+430680+1616); 7. Generate invoice and validate total
Expected: 1. Contract configured with all rates; 2. Job data loaded successfully; 3. Transport fee shows 300000.00; 4. Distance charge shows 430680.00; 5. Demurrage shows 1616.00; 6. Final total shows 732296.00; 7. Invoice generated with accurate breakdown
```

## 🔧 CALCULATION VALIDATION RULES

### **Accuracy Requirements**
- All monetary calculations must be accurate to 2 decimal places
- Percentage calculations accurate to 2 decimal places  
- Distance calculations accurate to 1 decimal place
- Time calculations accurate to minutes

### **Rate Application Validation**
- Base rates applied once per contract terms
- Distance rates applied only to chargeable kilometers
- Time rates applied only to chargeable hours
- Demurrage rates applied per configured tiers
- Transport fees applied per flagdown count

### **Edge Case Handling**
- Zero distance/time scenarios
- Maximum value limits
- Negative value prevention
- Rounding rule compliance
- Overflow protection

## 📝 EXPECTED DELIVERABLES

### **1. Comprehensive Markdown File**
- Complete test case documentation
- Professional QA structure
- Detailed calculation scenarios
- Edge case coverage
- Critical issue identification

### **2. Testiny-Compatible CSV File**
- Character limit compliant
- Proper CSV formatting
- No internal line breaks
- Quote-escaped properly
- Import-ready structure

### **3. Calculation Validation Matrix**
```
| Scenario | Input Values | Expected Output | Validation Points |
|----------|--------------|-----------------|-------------------|
| Single Flagdown | Rate: 100000, Distance: 1000km | Total: [calculated] | Rate applied once |
| Multiple Flagdown | Count: 3, Rate: 100000 | Transport: 300000 | Count×Rate formula |
| Distance Charges | 1000km-30free×444 | Distance: 430680 | Free km deduction |
| Demurrage Tiers | 2 locations×808 | Demurrage: 1616 | Location-based calc |
| Complete Invoice | Job: LSl80-250728-00005, 3 flagdowns, 1000km, 2 delays | Total: 732296 | All components sum |
```

## 📋 REFERENCE CALCULATION EXAMPLE

### **Flagdown Contract Calculation Reference**
*Use this as reference for generating accurate test cases and expected results*

#### **Contract Configuration:**
```
- Flagdown Rate: 100,000.00 (Rate to Charge)
- Flagdown Frequency: 5 per 4 Hours
- Free Hours per Flagdown: 1 hour
- Free Kilometers per Flagdown: 10 km
- Selling Rate per Extra Km: 444.00 (Rate of Charge)
- Demurrage Tiers:
  - First tier: 1 hour @ 101 per hour
  - Next tier: 2 hours @ 202 per hour
  - Until Clearance Per Hour: 303 per hour
```

#### **Input Data:**
```
- Contract Reference: LSl80-CNT-2025-07-28-00003
- Total Distance: 1,000 km
- Flagdown Count: 3
- Delay Locations: 2 (WTC West, Lotus Tower RK)
- Delay Hours per Location: 4 hours each
```

#### **Calculation Breakdown:**
```
| Component | Calculation | Rate | Amount |
|-----------|-------------|------|--------|
| Transport Fee | 3 flagdown count × 100,000.00 | 100,000.00 × 3 | 300,000.00 |
| Extra Distance | 1,000 km - (3 × 10 free km) = 970 km | 444.00/km | 430,680.00 |
| Demurrage | Location-based calculation | Various | 1,616.00 |
| TOTAL | | | 732,296.00 |
```

#### **Demurrage Calculation Detail:**
```
| Location | First (1 hr) | Next (2 hrs) | Until Clearance (1 hr) | Location Total |
|----------|--------------|-------------|----------------------|----------------|
| WTC West | 101 | 404 | 303 | 808 |
| Lotus Tower RK | 101 | 404 | 303 | 808 |
| TOTAL | | | | 1,616.00 |

Per Location Calculation:
- First: 1 hour @ 101/hr = 101
- Next: 2 hours @ 202/hr = 404  
- Until Clearance: 1 hour @ 303/hr = 303
- Per Location: 808
- Total Locations: 2 × 808 = 1,616
```

#### **Validation Points:**
```
✅ Transport Fee: 3 flagdown count × 100,000.00 = 300,000.00
✅ Distance: 970 km charged (1,000 km - 30 free km) @ 444.00/km = 430,680.00
✅ Free Kilometers: 30 km total (3 × 10 free km per flagdown)
✅ Demurrage: 1,616.00 (2 locations × 808 each) location-based calculation
✅ Final Total: 732,296.00
```

#### **Cost Components:**
```
- Transport Fee: 41.0% (300,000.00)
- Distance charges: 58.8% (430,680.00)
- Demurrage: 0.22% (1,616.00)
```

**Use this reference to:**
- Generate accurate expected results for test cases
- Validate calculation logic in test scenarios  
- Create realistic test data with known outcomes
- Ensure mathematical accuracy in test case generation

## 🚀 AUTOMATION INSTRUCTIONS

When contract image is provided:

1. **ANALYZE** contract structure and extract all visible rates/rules
2. **COMPLETE** missing fields using default values from the completion rules above
3. **REFERENCE** the calculation example for accuracy and methodology
4. **GENERATE** comprehensive markdown test cases covering all calculation scenarios
5. **INCLUDE** detailed invoice calculation test with step-by-step mathematical validation
6. **CALCULATE** expected results using the reference methodology with completed data
7. **CREATE** CSV file optimized for Testiny import using ASCII characters only (x not ×, -> not →)
8. **VALIDATE** all calculations against contract terms and reference example
9. **DOCUMENT** which fields were auto-completed with defaults and any assumptions made

### **Handling Different Image Scenarios:**

#### **Scenario 1: Completely Empty Form**
- Apply all default values
- Generate test cases with standard flagdown structure
- Document: "All fields completed with default values"

#### **Scenario 2: Partially Filled Form**  
- Keep existing values from image
- Fill empty fields with defaults
- Generate test cases using mixed data
- Document: "Fields X, Y, Z completed with defaults"

#### **Scenario 3: Fully Populated Form**
- Use all values from image
- Generate test cases with provided data
- Document: "All values extracted from contract image"

#### **Auto-Completion Priority:**
1. **Preserve existing data** from image (highest priority)
2. **Apply defaults** for missing required fields
3. **Use reference calculation** for validation logic
4. **Generate realistic test scenarios** with completed configuration

## 📋 QUALITY CHECKLIST

### **Test Case Completeness**
- [ ] All contract components tested
- [ ] Edge cases covered
- [ ] Calculation accuracy validated
- [ ] Integration scenarios included
- [ ] Error handling tested
- [ ] Auto-completed fields properly documented
- [ ] Default values applied consistently

### **CSV Import Readiness**
- [ ] All character limits respected
- [ ] No internal line breaks
- [ ] Proper quote escaping
- [ ] Complete required fields
- [ ] Professional terminology
- [ ] ASCII characters only (x not ×, -> not →, * not •)

### **Calculation Accuracy**
- [ ] Mathematical accuracy verified
- [ ] Contract terms properly applied
- [ ] Rate structures correctly implemented
- [ ] Expected results calculated
- [ ] Validation points identified

---

**Usage**: Provide contract image → Receive comprehensive test cases with calculations → Import to Testiny for execution
**Output**: Professional QA test documentation + Import-ready CSV file
**Standards**: Testiny-compliant, calculation-accurate, comprehensive coverage 