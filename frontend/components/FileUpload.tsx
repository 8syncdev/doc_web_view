'use client'

import React, { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { ConversionOptions } from '@/types/api'
import { useConversion, useFormState } from '@/lib/hooks'

interface FileUploadProps {
    onConversionStart: () => void
    onConversionComplete: (result: any) => void
}

export default function FileUpload({ onConversionStart, onConversionComplete }: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Sử dụng custom hooks
    const { convertFile, result, error, isPending } = useConversion()
    const { state: options, updateState: updateOptions } = useFormState<ConversionOptions>({
        extract_images: true,
        extract_tables: true,
        output_type: 'markdown'
    })

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            const maxSize = 50 * 1024 * 1024 // 50MB

            if (file.size > maxSize) {
                alert(`File quá lớn! Tối đa 50MB, file của bạn: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
                return
            }

            setSelectedFile(file)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const maxSize = 50 * 1024 * 1024 // 50MB

            if (file.size > maxSize) {
                alert(`File quá lớn! Tối đa 50MB, file của bạn: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
                return
            }

            setSelectedFile(file)
        }
    }

    const handleConvert = async () => {
        if (!selectedFile) return

        console.log('🚀 Starting conversion for:', selectedFile.name)
        onConversionStart()

        try {
            await convertFile(selectedFile, options)
            console.log('✅ Conversion finished, result:', result)
        } catch (error) {
            console.error('❌ Conversion error:', error)
        }
    }

    // Effect để handle result và error
    React.useEffect(() => {
        console.log('🔄 FileUpload effect triggered:', { result, error, selectedFile: selectedFile?.name })

        if (result) {
            console.log('✅ Calling onConversionComplete with result:', result)
            onConversionComplete(result)
        }
        if (error) {
            console.log('❌ Calling onConversionComplete with error:', error)
            onConversionComplete({
                success: false,
                message: error,
                pages: [],
                total_pages: 0,
                file_type: selectedFile?.name.split('.').pop() || 'unknown'
            })
        }
    }, [result, error, selectedFile, onConversionComplete])

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase()
        const iconMap: Record<string, string> = {
            pdf: '📄',
            docx: '📝',
            pptx: '📊',
            csv: '📈',
            png: '🖼️',
            jpg: '🖼️',
            jpeg: '🖼️'
        }
        return iconMap[ext || ''] || '📄'
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Upload File</h3>

            {/* File Drop Zone */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {selectedFile ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
                            <div>
                                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-sm text-gray-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Chọn file khác
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <div>
                            <p className="text-lg font-medium text-gray-900">
                                Kéo thả file vào đây
                            </p>
                            <p className="text-gray-500">hoặc</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-primary mt-2"
                            >
                                Chọn file
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">
                            PDF, DOCX, PPTX, CSV, PNG, JPG, JPEG
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Tối đa 50MB
                        </p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.pptx,.csv,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
            />

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
                    disabled={!selectedFile || isPending}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${selectedFile && !isPending
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
                            <FileText className="inline w-4 h-4 mr-2" />
                            Chuyển đổi sang Markdown
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
