@echo off
cd /d "%~dp0"
echo ======================================
echo    Job Master Data Processor (Web)
echo ======================================
echo.
echo Folder Structure:
echo   - data/uploads/   : Uploaded source files
echo   - data/downloads/ : Search results and exports
echo   - data/reports/   : Generated reports
echo.
echo Open your browser: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
py -m flask --app app run --host=0.0.0.0 --port=5000 --debug
pause 