'use client'

import { useState } from 'react'
import { Download, Copy, Check, Eye, Code } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ConversionResult } from '@/types/api'

interface MarkdownViewerProps {
    result: ConversionResult
}

export default function MarkdownViewer({ result }: MarkdownViewerProps) {
    console.log('📄 MarkdownViewer rendered with result:', result)

    const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview')
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        const allContent = result.pages.map(page => page.content).join('\n\n---\n\n')
        await navigator.clipboard.writeText(allContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const allContent = result.pages.map(page => page.content).join('\n\n---\n\n')
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
        return result.pages.reduce((total, page) => total + page.content_length, 0)
    }

    return (
        <div className="card">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {result.success ? 'Kết quả chuyển đổi' : 'Lỗi chuyển đổi'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {result.message}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setViewMode(viewMode === 'preview' ? 'source' : 'preview')}
                        className="btn-secondary"
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
                        className="btn-secondary"
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
                        className="btn-primary"
                    >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{result.total_pages}</div>
                    <div className="text-sm text-gray-500">Trang</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                        {getTotalContentLength().toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Ký tự</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{result.file_type}</div>
                    <div className="text-sm text-gray-500">Định dạng</div>
                </div>
            </div>

            {/* Content */}
            <div className="border rounded-lg overflow-hidden">
                {viewMode === 'preview' ? (
                    <div className="p-6 max-h-96 overflow-y-auto">
                        {result.pages.map((page, index) => (
                            <div key={index} className="mb-8">
                                {result.total_pages > 1 && (
                                    <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                                        <span className="text-sm font-medium text-gray-500">
                                            Trang {page.page_number}
                                        </span>
                                        <span className="ml-auto text-sm text-gray-400">
                                            {page.content_length} ký tự
                                        </span>
                                    </div>
                                )}
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={tomorrow}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >
                                        {page.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                            {result.pages.map(page => page.content).join('\n\n---\n\n')}
                        </pre>
                    </div>
                )}
            </div>

            {/* Error State */}
            {!result.success && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 font-medium">Lỗi chuyển đổi</span>
                    </div>
                    <p className="text-red-600 mt-1">{result.message}</p>
                </div>
            )}
        </div>
    )
}
