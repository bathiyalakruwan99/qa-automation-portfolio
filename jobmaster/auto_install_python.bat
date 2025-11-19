@echo off
echo ==========================================
echo    Job Master - Auto Python Installer
echo ==========================================
echo.
echo This script will help you install Python automatically.
echo.

REM Check if Python is already installed
echo Checking for existing Python installation...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python is already installed!
    python --version
    goto :install_deps
)

py --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python is already installed!
    py --version
    goto :install_deps
)

echo.
echo ❌ Python not found. Installing Python...
echo.
echo Opening Microsoft Store to install Python...
echo Please follow these steps:
echo 1. Microsoft Store will open
echo 2. Search for "Python" 
echo 3. Install "Python 3.11" or "Python 3.12"
echo 4. Wait for installation to complete
echo 5. Close Microsoft Store and come back here
echo.
start ms-windows-store://search/?query=Python
echo.
echo Press any key AFTER you have installed Python from Microsoft Store...
pause
echo.

REM Check again after installation
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python installed successfully!
    python --version
    goto :install_deps
)

py --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python installed successfully!
    py --version
    goto :install_deps
)

echo.
echo ❌ Python still not found. Let's try alternative installation...
echo.
echo Downloading Python installer...
powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe' -OutFile 'python-installer.exe'"

if exist python-installer.exe (
    echo Running Python installer...
    echo ⚠️  IMPORTANT: Check "Add Python to PATH" during installation!
    python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    echo.
    echo Installation complete. Cleaning up...
    del python-installer.exe
    echo.
    echo Please restart your computer and run this script again.
    pause
    exit
) else (
    echo ❌ Failed to download Python installer.
    echo Please manually install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation!
    pause
    exit
)

:install_deps
echo.
echo ==========================================
echo    Installing Required Dependencies
echo ==========================================
echo.

REM Try different Python commands
if exist python.exe (
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
) else (
    if exist py.exe (
        py -m pip install --upgrade pip
        py -m pip install -r requirements.txt
    ) else (
        python -m pip install --upgrade pip
        python -m pip install -r requirements.txt
    )
)

echo.
echo ==========================================
echo    Testing Desktop App
echo ==========================================
echo.

REM Create necessary directories
if not exist "file" mkdir file
if not exist "exports" mkdir exports
if not exist "reports" mkdir reports

echo Testing desktop app...
echo.

REM Try to run the desktop app
if exist python.exe (
    python desktop_app.py
) else (
    if exist py.exe (
        py desktop_app.py
    ) else (
        python desktop_app.py
    )
)

echo.
echo Setup complete! You can now run the desktop app using:
echo - desktop_app.bat
echo - run_desktop_app.ps1
echo.
pause 