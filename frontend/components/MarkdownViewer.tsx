'use client'

import { useState, useMemo } from 'react'
import { Download, Copy, Check, Eye, Code, AlertCircle } from 'lucide-react'
import { MarkdownRenderer } from '@/components/mdx'
import type { ConversionResult } from '@/types/api'

interface MarkdownViewerProps {
    result: ConversionResult
}

export default function MarkdownViewer({ result }: MarkdownViewerProps) {
    console.log('📄 MarkdownViewer rendered with result:', result)

    const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview')
    const [copied, setCopied] = useState(false)

    const processedPages = useMemo(() => result.pages ?? [], [result.pages])

    const handleCopy = async () => {
        const allContent = processedPages.map(page => page.content).join('\n\n---\n\n')
        await navigator.clipboard.writeText(allContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const allContent = processedPages.map(page => page.content).join('\n\n---\n\n')
        const blob = new Blob([allContent], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `converted_${result.file_type}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const getTotalContentLength = () => {
        return processedPages.reduce((total, page) => total + page.content_length, 0)
    }

    return (
        <div className="w-full mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/60 dark:shadow-none p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {result.success ? 'Kết quả chuyển đổi' : 'Chuyển đổi thất bại'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-6">
                        {result.message}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setViewMode(viewMode === 'preview' ? 'source' : 'preview')}
                        className={`inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${viewMode === 'preview' ? 'bg-slate-900 text-white dark:bg-white/10 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                        {viewMode === 'preview' ? (
                            <>
                                <Code className="w-4 h-4 mr-1" />
                                Source
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-medium transition-all hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="stat-card">
                    <div className="stat-value">{result.total_pages}</div>
                    <div className="stat-label">Số trang</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{getTotalContentLength().toLocaleString()}</div>
                    <div className="stat-label">Tổng ký tự</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value uppercase">{result.file_type}</div>
                    <div className="stat-label">Định dạng</div>
                </div>
            </div>

            {/* Content */}
            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                {viewMode === 'preview' ? (
                    <div className="p-6 max-h-[600px] overflow-y-auto">
                        {processedPages.map((page, index) => (
                            <article key={index} className="mb-10 last:mb-0">
                                {processedPages.length > 1 && (
                                    <header className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200">
                                        <span className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                                            Trang {page.page_number}
                                        </span>
                                        <span className="ml-auto text-xs text-slate-400">
                                            {page.content_length.toLocaleString()} ký tự
                                        </span>
                                    </header>
                                )}
                                <div className="markdown-container prose prose-base sm:prose-lg lg:prose-xl max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:my-1 prose-hr:my-10">
                                    <MarkdownRenderer
                                        content={page.content}
                                        className="bg-transparent border-none shadow-none px-0"
                                    />
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 max-h-[600px] overflow-y-auto bg-slate-900">
                        <pre className="text-sm sm:text-base text-slate-200 whitespace-pre-wrap leading-7">
                            {processedPages.map(page => page.content).join('\n\n---\n\n')}
                        </pre>
                    </div>
                )}
            </div>

            {/* Error State */}
            {!result.success && (
                <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4" />
                    <div>
                        <p className="font-medium">Lỗi chuyển đổi</p>
                        <p className="mt-1 text-red-600/80">{result.message}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
