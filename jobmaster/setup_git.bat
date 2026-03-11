@echo off
echo ==========================================
echo    Job Master Git Setup
echo ==========================================

:: Add Git to PATH for this session
set "PATH=%PATH%;C:\Program Files\Git\bin"

:: Check if Git is available
echo Checking Git installation...
git --version
if %errorlevel% neq 0 (
    echo Error: Git not found! Please restart your computer after Git installation.
    echo Alternative: Use GitHub Desktop instead.
    pause
    exit /b 1
)

echo.
echo Setting up Git repository...

:: Initialize repository
git init

:: Configure Git (you can change these)
echo Configuring Git user...
set /p username="Enter your GitHub username (bathiyalakruwan99): "
if "%username%"=="" set username=bathiyalakruwan99

set /p email="Enter your email address: "
if "%email%"=="" set email=your.email@example.com

git config --global user.name "%username%"
git config --global user.email "%email%"

:: Add all files
echo Adding files to repository...
git add .

:: Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: Job Master Data Processor - Flask web app with Tkinter desktop app, Excel processing, advanced search and filtering capabilities"

:: Add remote repository
echo.
echo ==========================================
echo Next steps:
echo 1. Create a repository on GitHub called 'jobmaster'
echo 2. Copy the repository URL
echo 3. Run: git remote add origin [YOUR_REPO_URL]
echo 4. Run: git push -u origin main
echo ==========================================
echo.
echo Repository initialized successfully!
echo Your files are ready to be pushed to GitHub.

pause 