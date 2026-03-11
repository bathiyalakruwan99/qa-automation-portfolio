# Current Counting Logic - Complete Documentation

## 📊 **Overview**

The JobMaster application uses a sophisticated multi-method counting system with **three separate categories** and **three different calculation methods** for each category.

---

## 🎯 **Three Main Categories**

### **1. Non FTL-DISTRIBUTION Loads**
- **What it counts**: All records where `Trip Type ≠ FTL-DISTRIBUTION`
- **Exclusion**: Records with "Count: Load and Route Optimiser" values are **excluded** from this count
- **Method**: Counts unique, non-empty `Load ID` values
- **Fallback**: If no `Load ID` column, uses unique combinations of (Job ID + Vehicle + Driver)
- **Display**: Green label in UI
- **Result Type**: Whole numbers

### **2. FTL-DISTRIBUTION Loads**
- **What it counts**: Records where `Trip Type = FTL-DISTRIBUTION`
- **Exclusion**: Records with "Count: Load and Route Optimiser" values are **excluded** from this count
- **Requirement**: Must have both `Load ID` (non-empty) and `Planned Stops: Qty` (valid number)
- **Calculation**: Based on `Planned Stops: Qty` value
- **Display**: Red (Current), Orange (8x), Dark Orange (10x) labels in UI
- **Result Type**: Decimals for Current, whole numbers for 8x and 10x

### **3. FTL-DOMESTIC Route Optimiser (ftldis-op)**
- **What it counts**: Records where `Trip Type = FTL-DOMESTIC` AND has "Count: Load and Route Optimiser" value
- **Calculation**: Based on "Count: Load and Route Optimiser" value (not Planned Stops)
- **Display**: Currently **NOT displayed in UI** (logic exists but no UI labels)
- **Result Type**: Decimals for Current, whole numbers for 8x and 10x

---

## 🧮 **Three Calculation Methods**

### **Method 1: Current (Prorated System)**
- **Formula**: 
  - If stops ≤ 8: `1.0 Load`
  - If stops > 8: `base_loads + (remaining / 8)`
    - `base_loads = stops // 8`
    - `remaining = stops % 8`
- **Result**: Decimal values (3 decimal places)
- **Example**: 
  - 5 stops → 1.000 Load
  - 9 stops → 1.125 Load (1 + 1/8)
  - 17 stops → 2.125 Load (2 + 1/8)

### **Method 2: 8x Multiplication (Previous Logic)**
- **Formula**: `math.ceil(stops / 8)`
- **Result**: Whole numbers
- **Example**:
  - 1-8 stops → 1 Load
  - 9-16 stops → 2 Loads
  - 17-24 stops → 3 Loads
  - 25-32 stops → 4 Loads

### **Method 3: 10x Multiplication (New Logic)**
- **Formula**: `math.ceil(stops / 10)`
- **Result**: Whole numbers
- **Example**:
  - 1-10 stops → 1 Load
  - 11-20 stops → 2 Loads
  - 21-30 stops → 3 Loads
  - 31-40 stops → 4 Loads

---

## 📋 **Detailed Logic Flow**

### **Step 1: Data Separation**
```
1. Check if "Count: Load and Route Optimiser" column exists
2. If exists:
   - Identify records with Route Optimiser values
   - Exclude these records from non-FTL-DISTRIBUTION counting
   - Exclude these records from FTL-DISTRIBUTION counting
3. Separate remaining data:
   - FTL-DISTRIBUTION records (without Route Optimiser)
   - Non FTL-DISTRIBUTION records (without Route Optimiser)
4. Separate Route Optimiser records:
   - FTL-DOMESTIC records with Route Optimiser → ftldis-op category
```

### **Step 2: Non FTL-DISTRIBUTION Counting**
```
1. Filter: Trip Type ≠ FTL-DISTRIBUTION AND Route Optimiser is empty
2. Count unique Load IDs (non-empty)
3. Result: Single whole number
```

### **Step 3: FTL-DISTRIBUTION Counting**
```
For each FTL-DISTRIBUTION record (without Route Optimiser):
  1. Check if has Load ID (non-empty)
  2. Check if has Planned Stops: Qty (valid number)
  3. If both present:
     - Apply Current (Prorated) logic → add to ftl_distribution_loads_current
     - Apply 8x logic → add to ftl_distribution_loads_previous
     - Apply 10x logic → add to ftl_distribution_loads_10x
  4. If no Load ID: Exclude from count
```

### **Step 4: FTL-DOMESTIC Route Optimiser (ftldis-op) Counting**
```
For each FTL-DOMESTIC record with Route Optimiser value:
  1. Get Route Optimiser value (not Planned Stops)
  2. Apply Current (Prorated) logic → add to ftldis_op_loads_current
  3. Apply 8x logic → add to ftldis_op_loads_8x
  4. Apply 10x logic → add to ftldis_op_loads_10x
```

### **Step 5: Total Calculation**
```
Total Current = Non FTL-DIST + FTL-DIST (Current) + ftldis-op (Current)
Total 8x = Non FTL-DIST + FTL-DIST (8x) + ftldis-op (8x)
Total 10x = Non FTL-DIST + FTL-DIST (10x) + ftldis-op (10x)
```

---

## ⚠️ **Important Notes**

### **Route Optimiser Exclusion**
- Records with "Count: Load and Route Optimiser" values are **completely excluded** from:
  - Non FTL-DISTRIBUTION counting
  - FTL-DISTRIBUTION counting
- They are **only counted** in ftldis-op category (if Trip Type = FTL-DOMESTIC)

### **Current Issue**
- The code looks for **FTL-DOMESTIC** records with Route Optimiser values
- But your data has **FTL-DISTRIBUTION** records with Route Optimiser values
- Result: ftldis-op shows 0 because no FTL-DOMESTIC records have Route Optimiser values

### **UI Display**
- **Displayed in UI**: 
  - Total Jobs
  - Non FTL-DIST
  - FTL-DIST (Current, 8x, 10x)
  - Total (Current, 8x, 10x)
- **NOT displayed in UI** (but calculated):
  - ftldis-op (Current, 8x, 10x) - Logic exists but no UI labels

---

## 📊 **Example Calculation**

### **Scenario:**
- 1000 Non FTL-DISTRIBUTION records → 954 unique Load IDs
- 205 FTL-DISTRIBUTION records (1 without Load ID, 4 with Route Optimiser excluded)
  - 200 records with Load ID and Planned Stops
  - Average 10 stops per record
- 4 FTL-DOMESTIC records with Route Optimiser values: [6, 3, 4, 3]

### **Calculations:**

**Non FTL-DISTRIBUTION**: 954 loads

**FTL-DISTRIBUTION** (200 records, avg 10 stops):
- Current: 200 × 1.250 = 250.000 loads
- 8x: 200 × 2 = 400 loads
- 10x: 200 × 1 = 200 loads

**ftldis-op** (4 records with values [6, 3, 4, 3]):
- Current: 
  - 6 → 1.000, 3 → 1.000, 4 → 1.000, 3 → 1.000
  - Total: 4.000 loads
- 8x:
  - 6 → 1, 3 → 1, 4 → 1, 3 → 1
  - Total: 4 loads
- 10x:
  - 6 → 1, 3 → 1, 4 → 1, 3 → 1
  - Total: 4 loads

**Total**:
- Current: 954 + 250.000 + 4.000 = 1,208.000 loads
- 8x: 954 + 400 + 4 = 1,358 loads
- 10x: 954 + 200 + 4 = 1,158 loads

---

## 🔧 **Current Status**

✅ **Working**:
- Non FTL-DISTRIBUTION counting
- FTL-DISTRIBUTION counting (all 3 methods)
- Route Optimiser exclusion logic
- Total calculations (including ftldis-op)

⚠️ **Issue**:
- ftldis-op only counts FTL-DOMESTIC records
- Your data has FTL-DISTRIBUTION records with Route Optimiser
- Result: ftldis-op = 0

❌ **Missing**:
- UI display for ftldis-op values (logic exists but no labels)

---

**Last Updated**: Based on current code state after rejected UI changes

