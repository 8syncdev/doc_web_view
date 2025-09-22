import { ConversionResult, ConversionOptions } from '@/types/api'

// Client-side function để convert file (sử dụng API route)
export async function convertFileAction(
    formData: FormData,
    options: ConversionOptions
): Promise<ConversionResult> {
    try {
        const file = formData.get('file') as File
        if (!file) {
            throw new Error('No file provided')
        }

        // Kiểm tra kích thước file (50MB limit)
        const maxSize = 50 * 1024 * 1024 // 50MB
        if (file.size > maxSize) {
            throw new Error(`File size too large. Maximum size is 50MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        }

        // Kiểm tra file type để quyết định sử dụng fast mode hay normal mode
        const fileExtension = file.name.split('.').pop()?.toLowerCase()
        const useFastMode = fileExtension === 'csv' || fileExtension === 'txt'

        const endpoint = useFastMode ? '/api/convert-fast' : '/api/convert'
        console.log(`Using ${useFastMode ? 'fast' : 'normal'} mode for ${fileExtension} file`)

        // Tạo FormData cho API call
        const apiFormData = new FormData()
        apiFormData.append('file', file)
        apiFormData.append('extract_images', options.extract_images.toString())
        apiFormData.append('extract_tables', options.extract_tables.toString())
        apiFormData.append('output_type', options.output_type)

        const response = await fetch(endpoint, {
            method: 'POST',
            body: apiFormData,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const result: ConversionResult = await response.json()
        return result
    } catch (error) {
        console.error('Convert file error:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to convert file')
    }
}

// Client-side function để convert URL (sử dụng API route)
export async function convertUrlAction(
    url: string,
    options: ConversionOptions
): Promise<ConversionResult> {
    try {
        const response = await fetch('/api/convert-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                extract_images: options.extract_images,
                extract_tables: options.extract_tables,
                output_type: options.output_type,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const result: ConversionResult = await response.json()
        return result
    } catch (error) {
        console.error('Convert URL error:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to convert URL')
    }
}

// Client-side function để lấy supported formats
export async function getSupportedFormatsAction() {
    try {
        const response = await fetch('/api/supported-formats', {
            method: 'GET',
            cache: 'no-store', // Luôn fetch fresh data
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Get supported formats error:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to get supported formats')
    }
}

// Client-side function để health check
export async function healthCheckAction() {
    try {
        const response = await fetch('/api/health', {
            method: 'GET',
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Health check error:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to check health')
    }
}
