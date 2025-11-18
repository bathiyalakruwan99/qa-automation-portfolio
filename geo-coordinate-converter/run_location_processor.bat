@echo off
title Location Data Processor
echo ========================================
echo    Location Data Processor
echo ========================================
echo.
echo Checking for Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher from python.org
    pause
    exit /b 1
)

echo Python found!
echo.
echo Checking for required packages...
python -c "import pandas" >nul 2>&1
if errorlevel 1 (
    echo Installing required packages...
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
) else (
    echo Required packages already installed.
)

echo.
echo Starting Location Processor...
echo.
python location_processor.py

if errorlevel 1 (
    echo.
    echo ERROR: Application closed with an error
    pause
) else (
    echo.
    echo Application closed successfully
)

