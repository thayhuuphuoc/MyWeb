import PageHeading from "@/components/dashboard/page-heading";
import {Metadata} from "next";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import {getPosts} from "@/actions/posts/queries";

import {getPostConstants} from "@/actions/posts/queries";
import {SearchParams} from "@/types";
import {searchParamsSchema} from "@/actions/posts/validations";
import {PostTableProvider} from "@/app/(protected)/dashboard/posts/_components/post-table-provider";
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton";
import React from "react";
import PostTable from "@/app/(protected)/dashboard/posts/_components/post-table";

export const metadata: Metadata = {
	title: 'Bài viết ',
}

export default function Page({searchParams}: {
	searchParams: SearchParams
}){
	const constants = getPostConstants()
	const posts = getPosts({...searchParamsSchema.parse(searchParams)})

	return (
		<>
			<PageHeading
				title={'Bài viết'}
				right={(
					<Button
						asChild
					>
						<Link href={'/dashboard/posts/add'}>
							Thêm Bài viết <PlusIcon className={'ml-2'} />
						</Link>
					</Button>
				)}
			/>
			<div className="container space-y-5">
				<PostTableProvider>
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
						<PostTable
							constantsPromise={constants}
							postsPromise={posts}
						/>
					</React.Suspense>
				</PostTableProvider>
			</div>
		</>
	)
}
