# DocToMarkdown Frontend

Giao diện web Next.js 15 với React 19 để chuyển đổi tài liệu sang Markdown sử dụng API Routes.

## Tính năng

- ✅ **Next.js 15**: Turbopack builds, API Routes, Node.js middleware
- ✅ **React 19**: useTransition, concurrent features
- ✅ **API Routes**: Native API calls không cần axios
- ✅ Upload file (PDF, DOCX, PPTX, CSV, Images) - tối đa 50MB
- ✅ Chuyển đổi URL sang Markdown
- ✅ Xem trước Markdown với syntax highlighting
- ✅ Copy và download kết quả
- ✅ Responsive design với Tailwind CSS
- ✅ Drag & drop file upload
- ✅ Real-time preview với loading states

## Cài đặt

1. Cài đặt dependencies:
```bash
cd frontend
npm install
```

2. Cấu hình API URL (tùy chọn):
```bash
# Tạo file .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

## Chạy ứng dụng

```bash
# Development server với Turbopack (nhanh hơn)
npm run dev

# Build production
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## Cấu trúc dự án

```
frontend/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── FileUpload.tsx       # File upload component với Server Actions
│   ├── UrlConverter.tsx     # URL converter component với Server Actions
│   └── MarkdownViewer.tsx   # Markdown viewer component
├── lib/
│   ├── actions.ts           # Server Actions cho API calls
│   └── hooks.ts             # Custom hooks với React 19
├── types/
│   └── api.ts               # TypeScript types
└── package.json
```

## API Integration

Frontend sử dụng **Server Actions** để tích hợp với FastAPI backend:

- `convertFileAction()` - Chuyển đổi file
- `convertUrlAction()` - Chuyển đổi URL  
- `getSupportedFormatsAction()` - Lấy danh sách định dạng hỗ trợ
- `healthCheckAction()` - Health check

**Ưu điểm Server Actions:**
- ✅ Không cần axios - sử dụng native fetch
- ✅ Type-safe với TypeScript
- ✅ Automatic error handling
- ✅ Optimistic updates với React 19
- ✅ Better performance với caching

## Tech Stack

- **Next.js 15.5** - React framework với Turbopack
- **React 19.1** - UI library với concurrent features
- **TypeScript 5.6** - Type safety
- **Tailwind CSS 3.4** - Styling
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code highlighting
- **Server Actions** - Native API calls
- **Lucide React** - Icons
