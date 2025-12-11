import PostCard from "@/components/public/posts/post-card";
import Link from "next/link";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {getPosts} from "@/actions/posts/queries";
import React from "react";
import {notFound} from "next/navigation";
import {SearchInput} from "@/components/public/posts/search-input";
import {cn} from "@/lib/utils";

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
					<div className={'container mx-auto px-4 sm:px-7'}>
						<BlogPagination 
							currentPage={currentPage} 
							pageCount={pageCount} 
							navLink={navLink || '/blog'} 
						/>
					</div>
				</div>
			)}
		</>
	)
}

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(currentPage: number, pageCount: number): (number | 'ellipsis')[] {
	const pages: (number | 'ellipsis')[] = []
	
	if (pageCount <= 7) {
		// Show all pages if total is small
		for (let i = 1; i <= pageCount; i++) {
			pages.push(i)
		}
		return pages
	}
	
	// Always show first page
	pages.push(1)
	
	if (currentPage <= 3) {
		// Show first few pages: 1 2 3 4 ... 15 16
		for (let i = 2; i <= 4; i++) {
			pages.push(i)
		}
		if (pageCount > 5) {
			pages.push('ellipsis')
		}
		pages.push(pageCount - 1)
		pages.push(pageCount)
	} else if (currentPage >= pageCount - 2) {
		// Show last few pages: 1 2 ... 13 14 15 16
		pages.push(2)
		if (pageCount > 5) {
			pages.push('ellipsis')
		}
		for (let i = pageCount - 3; i <= pageCount; i++) {
			pages.push(i)
		}
	} else {
		// Show pages around current: 1 2 ... 7 8 9 ... 15 16
		pages.push(2)
		pages.push('ellipsis')
		for (let i = currentPage - 1; i <= currentPage + 1; i++) {
			pages.push(i)
		}
		pages.push('ellipsis')
		pages.push(pageCount - 1)
		pages.push(pageCount)
	}
	
	return pages
}

// Blog Pagination Component
function BlogPagination({currentPage, pageCount, navLink}: {
	currentPage: number
	pageCount: number
	navLink: string
}) {
	const pageNumbers = generatePageNumbers(currentPage, pageCount)
	
	return (
		<nav className="flex items-center justify-center gap-2" aria-label="Blog pagination">
			{/* Previous Button */}
			{currentPage > 1 ? (
				<Link 
					href={`${navLink}/page/${currentPage - 1}`}
					className={cn(
						"inline-flex items-center justify-center rounded-lg",
						"px-4 py-2 text-sm font-medium",
						"text-gray-700 dark:text-gray-300",
						"hover:bg-gray-100 dark:hover:bg-gray-800",
						"transition-colors duration-150"
					)}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Trước
				</Link>
			) : (
				<div className="w-[100px]"></div> // Spacer to maintain layout
			)}
			
			{/* Page Numbers */}
			<div className="flex items-center gap-1">
				{pageNumbers.map((page, index) => {
					if (page === 'ellipsis') {
						return (
							<span 
								key={`ellipsis-${index}`}
								className="px-2 py-1 text-gray-500 dark:text-gray-400"
							>
								...
							</span>
						)
					}
					
					const isActive = page === currentPage
					
					return (
						<Link
							key={page}
							href={page === 1 ? navLink : `${navLink}/page/${page}`}
							className={cn(
								"inline-flex items-center justify-center",
								"min-w-[36px] h-9 px-3 text-sm font-medium",
								"transition-colors duration-150",
								isActive
									? "rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
									: "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
							)}
						>
							{page}
						</Link>
					)
				})}
			</div>
			
			{/* Next Button */}
			{currentPage < pageCount ? (
				<Link 
					href={`${navLink}/page/${currentPage + 1}`}
					className={cn(
						"inline-flex items-center justify-center rounded-lg",
						"px-4 py-2 text-sm font-medium",
						"text-gray-700 dark:text-gray-300",
						"hover:bg-gray-100 dark:hover:bg-gray-800",
						"transition-colors duration-150"
					)}
				>
					Sau
					<ArrowRight className="ml-2 h-4 w-4" />
				</Link>
			) : (
				<div className="w-[80px]"></div> // Spacer to maintain layout
			)}
		</nav>
	)
}

