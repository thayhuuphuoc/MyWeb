'use client'

import React from "react";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {getProducts} from "@/actions/products/queries";
import ProductCard from "@/components/public/products/product-card";
import SearchProductInput from "@/components/public/shared/search-product-input";
import {useSearchContext} from "@/components/public/shared/search-provider";

export default function ProductsList({productsPromise, enabledSearch}: {
	productsPromise: ReturnType<typeof getProducts>,
	enabledSearch?: boolean
}){
	const {data, pageCount} = React.use(productsPromise)
	const {filterParams, setFilterParams} = useSearchContext()

	return (
		<>
			{enabledSearch && (
				<div className={'container mx-auto max-w-[1400px] px-5 mb-10 md:mb-12'}>
					<SearchProductInput/>
					{Boolean(filterParams.title) && (
						<p className={'text-center mt-4 text-gray-800 dark:text-white'}>Có {pageCount} trang kết quả tìm kiếm cho: <span className={'font-medium bg-yellow-300 dark:bg-yellow-500 px-2 py-1 rounded'}>{filterParams.title}</span></p>
					)}
				</div>
			)}

			<div className={'container mx-auto max-w-[1400px] px-5 mt-10 md:mt-12 mb-12 md:mb-16'}>
				{data.length === 0 ? (
					<div className={'text-lg lg:text-xl text-center text-gray-800 dark:text-white'}>
						<p>Không có dữ liệu</p>
					</div>
				) : (
					<div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5'}>
						{data.map((product) => (
							<ProductCard product={product} key={product.id} size={'sm'} />
						))}
					</div>
				)}
			</div>

			<div className={'container mx-auto max-w-[1400px] px-5 mt-12 md:mt-16 '}>
				{data.length > 0 && (
					<p className={'text-center mb-4 text-gray-800 dark:text-white'}>Trang {filterParams.page} trên {pageCount} </p>
				)}
				<div className="text-center flex flex-nowrap items-center justify-center gap-7">
					{filterParams.page > 1 && (
						<button
							type="button"
							onClick={() => setFilterParams({...filterParams, page: filterParams.page - 1})}
							className="cursor-pointer h-14 inline-flex rounded-full bg-blue-200 dark:bg-blue-800 p-[2px]"
						>
							<div className="text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg dark:bg-surfaceDark px-6 transition-all duration-150 hover:bg-opacity-70 text-[15px] text-gray-800 dark:text-white">
								<ArrowLeft className="mr-5 size-5"/> Trước
							</div>
						</button>
					)}
					{filterParams.page < pageCount && (
						<button
							type="button"
							onClick={() => setFilterParams({...filterParams, page: filterParams.page + 1})}
							className="cursor-pointer h-14 inline-flex rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 dark:from-pink-600 dark:via-blue-600 dark:to-green-600 p-[2px]"
						>
							<div className="text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg dark:bg-surfaceDark px-6 transition-all duration-150 hover:bg-opacity-80 text-[15px] text-gray-800 dark:text-white">
								Sau <ArrowRight className="ml-5 size-5"/>
							</div>
						</button>
					)}
				</div>
			</div>
		</>
	)
}
