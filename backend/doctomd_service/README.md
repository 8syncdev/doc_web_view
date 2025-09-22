# DocToMarkdown FastAPI Service

Dịch vụ FastAPI để chuyển đổi tài liệu sang Markdown sử dụng thư viện [doctomarkdown](https://github.com/DocParseAI/doctomarkdown).

## Tính năng

- ✅ Chuyển đổi PDF, DOCX, PPTX, CSV, Images sang Markdown
- ✅ Chuyển đổi URL sang Markdown
- ✅ Hỗ trợ LLM (OpenAI GPT-4o) để cải thiện chất lượng
- ✅ API RESTful với FastAPI
- ✅ CORS enabled cho frontend
- ✅ Upload file và xử lý bất đồng bộ

## Cài đặt

1. Cài đặt dependencies:
```bash
cd backend/doctomd_service
uv sync
```

2. Cài đặt Tesseract OCR (cho image processing):
```bash
# Windows
install-tesseract-windows.bat

# Linux/Mac
chmod +x install-tesseract-unix.sh
./install-tesseract-unix.sh
```

3. Tạo file `.env` với Mistral API key:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-large-latest
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

## Chạy ứng dụng

```bash
# Chạy development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Hoặc chạy trực tiếp
python main.py
```

## API Endpoints

### 1. Health Check
```
GET /health
```

### 2. Convert Document (Normal Mode)
```
POST /convert
Content-Type: multipart/form-data

Parameters:
- file: File upload (PDF, DOCX, PPTX, CSV, PNG, JPG, JPEG)
- extract_images: boolean (default: true)
- extract_tables: boolean (default: true)
- output_type: string ("markdown" or "text", default: "markdown")
```

### 3. Convert Document (Fast Mode)
```
POST /convert-fast
Content-Type: multipart/form-data

Parameters:
- file: File upload (CSV, TXT only)
- extract_images: boolean (default: false)
- extract_tables: boolean (default: false)
- output_type: string ("markdown" or "text", default: "markdown")
```

**Fast Mode vs Normal Mode**:
- ⚡ **Fast Mode**: Không LLM, nhanh hơn, chỉ CSV/TXT
- 🤖 **Normal Mode**: Có LLM, chậm hơn, hỗ trợ đầy đủ

### 3. Convert URL
```
POST /convert-url
Content-Type: application/x-www-form-urlencoded

Parameters:
- url: string (URL to convert)
- extract_images: boolean (default: true)
- extract_tables: boolean (default: true)
- output_type: string ("markdown" or "text", default: "markdown")
```

### 4. Supported Formats
```
GET /supported-formats
```

## Response Format

```json
{
  "success": true,
  "message": "Chuyển đổi thành công filename.pdf",
  "pages": [
    {
      "page_number": 1,
      "content": "# Markdown content...",
      "content_length": 1234
    }
  ],
  "total_pages": 1,
  "file_type": "pdf"
}
```

## Cấu hình LLM

Hiện tại sử dụng **Mistral AI** làm LLM provider.

### Mistral AI Configuration
```env
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-large-latest
```

**Các model Mistral được hỗ trợ:**
- `mistral-large-latest` (Mặc định) - Model mạnh nhất
- `mistral-small-latest` - Model nhỏ hơn, nhanh hơn
- `mistral-nemo` - Model tối ưu cho tốc độ

## 🐛 Troubleshooting

### Rate Limit Issues
- **Error**: `429 Rate limit exceeded`
- **Solution**: API sẽ tự động retry với exponential backoff
- **Prevention**: Tránh gửi nhiều request cùng lúc

### Tesseract OCR Issues
- **Error**: `OCR error: tesseract is not installed`
- **Solution**: Cài đặt Tesseract OCR theo hướng dẫn trên
- **Workaround**: Sử dụng file PDF/DOCX thay vì image

### LLM Connection Issues
- **Error**: `LLM client not available`
- **Solution**: Kiểm tra `MISTRAL_API_KEY` trong file `.env`
- **Fallback**: App sẽ hoạt động không có LLM (chất lượng thấp hơn)

**Lấy API key:**
1. Truy cập [Mistral AI Console](https://console.mistral.ai/)
2. Đăng ký tài khoản
3. Tạo API key mới
4. Copy API key vào file `.env`

**Lưu ý:** Mistral API có giới hạn rate limit và chi phí theo usage.
