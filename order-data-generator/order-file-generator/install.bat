@echo off
echo ========================================
echo Order File Generator - Package Installer
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

echo Installing required packages...
echo.
python -m pip install --upgrade pip
pip install pandas numpy openpyxl xlsxwriter

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo To run the application, double-click run.bat
echo.
pause

