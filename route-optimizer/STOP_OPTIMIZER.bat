@echo off
title Stop Route Optimizer
color 0C
cls

echo.
echo  ============================================================
echo              STOPPING ROUTE OPTIMIZER SERVER
echo  ============================================================
echo.

REM Kill all Node.js processes running on port 3000
echo Stopping server on port 3000...
echo.

REM Find and kill processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping process %%a...
    taskkill /F /PID %%a >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Process %%a stopped
    )
)

REM Also kill any running npm/node processes with "Route Optimizer" in title
taskkill /FI "WINDOWTITLE eq Route Optimizer Server*" /F >nul 2>&1

echo.
echo ✅ Route Optimizer server stopped!
echo.
echo Port 3000 is now available.
echo.
echo Press any key to exit...
pause >nul
