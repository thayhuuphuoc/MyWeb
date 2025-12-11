"use client";

import React, { useState, useEffect, useTransition, useMemo, useCallback } from "react";
import PostCard from "./post-card";
import { SearchInput } from "./search-input";
import { getPosts } from "@/actions/posts/queries";
import { TPostCategoryWithPostCount } from "@/actions/posts/categories/validations";
import { PostStatus } from ".prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogWithCategoriesProps {
	initialPostsPromise: ReturnType<typeof getPosts>;
	currentPage: number;
	categories: TPostCategoryWithPostCount[];
	navLink?: string;
	enabledSearch?: boolean;
}

export default function BlogWithCategories({
	initialPostsPromise,
	currentPage,
	categories,
	navLink = "/blog",
	enabledSearch = false,
}: BlogWithCategoriesProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	
	const categoryParam = searchParams.get("category");
	const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(
		categoryParam || null
	);
	const [postsPromise, setPostsPromise] = useState(initialPostsPromise);

	// Update posts when category or page changes
	useEffect(() => {
		startTransition(() => {
			const newPostsPromise = getPosts({
				page: currentPage,
				per_page: 15,
				status: PostStatus.PUBLISHED,
				category_slug: selectedCategorySlug || undefined,
			});
			setPostsPromise(newPostsPromise);
		});
	}, [selectedCategorySlug, currentPage]);

	// Sync with URL params
	useEffect(() => {
		const categoryParam = searchParams.get("category");
		if (categoryParam !== selectedCategorySlug) {
			setSelectedCategorySlug(categoryParam);
		}
	}, [searchParams, selectedCategorySlug]);

	// Handle category selection
	const handleCategorySelect = useCallback((categorySlug: string | null) => {
		setSelectedCategorySlug(categorySlug);
		
		// Update URL - navigate to page 1 when changing category
		const params = new URLSearchParams();
		if (categorySlug) {
			params.set("category", categorySlug);
		}
		
		const newUrl = params.toString() 
			? `${navLink}?${params.toString()}`
			: navLink;
		
		router.push(newUrl);
	}, [navLink, router]);

	// Get selected category name for title
	const selectedCategory = useMemo(() => 
		categories.find((cat) => cat.slug === selectedCategorySlug),
		[categories, selectedCategorySlug]
	);

	// Create custom navLink that includes category filter
	const getNavLinkWithCategory = useCallback((page: number) => {
		const params = new URLSearchParams();
		if (selectedCategorySlug) {
			params.set("category", selectedCategorySlug);
		}
		const queryString = params.toString();
		
		if (page === 1) {
			return queryString ? `${navLink}?${queryString}` : navLink;
		}
		return queryString 
			? `${navLink}/page/${page}?${queryString}`
			: `${navLink}/page/${page}`;
	}, [navLink, selectedCategorySlug]);

	return (
		<>
			<PostsListWithCategory
				postsPromise={postsPromise}
				currentPage={currentPage}
				listTitle={selectedCategory?.name}
				navLink={navLink}
				getNavLink={getNavLinkWithCategory}
				enabledSearch={enabledSearch}
			/>
		</>
	);
}

// Wrapper component to pass custom navLink function
function PostsListWithCategory({
	postsPromise,
	currentPage,
	listTitle,
	navLink,
	getNavLink,
	enabledSearch,
}: {
	postsPromise: ReturnType<typeof getPosts>;
	currentPage: number;
	listTitle?: string;
	navLink: string;
	getNavLink: (page: number) => string;
	enabledSearch?: boolean;
}) {
	const {data, pageCount} = React.use(postsPromise)

	if(!data || data.length === 0){
		return (
			<div className="container mx-auto px-4 sm:px-7 text-center py-12">
				<p className="text-gray-600 dark:text-gray-400">Không có bài viết nào.</p>
			</div>
		)
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
				{data.map((post) => (
					<PostCard post={post} key={post.id} smallSize />
				))}
			</div>

			{pageCount > 1 && (
				<div className={'mt-12 mb-16'}>
					<div className={'container mx-auto px-4 sm:px-7'}>
						<BlogPaginationWithCategory 
							currentPage={currentPage} 
							pageCount={pageCount} 
							getNavLink={getNavLink}
						/>
					</div>
				</div>
			)}
		</>
	);
}


// Blog Pagination Component with Category Support
function BlogPaginationWithCategory({
	currentPage,
	pageCount,
	getNavLink,
}: {
	currentPage: number;
	pageCount: number;
	getNavLink: (page: number) => string;
}) {
	const pageNumbers = generatePageNumbers(currentPage, pageCount);
	
	return (
		<nav className="flex items-center justify-center gap-2" aria-label="Blog pagination">
			{/* Previous Button */}
			{currentPage > 1 ? (
				<Link 
					href={getNavLink(currentPage - 1)}
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
				<div className="w-[100px]"></div>
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
							href={getNavLink(page)}
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
					href={getNavLink(currentPage + 1)}
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
				<div className="w-[80px]"></div>
			)}
		</nav>
	);
}

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(currentPage: number, pageCount: number): (number | 'ellipsis')[] {
	const pages: (number | 'ellipsis')[] = []
	
	if (pageCount <= 7) {
		for (let i = 1; i <= pageCount; i++) {
			pages.push(i)
		}
		return pages
	}
	
	pages.push(1)
	
	if (currentPage <= 3) {
		for (let i = 2; i <= 4; i++) {
			pages.push(i)
		}
		if (pageCount > 5) {
			pages.push('ellipsis')
		}
		pages.push(pageCount - 1)
		pages.push(pageCount)
	} else if (currentPage >= pageCount - 2) {
		pages.push(2)
		if (pageCount > 5) {
			pages.push('ellipsis')
		}
		for (let i = pageCount - 3; i <= pageCount; i++) {
			pages.push(i)
		}
	} else {
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







