@echo off
title Route Optimizer - Clean Start
color 0E
cls

echo.
echo  ============================================================
echo          ROUTE OPTIMIZER - CLEAN REBUILD START            
echo  ============================================================
echo.
echo  This will perform a complete clean rebuild
echo  Use this if you're having any issues
echo.
echo  ============================================================
echo.

REM Change to the optimizer directory
cd /d "%~dp0"

echo [1/6] Stopping any running servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo ✅ Servers stopped

echo.
echo [2/6] Removing old .next build folder...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✅ .next folder removed
) else (
    echo ✅ No .next folder to remove
)

echo.
echo [3/6] Removing node_modules (this may take a minute)...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo ✅ node_modules removed
) else (
    echo ✅ No node_modules to remove
)

echo.
echo [4/6] Installing fresh dependencies...
echo This will take a few minutes, please wait...
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Failed to install dependencies
    echo.
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo [5/6] Starting development server...
echo.

start "Route Optimizer Server" cmd /c "npm run dev & pause"

echo Waiting for server to start (20 seconds)...
timeout /t 20 /nobreak >nul

echo.
echo [6/6] Opening browser...
start http://localhost:3000

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo ✅ ROUTE OPTIMIZER IS NOW RUNNING!
echo.
echo  📍 URL: http://localhost:3000
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Press any key to close this window...
pause >nul

