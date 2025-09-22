# Migration Guide: Next.js 14 → Next.js 15

Hướng dẫn nâng cấp từ Next.js 14 lên Next.js 15 với React 19 và Server Actions.

## 🚀 Những thay đổi chính

### 1. Package.json Updates

**Trước (Next.js 14):**
```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  }
}
```

**Sau (Next.js 15):**
```json
{
  "dependencies": {
    "next": "15.5.3",
    "react": "19.1.1",
    "react-dom": "19.1.1"
  }
}
```

### 2. Server Actions thay thế Axios

**Trước (Axios):**
```typescript
// lib/api.ts
import axios from 'axios'

export const convertFile = async (file: File, options: ConversionOptions) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await axios.post('/convert', formData)
  return response.data
}
```

**Sau (Server Actions):**
```typescript
// lib/actions.ts
'use server'

export async function convertFileAction(
  formData: FormData,
  options: ConversionOptions
): Promise<ConversionResult> {
  const response = await fetch(`${API_BASE_URL}/convert`, {
    method: 'POST',
    body: formData,
  })
  
  return await response.json()
}
```

### 3. React 19 Hooks

**Trước (React 18):**
```typescript
const [isLoading, setIsLoading] = useState(false)

const handleConvert = async () => {
  setIsLoading(true)
  try {
    const result = await convertFile(file, options)
    setResult(result)
  } finally {
    setIsLoading(false)
  }
}
```

**Sau (React 19):**
```typescript
const [isPending, startTransition] = useTransition()

const handleConvert = () => {
  startTransition(async () => {
    const result = await convertFileAction(formData, options)
    setResult(result)
  })
}
```

### 4. Next.js Config Updates

**Trước:**
```javascript
const nextConfig = {
  experimental: {
    appDir: true,
  },
}
```

**Sau:**
```javascript
const nextConfig = {
  // Turbopack configuration (Next.js 15.5+)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Server Actions configuration
  serverActions: {
    bodySizeLimit: '50mb', // Tăng từ 1mb lên 50mb cho file upload
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
}
```

## 🔧 Các bước migration

### 1. Cập nhật Dependencies

```bash
npm install next@15.5.3 react@19.1.1 react-dom@19.1.1
npm install -D @types/react@^19 @types/react-dom@^19
npm uninstall axios
```

### 2. Tạo Server Actions

Tạo file `lib/actions.ts` với các Server Actions thay thế axios calls.

### 3. Cập nhật Components

- Thay thế `useState` cho loading bằng `useTransition`
- Sử dụng Server Actions thay vì axios
- Cập nhật error handling

### 4. Cập nhật Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### 5. ESLint Config

Tạo `eslint.config.mjs` thay vì dựa vào `next lint`.

## 🎯 Lợi ích sau migration

### Performance
- ✅ **Turbopack**: Build nhanh hơn 2-5x
- ✅ **Server Actions**: Ít network overhead
- ✅ **React 19**: Concurrent features

### Developer Experience
- ✅ **Type Safety**: Better TypeScript support
- ✅ **Error Handling**: Automatic error boundaries
- ✅ **Loading States**: Built-in pending states

### Bundle Size
- ✅ **No Axios**: Giảm bundle size
- ✅ **Tree Shaking**: Better optimization
- ✅ **Native APIs**: Sử dụng fetch thay vì library

## 🐛 Troubleshooting

### Common Issues

1. **Import errors**: Cập nhật import paths cho React 19
2. **Type errors**: Cập nhật @types/react và @types/react-dom
3. **Build errors**: Kiểm tra next.config.js compatibility
4. **Runtime errors**: Test Server Actions thoroughly
5. **Body size limit**: Server Actions mặc định giới hạn 1MB, cần tăng lên cho file upload
6. **Deprecated turbo config**: Di chuyển từ `experimental.turbo` sang `turbopack`

### Debugging Tips

```bash
# Check TypeScript errors
npm run type-check

# Check ESLint errors  
npm run lint

# Build và test
npm run build
npm start
```

## 📚 Resources

- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15-5)
- [React 19 Features](https://react.dev/blog/2024/12/05/react-19)
- [Server Actions Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Turbopack Documentation](https://nextjs.org/docs/app/building-your-application/tooling/turbopack)
