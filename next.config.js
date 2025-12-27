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
	images: {
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
