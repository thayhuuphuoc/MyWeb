import { MetadataRoute } from 'next'

import {getPostTagsSiteMap} from "@/actions/sitemap/queries";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const resTags = await getPostTagsSiteMap()
	const tagUrls = resTags.data?.map((item) => ({
		url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/tags/${item.slug}`,
	})) || []

	return [
		...tagUrls,
	]
}
