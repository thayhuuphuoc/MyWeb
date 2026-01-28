'use client'
import PostCard from "@/components/public/posts/post-card";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {getPosts} from "@/actions/posts/queries";
import React from "react";
import {useSearchContext} from "@/components/public/shared/search-provider";
import SearchPostInput from "@/components/public/shared/search-post-input";

export default function SearchPostsList({postsPromise}: {
	postsPromise: ReturnType<typeof getPosts>,
}){
	const {data, pageCount} = React.use(postsPromise)
	const {filterParams, setFilterParams} = useSearchContext()

	return (
		<>
			<div className={'container mx-auto max-w-[1400px] px-5 '}>
				<SearchPostInput/>
				{Boolean(filterParams.title) && (
					<p className={'text-center mt-4'}>Có {pageCount} trang kết quả tìm kiếm cho: <span className={'font-medium bg-yellow-300'}>{filterParams.title}</span></p>
				)}
			</div>

			<div className={'container mx-auto max-w-[1400px] px-5 mt-10'}>
				<div className={'grid grid-cols-1 min-[1024px]:grid-cols-2 gap-7'}>
					{data.map((post, index) => (
						<PostCard post={post} key={post.id} />
					))}
				</div>
				{data.length === 0 &&
					<div className={'text-lg lg:text-xl text-center'}>
						<p>Không có dữ liệu</p>
					</div>
				}
			</div>

			<div className={'container mx-auto max-w-[1400px] px-5 mt-10 '}>
				{data.length > 0 && (
					<p className={'text-center mb-4'}>Trang {filterParams.page} trên {pageCount} </p>
				)}
				<div className="text-center flex flex-nowrap items-center justify-center gap-7">
					{filterParams.page > 1 && (
						<div
							onClick={()=>{
								setFilterParams({...filterParams, page: filterParams.page - 1})
							}}
							className={'cursor-pointer h-14 inline-flex rounded-full bg-blue-200 p-[2px]'}
						>
							<div className={'text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg back px-6 transition-all duration-150 hover:bg-opacity-70 text-[15px]'}>
								<ArrowLeft className={'mr-5 size-5'}/> Trước
							</div>
						</div>
					)}
					{filterParams.page < pageCount && (
						<div
							onClick={()=>{
								setFilterParams({...filterParams, page: filterParams.page + 1})
							}}
							className={'cursor-pointer h-14 inline-flex rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 p-[2px]'}
						>
							<div className={'text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg back px-6 transition-all duration-150 hover:bg-opacity-80 text-[15px]'}>
								Sau <ArrowRight className={'ml-5 size-5'}/>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

