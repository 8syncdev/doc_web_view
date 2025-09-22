'use client'

import React, { useState } from 'react'
import { Link, Globe, CheckCircle, AlertCircle } from 'lucide-react'
import { ConversionOptions } from '@/types/api'
import { useConversion, useFormState } from '@/lib/hooks'

interface UrlConverterProps {
    onConversionStart: () => void
    onConversionComplete: (result: any) => void
}

export default function UrlConverter({ onConversionStart, onConversionComplete }: UrlConverterProps) {
    const [url, setUrl] = useState('')

    // Sử dụng custom hooks
    const { convertUrl, result, error, isPending } = useConversion()
    const { state: options, updateState: updateOptions } = useFormState<ConversionOptions>({
        extract_images: true,
        extract_tables: true,
        output_type: 'markdown'
    })

    const isValidUrl = (string: string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    const handleConvert = async () => {
        if (!url || !isValidUrl(url)) {
            alert('Vui lòng nhập URL hợp lệ')
            return
        }

        onConversionStart()
        await convertUrl(url, options)
    }

    // Effect để handle result và error
    React.useEffect(() => {
        if (result) {
            onConversionComplete(result)
        }
        if (error) {
            onConversionComplete({
                success: false,
                message: error,
                pages: [],
                total_pages: 0,
                file_type: 'url'
            })
        }
    }, [result, error, onConversionComplete])

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Convert URL</h3>

            {/* URL Input */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Website
                    </label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="input-field pl-10"
                        />
                    </div>
                    {url && !isValidUrl(url) && (
                        <p className="text-sm text-red-600 mt-1">
                            URL không hợp lệ
                        </p>
                    )}
                </div>

                {/* Example URLs */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ví dụ:</p>
                    <div className="space-y-1 text-sm text-gray-600">
                        <p>• https://medium.com/article</p>
                        <p>• https://github.com/user/repo</p>
                        <p>• https://docs.example.com</p>
                    </div>
                </div>
            </div>

            {/* Options */}
            <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900">Tùy chọn chuyển đổi</h4>

                <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={options.extract_images}
                            onChange={(e) => updateOptions({ extract_images: e.target.checked })}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Trích xuất hình ảnh</span>
                    </label>

                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={options.extract_tables}
                            onChange={(e) => updateOptions({ extract_tables: e.target.checked })}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Trích xuất bảng</span>
                    </label>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Định dạng đầu ra
                        </label>
                        <select
                            value={options.output_type}
                            onChange={(e) => updateOptions({ output_type: e.target.value as 'markdown' | 'text' })}
                            className="input-field"
                        >
                            <option value="markdown">Markdown</option>
                            <option value="text">Plain Text</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Convert Button */}
            <div className="mt-6">
                <button
                    onClick={handleConvert}
                    disabled={!url || !isValidUrl(url) || isPending}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${url && isValidUrl(url) && !isPending
                        ? 'btn-primary'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isPending ? (
                        <>
                            <div className="inline w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Đang chuyển đổi...
                        </>
                    ) : (
                        <>
                            <Link className="inline w-4 h-4 mr-2" />
                            Chuyển đổi URL sang Markdown
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
