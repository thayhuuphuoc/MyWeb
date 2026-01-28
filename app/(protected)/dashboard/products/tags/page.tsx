import PageHeading from "@/components/dashboard/page-heading";
import {Metadata} from "next";

import {getProductTags} from "@/actions/products/tags/queries";
import ProductTagsTable from "@/app/(protected)/dashboard/products/tags/_components/product-tags-table";
import {
	ProductTagsTableProvider
} from "@/app/(protected)/dashboard/products/tags/_components/product-tags-table-provider";
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton";
import React from "react";
import {SearchParams} from "@/types";
import {searchParamsSchema} from "@/actions/products/tags/validations";


export const metadata: Metadata = {
	title: 'Tag Sản phẩm ',
}

export default function Page({searchParams}: {
	searchParams: SearchParams
}){
	const tags = getProductTags({...searchParamsSchema.parse(searchParams)})
	return (
		<>
			<PageHeading
				title={'Tag Sản phẩm'}
			/>
			<div className="container space-y-5">
				<ProductTagsTableProvider>
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
						<ProductTagsTable productTagsPromise={tags}/>
					</React.Suspense>
				</ProductTagsTableProvider>
			</div>
		</>
	)
}
