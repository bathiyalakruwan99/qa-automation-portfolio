# 🚀 START HERE - Job Master Data Processor

## ⚠️ Having "Python not found" Error?

**You're not alone! This is the most common issue on Windows. Here's how to fix it:**

### 🔧 Quick Fix (Recommended)

**Step 1: Install Python from Microsoft Store**
1. **Press Windows key + S** and search "Microsoft Store"
2. **Open Microsoft Store**
3. **Search for "Python"**
4. **Install "Python 3.11"** or **"Python 3.12"** (latest version)
5. **Wait for installation** to complete
6. **Try running the app again**

**Step 2: Try the Alternative Scripts**
- **Try**: `run_desktop_app_alt.bat` (smarter script that finds Python)
- **Or**: `run_web_app_alt.bat` (web version)

### 🎯 Multiple Ways to Run the App

#### Option 1: Windows Store Python (Easiest)
1. **Install Python from Microsoft Store** (see above)
2. **Double-click** `run_desktop_app_alt.bat`
3. **Wait for app to start**

#### Option 2: Official Python Website
1. **Go to** https://www.python.org/downloads/
2. **Download and install** Python
3. **⚠️ CRITICAL**: Check **"Add Python to PATH"** during installation
4. **Restart your computer**
5. **Try** `run_desktop_app_alt.bat`

#### Option 3: Web Version (No Installation Required)
1. **Try the web version** instead: `run_web_app_alt.bat`
2. **Works in your browser** - no complex setup needed

#### Option 4: PowerShell Script
1. **Right-click** on `run_desktop_app.ps1`
2. **Select** "Run with PowerShell"
3. **Follow prompts**

#### Option 5: Manual Commands
**Open Command Prompt and type:**
```bash
python --version
```
**If it works:**
```bash
pip install -r requirements.txt
python desktop_app.py
```

### 🔍 Check if Python is Working

**Open Command Prompt** (Win+R, type `cmd`, press Enter):
```bash
python --version
```
**OR**
```bash
py --version
```

**If you see a version number**: ✅ Python is installed correctly
**If you get an error**: ❌ Python needs to be installed

### 📁 What Files to Use

| File | Purpose | When to Use |
|------|---------|-------------|
| `run_desktop_app_alt.bat` | Desktop app with smart Python detection | **Try this first** |
| `run_web_app_alt.bat` | Web app with smart Python detection | If desktop version fails |
| `run_desktop_app.ps1` | PowerShell script with error handling | If batch files don't work |
| `TROUBLESHOOTING.md` | Complete troubleshooting guide | If nothing else works |
| `INSTALL_PYTHON.md` | Step-by-step Python installation | If you need to install Python |

### 🚀 Quick Test

**To test if everything is working:**
1. **Use the sample file**: `file/job-master (9).xlsx`
2. **Upload it** to the app
3. **Click "Process File"**
4. **Try the search and export features**

### 💡 Pro Tips

1. **Web version is often easier** than desktop version
2. **Microsoft Store Python** is the easiest to install
3. **Always restart** your computer after installing Python
4. **Check** that you're in the right folder (contains `desktop_app.py`)

### 🆘 Still Not Working?

**Try these in order:**
1. **Check** `TROUBLESHOOTING.md` for detailed solutions
2. **Try the web version** instead of desktop
3. **Use online Python environments** like Replit.com
4. **Ask someone** with Python installed to help

---

## 📋 What This App Does

✅ **Uploads Excel files** with job data
✅ **Automatically maps columns** to required fields
✅ **Searches by Job ID** or keywords
✅ **Filters and displays** data in tables
✅ **Exports to Excel** and PDF formats
✅ **Generates individual job reports**
✅ **Works on web** and desktop

## 🎯 Your Next Steps

1. **Fix the Python issue** using the guide above
2. **Try the alternative scripts** (`*_alt.bat` files)
3. **Upload your Excel file** and test the features
4. **Check the full documentation** in `README.md`

---

**Remember**: The web version is often easier to get working than the desktop version! 🌐 