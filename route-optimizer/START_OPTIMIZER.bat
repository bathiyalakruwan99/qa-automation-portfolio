@echo off
title Route Optimizer - One Click Launcher
color 0A
cls

echo.
echo  ============================================================
echo            ROUTE OPTIMIZER - ONE CLICK LAUNCHER            
echo  ============================================================
echo.
echo  Starting your Route Optimizer application...
echo.
echo  ============================================================
echo.

REM Change to the optimizer directory
cd /d "%~dp0"

echo [1/5] Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo [2/5] Ensuring port 3000 is available...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo ⚠️  Port 3000 is in use. Stopping process %%a...
    taskkill /F /PID %%a >nul 2>&1
)
echo ✅ Port 3000 is ready

echo.
echo [3/5] Cleaning previous build...
if exist ".next" (
    echo Removing old .next folder...
    rmdir /s /q ".next" 2>nul
)
echo ✅ Clean workspace ready

echo.
echo [4/5] Checking npm dependencies...
if not exist "node_modules\" (
    echo ⚠️  Dependencies not installed. Installing now...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ❌ ERROR: Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
)
echo ✅ Dependencies ready

echo.
echo [5/5] Starting development server on port 3000...
echo.
echo ════════════════════════════════════════════════════════════
echo.

REM Start the dev server in a new window
start "Route Optimizer Server" /MIN cmd /c "npm run dev & pause"

echo Waiting for server to initialize (15 seconds)...
timeout /t 15 /nobreak >nul

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Opening Route Optimizer in your browser...
echo.

REM Open browser on port 3000 only
start http://localhost:3000

timeout /t 2 /nobreak >nul

echo.
echo ✅ ROUTE OPTIMIZER IS NOW RUNNING!
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo  📍 Application URL:  http://localhost:3000
echo  🗺️  Features:         Route optimization with TSP algorithm
echo  🚀 Start/End:        Select custom start and end locations
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo  ℹ️  INSTRUCTIONS:
echo     - The application is running on port 3000
echo     - Access it at: http://localhost:3000
echo     - Server window is minimized in taskbar
echo.
echo  🛑 TO STOP THE SERVER:
echo     - Close the "Route Optimizer Server" window, or
echo     - Run STOP_OPTIMIZER.bat, or
echo     - Press Ctrl+C in the server window
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Press any key to close this launcher (server keeps running)...
pause >nul
