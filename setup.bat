@echo off
echo ========================================
echo IT Documentation Portal - Setup Script
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Step 2: Creating uploads directory...
if not exist "uploads" mkdir uploads
echo Uploads directory created!
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run 'npm start' in the backend folder
echo 3. Create admin user using MongoDB shell (see README.md)
echo 4. Open frontend/login.html in your browser
echo.
pause
