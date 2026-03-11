@echo off
echo ==========================================
echo    Job Master Git Setup (Automated)
echo ==========================================

:: Add Git to PATH for this session
set "PATH=%PATH%;C:\Program Files\Git\bin"

:: Check if Git is available
echo Checking Git installation...
git --version
if %errorlevel% neq 0 (
    echo Error: Git not found!
    pause
    exit /b 1
)

echo.
echo Setting up Git repository...

:: Initialize repository
git init

:: Configure Git with default values
echo Configuring Git user...
git config --global user.name "bathiyalakruwan99"
git config --global user.email "bathiyalakruwan99@example.com"

:: Add all files
echo Adding files to repository...
git add .

:: Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: Job Master Data Processor

Features:
- Flask web application with real-time search
- Tkinter desktop GUI with advanced filtering  
- Excel data processing and smart exports
- Multi-column search and data visualization
- File organization with meaningful naming
- Python 3.7+ compatibility
- Fixed pandas warnings and regex errors"

echo.
echo ==========================================
echo Repository initialized successfully!
echo.
echo Next Steps:
echo 1. Go to GitHub.com and create a new repository called 'jobmaster'
echo 2. Run these commands:
echo    git remote add origin https://github.com/bathiyalakruwan99/jobmaster.git
echo    git branch -M main  
echo    git push -u origin main
echo.
echo Or use GitHub Desktop to publish the repository.
echo ==========================================

pause 