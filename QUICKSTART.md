# 🚀 Quick Start Guide

Hướng dẫn cài đặt và chạy ứng dụng DocToMarkdown trong 5 phút.

## 📋 Yêu cầu

- Python 3.12+
- Node.js 18+
- OpenAI API Key (tùy chọn, để có chất lượng tốt hơn)

## ⚡ Cài đặt nhanh

### 1. Backend Setup

```bash
# Di chuyển vào thư mục backend
cd backend/doctomd_service

# Cài đặt dependencies
uv sync

# Tạo file .env với Mistral API key
echo "MISTRAL_API_KEY=your_mistral_api_key_here" > .env
echo "MISTRAL_MODEL=mistral-large-latest" >> .env
echo "HOST=0.0.0.0" >> .env
echo "PORT=8000" >> .env
echo "DEBUG=True" >> .env

# Chạy backend
python main.py
```

### 2. Frontend Setup (Next.js 15)

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy frontend với Turbopack (nhanh hơn)
npm run dev

# Hoặc chạy với type checking
npm run type-check
```

### 3. Truy cập ứng dụng

- **Frontend**: http://127.0.0.1:3000
- **Backend API**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs

## 🚀 Khởi động nhanh với script

### Windows
```bash
start-dev.bat
```

### Linux/Mac
```bash
chmod +x start-dev.sh
./start-dev.sh
```

Script sẽ tự động khởi động cả backend và frontend.

## 🎯 Sử dụng

1. **Upload File**: Kéo thả file PDF/DOCX/PPTX/CSV/Image
2. **Convert URL**: Nhập URL website
3. **Xem kết quả**: Markdown được hiển thị với syntax highlighting
4. **Download**: Tải xuống file Markdown

## ⚡ Performance Tips

### Fast Mode (Tự động cho CSV/TXT)
- ⚡ **CSV/TXT files**: Sử dụng fast mode (không LLM)
- 🚀 **Thời gian**: < 5 giây
- 📄 **Chất lượng**: Cơ bản nhưng nhanh

### Normal Mode (Cho file phức tạp)
- 🤖 **PDF/DOCX/Images**: Sử dụng LLM
- ⏱️ **Thời gian**: 10-60 giây (tùy file size)
- 🎯 **Chất lượng**: Cao với AI enhancement

## 🐛 Troubleshooting

### Rate Limit Issues
- **Lỗi**: `429 Rate limit exceeded`
- **Giải pháp**: Backend sẽ tự động retry, chờ vài giây rồi thử lại
- **Phòng ngừa**: Tránh upload nhiều file cùng lúc

### Tesseract OCR Issues
- **Lỗi**: `OCR error: tesseract is not installed`
- **Giải pháp**: Cài đặt Tesseract OCR:
  ```bash
  # Windows
  install-tesseract-windows.bat
  
  # Linux/Mac
  chmod +x install-tesseract-unix.sh
  ./install-tesseract-unix.sh
  ```
- **Workaround**: Sử dụng file PDF/DOCX thay vì image

### Connection Issues
- **Lỗi**: `ECONNREFUSED`
- **Giải pháp**: Đảm bảo cả backend và frontend đang chạy
- **Kiểm tra**: 
  ```bash
  # Backend
  curl http://127.0.0.1:8000/health
  
  # Frontend
  curl http://127.0.0.1:3000/api/health
  ```

## 🔧 Script tự động (Windows)

```bash
# Chạy cả backend và frontend cùng lúc
start-dev.bat
```

## 🔧 Script tự động (Linux/Mac)

```bash
# Cấp quyền thực thi
chmod +x start-dev.sh

# Chạy cả backend và frontend cùng lúc
./start-dev.sh
```

## 🐛 Troubleshooting

### Backend không chạy được
```bash
# Kiểm tra Python version
python --version

# Cài đặt lại dependencies
cd backend/doctomd_service
uv sync --force
```

### Frontend không chạy được
```bash
# Xóa node_modules và cài đặt lại
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### API không kết nối được
- Kiểm tra backend đang chạy tại http://localhost:8000
- Kiểm tra CORS settings trong backend
- Kiểm tra file `.env.local` trong frontend

## 📞 Cần hỗ trợ?

- Tạo [Issue](https://github.com/your-repo/issues)
- Kiểm tra [README.md](README.md) để biết thêm chi tiết
- Xem [API Documentation](http://localhost:8000/docs) khi backend đang chạy

---

**Chúc bạn sử dụng vui vẻ! 🎉**
