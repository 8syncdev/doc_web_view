export interface ConversionResult {
    success: boolean
    message: string
    pages: Page[]
    total_pages: number
    file_type: string
}

export interface Page {
    page_number: number
    content: string
    content_length: number
}

export interface ConversionOptions {
    extract_images: boolean
    extract_tables: boolean
    output_type: 'markdown' | 'text'
}

export interface SupportedFormats {
    supported_formats: Record<string, string>
    url_support: boolean
    llm_available: boolean
}
