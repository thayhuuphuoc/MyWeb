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
			<div className={'mt-10'}>
				{currentPage > 1 ? <p className={'text-center'}>{`Trang ${currentPage}`}</p> : ''}
				<h1 className="container mx-auto px-5 text-center text-xl font-bold m-0">
					{listTitle ? listTitle : 'Bài viết mới nhất'}
				</h1>
			</div>

			{Boolean(enabledSearch) && (
				<div className={'container mx-auto max-w-[1400px] px-5 mt-8'}>
					<SearchInput/>
				</div>
			)}


			<div className={'container mx-auto max-w-[1400px] px-5 grid grid-cols-1 min-[1024px]:grid-cols-2 gap-7 mt-10'}>
				{data.map((post, index) => (
					<PostCard post={post} key={post.id} />
				))}
			</div>

			<div className={'container mx-auto max-w-[1400px] px-5 mt-10 text-center flex flex-nowrap items-center justify-center gap-7'}>
				{currentPage > 1 && (
					<Link href={`${navLink ? navLink : '/blog'}/page/${currentPage-1}`} className={'h-14 inline-flex rounded-full bg-blue-200 p-[2px]'}>
						<span className={'text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg back px-6 transition-all duration-150 hover:bg-opacity-70 text-[15px]'}>
							<ArrowLeft className={'mr-5 size-5'}/> Trước
						</span>
					</Link>
				)}
				{currentPage < pageCount && (
					<Link href={`${navLink ? navLink : '/blog'}/page/${currentPage+1}`} className={'h-14 inline-flex rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 p-[2px]'}>
						<span className={'text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg back px-6 transition-all duration-150 hover:bg-opacity-80 text-[15px]'}>
							Sau <ArrowRight className={'ml-5 size-5'}/>
						</span>
					</Link>
				)}
			</div>
		</>
	)
}

