@echo off
echo ==========================================
echo      Bulk Job Checker - GPS, Payment & Invoice Status
echo ==========================================
echo.
echo This tool checks multiple job IDs for:
echo   - GPS Execution status
echo   - Payment Schedule status  
echo   - Invoice Status
echo.
echo Instructions:
echo   1. Load main data Excel file
echo   2. Enter job IDs to check (one per line)
echo   3. Click "Check Job Status"
echo   4. Export results to Excel
echo.

REM Check if Python is available
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install Python first.
    echo Try running: auto_install_python.bat
    pause
    exit /b 1
)

echo ✓ Python is available
echo.

REM Check if required files exist
if not exist "bulk_job_checker.py" (
    echo ❌ bulk_job_checker.py not found!
    echo Please make sure you're in the correct directory.
    pause
    exit /b 1
)

echo ✓ bulk_job_checker.py found
echo.

REM Check if dependencies are installed
echo Checking dependencies...
python -c "import pandas, tkinter" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Required packages not installed!
    echo Installing packages...
    python -m pip install pandas openpyxl
    if %errorlevel% neq 0 (
        echo ❌ Failed to install packages!
        pause
        exit /b 1
    )
)

echo ✓ All dependencies are available
echo.

REM Create directories if they don't exist
if not exist "exports" mkdir exports
if not exist "reports" mkdir reports

echo ✓ Directories are ready
echo.

echo Starting Bulk Job Checker...
echo ✓ Look for the "Bulk Job Checker" window
echo.

REM Start the app
python bulk_job_checker.py

REM Check if the app exited with an error
if %errorlevel% neq 0 (
    echo ❌ Bulk Job Checker exited with an error!
    echo Please check the error messages above.
) else (
    echo ✓ Bulk Job Checker closed successfully.
)

echo.
echo Press any key to exit...
pause >nul 