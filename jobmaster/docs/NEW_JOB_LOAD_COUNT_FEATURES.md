# Job Count & Load Count Features - New Update

## 🎯 **What's New**

The JobMaster application now includes **Job Count** and **Load Count** as new filter options and data fields. These features allow you to:

- **Filter by Job Count**: Search for jobs with specific job count ranges
- **Filter by Load Count**: Search for jobs with specific load count ranges  
- **Export filtered data**: Download Excel files with Job Count and Load Count filters applied
- **View in data tables**: See Job Count and Load Count columns in the main data view

## 📋 **New Filter Options**

### **Job Count Filter**
- **Min Value**: Filter jobs with job count greater than or equal to this value
- **Max Value**: Filter jobs with job count less than or equal to this value
- **Range**: Use both min and max to filter within a specific range

### **Load Count Filter**
- **Min Value**: Filter jobs with load count greater than or equal to this value
- **Max Value**: Filter jobs with load count less than or equal to this value
- **Range**: Use both min and max to filter within a specific range

## 🚀 **How to Use**

### **Desktop Application**

1. **Load your Excel file** containing Job Count and Load Count data
2. **Use the new filter fields** in the Search & Filter section:
   - Enter minimum and maximum values for Job Count
   - Enter minimum and maximum values for Load Count
3. **Apply filters** using "Search Now" or real-time search
4. **Export results** to Excel with meaningful filenames including filter information

### **Web Application**

1. **Upload your Excel file** with Job Count and Load Count columns
2. **Use the search interface** to filter by these new fields
3. **Download filtered data** as Excel files

## 📊 **Column Mapping**

The application automatically maps these column names to the new fields:

### **Job Count**
- `Job Count`
- `job_count`
- `Jobs Count`
- `Number of Jobs`

### **Load Count**
- `Load Count`
- `load_count`
- `Loads Count`
- `Number of Loads`

## 📁 **Export Features**

### **Smart Filename Generation**
When you export filtered data, the filename will include your filter criteria:

**Examples:**
- `JobMaster_Export_JobCount-5-to-10_LoadCount-2-to-5_20241201_143022.xlsx`
- `JobMaster_Export_JobCountMin-3_LoadCountMax-8_20241201_143022.xlsx`

### **Excel Export Contents**
- **Main Data Sheet**: All filtered data including Job Count and Load Count columns
- **Summary Sheet**: Statistics including totals and averages for Job Count and Load Count
- **Applied Filters Sheet**: List of all filters used (including Job Count and Load Count ranges)

## 🔍 **Search Examples**

### **Example 1: Jobs with 5-10 job count and 2-5 load count**
- Job Count Min: `5`
- Job Count Max: `10`
- Load Count Min: `2`
- Load Count Max: `5`

### **Example 2: Jobs with minimum 3 job count**
- Job Count Min: `3`
- Job Count Max: (leave empty)
- Load Count Min: (leave empty)
- Load Count Max: (leave empty)

### **Example 3: Jobs with maximum 8 load count**
- Job Count Min: (leave empty)
- Job Count Max: (leave empty)
- Load Count Min: (leave empty)
- Load Count Max: `8`

## 📈 **Summary Statistics**

The exported Excel files now include:

### **Job Count Statistics**
- Total Job Count across all records
- Average Job Count per record
- Distribution of Job Count values

### **Load Count Statistics**
- Total Load Count across all records
- Average Load Count per record
- Distribution of Load Count values

## 🛠️ **Technical Details**

### **Data Processing**
- Job Count and Load Count are treated as numeric fields
- Invalid values are converted to NaN (missing data)
- Filters work with both integer and decimal values

### **Performance**
- Real-time filtering supported
- Efficient numeric comparisons
- Optimized for large datasets

## 📝 **Usage Tips**

1. **Use ranges** for more precise filtering
2. **Leave fields empty** to ignore that filter
3. **Combine with other filters** for complex searches
4. **Check the summary statistics** to understand your data distribution
5. **Use meaningful filenames** that include your filter criteria

## 🔧 **Compatibility**

- **Desktop App**: ✅ Fully supported
- **Web App**: ✅ Fully supported
- **Bulk Job Checker**: ✅ Available in data processing
- **Excel Export**: ✅ Includes new fields in all exports

---

**Version**: 2.0.0  
**Update Date**: December 2024  
**Features Added**: Job Count and Load Count filtering and export capabilities
