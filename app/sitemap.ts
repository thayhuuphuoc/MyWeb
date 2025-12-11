import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return [
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
		},
	]
}
