'use client'

import { useState, useCallback } from 'react'
import { ConversionResult, ConversionOptions } from '@/types/api'
import { convertFileAction, convertUrlAction } from './actions'

// Hook đơn giản cho conversion
export function useConversion() {
    const [isPending, setIsPending] = useState(false)
    const [result, setResult] = useState<ConversionResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const convertFile = useCallback(async (
        file: File,
        options: ConversionOptions
    ) => {
        console.log('🔄 Starting conversion...', file.name)
        setError(null)
        setResult(null)
        setIsPending(true)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('extract_images', options.extract_images.toString())
            formData.append('extract_tables', options.extract_tables.toString())
            formData.append('output_type', options.output_type)

            const conversionResult = await convertFileAction(formData, options)
            console.log('✅ Conversion completed:', conversionResult)
            setResult(conversionResult)
        } catch (err) {
            console.error('❌ Conversion failed:', err)
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setIsPending(false)
        }
    }, [])

    const convertUrl = useCallback(async (
        url: string,
        options: ConversionOptions
    ) => {
        console.log('🔄 Starting URL conversion...', url)
        setError(null)
        setResult(null)
        setIsPending(true)

        try {
            const conversionResult = await convertUrlAction(url, options)
            console.log('✅ URL conversion completed:', conversionResult)
            setResult(conversionResult)
        } catch (err) {
            console.error('❌ URL conversion failed:', err)
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setIsPending(false)
        }
    }, [])

    const reset = useCallback(() => {
        setResult(null)
        setError(null)
        setIsPending(false)
    }, [])

    return {
        convertFile,
        convertUrl,
        reset,
        result,
        error,
        isPending,
    }
}

// Hook để quản lý form state
export function useFormState<T>(initialState: T) {
    const [state, setState] = useState<T>(initialState)

    const updateState = useCallback((updates: Partial<T>) => {
        setState(prev => ({ ...prev, ...updates }))
    }, [])

    const resetState = useCallback(() => {
        setState(initialState)
    }, [initialState])

    return {
        state,
        updateState,
        resetState,
    }
}
