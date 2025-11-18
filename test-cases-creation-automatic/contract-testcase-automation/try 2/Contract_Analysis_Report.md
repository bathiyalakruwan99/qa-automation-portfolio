# Contract Analysis and Calculation Report

## Executive Summary
This report provides a comprehensive analysis of contract execution and billing calculations for Job **28072025falgdownTest** (Invoice: LSl80-INV-2025-07-28-29f1). The analysis reveals **significant billing discrepancies** requiring immediate investigation. While the job execution shows moderate delays, the primary concern is in the calculation methodology for additional kilometers and demurrage charges, resulting in a total invoice of **LKR 732,296.00**.

---

## 1. Contract Details

### Basic Information
| Field | Value |
|-------|-------|
| **Job Title** | 28072025falgdownTest |
| **Job Reference Number** | LSl80-250728-00005 |
| **Contract Reference** | LSl80-CNT-2025-07-28-00003 |
| **Job Type** | DOMESTIC |
| **Customer** | RetailChain |
| **Service Provider** | Centrics 3PL |
| **Invoice Reference** | LSl80-INV-2025-07-28-29f1 |
| **Load Reference** | LSl80-250728-00005 - 1 |

### Contract Terms (From Configuration)
| Parameter | Value |
|-----------|-------|
| **Vehicle Category** | CAO-8070 (Commercial Vehicle) |
| **Contract Type** | Flagdown |
| **Flag Down Rate** | LKR 100,000.00 |
| **Free Hours per Flag Down** | 1 hour |
| **Flag Down Application Frequency** | 5 hours |
| **Free KM's per Flag Down** | 10 km |
| **Rate Per Extra KM** | LKR 444.00 |
| **Demurrage Basis** | Complete trip |
| **Fuel Efficiency** | 555 |

---

## 2. Running Sheet Analysis

### Job Execution Details
| Field | Planned | Actual | Variance |
|-------|---------|--------|----------|
| **Start Date/Time** | Jul 28, 2025, 2:46:04 PM | Jul 28, 2025, 2:18:44 PM | -27m early start |
| **End Date/Time** | Jul 28, 2025, 2:46:04 PM | Jul 29, 2025, 12:21:00 AM | +21h 35m delay |
| **Duration** | 0 Hrs 0 Min | 10 Hrs 2 Min | +10 Hrs 2 Min (+∞%) |
| **Distance (Planned)** | 3.21 km | 3.21 km | 0 km (0%) |
| **Distance (Billing)** | - | 400.0 km | Odometer: 500-100 km |
| **GPS Reading** | - | 0.0 km | GPS system failure |
| **Stops** | 2 | 2 | 0 |

### Resource Details
| Resource Type | Name | Distance Contribution | Duration Contribution |
|---------------|------|---------------------|---------------------|
| **Driver** | Yomal Perera | 400.0 Km (100%) | 10 Hrs 2 Min (100%) |
| **Vehicle** | CAO-8070 | 400.0 Km (100%) | 10 Hrs 2 Min (100%) |

### Route Information
- **Route**: WTC West → Lotus Tower RK
- **Planned Distance**: 3.21 km
- **Billing Distance**: 400.0 km (Odometer: 500 - 100 km)
- **GPS Distance**: 0.0 km (system failure)
- **Trip Type**: Domestic-FTL
- **Report Generated**: Jul 28, 2025, 2:16:46 PM

---

## 3. Contract-Based Calculations

### Flag Down Calculation
Based on the contract terms and actual job execution:

| Calculation Component | Details | Amount (LKR) |
|----------------------|---------|--------------|
| **Base Flag Down Rate** | LKR 100,000 × 3 applications | 300,000.00 |
| **Application Logic** | 10 Hrs 2 Min ÷ 5 hrs frequency = 2.00 (3 applications) | - |
| **Free Hours Deduction** | 3 applications × 1 free hour each | (3 hours free) |
| **Billable Duration** | 10 Hrs 2 Min - 3 free hours | 7 Hrs 2 Min |

### Distance-Based Calculation
Analysis of additional kilometer charges:

| Component | Details | Amount (LKR) |
|-----------|---------|--------------|
| **Total Distance** | 400.0 km (billing distance) | - |
| **Free KM Allowance** | 3 applications × 10 km each | 30 km |
| **Additional KM** | 400 - 30 = 370 km | - |
| **Expected Rate** | 370 km × 444 LKR/km | 164,280.00 |
| **System Calculation** | 970 km × 444 LKR/km | 430,680.00 |
| **Discrepancy** | System shows 970 km vs calculated 370 km | +266,400.00 |

### Demurrage Calculation - Analysis

#### Step 1: Contract-Based Demurrage Structure
Based on the contract configuration (LSl80-CNT-2025-07-28-00003):

**Configured Demurrage Slabs:**
| Slab | Duration | Rate (LKR/Hr) |
|------|----------|---------------|
| **Slab 1** | First 1 Hour | 101.00 |
| **Slab 2** | Next 2 Hours | 202.00 |
| **Slab 3** | Until Clearance | 999.00 |

**Invoice Terms & Conditions Show:**
| Slab | Duration | Rate (LKR/Hr) |
|------|----------|---------------|
| **Slab 1** | First 1 Hour | 101.00 |
| **Slab 2** | Next 2 Hours | 202.00 |
| **Slab 3** | Until Clearance | 0.00 |

#### Step 2: Demurrage Hours Determination
**Time Analysis:**
- **Total Duration**: 10 Hours 2 Minutes
- **Free Hours Allowance**: 3 applications × 1 hour each = 3 hours
- **Billable Demurrage Hours**: 10.03 - 3 = 7.03 hours
- **System Calculated Demurrage Hours**: **8 hours**

#### Step 3: System Calculation Analysis
**Applied Calculation (8 Hours Total):**

| Slab | Hours Applied | Rate (LKR/Hr) | Calculation | Amount (LKR) |
|------|---------------|---------------|-------------|--------------|
| **Slab 1: First 1 Hour** | 1 | 101.00 | 1 × 101 | 101.00 |
| **Slab 2: Next 2 Hours** | 2 | 202.00 | 2 × 202 | 404.00 |
| **Slab 3: Remaining 5 Hours** | 5 | 222.20* | 5 × 222.20 | 1,111.00 |
| **Total Demurrage** | **8** | **-** | **-** | **1,616.00** |

*Note: Reverse engineered rate to match system total

#### Step 4: Verification & Discrepancy Analysis
**Method 1: Using Configuration Rates (999 LKR/hr)**
```
Slab 1 (1 hour):    1 × 101 = 101 LKR
Slab 2 (2 hours):   2 × 202 = 404 LKR  
Slab 3 (5 hours):   5 × 999 = 4,995 LKR
Expected Total:               5,500 LKR
```

**Method 2: Using Invoice Terms (0 LKR/hr)**
```
Slab 1 (1 hour):    1 × 101 = 101 LKR
Slab 2 (2 hours):   2 × 202 = 404 LKR  
Slab 3 (5 hours):   5 × 0 = 0 LKR
Expected Total:             505 LKR
```

**Actual System: 1,616 LKR**

#### Critical Discrepancy
The system demurrage calculation of **1,616 LKR** doesn't match either:
- **Configuration rate (999 LKR/hr)**: Would result in 5,500 LKR
- **Invoice terms (0 LKR/hr)**: Would result in 505 LKR
- **Calculated effective rate**: 222.20 LKR/hr for clearance hours

### Additional Fees
Based on invoice analysis:

**No additional fees applied to this invoice.**

All charges are limited to:
- Transportation Fee (Flagdown)
- Demurrage charges
- Fee for Additional kilometers

---

## 4. Final Billing Summary

### Critical Billing Analysis  
| Component | Expected Calculation (LKR) | System Amount (LKR) | Variance (LKR) |
|-----------|----------------------------|-------------------|----------------|
| **Transportation Fee** | 300,000.00 | 300,000.00 | 0.00 ✓ |
| **Additional KMs (370 km)** | 164,280.00 | 430,680.00 | +266,400.00 ❌ |
| **Demurrage (8 hrs) - Config** | 5,500.00 | 1,616.00 | -3,884.00 ❌ |
| **Demurrage (8 hrs) - Invoice** | 505.00 | 1,616.00 | +1,111.00 ❌ |
| **Additional Fees** | 0.00 | 0.00 | 0.00 ✓ |
| **Tax** | 0.00 | 0.00 | 0.00 ✓ |
| **Grand Total (Expected)** | 469,780.00 | 732,296.00 | **+262,516.00 ❌** |

### Major Discrepancies Identified

**1. Additional Kilometers Overcharge: +266,400 LKR**
- System calculates: 970 km × 444 LKR = 430,680 LKR
- Expected calculation: 370 km × 444 LKR = 164,280 LKR
- **Issue**: System using 970 km instead of 370 km

**2. Demurrage Rate Inconsistency**
- Configuration shows: 999 LKR/hr for clearance
- Invoice terms show: 0 LKR/hr for clearance  
- System applies: 222.20 LKR/hr effective rate
- **Issue**: Unclear which rate structure is authoritative

### Billing Verification
- **Currency**: LKR (Sri Lankan Rupees)
- **Invoice Status**: Internally Approved  
- **Payment Schedule**: Single payment of 732,296.00 LKR
- **Primary Issue**: 970 km distance calculation needs urgent investigation

---

## 5. Cross-Validation Results

### Data Alignment Check
✅ **Contract Reference**: LSl80-CNT-2025-07-28-00003 matches across systems  
✅ **Job Details**: Consistent job title and reference numbers  
✅ **Transportation Fee**: Correctly calculated at 3 × 100,000 LKR  
❌ **Distance Calculation**: Major discrepancy in additional KM methodology  
❌ **Demurrage**: Rate structure inconsistency between config and invoice  
✅ **Additional Fees**: No additional fees applied consistently  
❌ **Total Billing**: 36% overcharge due to distance calculation error  

### Key Performance Indicators  
| KPI | Target | Actual | Status |
|-----|--------|--------|--------|
| **On-Time Performance** | 100% | Start: Early by 27m, End: Late by 21h 35m | ⚠️ Mixed Performance |
| **Distance Accuracy** | ±10% | GPS: 100% failure, Planned: 0% variance | ❌ System Failure |
| **Duration Variance** | ±20% | +∞% (0 planned vs 10+ actual) | ❌ Planning Failure |
| **Billing Accuracy** | 100% | 64% (262K LKR overcharge) | ❌ Critical Failure |

---

## 6. Issues and Discrepancies

### Critical Billing Issues
1. **Distance Calculation Error**: 970 km vs expected 370 km (+600 km overcharge)
2. **Rate Structure Conflict**: Configuration (999 LKR/hr) vs Invoice terms (0 LKR/hr)
3. **Massive Overcharge**: LKR 262,516 (36% of total invoice amount)
4. **GPS System Failure**: 0.0 km reading requiring manual odometer reliance

### Operational Issues  
1. **Planning Deficiency**: 0 hours planned vs 10+ hours actual duration
2. **Mixed Time Performance**: Early start (-27m) but significant end delay (+21h 35m)
3. **Distance Tracking**: Planned 3.21 km vs billed 400 km from odometer readings

### Root Cause Analysis
**Primary Issue**: Distance calculation methodology
- **Free KM Logic**: System may not be properly calculating free allowances
- **Odometer vs GPS**: Over-reliance on odometer readings without GPS validation
- **Rate Application**: Inconsistent demurrage rate structures across systems

**Secondary Issue**: Contract configuration vs system implementation
- **Rate Discrepancy**: 999 LKR/hr config vs 0 LKR/hr invoice terms
- **Distance Base**: Unclear whether 970 km includes return journey or errors

### Immediate Actions Required
1. **URGENT**: Freeze invoice payment pending distance calculation review
2. **CRITICAL**: Audit all contracts using similar distance calculation logic  
3. **IMMEDIATE**: Reconcile contract configuration with invoice generation system
4. **PRIORITY**: Investigate GPS system failures affecting distance tracking
5. **ESCALATE**: Review billing methodology for flagdown + per-km contracts

### Financial Impact
- **Potential Overcharge**: LKR 262,516
- **Customer Impact**: 36% billing error affects customer relationship
- **System Risk**: Similar errors may exist in other invoices

---

## 7. Payment Terms  
- **Invoice Amount**: LKR 732,296.00
- **Recommended Action**: **HOLD PAYMENT** pending billing investigation
- **Terms**: Pay upon completion (originally)
- **Amount in Words**: Seven Hundred Thirty Two Thousand Two Hundred Ninety Six Only
- **Expected Corrected Amount**: LKR 469,780.00 (pending investigation)

---

## 8. Data Sources
- **Running Sheet**: https://staging.app.exampleplatform.com/run-sheet/7171bb41-185a-448f-aa40-c9ab64ab9ca2/LSl80-250728-00005?jpmId=f57c60c0-10cd-4785-b979-f365b03442b6
- **Invoice Management**: https://staging.app.exampleplatform.com/invoice-management/progress-line?id=a46424b6-df37-4d00-b87e-a7cf55975167
- **Contract Configuration**: Provided via screenshot analysis
- **Report Generated**: December 31, 2024
- **Prepared By**: Automated Contract Analysis System

---

*This report was generated based on data extracted from the ExamplePlatform system. All calculations are based on the contract terms and actual job execution data as recorded in the system.* 