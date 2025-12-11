import { MetadataRoute } from 'next'

import {getPostSiteMap, getPostTagsSiteMap} from "@/actions/sitemap/queries";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const resPosts = await getPostSiteMap()
	const blogUrls = resPosts.data?.map((item) => ({
		url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${item.slug}`,
		lastModified: item.updatedAt,
	})) || []
	return [
		...blogUrls,
	]
}
