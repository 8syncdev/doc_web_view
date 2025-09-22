# Cài đặt Tesseract OCR

Để sử dụng tính năng OCR (Optical Character Recognition) cho việc chuyển đổi hình ảnh sang text, bạn cần cài đặt Tesseract OCR.

## Windows

### Cách 1: Sử dụng Chocolatey (Khuyến nghị)
```bash
# Cài đặt Chocolatey nếu chưa có
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Cài đặt Tesseract
choco install tesseract
```

### Cách 2: Download trực tiếp
1. Truy cập: https://github.com/UB-Mannheim/tesseract/wiki
2. Download file `.exe` phù hợp với Windows của bạn
3. Cài đặt và thêm vào PATH

### Cách 3: Sử dụng conda
```bash
conda install -c conda-forge tesseract
```

## Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install tesseract-ocr
sudo apt install tesseract-ocr-vie  # Cho tiếng Việt (tùy chọn)
```

## macOS

```bash
# Sử dụng Homebrew
brew install tesseract

# Hoặc sử dụng MacPorts
sudo port install tesseract4
```

## Kiểm tra cài đặt

Sau khi cài đặt, kiểm tra bằng lệnh:

```bash
tesseract --version
```

## Cấu hình trong Python

Nếu bạn muốn sử dụng OCR trong Python, cài đặt thêm:

```bash
pip install pytesseract
```

## Lưu ý

- Tesseract OCR chỉ cần thiết khi chuyển đổi hình ảnh có chứa text
- Nếu không cài đặt, ứng dụng vẫn hoạt động bình thường nhưng sẽ không thể OCR text từ hình ảnh
- Để có kết quả tốt nhất, sử dụng hình ảnh có độ phân giải cao và text rõ ràng
