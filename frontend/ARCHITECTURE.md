# Architecture: API Routes vs Server Actions

## 🔄 Thay đổi Architecture

### Vấn đề với Server Actions
- **Body size limit**: Server Actions có giới hạn 1MB mặc định
- **Config complexity**: Cần nhiều config để tăng limit
- **Cache issues**: Có thể gặp vấn đề với cache

### Giải pháp: API Routes
- ✅ **Không có body size limit**: Có thể xử lý file lớn
- ✅ **Đơn giản hơn**: Ít config hơn
- ✅ **Tương thích tốt**: Hoạt động ổn định với Next.js 15
- ✅ **Better error handling**: Dễ debug hơn

## 📁 Cấu trúc API Routes

```
frontend/
├── app/
│   ├── api/
│   │   ├── convert/
│   │   │   └── route.ts          # POST /api/convert
│   │   ├── convert-url/
│   │   │   └── route.ts          # POST /api/convert-url
│   │   ├── supported-formats/
│   │   │   └── route.ts          # GET /api/supported-formats
│   │   └── health/
│   │       └── route.ts           # GET /api/health
│   └── page.tsx
├── lib/
│   └── actions.ts                 # Client-side functions
└── next.config.js                 # API config
```

## 🔧 Configuration

### next.config.js
```javascript
const nextConfig = {
  // API configuration
  api: {
    bodyParser: {
      sizeLimit: '50mb',        // File upload limit
    },
    responseLimit: '50mb',       // Response limit
  },
  
  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}
```

## 🚀 Cách sử dụng

### Client-side (lib/actions.ts)
```typescript
// Thay vì Server Actions
export async function convertFileAction(
  formData: FormData,
  options: ConversionOptions
): Promise<ConversionResult> {
  const response = await fetch('/api/convert', {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error)
  }
  
  return await response.json()
}
```

### API Route (app/api/convert/route.ts)
```typescript
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    // Validation
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 413 }
      )
    }
    
    // Forward to backend
    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      body: formData,
    })
    
    return NextResponse.json(await response.json())
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

## ✅ Lợi ích

1. **Không có body size limit issues**
2. **Dễ debug và maintain**
3. **Tương thích tốt với Next.js 15**
4. **Better error handling**
5. **Có thể cache và optimize**

## 🔄 Migration từ Server Actions

1. **Tạo API routes** trong `app/api/`
2. **Cập nhật client functions** trong `lib/actions.ts`
3. **Loại bỏ serverActions config** trong `next.config.js`
4. **Test thoroughly** với file lớn

## 🐛 Troubleshooting

### Common Issues
- **404 errors**: Kiểm tra API route paths
- **CORS errors**: Đảm bảo backend CORS config
- **File upload fails**: Kiểm tra bodyParser config
- **Memory issues**: Monitor server memory usage
- **ECONNREFUSED**: Sử dụng IPv4 (127.0.0.1) thay vì localhost

### IPv4 Fix
```typescript
// Thay vì localhost (có thể resolve IPv6)
const API_BASE_URL = 'http://localhost:8000'

// Sử dụng IPv4 explicit
const API_BASE_URL = 'http://127.0.0.1:8000'
```

### Debug Tips
```bash
# Check API routes
curl -X POST http://127.0.0.1:3000/api/convert \
  -F "file=@test.pdf" \
  -F "extract_images=true"

# Check backend
curl -X POST http://127.0.0.1:8000/convert \
  -F "file=@test.pdf" \
  -F "extract_images=true"

# Check if services are running
netstat -an | findstr :8000  # Windows
netstat -an | grep :8000     # Linux/Mac
```
