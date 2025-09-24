#!/bin/bash

echo "🌐 Starting Web Face Tracker..."
echo "==============================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Navigate to js directory
cd js

echo "🚀 Starting web server..."
echo "Features:"
echo "- Real face detection with MediaPipe"
echo "- Red bounding boxes around detected faces"
echo "- Persistent Turkish adjectives above each face"
echo "- Same person keeps same label until they leave"
echo ""
echo "Open your browser and go to:"
echo "http://localhost:8000/real-face-detection.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo "==============================="

# Start web server
python3 -m http.server 8000
