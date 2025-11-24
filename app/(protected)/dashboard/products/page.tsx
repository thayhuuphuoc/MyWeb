import PageHeading from "@/components/dashboard/page-heading";
import {Metadata} from "next";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import {getProducts} from "@/actions/products/queries";

import {getProductConstants} from "@/actions/products/queries";
import {SearchParams} from "@/types";
import {searchParamsSchema} from "@/actions/products/validations";
import {ProductTableProvider} from "@/app/(protected)/dashboard/products/_components/product-table-provider";
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton";
import React from "react";
import ProductTable from "@/app/(protected)/dashboard/products/_components/product-table";

export const metadata: Metadata = {
	title: 'Sản phẩm ',
}

export default function Page({searchParams}: {
	searchParams: SearchParams
}){
	const constants = getProductConstants()
	const products = getProducts({...searchParamsSchema.parse(searchParams)})

	return (
		<>
			<PageHeading
				title={'Sản phẩm'}
				right={(
					<Button
						asChild
					>
						<Link href={'/dashboard/products/add'}>
							Thêm Sản phẩm <PlusIcon className={'ml-2'} />
						</Link>
					</Button>
				)}
			/>
			<div className="container space-y-5">
				<ProductTableProvider>
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
						<ProductTable
							constantsPromise={constants}
							productsPromise={products}
						/>
					</React.Suspense>
				</ProductTableProvider>
			</div>
		</>
	)
}
