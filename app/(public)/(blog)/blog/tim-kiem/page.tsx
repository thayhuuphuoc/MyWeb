import {PostStatus} from ".prisma/client";
import {Metadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {SearchParams} from "@/types";
import {searchParamsSchema} from "@/actions/posts/validations";
import React from "react";
import {SearchProvider} from "@/components/public/shared/search-provider";
import {getPosts} from "@/actions/posts/queries";
import SearchPostsList from "@/components/public/posts/search-posts-list";

export const metadata: Metadata = {
	title: 'Tìm kiếm bài viết',
	description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
	openGraph: {
		title: 'Tìm kiếm bài viết',
		description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
		images: `${siteMetadata.ogImage}`
	}
}

export default function Page({searchParams}: {
	searchParams: SearchParams
}){
	const parsedSearchParams = searchParamsSchema.parse(searchParams)
	const postsPromise = getPosts({
		...parsedSearchParams,
		per_page: 10,
		status: PostStatus.PUBLISHED
	})

	return (
		<>
			<div className={'mt-10'}>
				{parsedSearchParams.page > 1 ? <p className={'text-center'}>{`Trang ${parsedSearchParams.page}`}</p> : ''}
				<h1 className="container mx-auto px-5 text-center text-xl font-bold m-0">
					Tìm kiếm bài viết
				</h1>
			</div>

			<React.Suspense
				fallback={<p className='text-center mx-auto my-8 text-xl'>Loading</p>}
			>
				<SearchProvider>
					<SearchPostsList
						postsPromise={postsPromise}
					/>
				</SearchProvider>
			</React.Suspense>
		</>
	)
}
