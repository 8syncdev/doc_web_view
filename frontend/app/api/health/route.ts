import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export async function GET() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return NextResponse.json(result)
    } catch (error) {
        console.error('Health check error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to check health' },
            { status: 500 }
        )
    }
}
