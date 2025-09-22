#!/bin/bash

echo "Installing Tesseract OCR for Linux/Mac..."

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detected Linux"
    
    # Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        echo "Installing via apt-get..."
        sudo apt-get update
        sudo apt-get install -y tesseract-ocr tesseract-ocr-eng
    # CentOS/RHEL
    elif command -v yum &> /dev/null; then
        echo "Installing via yum..."
        sudo yum install -y tesseract
    # Arch Linux
    elif command -v pacman &> /dev/null; then
        echo "Installing via pacman..."
        sudo pacman -S tesseract
    else
        echo "Please install Tesseract manually for your Linux distribution"
    fi
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detected macOS"
    
    # Check if Homebrew is installed
    if command -v brew &> /dev/null; then
        echo "Installing via Homebrew..."
        brew install tesseract
    else
        echo "Please install Homebrew first: https://brew.sh/"
        echo "Then run: brew install tesseract"
    fi
else
    echo "Unsupported OS. Please install Tesseract manually."
fi

echo ""
echo "After installation, verify with:"
echo "tesseract --version"

echo ""
echo "For Python integration, also install:"
echo "pip install pytesseract"
