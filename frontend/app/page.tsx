'use client'

import React, { useState } from 'react'
import { Upload, Link, FileText, Download, Loader2 } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import UrlConverter from '@/components/UrlConverter'
import MarkdownViewer from '@/components/MarkdownViewer'
import { ConversionResult } from '@/types/api'

export default function Home() {
    const [activeTab, setActiveTab] = useState<'file' | 'url'>('file')
    const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Debug effect
    React.useEffect(() => {
        console.log('🔍 Main page state changed:', {
            isLoading,
            hasResult: !!conversionResult,
            resultSuccess: conversionResult?.success,
            resultPages: conversionResult?.total_pages
        })
    }, [isLoading, conversionResult])

    const handleConversionComplete = (result: ConversionResult) => {
        console.log('🎯 Main page: handleConversionComplete called with:', result)
        console.log('🎯 Main page: Setting isLoading to false and conversionResult to:', result.success ? 'success' : 'error')
        setConversionResult(result)
        setIsLoading(false)
    }

    const handleConversionStart = () => {
        console.log('🚀 Main page: handleConversionStart called')
        console.log('🚀 Main page: Setting isLoading to true and clearing conversionResult')
        setIsLoading(true)
        setConversionResult(null)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Chuyển đổi tài liệu sang Markdown
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Hỗ trợ PDF, DOCX, PPTX, CSV, Images và URLs. Sử dụng AI để tạo ra Markdown chất lượng cao.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center">
                <div className="bg-white rounded-lg p-1 shadow-sm border">
                    <button
                        onClick={() => setActiveTab('file')}
                        className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'file'
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Upload className="inline w-4 h-4 mr-2" />
                        Upload File
                    </button>
                    <button
                        onClick={() => setActiveTab('url')}
                        className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'url'
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Link className="inline w-4 h-4 mr-2" />
                        Convert URL
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    {activeTab === 'file' ? (
                        <FileUpload
                            onConversionStart={handleConversionStart}
                            onConversionComplete={handleConversionComplete}
                        />
                    ) : (
                        <UrlConverter
                            onConversionStart={handleConversionStart}
                            onConversionComplete={handleConversionComplete}
                        />
                    )}
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="card text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
                            <p className="text-gray-600">Đang xử lý tài liệu...</p>
                        </div>
                    ) : conversionResult ? (
                        <MarkdownViewer result={conversionResult} />
                    ) : (
                        <div className="card text-center text-gray-500">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Kết quả chuyển đổi sẽ hiển thị ở đây</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Supported Formats */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Định dạng được hỗ trợ</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>PDF</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>DOCX</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>PPTX</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>CSV</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>PNG/JPG</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span>URLs</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
