import {getProducts, getRandomPublishedProducts} from "@/actions/products/queries";
import React from "react";
import ProductCard from "@/components/public/products/product-card";

export default function RelatedProducts(props :{
	productsPromise: ReturnType<typeof getRandomPublishedProducts>
}){
	const {data} = React.use(props.productsPromise)

	return (
		<div className={'container mx-auto max-w-[1400px] px-5 mt-12 md:mt-16 lg:mt-20 mb-8 md:mb-12'}>
			<div className={'mb-4 md:mb-6 p-5 rounded-t-md'}>
				<h3 className={'text-xl md:text-2xl font-bold text-navyGray dark:text-white'}>Một số sản phẩm khác:</h3>
			</div>
			<div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4'}>
				{data?.map((product, index) => (
					<ProductCard product={product} key={product.id} size={'sm'} />
				))}
			</div>
		</div>
	)
}
