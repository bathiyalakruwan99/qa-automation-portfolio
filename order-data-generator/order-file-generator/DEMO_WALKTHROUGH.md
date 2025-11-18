# Demo Walkthrough: Order File Generator

This is a step-by-step walkthrough demonstrating all features of the Order File Generator.

## 🎬 Demo Scenario
**Goal**: Generate 15 test orders with 5 drop locations, including test scenarios

---

## Step 1: Installation (First Time Only)

### Windows
1. Open File Explorer
2. Navigate to: `D:\ordermanger optimizer check\order file creation\order-file-generator\`
3. Double-click `install.bat`
4. Wait for message: "Installation complete!"
5. Press any key to close

### What Happened
- Created virtual environment in `.venv/`
- Installed pandas, numpy, openpyxl, xlsxwriter
- Ready to run

---

## Step 2: Launch Application

### Windows
1. Double-click `run.bat`
2. Application window appears

### What You See
```
╔══════════════════════════════════════════════════════════╗
║          Order File Generator                            ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  1. Load Files                                           ║
║     Order Spec File:  [____________] [Browse...]         ║
║     Location Master:  [____________] [Browse...]         ║
║                                                          ║
║  2. Map Location Columns                                 ║
║     Location Reference ID:    [dropdown ▼]              ║
║     Organization Short Name:  [dropdown ▼]              ║
║     Location Name (optional): [dropdown ▼]              ║
║                                                          ║
║  3. Generation Parameters                                ║
║     Pickup Location:          [dropdown ▼]              ║
║     Number of Unloading Locations: [5 ↕]                ║
║     Orders per Location:      [3 ↕] ☐ Use random        ║
║     Shipper Name:             [Default Shipper]         ║
║     Order ID Prefix:          [ORD]                     ║
║     Start Index:              [1 ↕]                     ║
║                                                          ║
║  4. Test Scenarios (Optional)                            ║
║     ☐ Duplicate Order IDs                               ║
║     ☐ Bad Time Windows                                  ║
║     ☐ Whitespace/Case Sensitivity                       ║
║                                                          ║
║  [Generate Order File]  [Quit]                          ║
║                                                          ║
║  Status: Ready. Please load files to begin.             ║
╚══════════════════════════════════════════════════════════╝
```

---

## Step 3: Load Order Spec File

### Actions
1. Click **[Browse...]** next to "Order Spec File"
2. Navigate to: `data\specs\`
3. Select: `Order List Spec - D7 Cash Customer-Kithulgala-OK DEMO.xlsx`
4. Click **[Open]**

### What Happens
- Status bar shows: "Loading order spec..."
- Dialog appears:
  ```
  ✓ Order spec loaded successfully!
  
  Columns: 15
  First few: OrderID, PickupLocationId, DropOffLocationId...
  ```
- Click **[OK]**
- File path appears in the text box
- Status bar shows: "✓ Loaded spec with 15 columns"

### Why Important
This defines the **exact schema** of your output file.

---

## Step 4: Load Location Master File

### Actions
1. Click **[Browse...]** next to "Location Master"
2. Navigate to: `data\locations\`
3. Select: `Centrics 3PL (7).xlsx`
4. Click **[Open]**

### What Happens
- Status bar shows: "Loading location master..."
- Column dropdowns populate automatically
- Dialog appears:
  ```
  ✓ Location master loaded successfully!
  
  Locations: 250
  Auto-detected:
    Ref ID: Location Reference ID
    Org Name: Organization Short Name
  ```
- Click **[OK]**
- File path appears in the text box
- Pickup Location dropdown populates with all location IDs
- Status bar shows: "✓ Loaded location master with 250 locations"

### Why Important
This provides real location data for pickup/dropoff points.

---

## Step 5: Verify Column Mappings

### Check Settings
- **Location Reference ID**: Should show "Location Reference ID"
- **Organization Short Name**: Should show "Organization Short Name"  
- **Location Name**: Can be empty or auto-selected

### Manual Override (if needed)
If auto-detection selected wrong columns:
1. Click dropdown ▼
2. Select correct column from list
3. Repeat for each mapping

### Why Important
These mappings determine how location data is used.

---

## Step 6: Configure Parameters

### Set Values
1. **Pickup Location**: Click dropdown, select "WH-MAIN-001" (or any location)
2. **Number of Unloading Locations**: Leave at **5** (or change with ↕ buttons)
3. **Orders per Location**: Leave at **3** (or change)
4. **Use random**: Leave **unchecked** for predictable output
5. **Shipper Name**: Change to **"Acme Shipping Co."**
6. **Order ID Prefix**: Change to **"TEST"**
7. **Start Index**: Leave at **1**

### What This Means
- 1 pickup location (WH-MAIN-001)
- 5 different drop locations (randomly selected)
- 3 orders per drop location
- Total: 5 × 3 = **15 orders**
- Order IDs: TEST0001, TEST0002, ..., TEST0015
- Shipper: "Acme Shipping Co."

---

## Step 7: Enable Test Scenarios

### For This Demo
Check all three boxes:
- ☑ **Duplicate Order IDs**
- ☑ **Bad Time Windows**
- ☑ **Whitespace/Case Sensitivity**

### What Each Does

**Duplicate Order IDs**:
- Adds 2 duplicate rows at the end
- Total rows: 15 + 2 = 17
- Tests TMS duplicate detection

**Bad Time Windows**:
- Last row has DeliveryEnd < DeliveryStart
- Tests TMS validation

**Whitespace/Case Sensitivity**:
- Middle rows have "  WH-MAIN-001  " (spaces)
- Tests TMS trimming logic

---

## Step 8: Generate Order File

### Actions
1. Click **[Generate Order File]** button
2. Status bar shows: "Generating orders..."
3. Save dialog appears

### In Save Dialog
- **Directory**: Shows `D:\ordermanger optimizer check\order file creation\Created file`
- **Filename**: Shows `Orders_20241021_143052.xlsx` (current timestamp)
- Options:
  - Keep default location and filename, or
  - Change to custom location
  - Change filename if desired
4. Click **[Save]**

### What Happens
- Progress briefly shown
- Success dialog appears:
  ```
  ✓ Order file generated successfully!
  
  Orders: 17
  File: D:\ordermanger optimizer check\...
        \Created file\Orders_20241021_143052.xlsx
  ```
5. Click **[OK]**
6. Status bar shows: "✓ Saved 17 orders to Orders_20241021_143052.xlsx"

---

## Step 9: Verify Output File

### Open in Excel
1. Navigate to: `D:\ordermanger optimizer check\order file creation\Created file\`
2. Double-click: `Orders_20241021_143052.xlsx`
3. Excel opens with sheet "Orders"

### What You See

**Column Headers (Row 1)**:
```
OrderID | PickupLocationId | DropOffLocationId | Consignee | Shipper | Quantity | Weight | Volume | Priority | PickupTimeWindow | DeliveryTimeWindow | ...
```

**Sample Data (Row 2)**:
```
TEST0001 | WH-MAIN-001 | DROP-LOC-042 | ABC Corp | Acme Shipping Co. | 5 | 45.32 | 0.85 | Normal | 2024-10-21 18:00–2024-10-21 20:00 | 2024-10-21 22:00–2024-10-22 00:00 | ...
```

### Verify
- ✅ 17 rows of data (15 normal + 2 duplicates)
- ✅ Columns match spec exactly
- ✅ OrderIDs: TEST0001, TEST0002, ..., TEST0015, TEST0001, TEST0002
- ✅ Shipper: "Acme Shipping Co." in all rows
- ✅ Pickup: "WH-MAIN-001" in all rows
- ✅ Drop locations: 5 different locations, 3 orders each
- ✅ Consignee: Matches organization name from location master
- ✅ Random values: Different quantities, weights, volumes
- ✅ Time windows: Realistic pickup and delivery times
- ✅ Last row: Bad time window (end < start)
- ✅ Middle rows: Some have extra spaces in location IDs

---

## Step 10: Test Different Scenarios

### Scenario A: Large Scale Test
**Parameters**:
- Pickup: Any location
- Unloading Locations: **50**
- Orders per Location: **10**
- Use random: **☑ checked**
- Scenarios: None

**Result**: 
- ~250-500 orders (random)
- Tests performance
- Realistic variation

### Scenario B: Minimal Test
**Parameters**:
- Pickup: Any location
- Unloading Locations: **1**
- Orders per Location: **1**
- Scenarios: None

**Result**:
- 1 order
- Fastest generation
- Basic validation

### Scenario C: Validation Test
**Parameters**:
- Pickup: Any location
- Unloading Locations: **3**
- Orders per Location: **2**
- Scenarios: **All enabled**

**Result**:
- 8 orders (6 + 2 duplicates)
- Mix of valid and invalid
- Tests error handling

---

## Step 11: Understanding the Output

### Time Windows
**Format depends on spec**:

**If spec has combined columns**:
- `PickupTimeWindow`: "2024-10-21 18:00–2024-10-21 20:00"
- `DeliveryTimeWindow`: "2024-10-21 22:00–2024-10-22 00:00"

**If spec has split columns**:
- `PickupStart`: "2024-10-21 18:00"
- `PickupEnd`: "2024-10-21 20:00"
- `DeliveryStart`: "2024-10-21 22:00"
- `DeliveryEnd`: "2024-10-22 00:00"

### Random Values
**Quantity**: 1-8 pieces (uniform distribution)  
**Weight**: 10.0-80.0 kg (uniform distribution)  
**Volume**: 0.1-2.0 m³ (uniform distribution)  
**Priority**: Low (20%), Normal (60%), High (20%)

### Consignee Logic
1. For each order, look at `DropOffLocationId`
2. Find that location in the location master
3. Get the `Organization Short Name` for that location
4. Set `Consignee` to that organization name

Example:
- DropOffLocationId: "DROP-LOC-042"
- Location Master lookup: Organization = "ABC Corp"
- Consignee: "ABC Corp"

---

## Step 12: Common Workflows

### Daily Testing
1. Open tool (run.bat)
2. Files already loaded (from last time)
3. Change pickup location
4. Click Generate
5. Done in 10 seconds

### Scenario Testing
1. Open tool
2. Enable specific scenarios
3. Generate multiple files:
   - File 1: Duplicates only
   - File 2: Bad windows only
   - File 3: Whitespace only
   - File 4: All combined
4. Test each in TMS

### Data Prep for Demos
1. Generate clean file (no scenarios)
2. Large scale (50+ locations)
3. Use for customer demos
4. Consistent, realistic data

---

## 🎓 Key Takeaways

### What the Tool Does
✅ Preserves your exact spec schema  
✅ Uses real location data  
✅ Generates realistic random values  
✅ Creates test scenarios automatically  
✅ Saves time on manual data entry  

### What the Tool Doesn't Do
❌ Doesn't modify your spec file  
❌ Doesn't modify your location master  
❌ Doesn't connect to any database  
❌ Doesn't send data anywhere  

### When to Use This Tool
- Testing TMS import functionality
- Creating demo data
- Stress testing with large files
- Testing validation logic
- Preparing for user training

---

## 🐛 Troubleshooting Demo

### Problem During Demo: "Column not found"
**Solution**: Use column mapping dropdowns to manually select

### Problem During Demo: "Not enough locations"
**Solution**: Reduce number of unloading locations

### Problem During Demo: File won't save
**Solution**: Check that output directory exists and is writable

### Problem During Demo: Wrong consignee names
**Solution**: Check Organization Short Name mapping

---

## 📝 Demo Script (5 Minutes)

**1. Introduction (30 sec)**
"I'll show you how to generate test order files in under a minute."

**2. Load Files (60 sec)**
- Click Browse → Select spec
- Click Browse → Select locations
- "Notice the auto-detection"

**3. Configure (60 sec)**
- Select pickup
- Set 5 locations, 3 orders
- Change shipper name
- "This gives us 15 orders"

**4. Enable Scenarios (30 sec)**
- Check all three boxes
- "These test edge cases"

**5. Generate (30 sec)**
- Click Generate
- Show save dialog
- Click Save
- "Done! File created."

**6. Open Result (60 sec)**
- Open in Excel
- Show columns match spec
- Show random values
- Show test scenarios

**7. Conclusion (30 sec)**
"That's it! Generate unlimited test files in seconds."

---

## 🎉 End of Demo

You now know how to:
- ✅ Install and run the tool
- ✅ Load specification and location files
- ✅ Map columns correctly
- ✅ Configure generation parameters
- ✅ Enable test scenarios
- ✅ Generate and save order files
- ✅ Verify output

**Next Steps**:
- Read USAGE_GUIDE.md for advanced features
- Try different parameter combinations
- Customize for your specific needs
- Share with your team

**Questions?**
Check README.md or USAGE_GUIDE.md for more help.

