#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Start the FastAPI server
echo "🚀 Starting TODO Web Application..."
echo "📍 Server will run at: http://localhost:8000"
echo "📚 API docs available at: http://localhost:8000/docs"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000
