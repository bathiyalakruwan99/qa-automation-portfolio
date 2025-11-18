# 📄 CSV Upload Format Guide

## ✅ Supported Format

The Route Optimizer accepts **simple CSV/TXT files** with **one location per line**.

## 📋 Basic Format

### Simple Format (One Location Per Line)
```
Location 1
Location 2
Location 3
Location 4
```

### With Addresses
```
123 Main St, New York, NY
456 Park Ave, Los Angeles, CA
789 Oak Rd, Chicago, IL
```

### With Coordinates
```
40.7128,-74.0060
34.0522,-118.2437
41.8781,-87.6298
```

### Mixed Format (Recommended)
```
New York Office, 40.7128,-74.0060
Los Angeles Branch
Chicago Warehouse, 41.8781,-87.6298
San Francisco HQ
```

## 📝 Format Rules

### ✅ SUPPORTED:
- **One location per line**
- **Plain addresses** (will be geocoded)
- **Coordinates** in format: `latitude,longitude`
- **Mixed text and coordinates**
- **Empty lines** (will be ignored)
- **No header row needed**

### ❌ NOT SUPPORTED:
- Multiple columns with headers
- Semicolon or tab-separated values
- Complex CSV with metadata
- Multiple locations on same line

## 🎯 Examples

### Example 1: Simple Addresses
```csv
Colombo, Sri Lanka
Kandy, Sri Lanka
Galle, Sri Lanka
Anuradhapura, Sri Lanka
Trincomalee, Sri Lanka
```

### Example 2: Coordinates Only
```csv
6.9271,79.8612
7.2906,80.6337
6.0329,80.2170
8.3114,80.4037
8.5874,81.2152
```

### Example 3: Named Locations with Coordinates
```csv
Warehouse A, 6.9271,79.8612
Store B, 7.2906,80.6337
Office C, 6.0329,80.2170
```

### Example 4: Business Locations
```csv
Customer 1 - 123 Main Street, City A
Customer 2 - 456 Park Avenue, City B
Customer 3 - 789 Oak Road, City C
Warehouse - 321 Industrial Blvd, City D
```

## 📂 How to Create CSV File

### Option 1: Excel/Google Sheets
1. Create a spreadsheet with one column
2. Put one location per row
3. Save As → CSV (Comma delimited)

### Option 2: Text Editor (Notepad)
1. Open Notepad
2. Type one location per line
3. Save with `.csv` or `.txt` extension

### Option 3: From Existing Data
1. Copy your list of addresses
2. Paste into Notepad
3. Ensure one address per line
4. Save as `.csv` or `.txt`

## 🚀 How to Upload

1. Click **"Import CSV"** button in the Route Optimizer
2. Select your CSV or TXT file
3. Locations will be added to the list
4. Addresses will be geocoded automatically when you optimize

## 💡 Tips for Best Results

### ✅ DO:
- Keep addresses clear and complete
- Include city/state/country for better geocoding
- Use coordinates when available for accuracy
- Test with a small file first

### ❌ DON'T:
- Don't use complex CSV formats
- Don't include headers or column names
- Don't put multiple addresses per line
- Don't use special characters that might break

## 📊 Sample CSV Files

### sample-locations.csv
```csv
New York City, USA
Los Angeles, USA
Chicago, USA
Houston, USA
Phoenix, USA
```

### sample-coordinates.csv
```csv
40.7128,-74.0060
34.0522,-118.2437
41.8781,-87.6298
29.7604,-95.3698
33.4484,-112.0740
```

### sample-delivery-route.csv
```csv
Distribution Center - 123 Warehouse Dr
Customer A - 456 Main St
Customer B - 789 Park Ave
Customer C - 321 Oak Rd
Customer D - 654 Elm St
Return to Distribution Center - 123 Warehouse Dr
```

## 🔧 Troubleshooting

### Problem: "No locations added"
**Solution:** 
- Check file has content
- Ensure one location per line
- Verify no special characters

### Problem: "Geocoding failed"
**Solution:**
- Make addresses more specific
- Include city and country
- Use coordinates instead
- Try shorter address format

### Problem: "Invalid format"
**Solution:**
- Remove headers if any
- Use simple text format
- Check file encoding (UTF-8)
- Resave as plain CSV

## 🎓 Quick Example Workflow

1. **Create file:** `my-route.csv`
```
Office Building, 1234 Start St
Client A, 5678 North Ave
Client B, 9012 South Blvd
Client C, 3456 East Rd
Warehouse, 7890 End Lane
```

2. **Upload file:**
   - Click "Import CSV"
   - Select `my-route.csv`

3. **Set route options:**
   - Select "Office Building" as START (green)
   - Select "Warehouse" as END (red)

4. **Optimize:**
   - Click "Optimize Route"
   - Get best route: Office → optimized visits → Warehouse

## 📁 File Extensions

Both work equally:
- `.csv` - Standard CSV format
- `.txt` - Plain text format

## 🌍 International Addresses

The system supports addresses worldwide:

```csv
Tokyo Tower, Tokyo, Japan
Eiffel Tower, Paris, France
Big Ben, London, UK
Statue of Liberty, New York, USA
Sydney Opera House, Sydney, Australia
```

## 💾 Current Implementation

The system:
1. Reads each line as a separate location
2. Trims whitespace
3. Ignores empty lines
4. Adds each location to the optimizer
5. Geocodes addresses when you click "Optimize"

---

## ✨ Summary

**Keep it simple:**
- One location per line
- No headers
- Plain text
- Save as .csv or .txt

**That's it!** 🎉

---

Need help? Check the demo files at:
`D:\ordermanger optimizer check\optimizer\location demo file\`

Or just type your locations in the app one by one! 📍

