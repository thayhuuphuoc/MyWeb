import {Metadata, ResolvingMetadata} from "next";
import {getPublishedProductBySlug, getProducts} from "@/actions/products/queries";
import {notFound} from "next/navigation";
import Product from "@/components/public/products/product";
import siteMetadata from "@/config/siteMetadata";
import {ProductStatus} from ".prisma/client";
import {parseProductImages} from "@/actions/products/validations";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const slug = params.slug
	const {data, error} = await getPublishedProductBySlug(slug)

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	const images = parseProductImages(data.images || [])
	const firstImage = images.length > 0 ? images[0].url : undefined

	return {
		title: data.title,
		keywords: data?.keywords,
		description: String(data.metaDescription),
		openGraph: {
			images: firstImage || `${siteMetadata.ogImage}`,
			title: data.metaTitle || data.title,
			description: String(data.metaDescription),
		},
	}
}
export async function generateStaticParams() {
	try {
		const {data} = await getProducts({
			page: 1,
			per_page: 1000,
			status: ProductStatus.PUBLISHED
		})

		if (!data || data.length === 0) {
			return []
		}

		return data.map((product) => ({
			slug: product.slug,
		}))
	} catch (error) {
		console.error('Error generating static params for products:', error)
		return []
	}
}

export default async function Page({params}: Props) {
	const {data, error} = await getPublishedProductBySlug(params.slug)

	if(!data || error){
		notFound()
	}

	return (
		<Product data={data} />
	)
}
