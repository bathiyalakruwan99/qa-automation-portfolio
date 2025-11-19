@echo off
echo ======================================
echo    Job Master Data Processor (Web)
echo ======================================
echo.
echo Starting web application...
echo.
echo Folder Structure:
echo   - uploads/     : Uploaded source files
echo   - downloads/   : Search results and exports
echo   - reports/     : Generated reports
echo.
echo Open your browser and go to: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
py -m flask --app app run --host=0.0.0.0 --port=5000 --debug
pause 