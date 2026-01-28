import {getProductConstants, getProducts} from "@/actions/products/queries";
import {ProductStatus} from ".prisma/client";
import ProductsList from "@/components/public/products/products-list";
import {getProductTag, getProductTags, getProductTagBySlug} from "@/actions/products/tags/queries";
import {notFound} from "next/navigation";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {searchParamsSchema} from "@/actions/products/validations";
import React from "react";
import ProductTags from "@/components/public/products/product-tags";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const {data, error} = await getProductTagBySlug(params.slug)

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	return {
		title: `Tag sản phẩm: ${data.name}`,
		description: `Danh sách sản phẩm với tag: ${data.name}`,
		openGraph: {
			title: `Tag sản phẩm: ${data.name}`,
			description: `Danh sách sản phẩm với tag: ${data.name}`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

export async function generateStaticParams() {
	const {data, pageCount} = await getProductTags({
		page: 1,
		per_page: 1000,
	})
	const tags = data.filter(tag => tag._count.products !== 0)

	return tags.map((tag) => ({
		slug: tag.slug,
	}))
}

export default async function Page({params, searchParams}: Props){
	const tag = await getProductTagBySlug(params.slug)

	if(!tag.data || tag.error){
		notFound()
	}

	const parsedSearchParams = searchParamsSchema.parse(searchParams)
	const productsPromise = getProducts({
		...parsedSearchParams,
		per_page: 20,
		status: ProductStatus.PUBLISHED,
		tag_slug: params.slug,
	})

	return (
		<>
			<div className={'mt-10'}>
				{parsedSearchParams.page > 1 ? <p className={'text-center'}>{`Trang ${parsedSearchParams.page}`}</p> : ''}
				<h1 className="container mx-auto px-5 text-center text-xl font-bold m-0">
					Tag sản phẩm: {tag.data.name}
				</h1>
			</div>

			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<ProductsList
					productsPromise={productsPromise}
				/>
			</React.Suspense>
		</>
	)
}
