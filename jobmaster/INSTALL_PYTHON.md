# Installing Python on Windows

## 🔧 Quick Fix Options

### Option 1: Install Python from Microsoft Store (Easiest)
1. **Open Microsoft Store** (search "Microsoft Store" in Start menu)
2. **Search for "Python"**
3. **Install "Python 3.11"** or **"Python 3.12"** (latest stable version)
4. **Wait for installation** to complete
5. **Try running the app again**

### Option 2: Install Python from Official Website
1. **Go to** https://www.python.org/downloads/
2. **Click "Download Python 3.x.x"** (latest version)
3. **Run the installer**
4. **IMPORTANT**: Check "Add Python to PATH" during installation
5. **Complete installation**
6. **Restart your computer**
7. **Try running the app again**

### Option 3: Use Python Launcher (If Python is installed but not in PATH)
1. **Edit** `run_desktop_app.bat`
2. **Replace** `python desktop_app.py` with `py desktop_app.py`
3. **Save and run** the batch file again

## 🔍 Check if Python is Working

**Open Command Prompt** (Win+R, type `cmd`, press Enter) and run:
```bash
python --version
```

**If it shows version number**: Python is installed correctly
**If it shows error**: Python needs to be installed or added to PATH

## 🚀 Alternative: Run Without Installation

If you don't want to install Python system-wide, you can use:

### Option A: Portable Python
1. Download **WinPython** from https://winpython.github.io/
2. Extract to a folder (e.g., `C:\WinPython`)
3. Use the included command prompt to run the app

### Option B: Use Online Python Environment
1. Go to https://replit.com/ or https://colab.research.google.com/
2. Upload your files
3. Run the web version online

## 🔧 Troubleshooting

### If you get "pip not found" error:
```bash
python -m pip install -r requirements.txt
```

### If you get permission errors:
```bash
python -m pip install --user -r requirements.txt
```

### If nothing works:
1. **Download and install** Python from https://www.python.org/downloads/
2. **Check "Add Python to PATH"** during installation
3. **Restart your computer**
4. **Try again**

---
**Need immediate help?** Try the web version instead - it might work with online Python environments! 