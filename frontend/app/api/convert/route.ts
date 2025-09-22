import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
    console.log('📥 Frontend API route /api/convert called')
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        console.log(`📄 File received: ${file?.name} (${file?.size} bytes)`)

        if (!file) {
            console.log('❌ No file provided')
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Kiểm tra kích thước file (50MB limit)
        const maxSize = 50 * 1024 * 1024 // 50MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File size too large. Maximum size is 50MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB` },
                { status: 413 }
            )
        }

        // Tạo FormData cho API call
        const apiFormData = new FormData()
        apiFormData.append('file', file)

        // Lấy options từ formData
        const extractImages = formData.get('extract_images') === 'true'
        const extractTables = formData.get('extract_tables') === 'true'
        const outputType = formData.get('output_type') as string || 'markdown'

        apiFormData.append('extract_images', extractImages.toString())
        apiFormData.append('extract_tables', extractTables.toString())
        apiFormData.append('output_type', outputType)

        console.log(`🚀 Forwarding to backend: ${API_BASE_URL}/convert`)
        const response = await fetch(`${API_BASE_URL}/convert`, {
            method: 'POST',
            body: apiFormData,
        })

        console.log(`📊 Backend response: ${response.status}`)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.log(`❌ Backend error: ${errorData.detail || response.status}`)
            return NextResponse.json(
                { error: errorData.detail || `HTTP error! status: ${response.status}` },
                { status: response.status }
            )
        }

        const result = await response.json()
        console.log(`✅ Backend success: ${result.total_pages} pages`)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Convert file error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to convert file' },
            { status: 500 }
        )
    }
}
