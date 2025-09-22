@echo off
echo Installing Tesseract OCR for Windows...

echo.
echo Method 1: Using Chocolatey (Recommended)
echo If you have Chocolatey installed, run:
echo choco install tesseract

echo.
echo Method 2: Manual Installation
echo 1. Download Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
echo 2. Install to default location: C:\Program Files\Tesseract-OCR
echo 3. Add to PATH: C:\Program Files\Tesseract-OCR

echo.
echo Method 3: Using pip (Alternative)
echo pip install pytesseract

echo.
echo After installation, restart your terminal and run:
echo tesseract --version

echo.
echo Press any key to continue...
pause > nul
