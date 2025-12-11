import {getProductConstants, getProducts} from "@/actions/products/queries";
import {ProductStatus} from ".prisma/client";
import ProductsList from "@/components/public/products/products-list";
import {Metadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {SearchParams} from "@/types";
import {searchParamsSchema} from "@/actions/products/validations";
import React from "react";
import {SearchProvider} from "@/components/public/shared/search-provider";

export const metadata: Metadata = {
	title: 'Sản phẩm',
	description: 'Danh sách sản phẩm, các món ăn vặt trung quốc hot nhất - được cập nhật thường xuyên',
	openGraph: {
		title: 'Sản phẩm',
		description: 'Danh sách sản phẩm, các món ăn vặt trung quốc hot nhất - được cập nhật thường xuyên',
		images: `${siteMetadata.ogImage}`
	}
}

export default function Page({searchParams}: {
	searchParams: SearchParams
}){
	const parsedSearchParams = searchParamsSchema.parse(searchParams)
	const productsPromise = getProducts({
		...parsedSearchParams,
		per_page: 20,
		status: ProductStatus.PUBLISHED
	})

	return (
		<>
			<div className="mt-10 mb-8 md:mb-10">
				{parsedSearchParams.page > 1 && (
					<p className="text-center text-gray-800 dark:text-white">
						Trang {parsedSearchParams.page}
					</p>
				)}
				<h1 className="container mx-auto px-5 text-center text-2xl md:text-3xl font-bold m-0 text-gray-800 dark:text-white">
					Sản phẩm mới nhất
				</h1>
			</div>

			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<SearchProvider>
					<ProductsList
						productsPromise={productsPromise}
						enabledSearch={true}
					/>
				</SearchProvider>
			</React.Suspense>
		</>
	)
}
