#!/bin/bash

echo "Starting DocToMarkdown Services..."

echo ""
echo "Starting Backend (FastAPI)..."
cd backend/doctomd_service
python main.py &
BACKEND_PID=$!

echo ""
echo "Waiting 3 seconds for backend to start..."
sleep 3

echo ""
echo "Starting Frontend (Next.js)..."
cd ../../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both services are starting..."
echo "Backend: http://127.0.0.1:8000"
echo "Frontend: http://127.0.0.1:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user interrupt
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait