import { MetadataRoute } from 'next'
import {getProductSiteMap} from "@/actions/products/queries";
import {getProductTags} from "@/actions/products/tags/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const resProducts = await getProductSiteMap()
	const productUrls = resProducts.data?.map((item) => ({
		url: `${process.env.NEXT_PUBLIC_APP_URL}/san-pham/${item.slug}`,
		lastModified: item.updatedAt,
	})) || []

	return [
		...productUrls,
	]
}
