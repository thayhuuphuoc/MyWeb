/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		// TODO: Fix all ESLint errors and set to false
		ignoreDuringBuilds: true,
	},
	compiler: {
		styledComponents: true,
	},
	// Tối ưu output và compression
	compress: true,
	poweredByHeader: false,
	// Tối ưu images
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'pbs.twimg.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'images.nguyenhuuphuoc.com',
				port: '',
				pathname: '**',
			},
		],
	},
	// Tối ưu experimental features
	experimental: {
		optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
	},
	async redirects() {
		return [
			{
				source: '/lien-he',
				destination: '/contact',
				permanent: true,
			},
		];
	},
}

module.exports = nextConfig
