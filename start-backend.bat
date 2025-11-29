@echo off
echo ===============================================
echo   Starting Arundhati Handlooms Local Server
echo ===============================================
echo.

echo [1/2] Stopping any existing servers on port 5000...
netstat -ano | findstr :5000 > nul
if %errorlevel% == 0 (
    echo Found process on port 5000, stopping it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %%a 2>nul
    timeout /t 2 >nul
) else (
    echo Port 5000 is free
)

echo.
echo [2/2] Starting backend server...
cd server
start "Arundhati Backend" cmd /k "npm start"

echo.
echo ✅ Backend started on http://localhost:5000
echo.
echo Now open a NEW terminal and run:
echo   npm run dev
echo.
echo Press any key to exit...
pause >nul
