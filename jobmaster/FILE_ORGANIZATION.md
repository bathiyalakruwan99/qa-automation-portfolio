# 📁 Job Master - File Organization Guide

## 🗂️ **Folder Structure**

The Job Master application now automatically creates and organizes files in the following directories:

```
jobmaster/
├── uploads/           # Uploaded source files
├── downloads/         # Web app search results and exports
├── exports/           # Desktop app exports and reports
├── reports/           # Generated reports and summaries
└── file/             # Your original Excel files
```

## 📝 **File Naming Conventions**

### **Automatic Meaningful Names**
Files are now automatically named based on:
- **Search criteria applied**
- **Date and time of export**
- **Type of data exported**

### **Web App Files** (`downloads/` folder)
- `JobMaster_SearchResults_[filters]_YYYYMMDD_HHMMSS.xlsx`

**Examples:**
- `JobMaster_SearchResults_JobID-J001_20241215_143022.xlsx`
- `JobMaster_SearchResults_Status-Completed_Keyword-Development_20241215_143155.xlsx`
- `JobMaster_SearchResults_Driver-John_Vehicle-VH001_20241215_143312.xlsx`

### **Desktop App Files** (`exports/` folder)
- `JobMaster_Export_[filters]_YYYYMMDD_HHMMSS.xlsx`
- `JobMaster_Job_[JobID]_[filters]_YYYYMMDD_HHMMSS.xlsx`

**Examples:**
- `JobMaster_Export_Status-InProgress_20241215_143545.xlsx`
- `JobMaster_Job_J001_20241215_143621.xlsx`

## 🔍 **Search Filter Codes in Filenames**

When you apply search filters, they are automatically included in the filename:

| Filter Applied | Filename Code | Example |
|---------------|---------------|---------|
| Job ID | `JobID-[value]` | `JobID-J001` |
| Status | `Status-[value]` | `Status-Completed` |
| Keyword | `Keyword-[value]` | `Keyword-Development` |
| Driver | `Driver-[value]` | `Driver-John` |
| Vehicle | `Vehicle-[value]` | `Vehicle-VH001` |
| Date Range | `DateRange-[from]-to-[to]` | `DateRange-2024-01-01-to-2024-01-31` |
| Date From | `DateFrom-[date]` | `DateFrom-2024-01-01` |
| Date To | `DateTo-[date]` | `DateTo-2024-01-31` |

## 📊 **Excel File Contents**

### **Multi-Sheet Structure**
All exported Excel files now contain multiple sheets:

1. **Main Data Sheet**
   - `Search Results` (Web app)
   - `Job Master Data` (Desktop app)
   - `Job [JobID]` (Individual job export)

2. **Summary Sheet**
   - Total records, statistics, and metrics

3. **Applied Filters Sheet** (if filters were used)
   - List of all search criteria applied
   - Filter values used

4. **Job Summary Sheet** (individual job exports)
   - Job-specific information and export details

## 🎯 **Benefits of This Organization**

### **Easy File Management**
- **Find files quickly** by their descriptive names
- **Understand what data** is in each file without opening it
- **Organize by date** with timestamps in filenames

### **Clear Folder Structure**
- **Separate upload and export** files
- **Organized by application** (web vs desktop)
- **Dedicated report storage**

### **Complete Information**
- **Filter details** preserved in filename and Excel sheets
- **Export metadata** included in files
- **Search criteria** documented

## 🚀 **How to Use**

### **Web App**
1. Upload your Excel file
2. Apply search filters as needed
3. Click "Export Results"
4. File is automatically saved to `downloads/` folder with meaningful name

### **Desktop App**
1. Process your Excel file
2. Apply search filters as needed
3. Click "Export to Excel"
4. Choose location (defaults to `exports/` folder)
5. Filename is automatically suggested based on your filters

## 💡 **Tips**

- **File names are automatically cleaned** of invalid characters
- **Timestamps ensure uniqueness** - no file overwrites
- **Folder structure is created automatically** when you start the application
- **All your search criteria are preserved** in both filename and Excel sheets
- **Multiple exports are organized** chronologically by timestamp

This organization makes it easy to find, identify, and manage all your Job Master data exports! 