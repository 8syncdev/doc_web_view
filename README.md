# 📄 DocToMarkdown Web Application

Ứng dụng web hoàn chỉnh để chuyển đổi tài liệu sang Markdown với AI, sử dụng FastAPI backend và Next.js frontend.

## 🚀 Tính năng

- ✅ **Chuyển đổi đa định dạng**: PDF, DOCX, PPTX, CSV, Images (PNG, JPG, JPEG)
- ✅ **Chuyển đổi URL**: Chuyển đổi nội dung web sang Markdown
- ✅ **AI-powered**: Sử dụng Mistral AI để cải thiện chất lượng
- ✅ **Giao diện hiện đại**: Next.js 15 với React 19 và Server Actions
- ✅ **Real-time preview**: Xem trước Markdown với syntax highlighting
- ✅ **Download & Copy**: Tải xuống và sao chép kết quả
- ✅ **Drag & Drop**: Upload file dễ dàng
- ✅ **Responsive**: Hoạt động tốt trên mọi thiết bị

## 🏗️ Kiến trúc

```
doc_web_view/
├── backend/
│   └── doctomd_service/     # FastAPI service
│       ├── main.py          # API endpoints
│       ├── pyproject.toml   # Dependencies
│       └── README.md        # Backend docs
├── frontend/                # Next.js app
│   ├── app/                 # App router
│   ├── components/          # React components
│   ├── lib/                 # API client
│   ├── types/               # TypeScript types
│   └── package.json         # Frontend dependencies
└── README.md               # This file
```

## 🛠️ Cài đặt

### 1. Backend (FastAPI)

```bash
cd backend/doctomd_service

# Cài đặt dependencies
uv sync

# Tạo file .env với API key
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
echo "HOST=0.0.0.0" >> .env
echo "PORT=8000" >> .env
echo "DEBUG=True" >> .env

# Chạy server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend (Next.js)

```bash
cd frontend

# Cài đặt dependencies
npm install

# Cấu hình API URL (tùy chọn)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Chạy development server
npm run dev
```

## 🚀 Sử dụng

1. **Khởi động backend**: `http://localhost:8000`
2. **Khởi động frontend**: `http://localhost:3000`
3. **Upload file** hoặc **nhập URL**
4. **Xem kết quả** và **download Markdown**

## 📡 API Endpoints

### Backend API (FastAPI)

- `GET /` - API status
- `GET /health` - Health check
- `POST /convert` - Convert file to Markdown
- `POST /convert-url` - Convert URL to Markdown
- `GET /supported-formats` - Get supported formats

### Frontend (Next.js)

- `/` - Main application page
- Responsive design với Tailwind CSS
- Real-time Markdown preview
- File upload với drag & drop

## 🔧 Cấu hình LLM

Hiện tại sử dụng **Mistral AI**:

```env
# Mistral AI Configuration
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-large-latest
```

**Lấy API key:**
1. Truy cập [Mistral AI Console](https://console.mistral.ai/)
2. Đăng ký tài khoản và tạo API key
3. Copy API key vào file `.env`

## 📦 Dependencies

### Backend
- `doctomarkdown>=0.2.0` - Document conversion library
- `fastapi>=0.117.1` - Web framework
- `uvicorn[standard]>=0.30.0` - ASGI server
- `python-multipart>=0.0.9` - File upload support
- `openai>=1.108.1` - OpenAI client

### Frontend
- `next>=15.5.3` - React framework với Turbopack
- `react>=19.1.1` - UI library với concurrent features
- `tailwindcss>=3.4.0` - CSS framework
- `react-markdown>=9.0.0` - Markdown renderer
- `typescript>=5.6.0` - Type safety

## 🎯 Tính năng nổi bật

### Backend
- **Async processing**: Xử lý file lớn không block
- **Multiple LLM support**: OpenAI, Azure, Groq, Gemini, Ollama
- **CORS enabled**: Tích hợp với frontend
- **Error handling**: Xử lý lỗi chi tiết
- **File validation**: Kiểm tra định dạng file

### Frontend
- **Next.js 15**: Turbopack builds, Server Actions, Node.js middleware
- **React 19**: useTransition, concurrent features, optimistic updates
- **Server Actions**: Native API calls không cần axios
- **Modern UI**: Giao diện đẹp với Tailwind CSS
- **Drag & Drop**: Upload file trực quan
- **Real-time preview**: Xem Markdown ngay lập tức với loading states
- **Syntax highlighting**: Highlight code blocks
- **Responsive**: Hoạt động trên mobile
- **TypeScript**: Type safety với strict mode

## 🔍 Demo

1. **Upload PDF**: Chọn file PDF và xem Markdown
2. **Convert URL**: Nhập URL Medium/GitHub và chuyển đổi
3. **Preview**: Xem trước với syntax highlighting
4. **Download**: Tải xuống file Markdown

## 📝 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Support

Nếu gặp vấn đề, vui lòng tạo [Issue](https://github.com/your-repo/issues) hoặc liên hệ qua email.

---

**Được xây dựng với ❤️ sử dụng [doctomarkdown](https://github.com/DocParseAI/doctomarkdown)**
