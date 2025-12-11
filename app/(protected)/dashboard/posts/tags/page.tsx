import PageHeading from "@/components/dashboard/page-heading";
import {Metadata} from "next";

import {getPostTags} from "@/actions/posts/tags/queries";
import PostTagsTable from "@/app/(protected)/dashboard/posts/tags/_components/post-tags-table";
import {
	PostTagsTableProvider
} from "@/app/(protected)/dashboard/posts/tags/_components/post-tags-table-provider";
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton";
import React from "react";
import {SearchParams} from "@/types";
import {tagSearchParamsSchema} from "@/actions/common/tag-schema";


export const metadata: Metadata = {
	title: 'Tag Bài viết ',
}

export default function Page({searchParams}: {
	searchParams: SearchParams
}){
	const tags = getPostTags({...tagSearchParamsSchema.parse(searchParams)})
	return (
		<>
			<PageHeading
				title={'Tag Bài viết'}
			/>
			<div className="container space-y-5">
				<PostTagsTableProvider>
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
						<PostTagsTable postTagsPromise={tags}/>
					</React.Suspense>
				</PostTagsTableProvider>
			</div>
		</>
	)
}
