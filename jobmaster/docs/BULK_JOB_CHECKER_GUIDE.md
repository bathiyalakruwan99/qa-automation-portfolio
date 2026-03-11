# Bulk Job Checker - User Guide

## 🎯 **What is this tool?**

The Bulk Job Checker is a specialized app that allows you to check multiple job IDs at once for:
- **GPS Execution** - Whether the job has GPS tracking data
- **Payment Schedule Status** - Whether payment schedule is set up
- **Invoice Status** - Whether invoice has been created

## 🚀 **How to Run the App**

### Method 1: Batch File (Recommended)
```bash
bulk_job_checker.bat
```

### Method 2: Direct Python Command
```bash
python bulk_job_checker.py
```

---

## 📋 **Step-by-Step Usage**

### **Step 1: Load Main Data**
1. Click **"Select Excel File"** 
2. Choose your main job data file (e.g., `file/job-master (9).xlsx`)
3. The app will automatically load the data and show how many rows were loaded

### **Step 2: Enter Job IDs**
You have multiple options to load job IDs:

**Option A: Manual Entry**
1. In the **"Enter Job IDs"** text area, paste your job IDs (one per line)

**Option B: Upload from File**
1. Click **"📁 Upload from File"** to upload job IDs from a text file (.txt) or CSV file (.csv)
2. Select your file containing job IDs
3. Job IDs will be automatically loaded

**Option C: Upload from Excel**
1. Click **"📊 Upload from Excel"** to upload job IDs from an Excel file
2. Select your Excel file
3. Choose the column containing job IDs
4. Job IDs will be automatically loaded

**Option D: Load Sample**
1. Click **"Load Sample Job IDs"** to load the example you provided

**Option E: Clear All**
1. Click **"Clear Job List"** to start fresh

**Example Job IDs:**
```
PV-5315-11-07-2025
11JULY25-LP-1701-04
LE-0065-11-JULY-2025-FAC
PT-5724-11-07-2025
227-9041-11-07-2025
```

### **Step 3: Check Job Status**
1. Click **"Check Job Status"**
2. The app will search for each job ID in the main data
3. Results will appear in the table on the right

### **Step 4: Export Results**
1. Click **"Export Results"**
2. Choose where to save the Excel file
3. The file will contain detailed results and summary statistics

---

## 📊 **Understanding the Results**

### **Results Table Columns:**
- **Job ID** - The job ID you searched for
- **Status** - Whether the job was found in the main data
- **GPS Executed** - YES/NO with GPS distance value
- **Payment Schedule** - YES/NO with payment schedule details
- **Invoice Status** - YES/NO with invoice information
- **Driver** - Assigned driver name
- **Vehicle** - Assigned vehicle

### **Color Coding:**
- 🟢 **Green** - Complete (has GPS, payment schedule, and invoice)
- 🟡 **Yellow** - Incomplete (missing some information)
- 🔴 **Red** - Not found in main data

### **Summary Metrics:**
- **Total Jobs** - Number of job IDs you checked
- **Found** - How many were found in the main data
- **GPS Executed** - How many have GPS tracking
- **Payment Schedule** - How many have payment schedules
- **Invoice Status** - How many have invoices

---

## 🔍 **Sample Data Analysis**

Using your sample job IDs:
```
PV-5315-11-07-2025
11JULY25-LP-1701-04
LE-0065-11-JULY-2025-FAC
PT-5724-11-07-2025
227-9041-11-07-2025
LM-1324-11-07-2025
GB-7711-11-JULY-2025-02FAC
...and more
```

The app will:
1. **Search** each job ID in the main data
2. **Check** if GPS distance is recorded
3. **Verify** payment schedule is set up
4. **Confirm** invoice status is available
5. **Show** driver and vehicle assignments

---

## 📁 **File Structure**

```
jobmaster/
├── bulk_job_checker.py     # Main application
├── bulk_job_checker.bat    # Windows launcher
├── file/
│   └── job-master (9).xlsx # Main data file
├── exports/                # Export results here
└── reports/                # Additional reports
```

---

## ⚠️ **Important Notes**

1. **Data File Required** - You must load the main data file first
2. **Job ID Format** - The app searches for partial matches, so variations in formatting should work
3. **Case Insensitive** - Job ID matching is case-insensitive
4. **Multiple Matches** - If multiple records match a job ID, the first one is used
5. **GPS Threshold** - GPS is considered "executed" if the distance value is > 0

---

## 🔧 **Troubleshooting**

### **App won't start:**
- Run `auto_install_python.bat` to install Python
- Make sure you're in the correct directory

### **No results found:**
- Check that the main data file is loaded correctly
- Verify your job IDs are formatted correctly
- Check the status log for error messages

### **Export fails:**
- Make sure you have write permissions to the export directory
- Check that the file isn't already open in Excel

---

## 📂 **Supported File Formats for Upload**

### **Text Files (.txt)**
- One job ID per line
- Simple text format
- UTF-8 encoding supported

### **CSV Files (.csv)**
- Comma-separated values
- One job ID per line OR comma-separated on same line
- Automatic detection of format

### **Excel Files (.xlsx, .xls)**
- Any Excel file format
- Column selection dialog
- Automatic detection of job ID columns
- Supports multiple sheets (first sheet used)

**Example file contents:**
```
Text file (.txt):
PV-5315-11-07-2025
11JULY25-LP-1701-04
LE-0065-11-JULY-2025-FAC

CSV file (.csv):
PV-5315-11-07-2025,11JULY25-LP-1701-04,LE-0065-11-JULY-2025-FAC
OR
PV-5315-11-07-2025
11JULY25-LP-1701-04
LE-0065-11-JULY-2025-FAC

Excel file (.xlsx):
| Job ID | Job Name | Status |
|--------|----------|---------|
| PV-5315-11-07-2025 | Test Job 1 | Active |
| 11JULY25-LP-1701-04 | Test Job 2 | Complete |
```

---

## 📈 **Export Features**

The exported Excel file contains:

### **Sheet 1: Job Check Results**
- Complete table with all job IDs and their status
- GPS execution details
- Payment schedule information
- Invoice status
- Driver and vehicle assignments

### **Sheet 2: Summary**
- Total jobs checked
- Found vs not found counts
- GPS, payment, and invoice statistics
- Check date and time

---

## 🎉 **Benefits of Using This Tool**

✅ **Quick bulk checking** - Check dozens of jobs at once
✅ **Multiple upload options** - Upload from text files, CSV files, or Excel files
✅ **Smart column detection** - Automatically finds job ID columns in Excel files
✅ **Comprehensive status** - GPS, payment, and invoice in one view
✅ **Excel export** - Easy to share and analyze results
✅ **Color coding** - Instantly see which jobs need attention
✅ **Automatic matching** - Finds jobs even with format variations
✅ **Summary statistics** - Overview of completion rates

---

**Happy job checking!** 🚀 