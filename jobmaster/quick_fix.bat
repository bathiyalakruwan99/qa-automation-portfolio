@echo off
echo ==========================================
echo    Job Master - Quick Fix
echo ==========================================
echo.
echo This will install Python and get your desktop app working.
echo.

REM Check if Python is already installed
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python is already installed!
    goto :install_deps
)

py --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python is already installed!
    goto :install_deps
)

echo Installing Python...
echo.
echo Method 1: Trying Microsoft Store installation...
start ms-windows-store://pdp/?productid=9NCVDN91XZQP
echo.
echo Please install Python from Microsoft Store that just opened.
echo After installation, close the store and press any key here...
pause

REM Check again
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python installed successfully!
    goto :install_deps
)

py --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python installed successfully!
    goto :install_deps
)

echo.
echo Method 2: Direct download installation...
echo Downloading Python installer...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe' -OutFile 'python-installer.exe' -UseBasicParsing}"

if exist python-installer.exe (
    echo Installing Python silently...
    python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    timeout /t 30 /nobreak >nul
    del python-installer.exe
    echo.
    echo Python installation complete!
) else (
    echo Failed to download. Please manually install Python from:
    echo https://www.python.org/downloads/
    pause
    exit
)

:install_deps
echo.
echo Creating necessary directories...
if not exist "file" mkdir file
if not exist "exports" mkdir exports
if not exist "reports" mkdir reports

echo.
echo Installing required packages...
python -m pip install --upgrade pip >nul 2>&1
python -m pip install pandas openpyxl flask werkzeug >nul 2>&1

if %errorlevel% neq 0 (
    py -m pip install --upgrade pip >nul 2>&1
    py -m pip install pandas openpyxl flask werkzeug >nul 2>&1
)

echo.
echo ==========================================
echo    Starting Desktop App
echo ==========================================
echo.

REM Try to run the desktop app
python desktop_app.py >nul 2>&1
if %errorlevel% neq 0 (
    py desktop_app.py >nul 2>&1
)

echo.
echo If the app didn't start, run: desktop_app.bat
pause 