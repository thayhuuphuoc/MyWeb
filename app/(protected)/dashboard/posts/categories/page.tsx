import PageHeading from "@/components/dashboard/page-heading";
import {Metadata} from "next";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";

import {getPostCategories} from "@/actions/posts/categories/queries";
import PostCategoriesTable from "@/app/(protected)/dashboard/posts/categories/_components/post-categories-table";
import {
	PostCategoriesTableProvider
} from "@/app/(protected)/dashboard/posts/categories/_components/post-categories-table-provider";
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton";
import React from "react";
import {SearchParams} from "@/types";

import {catSearchParamsSchema} from "@/actions/common/category-schema";


export const metadata: Metadata = {
	title: 'Danh mục Bài viết ',
}

export default function Page({searchParams}: {
	searchParams: SearchParams
}){
	const categories = getPostCategories({...catSearchParamsSchema.parse(searchParams)})
	return (
		<>
			<PageHeading
				title={'Danh mục Bài viết'}
			/>
			<div className="container space-y-5">
				<PostCategoriesTableProvider>
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
						<PostCategoriesTable postCategoriesPromise={categories}/>
					</React.Suspense>
				</PostCategoriesTableProvider>
			</div>
		</>
	)
}
