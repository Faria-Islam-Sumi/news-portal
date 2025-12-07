@echo off
echo ====================================
echo    NEWS PORTAL - Starting Servers
echo ====================================
echo.
echo Starting Backend Server...
start "News Portal - Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server...
start "News Portal - Frontend" cmd /k "npm run dev"
echo.
echo ====================================
echo Both servers are starting!
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Two command windows will open.
echo Keep them running while using the app.
echo ====================================
echo.
pause
