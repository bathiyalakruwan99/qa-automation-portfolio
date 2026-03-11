Write-Host "Starting Job Master Data Processor (Desktop Application)" -ForegroundColor Green
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Try to find Python
$pythonCmd = $null

Write-Host "Searching for Python installation..." -ForegroundColor Yellow

if (Test-Command "python3") {
    $pythonCmd = "python3"
    Write-Host "Found python3" -ForegroundColor Green
} elseif (Test-Command "py") {
    $pythonCmd = "py"
    Write-Host "Found py (Python Launcher)" -ForegroundColor Green
} elseif (Test-Command "python") {
    $pythonCmd = "python"
    Write-Host "Found python" -ForegroundColor Green
} else {
    Write-Host "❌ Python not found on your system!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Python first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://www.python.org/downloads/" -ForegroundColor White
    Write-Host "2. Download and install Python 3.8 or newer" -ForegroundColor White
    Write-Host "3. Make sure to check 'Add Python to PATH' during installation" -ForegroundColor White
    Write-Host "4. Restart your computer" -ForegroundColor White
    Write-Host "5. Try running this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternatively:" -ForegroundColor Yellow
    Write-Host "- Install Python from Microsoft Store" -ForegroundColor White
    Write-Host "- Check INSTALL_PYTHON.md for detailed instructions" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "Installing/updating dependencies..." -ForegroundColor Yellow
try {
    & $pythonCmd -m pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies. Trying with --user flag..." -ForegroundColor Yellow
        & $pythonCmd -m pip install --user -r requirements.txt
    }
} catch {
    Write-Host "Error installing dependencies: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Start the application
Write-Host "Starting desktop application..." -ForegroundColor Green
try {
    & $pythonCmd desktop_app.py
} catch {
    Write-Host "Error starting application: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit" 