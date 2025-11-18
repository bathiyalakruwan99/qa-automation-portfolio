@echo off
echo ========================================
echo Order File Generator - Launcher
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

echo Starting Order File Generator...
echo.

REM Run the application
python src/app.py

REM Keep window open if there's an error
if errorlevel 1 (
    echo.
    echo ========================================
    echo Error occurred!
    echo ========================================
    echo.
    echo If you see "ModuleNotFoundError", you need to install packages:
    echo   Run: install.bat
    echo   Or manually: pip install pandas numpy openpyxl xlsxwriter
    echo.
    pause
)

