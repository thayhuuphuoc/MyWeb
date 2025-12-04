import PostCard from "@/components/public/posts/post-card";
import Link from "next/link";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {getPosts} from "@/actions/posts/queries";
import React from "react";
import {notFound} from "next/navigation";
import {SearchInput} from "@/components/public/posts/search-input";

export default function PostsList({postsPromise, currentPage, listTitle, navLink, enabledSearch}: {
	postsPromise: ReturnType<typeof getPosts>,
	currentPage: number,
	listTitle?: string,
	navLink?: string,
	enabledSearch?: boolean
}){
	const {data, pageCount} = React.use(postsPromise)

	if(!data || data.length === 0){
		notFound()
	}

	return (
		<>
			<div className={'mt-10 mb-6'}>
				{currentPage > 1 ? <p className={'text-center text-navyGray dark:text-white mb-2'}>{`Trang ${currentPage}`}</p> : ''}
				<h1 className="container mx-auto px-4 sm:px-7 text-center text-2xl md:text-3xl font-bold m-0 text-navyGray dark:text-white">
					{listTitle ? listTitle : 'Bài viết mới nhất'}
				</h1>
			</div>

			{Boolean(enabledSearch) && (
				<div className={'container mx-auto px-4 sm:px-7'}>
					<div className="mb-10">
						<SearchInput/>
					</div>
				</div>
			)}

			<div className={'container mx-auto px-4 sm:px-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 mt-10'}>
				{data.map((post, index) => (
					<PostCard post={post} key={post.id} smallSize />
				))}
			</div>

			{pageCount > 1 && (
				<div className={'mt-12 mb-16'}>
					<div className={'container mx-auto px-4 sm:px-7 text-center'}>
						<p className={'text-center mb-4 text-navyGray dark:text-white'}>
							Trang {currentPage} trên {pageCount}
						</p>
						<div className="flex flex-nowrap items-center justify-center gap-7">
							{currentPage > 1 && (
								<Link href={`${navLink ? navLink : '/blog'}/page/${currentPage-1}`} className={'h-14 inline-flex rounded-full bg-blue-200 p-[2px]'}>
									<span className={'text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg dark:bg-surfaceDark back px-6 transition-all duration-150 hover:bg-opacity-70 text-[15px]'}>
										<ArrowLeft className={'mr-5 size-5'}/> Trước
									</span>
								</Link>
							)}
							{currentPage < pageCount && (
								<Link href={`${navLink ? navLink : '/blog'}/page/${currentPage+1}`} className={'h-14 inline-flex rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 p-[2px]'}>
									<span className={'text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg dark:bg-surfaceDark back px-6 transition-all duration-150 hover:bg-opacity-80 text-[15px]'}>
										Sau <ArrowRight className={'ml-5 size-5'}/>
									</span>
								</Link>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}

