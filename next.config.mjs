/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
        },
        {
            protocol: 'http',
            hostname: '192.168.50.14',
        },
        {
            protocol: 'http',
            hostname: 'localhost'
        }
        ]
    }
}

export default nextConfig;
