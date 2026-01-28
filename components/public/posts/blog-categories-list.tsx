"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { TPostCategoryWithPostCount } from "@/actions/posts/categories/validations";
import { cn } from "@/lib/utils";

interface BlogCategoriesListProps {
	categories: TPostCategoryWithPostCount[];
	selectedCategoryId?: string | null;
	onCategorySelect?: (categoryId: string | null) => void;
	navLink?: string;
}

// Get default placeholder colors for categories without images
const getCategoryColor = (index: number) => {
	const colors = [
		"bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
		"bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
		"bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
		"bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800",
		"bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800",
		"bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800",
	];
	return colors[index % colors.length];
};

export default function BlogCategoriesList({
	categories,
	selectedCategoryId,
	onCategorySelect,
	navLink = "/blog",
}: BlogCategoriesListProps) {
	// Filter categories that have posts
	const categoriesWithPosts = useMemo(() => 
		categories.filter((category) => (category._count?.posts || 0) > 0),
		[categories]
	);

	if (categoriesWithPosts.length === 0) {
		return null;
	}

	return (
		<div className="mt-8">
			{/* Title */}
			<div className="mb-4">
				<h2 className="text-lg font-bold text-white bg-blue-600 dark:bg-blue-700 px-4 py-3 rounded-lg">
					DANH MỤC BÀI VIẾT
				</h2>
			</div>

			{/* Categories List */}
			<div className="space-y-3">
				{categoriesWithPosts.map((category, index) => {
					const postCount = category._count?.posts || 0;
					const isSelected = selectedCategoryId === category.slug;
					const categoryLink = `${navLink}?category=${category.slug}`;
					
					// Common content for both button and link
					const categoryContent = (
						<>
							{/* Image Thumbnail - Left */}
							<div className="flex-shrink-0">
								{category.image ? (
									<div className="relative w-[60px] h-[60px] rounded-full overflow-hidden">
										<Image
											src={category.image}
											alt={category.name}
											fill
											className="object-cover"
											sizes="60px"
										/>
									</div>
								) : (
									<div
										className={cn(
											"w-[60px] h-[60px] rounded-full",
											getCategoryColor(index)
										)}
									/>
								)}
							</div>

							{/* Category Info - Right (beside image, same row) */}
							<div className="flex-1 min-w-0 flex flex-col justify-center">
								<div className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1">
									{category.name}
								</div>
								<div className="text-sm text-gray-500 dark:text-gray-400">
									{postCount} {postCount === 1 ? "bài viết" : "bài viết"}
								</div>
							</div>
						</>
					);

					// Common className for both button and link
					const baseClassName = cn(
						"w-full flex flex-row items-center gap-3 p-3 rounded-lg",
						"hover:bg-gray-50 dark:hover:bg-gray-800/50",
						"transition-colors duration-150",
						"text-left"
					);
					
					return onCategorySelect ? (
						<button
							key={category.id}
							onClick={() => onCategorySelect(isSelected ? null : category.slug)}
							className={cn(baseClassName, isSelected && "bg-gray-100 dark:bg-gray-800")}
						>
							{categoryContent}
						</button>
					) : (
						<Link
							key={category.id}
							href={categoryLink}
							className={baseClassName}
						>
							{categoryContent}
						</Link>
					);
				})}
			</div>
		</div>
	);
}




