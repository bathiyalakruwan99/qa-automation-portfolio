@echo off
echo ==========================================
echo    Job Master Data Processor (Desktop)
echo ==========================================
echo.
echo Folder Structure:
echo   - file/        : Your original Excel files
echo   - exports/     : Desktop app exports and reports
echo   - reports/     : Generated reports and summaries
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
python --version
echo.

REM Check if required files exist
if not exist "desktop_app.py" (
    echo ❌ desktop_app.py not found!
    echo Please make sure you're in the correct directory.
    pause
    exit /b 1
)

echo ✓ desktop_app.py found
echo.

REM Check if dependencies are installed
echo Checking dependencies...
python -c "import pandas, openpyxl, tkinter" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Required packages not installed!
    echo Installing packages...
    python -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo ❌ Failed to install packages!
        pause
        exit /b 1
    )
)

echo ✓ All dependencies are available
echo.

REM Create directories if they don't exist
if not exist "file" mkdir file
if not exist "exports" mkdir exports
if not exist "reports" mkdir reports
if not exist "downloads" mkdir downloads

echo ✓ Directories are ready
echo.

echo Starting desktop application...
echo ✓ If the app doesn't appear, check if it's running in the background
echo ✓ Look for the Job Master window in your taskbar
echo.

REM Start the desktop app
python desktop_app.py

REM Check if the app exited with an error
if %errorlevel% neq 0 (
    echo ❌ Desktop app exited with an error!
    echo Please check the error messages above.
) else (
    echo ✓ Desktop app closed successfully.
)

echo.
echo Press any key to exit...
pause >nul 