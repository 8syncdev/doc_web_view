@echo off
echo Starting DocToMarkdown Services...

echo.
echo Starting Backend (FastAPI)...
start "Backend" cmd /k "cd backend\doctomd_service && python main.py"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend (Next.js)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:3000
echo.
echo Press any key to exit...
pause > nul