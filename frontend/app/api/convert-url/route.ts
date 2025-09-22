import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { url, extract_images, extract_tables, output_type } = body

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            )
        }

        const response = await fetch(`${API_BASE_URL}/convert-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                extract_images: extract_images || false,
                extract_tables: extract_tables || false,
                output_type: output_type || 'markdown',
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return NextResponse.json(
                { error: errorData.detail || `HTTP error! status: ${response.status}` },
                { status: response.status }
            )
        }

        const result = await response.json()
        return NextResponse.json(result)
    } catch (error) {
        console.error('Convert URL error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to convert URL' },
            { status: 500 }
        )
    }
}
