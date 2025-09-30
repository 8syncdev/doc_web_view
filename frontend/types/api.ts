export interface ConversionResult {
    success: boolean
    message: string
    pages: Page[]
    total_pages: number
    file_type: string
    raw_response?: LLMResponse[]
}

export interface Page {
    page_number: number
    content: string
    content_length: number
    images?: ImageAsset[]
}

export interface ImageAsset {
    alt: string
    url: string
    title?: string
}

export interface LLMResponse {
    type: 'thinking' | 'text' | string
    text?: string
    thinking?: Array<{ type: string; text: string }>
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
