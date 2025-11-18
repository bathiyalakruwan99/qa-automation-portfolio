@echo off
title Route Optimizer Server
color 0A
cls

echo.
echo  ============================================================
echo            ROUTE OPTIMIZER - QUICK START            
echo  ============================================================
echo.

REM Change to the optimizer directory
cd /d "%~dp0"

echo Ensuring port 3000 is available...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Cleaning previous build...
if exist ".next" rmdir /s /q ".next" 2>nul

echo.
echo Starting development server on port 3000...
echo.

REM Start the dev server
call npm run dev

echo.
echo Server stopped.
pause
