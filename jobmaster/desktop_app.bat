@echo off
cd /d "%~dp0"
echo ==========================================
echo    Job Master Data Processor (Desktop)
echo ==========================================
echo.
echo Folder Structure:
echo   - data/input/   : Your Excel files
echo   - data/exports/ : Exports and reports
echo   - data/reports/ : Generated reports
echo.
echo Starting desktop application...
echo.
python desktop_app.py
pause 