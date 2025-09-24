#!/bin/bash

echo "🐍 Starting Python Face Tracker..."
echo "================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Navigate to python directory
cd python

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Install dependencies in virtual environment
echo "📥 Installing dependencies in virtual environment..."
venv/bin/pip install opencv-python numpy pillow psutil

# Check if camera is available
echo "📷 Checking camera availability..."
venv/bin/python -c "import cv2; cap = cv2.VideoCapture(0); print('Camera available:', cap.isOpened()); cap.release()"

echo ""
echo "🚀 Starting Face Tracker..."
echo "Features:"
echo "- Red bounding boxes around detected faces"
echo "- Persistent Turkish adjectives above each face"
echo "- Same person keeps same label until they leave"
echo "- 6-hour continuous operation"
echo ""
echo "Press 'q' to quit anytime"
echo "================================="

# Run the face tracker with virtual environment
venv/bin/python face_tracker.py
