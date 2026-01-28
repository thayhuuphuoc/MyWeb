"use client";
import { TPostWithRelation } from "@/actions/posts/validations";
import Image from "next/image";
import Link from "next/link";
import { Eye, MessageCircle, Calendar } from "lucide-react";
import { getDateVn } from "@/lib/date";

interface HeroSectionProps {
	posts: TPostWithRelation[];
}

export default function HeroSection({ posts }: HeroSectionProps) {
	const featuredPosts = posts.slice(0, 5);

	// Nếu không có posts, hiển thị message
	if (featuredPosts.length === 0) {
		return (
			<section>
				<div className="bg-primary/5 dark:bg-surfaceDark pb-14 md:pb-20 pt-40 -mt-[100px] md:-mt-[120px]">
					<div className="container mx-auto px-4 sm:px-7">
						<div className="text-center py-20">
							<p className="text-lg text-muted-foreground">
								Chưa có bài viết nào. Vui lòng thêm bài viết từ dashboard.
							</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section>
			<div className="bg-primary/5 dark:bg-surfaceDark pb-14 md:pb-20 pt-40 -mt-[100px] md:-mt-[120px]">
				<div className="container mx-auto px-4 sm:px-7">
					<div className="flex flex-col gap-10">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{featuredPosts.map((post, index) => {
								const isLarge = index < 2;
								const isFirst = index === 0;

								return (
									<div
										key={post.id}
										className={`relative rounded-md hover:shadow-lg hover:scale-[1.01] transition-all ${
											isLarge ? "h-[400px]" : "h-[245px]"
										} ${isFirst ? "md:col-span-2" : "md:col-span-1"}`}
									>
										{post.image && (
											<Image
												src={post.image}
												alt={post.title}
												fill
												className="object-cover object-center rounded-md absolute inset-0 z-0 transition-transform duration-500"
											/>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10 rounded-md" />

										{/* Author Avatar */}
										{post.author && (
											<div className="absolute top-6 left-6 z-20 group">
												<div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 whitespace-nowrap">
													{post.author.name || "Unknown"}
												</div>
												{post.author.image ? (
													<Image
														src={post.author.image}
														alt={post.author.name || "Author"}
														width={40}
														height={40}
														className="rounded-full cursor-pointer"
													/>
												) : (
													<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
														{(post.author.name || "A")[0].toUpperCase()}
													</div>
												)}
											</div>
										)}

										{/* Category Badge */}
										{post.categories && post.categories.length > 0 && (() => {
											// Format tên danh mục: chữ cái đầu mỗi từ viết hoa, còn lại viết thường
											const formatCategoryName = (str: string) => {
												if (!str) return str;
												return str
													.toLowerCase()
													.split(' ')
													.map(word => word.charAt(0).toUpperCase() + word.slice(1))
													.join(' ');
											};
											return (
												<div className="absolute top-6 right-6 z-20">
													<span className="text-xs font-semibold px-3 py-1 bg-primary text-white rounded-md">
														{formatCategoryName(post.categories[0].name)}
													</span>
												</div>
											);
										})()}

										{/* Content */}
										<div className="absolute bottom-6 left-6 right-6 text-white z-20">
											<Link href={`/blog/${post.slug}`}>
												{isLarge ? (
													<h4 className="font-semibold mb-6 text-xl md:text-2xl line-clamp-2">
														{post.title}
													</h4>
												) : (
													<h6 className="font-semibold mb-6 text-base md:text-lg line-clamp-2">
														{post.title}
													</h6>
												)}
											</Link>

											<div className="flex justify-between items-center gap-2">
												<div className="flex items-center gap-6">
													<div className="flex items-center gap-2">
														<Eye className="w-4 h-4" />
														<p className="text-sm">{post.viewCount || 0}</p>
													</div>
													<div className="flex items-center gap-2">
														<MessageCircle className="w-4 h-4" />
														<p className="text-sm">{post._count?.comments || 0}</p>
													</div>
												</div>
												<div className="flex items-center gap-0.5">
													<Calendar className="w-3.5 h-3.5" />
													<p className="text-xs font-medium">
														{getDateVn(post.createdAt, true)}
													</p>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

