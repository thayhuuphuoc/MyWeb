'use client'

import ProductCard from "@/components/public/products/product-card";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {getProducts} from "@/actions/products/queries";
import React, {useState} from "react";
import SearchProductInput from "@/components/public/shared/search-product-input";
import {useSearchContext} from "@/components/public/shared/search-provider";
import {Button} from "@/components/ui/button";

export default function ProductsList({productsPromise, enabledSearch}: {
	productsPromise: ReturnType<typeof getProducts>,
	enabledSearch?: boolean
}){
	const {data, pageCount} = React.use(productsPromise)
	const {filterParams, setFilterParams} = useSearchContext()

	return (
		<>
			{enabledSearch && (
				<div className={'container mx-auto max-w-[1400px] px-5 mt-10 mb-10'}>
					<SearchProductInput/>
					{Boolean(filterParams.title) && (
						<p className={'text-center mt-4 text-navyGray dark:text-white'}>Có {pageCount} trang kết quả tìm kiếm cho: <span className={'font-medium bg-yellow-300 dark:bg-yellow-500 px-2 py-1 rounded'}>{filterParams.title}</span></p>
					)}
				</div>
			)}

			<div className={'container mx-auto max-w-[1400px] px-5' + (enabledSearch ? '' : ' mt-10')}>
				<div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5'}>
					{data.map((product, index) => (
						<ProductCard product={product} key={product.id} size={'sm'} />
					))}
				</div>
				{data.length === 0 &&
					<div className={'text-lg lg:text-xl text-center text-navyGray dark:text-white'}>
						<p>Không có dữ liệu</p>
					</div>
				}
			</div>

			<div className={'container mx-auto max-w-[1400px] px-5 mt-10'}>
				{data.length > 0 && (
					<p className={'text-center mb-4 text-navyGray dark:text-white'}>Trang {filterParams.page} trên {pageCount} </p>
				)}
				<div className="text-center flex flex-nowrap items-center justify-center gap-7">
					{filterParams.page > 1 && (
						<Button
							onClick={()=>{
								setFilterParams({...filterParams, page: filterParams.page - 1})
							}}
							variant="outline"
							className="h-14 rounded-full px-6 gap-2"
						>
							<ArrowLeft className={'size-5'}/> Trước
						</Button>
					)}
					{filterParams.page < pageCount && (
						<Button
							onClick={()=>{
								setFilterParams({...filterParams, page: filterParams.page + 1})
							}}
							variant="outline"
							className="h-14 rounded-full px-6 gap-2"
						>
							Sau <ArrowRight className={'size-5'}/>
						</Button>
					)}
				</div>
			</div>
		</>
	)
}
