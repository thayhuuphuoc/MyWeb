"use client";

import { useState } from "react";
import BlogCard from "./blog-card";
import Link from "next/link";
import { TPostWithRelation } from "@/actions/posts/validations";

interface DiscoverCategoryProps {
	posts: TPostWithRelation[];
}

export default function DiscoverCategory({ posts }: DiscoverCategoryProps) {
	const [selectedCategory, setSelectedCategory] = useState("All");

	const categoriesWithCount = posts.reduce((acc, post) => {
		const categoryName = post.categories?.[0]?.name || "Uncategorized";
		acc[categoryName] = (acc[categoryName] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const categoryButtons = [
		{ tag: "All", count: posts.length },
		...Object.entries(categoriesWithCount).map(([tag, count]) => ({
			tag,
			count,
		})),
	];

	const filteredPosts =
		selectedCategory === "All"
			? posts
			: posts.filter((post) => post.categories?.[0]?.name === selectedCategory);

	// Format tên danh mục: chữ cái đầu mỗi từ viết hoa, còn lại viết thường
	const formatCategoryName = (str: string) => {
		if (!str) return str;
		// Chuyển tất cả về chữ thường trước, sau đó viết hoa chữ cái đầu mỗi từ
		return str
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	return (
		<section>
			<div className="dark:bg-baseInk">
				<div className="container mx-auto px-4 sm:px-7">
					<div className="flex flex-col items-center gap-9 md:gap-14 py-14 md:py-20">
						<div className="flex flex-col items-center text-center gap-3.5">
							<h1 className="font-semibold text-2xl md:text-3xl">
								Danh mục bài viết
							</h1>
							<p className="font-medium text-navyGray dark:text-white/80">
								Chọn một danh mục để khám phá nội dung phù hợp - Tìm những gì
								bạn quan tâm
							</p>
						</div>

						{/* Filter Buttons */}
						<div className="flex flex-wrap justify-center gap-3">
							{categoryButtons.map(({ tag, count }) => (
								<button
									key={tag}
									onClick={() => setSelectedCategory(tag)}
									className={`px-4 py-2 rounded-md text-base font-semibold border transition-all cursor-pointer hover:text-white dark:hover:text-black hover:bg-black dark:hover:bg-white duration-500 ${
										selectedCategory === tag
											? "bg-black dark:bg-white text-white dark:text-black dark:border-white/20"
											: "bg-transparent text-black dark:text-white border-black/20 dark:border-white/20"
									}`}
								>
									{tag === "All" ? "Tất Cả" : formatCategoryName(tag)} ({count.toString().padStart(2, "0")})
								</button>
							))}
						</div>

						{/* Blog Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredPosts.slice(0, 6).map((post) => (
								<BlogCard key={post.id} post={post} />
							))}
						</div>

						<Link
							href="/blog"
							className="bg-transparent hover:bg-black dark:hover:bg-white px-6 py-3 border border-black dark:border-white font-medium text-black dark:text-white dark:hover:text-black hover:text-white rounded-md transition-colors duration-500 ease-in-out"
						>
							<span>Xem Tất Cả Bài Viết</span>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

