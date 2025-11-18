@echo off
title Fix Server and Open Route Optimizer
color 0B

echo.
echo  ========================================
echo  🔧  FIXING SERVER AND OPENING APP  🔧
echo  ========================================
echo.

echo Step 1: Stopping any running servers...
taskkill /f /im node.exe 2>nul

echo Step 2: Cleaning build cache...
if exist .next rmdir /s /q .next 2>nul

echo Step 3: Reinstalling dependencies...
call npm install

echo Step 4: Starting development server...
start /B npm run dev

echo Step 5: Waiting for server to start...
timeout /t 8 /nobreak >nul

echo Step 6: Opening Route Optimizer...
start http://localhost:3000

echo.
echo ✅ Server should be running on http://localhost:3000
echo ✅ If you see errors, use the simple HTML version instead
echo.
echo Press any key to close this window...
pause >nul
