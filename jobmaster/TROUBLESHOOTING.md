# Troubleshooting Guide

## 🔧 Python Installation Issues

### ❌ "Python was not found" Error

**This is the most common issue on Windows. Here are the solutions:**

#### Solution 1: Install Python from Microsoft Store (Easiest)
1. **Open Microsoft Store** (Windows key + S, search "Microsoft Store")
2. **Search for "Python"**
3. **Install Python 3.11** or **Python 3.12** (latest versions)
4. **Wait for installation** to complete
5. **Try running the app again**

#### Solution 2: Install Python from Official Website
1. **Go to** https://www.python.org/downloads/
2. **Download** the latest Python version
3. **Run the installer**
4. **⚠️ CRITICAL**: Check **"Add Python to PATH"** box during installation
5. **Complete installation**
6. **Restart your computer**
7. **Try running the app again**

#### Solution 3: Use Alternative Scripts
Instead of the regular batch files, try these:
- `run_desktop_app_alt.bat` - Tries multiple Python commands
- `run_desktop_app.ps1` - PowerShell script with better error handling

#### Solution 4: Check Python Installation
**Open Command Prompt** (Win+R, type `cmd`, press Enter):
```bash
python --version
```
or
```bash
py --version
```

**If you see a version number**: Python is installed
**If you get an error**: Python is not installed or not in PATH

## 🔍 Common Error Messages & Solutions

### "pip is not recognized"
**Solution**: Use the full path to pip:
```bash
python -m pip install -r requirements.txt
```

### "Permission denied" or "Access denied"
**Solution**: Install packages for your user only:
```bash
python -m pip install --user -r requirements.txt
```

### "Module not found" errors
**Solution**: Dependencies not installed properly:
```bash
pip install streamlit pandas openpyxl reportlab pillow
```

### "Cannot find file" errors
**Solution**: Make sure you're in the correct directory:
1. **Navigate** to the folder containing the app files
2. **Check** that `desktop_app.py` and `requirements.txt` exist
3. **Run** the scripts from this folder

## 🚀 Alternative Methods

### Method 1: Use Online Python Environment
1. **Go to** https://replit.com/
2. **Create new Python project**
3. **Upload** your files
4. **Run** the web version online

### Method 2: Use Anaconda (For Advanced Users)
1. **Download** Anaconda from https://www.anaconda.com/
2. **Install** Anaconda
3. **Open** Anaconda Prompt
4. **Navigate** to your app folder
5. **Run** `pip install -r requirements.txt`
6. **Run** `python desktop_app.py`

### Method 3: Use WinPython (Portable)
1. **Download** WinPython from https://winpython.github.io/
2. **Extract** to any folder
3. **Use** the included command prompt
4. **Run** your app from there

## 🐛 Application-Specific Issues

### Excel File Not Loading
**Possible causes:**
- File is corrupted
- File is password protected
- File format not supported
- File is too large

**Solutions:**
1. **Try** a different Excel file
2. **Save** your file as `.xlsx` format
3. **Remove** password protection
4. **Check** file size (< 100MB recommended)

### Export Not Working
**Possible causes:**
- No write permissions
- Insufficient disk space
- Antivirus blocking file creation

**Solutions:**
1. **Run** as administrator
2. **Check** disk space
3. **Try** saving to a different location
4. **Temporarily disable** antivirus

### Application Crashes
**Possible causes:**
- Insufficient memory
- Corrupted Excel file
- Missing dependencies

**Solutions:**
1. **Close** other applications
2. **Try** a smaller Excel file
3. **Reinstall** dependencies:
   ```bash
   pip uninstall -r requirements.txt -y
   pip install -r requirements.txt
   ```

## 📋 Step-by-Step Python Installation (Detailed)

### For Windows 10/11:
1. **Open** your web browser
2. **Go to** https://www.python.org/downloads/
3. **Click** "Download Python 3.x.x" (latest version)
4. **Run** the downloaded installer
5. **On first screen**: ✅ **Check "Add Python to PATH"**
6. **Click** "Install Now"
7. **Wait** for installation to complete
8. **Click** "Close"
9. **Restart** your computer
10. **Test** by opening Command Prompt and typing: `python --version`

### Verification Steps:
**Open Command Prompt** (Win+R, type `cmd`, press Enter):
```bash
python --version
pip --version
```

Both commands should show version numbers.

## 🆘 Still Having Issues?

### Quick Diagnostics:
1. **What's your Windows version?** (Win+R, type `winver`)
2. **Is Python installed?** (Open cmd, type `python --version`)
3. **Are you in the right folder?** (Check for `desktop_app.py` file)
4. **Are you running as administrator?** (Right-click → "Run as administrator")

### Last Resort Options:
1. **Try the web version** instead of desktop version
2. **Use online Python environments** like Replit or Google Colab
3. **Ask someone** with Python already installed to help
4. **Use a different computer** with Python pre-installed

## 📞 Common Solutions Summary

| Problem | Quick Fix |
|---------|-----------|
| Python not found | Install from Microsoft Store |
| Permission denied | Use `--user` flag with pip |
| Module not found | Run `pip install -r requirements.txt` |
| File not found | Check you're in correct directory |
| App won't start | Try alternative batch files |
| Excel won't load | Check file format and size |
| Export fails | Try different save location |

---

**Remember**: The web version (`run_web_app.bat`) is often easier to get working than the desktop version! 