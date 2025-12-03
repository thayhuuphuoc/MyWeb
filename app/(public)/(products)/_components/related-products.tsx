import React from "react";
import {getRandomPublishedProducts} from "@/actions/products/queries";
import ProductCard from "@/components/public/products/product-card";

export default function RelatedProducts({
	productsPromise
}: {
	productsPromise: ReturnType<typeof getRandomPublishedProducts>
}){
	const {data} = React.use(productsPromise)

	if (!data || data.length === 0) return null

	return (
		<div className="container mx-auto max-w-[1400px] px-5 mt-12 md:mt-16 lg:mt-20 mb-8 md:mb-12">
			<div className="mb-4 md:mb-6 p-5 rounded-t-md">
				<h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
					Một số sản phẩm khác:
				</h3>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
				{data.map((product) => (
					<ProductCard product={product} key={product.id} size="sm" />
				))}
			</div>
		</div>
	)
}
