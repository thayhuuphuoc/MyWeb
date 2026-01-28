import PageHeading from "@/components/dashboard/page-heading";
import {Metadata} from "next";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";

import {getProductCategories} from "@/actions/products/categories/queries";
import ProductCategoriesTable from "@/app/(protected)/dashboard/products/categories/_components/product-categories-table";
import {
	ProductCategoriesTableProvider
} from "@/app/(protected)/dashboard/products/categories/_components/product-categories-table-provider";
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton";
import React from "react";
import {SearchParams} from "@/types";
import {searchParamsSchema} from "@/actions/products/categories/validations";


export const metadata: Metadata = {
	title: 'Danh mục Sản phẩm ',
}

export default function Page({searchParams}: {
	searchParams: SearchParams
}){
	const categories = getProductCategories({...searchParamsSchema.parse(searchParams)})
	return (
		<>
			<PageHeading
				title={'Danh mục Sản phẩm'}
			/>
			<div className="container space-y-5">
				<ProductCategoriesTableProvider>
					<React.Suspense
						fallback={
							<DataTableSkeleton
								columnCount={5}
								searchableColumnCount={1}
								filterableColumnCount={2}
								cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
								shrinkZero
							/>
						}
					>
						<ProductCategoriesTable productCategoriesPromise={categories}/>
					</React.Suspense>
				</ProductCategoriesTableProvider>
			</div>
		</>
	)
}
