@echo off
echo ========================================
echo   Esports Arena - Starting Servers
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Install backend dependencies if needed
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)
echo.

REM Start backend in a new window
echo Starting backend server on port 5000...
start "Esports Arena - Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

REM Go back to root directory
cd ..

REM Install frontend dependencies if needed
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)
echo.

REM Start frontend
echo Starting frontend server on port 3000...
echo.
echo ========================================
echo   Servers are starting...
echo   - Backend: http://localhost:5000
echo   - Frontend: http://localhost:3000
echo ========================================
echo.
call npm run dev
