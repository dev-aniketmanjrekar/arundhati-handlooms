@echo off
echo ===============================================
echo   Fixing Vite Cache Issue
echo ===============================================
echo.

echo [1/3] Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/3] Clearing Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✅ Vite cache cleared
) else (
    echo ⚠️  No Vite cache found
)

echo [3/3] Starting frontend with clean cache...
npm run dev

pause
