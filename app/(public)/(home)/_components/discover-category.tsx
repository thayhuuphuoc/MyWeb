"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BlogCard from "./blog-card";
import { TPostWithRelation } from "@/actions/posts/validations";
import { TPostCategoryWithPostCount } from "@/actions/posts/categories/validations";

interface DiscoverCategoryProps {
	posts: TPostWithRelation[];
	categories: TPostCategoryWithPostCount[];
}

export default function DiscoverCategory({ posts, categories }: DiscoverCategoryProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const checkScrollButtons = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
		}
	};

	// Filter categories that have posts
	const categoriesWithPosts = categories.filter(
		(category) => (category._count?.posts || 0) > 0
	);

	// Initialize scroll buttons on mount and handle resize
	useEffect(() => {
		checkScrollButtons();
		const handleResize = () => {
			setTimeout(checkScrollButtons, 100);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [categoriesWithPosts]);

	const scroll = (direction: "left" | "right") => {
		if (scrollContainerRef.current) {
			const scrollAmount = 300;
			const scrollTo = direction === "left" 
				? scrollContainerRef.current.scrollLeft - scrollAmount
				: scrollContainerRef.current.scrollLeft + scrollAmount;
			
			scrollContainerRef.current.scrollTo({
				left: scrollTo,
				behavior: "smooth",
			});
			
			setTimeout(checkScrollButtons, 300);
		}
	};

	// Format tên danh mục: chỉ chữ cái đầu tiên của mỗi từ viết hoa, còn lại viết thường
	// Ví dụ: "Lập trình" → "Lập trình", "Lối sống & Sức khỏe" → "Lối sống & Sức khỏe"
	// "Công nghệ-thông tin" → "Công nghệ - Thông tin"
	const formatCategoryName = (str: string) => {
		if (!str) return str;
		// Xử lý dấu - trước: thay - thành " - " (có khoảng trắng)
		let formatted = str.replace(/-/g, ' - ');
		
		// Tách theo khoảng trắng, giữ nguyên ký tự đặc biệt như &
		return formatted
			.split(/(\s+)/)
			.map(part => {
				// Giữ nguyên khoảng trắng
				if (/^\s+$/.test(part)) return part;
				// Với mỗi từ, chỉ viết hoa chữ cái đầu tiên, còn lại viết thường
				// Xử lý ký tự đặc biệt như &
				if (part.includes('&')) {
					// Tách theo & nhưng giữ nguyên nó
					return part
						.split(/(&)/)
						.map(subPart => {
							if (subPart === '&') return subPart;
							if (!subPart.trim()) return subPart;
							const firstChar = subPart.charAt(0);
							const rest = subPart.slice(1);
							return firstChar.toUpperCase() + rest.toLowerCase();
						})
						.join('');
				}
				const firstChar = part.charAt(0);
				const rest = part.slice(1);
				return firstChar.toUpperCase() + rest.toLowerCase();
			})
			.join('');
	};

	// Get default placeholder colors for categories without images
	const getCategoryColor = (index: number) => {
		const colors = [
			"bg-gradient-to-br from-purple-100 to-purple-200",
			"bg-gradient-to-br from-blue-100 to-blue-200",
			"bg-gradient-to-br from-red-100 to-red-200",
			"bg-gradient-to-br from-green-100 to-green-200",
			"bg-gradient-to-br from-yellow-100 to-yellow-200",
			"bg-gradient-to-br from-pink-100 to-pink-200",
		];
		return colors[index % colors.length];
	};

	// Filter posts based on selected category
	const filteredPosts = selectedCategory
		? posts.filter((post) => post.categories?.some((cat) => cat.id === selectedCategory))
		: posts;

	// Don't render if no categories with posts
	if (!categoriesWithPosts || categoriesWithPosts.length === 0) {
		return null;
	}

	return (
		<section>
			<div className="dark:bg-baseInk bg-white">
				<div className="container mx-auto px-4 sm:px-7">
					<div className="py-14 md:py-20">
						{/* Header with title and navigation arrows */}
						<div className="flex items-start justify-between mb-8 md:mb-12">
							{/* Left: Title and description */}
							<div className="flex flex-col gap-2 md:gap-3.5">
								<h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl text-black dark:text-white">
									Danh mục bài viết
								</h1>
								<p className="font-medium text-base md:text-lg text-gray-600 dark:text-gray-400">
									Chọn một danh mục để khám phá nội dung mà bạn quan tâm
								</p>
							</div>

							{/* Right: Navigation arrows */}
							<div className="flex items-center gap-2">
								<button
									onClick={() => scroll("left")}
									disabled={!canScrollLeft}
									className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
										canScrollLeft
											? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer"
											: "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
									}`}
									aria-label="Scroll left"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5 md:w-6 md:h-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>
								<button
									onClick={() => scroll("right")}
									disabled={!canScrollRight}
									className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
										canScrollRight
											? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer"
											: "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
									}`}
									aria-label="Scroll right"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-5 h-5 md:w-6 md:h-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Horizontal scrolling category cards */}
						<div
							ref={scrollContainerRef}
							onScroll={checkScrollButtons}
							className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4"
							style={{
								scrollbarWidth: "none",
								msOverflowStyle: "none",
							}}
						>
							{categoriesWithPosts.map((category, index) => {
								const postCount = category._count?.posts || 0;
								const categoryName = formatCategoryName(category.name);
								const isSelected = selectedCategory === category.id;
								
								return (
									<button
										key={category.id}
										onClick={() => setSelectedCategory(isSelected ? null : category.id)}
										className={`group relative flex-shrink-0 w-[180px] md:w-[220px] h-[140px] md:h-[160px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
											isSelected ? "ring-4 ring-primary ring-offset-2" : ""
										}`}
									>
										{/* Background Image or Gradient */}
										<div className="absolute inset-0">
											{category.image ? (
												<Image
													src={category.image}
													alt={category.name}
													fill
													className="object-cover transition-transform duration-300 group-hover:scale-110"
													sizes="(max-width: 768px) 180px, 220px"
												/>
											) : (
												<div className={`w-full h-full ${getCategoryColor(index)}`} />
											)}
											{/* Overlay gradient for better text readability - always visible */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
										</div>

										{/* Category info - always visible, left aligned, inside image */}
										<div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 text-left">
											<div className="mb-1">
												<h3 className="text-white group-hover:text-primary dark:group-hover:text-primary font-semibold text-sm md:text-base transition-colors duration-300">
													{categoryName}
												</h3>
											</div>
											<p className="text-white/90 group-hover:text-white text-xs md:text-sm transition-colors duration-300">
												{postCount} bài viết
											</p>
										</div>
									</button>
								);
							})}
						</div>

						{/* Blog Cards Grid - Always show, filtered by selected category */}
						<div className="mt-12">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredPosts.slice(0, 6).map((post) => (
									<BlogCard key={post.id} post={post} />
								))}
							</div>
						</div>

						{/* View All Posts Button */}
						<div className="mt-8 md:mt-10 flex justify-center">
							<Link
								href="/blog"
								className="bg-transparent hover:bg-black dark:hover:bg-white px-6 py-3 border border-black dark:border-white font-medium text-black dark:text-white dark:hover:text-black hover:text-white rounded-md transition-colors duration-500 ease-in-out"
							>
								<span>Xem Tất Cả Bài Viết</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
			
			{/* Decorative Divider - Phân biệt với Carousel Section */}
			<div className="relative h-20 md:h-32 overflow-hidden -mt-4 md:-mt-6">
				{/* Gradient Background */}
				<div className="absolute inset-0 bg-gradient-to-b from-white via-primary/5 to-primary/10 dark:from-baseInk dark:via-primary/10 dark:to-primary/20"></div>
				
				{/* Decorative Wave - To hơn, đẹp mắt hơn */}
				<svg 
					className="absolute bottom-0 w-full h-12 md:h-20" 
					viewBox="0 0 1440 200" 
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path 
						d="M0,100 C360,180 720,20 1080,100 C1260,140 1380,60 1440,100 L1440,200 L0,200 Z" 
						fill="currentColor" 
						className="text-white dark:text-baseInk"
					/>
				</svg>
			</div>
		</section>
	);
}
