/** @type {import('next').NextConfig} */
const nextConfig = {
    // Turbopack configuration (Next.js 15.5+)
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },

    // API configuration
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
        responseLimit: '50mb',
    },

    // Environment variables
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
    },

    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/**',
            },
        ],
    },

    // Performance optimizations
    compress: true,
    poweredByHeader: false,

    // TypeScript configuration
    typescript: {
        ignoreBuildErrors: false,
    },

    // Experimental features
    experimental: {
        serverComponentsExternalPackages: [],
    },
}

module.exports = nextConfig
