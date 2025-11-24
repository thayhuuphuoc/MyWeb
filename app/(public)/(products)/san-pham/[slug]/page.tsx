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

	return {
		title: data.title,
		keywords: data?.keywords,
		description: String(data.metaDescription),
		openGraph: {
			images: parseProductImages(data.images)[0].url || `${siteMetadata.ogImage}`,
			title: data.metaTitle || data.title,
			description: String(data.metaDescription),
		},
	}
}
export async function generateStaticParams() {
	const {data} = await getProducts({
		page: 1,
		per_page: 1000,
		status: ProductStatus.PUBLISHED
	})

	return data.map((product) => ({
		slug: product.slug,
	}))
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
