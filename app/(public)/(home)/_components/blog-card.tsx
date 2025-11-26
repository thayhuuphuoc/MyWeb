"use client";

import { TPostWithRelation } from "@/actions/posts/validations";
import Image from "next/image";
import Link from "next/link";
import { Eye, MessageCircle, Calendar } from "lucide-react";
import { getDateVn } from "@/lib/date";

interface BlogCardProps {
	post: TPostWithRelation;
}

export default function BlogCard({ post }: BlogCardProps) {
	return (
		<div className="shadow-card rounded-md hover:scale-[1.01] transition-all">
			<div className="relative w-full h-[240px] overflow-hidden rounded-t-md">
				{post.image && (
					<Link href={`/blog/${post.slug}`}>
						<Image
							src={post.image}
							alt={post.title}
							width={365}
							height={240}
							className="w-full h-full object-cover rounded-t-md"
						/>
					</Link>
				)}
				{!post.image && (
					<div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
						<span className="text-primary/50 text-sm">No Image</span>
					</div>
				)}
				<span className="absolute bottom-6 right-6 text-xs font-semibold w-fit p-1 px-2.5 text-black bg-white rounded-md">
					2 min Read
				</span>
			</div>
			<div className="relative p-6 pt-8 flex flex-col gap-5">
				{/* Author Avatar */}
				{post.author && (
					<div className="group absolute -top-6 left-7 z-20">
						<div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 whitespace-nowrap">
							{post.author.name || "Unknown"}
						</div>
						{post.author.image ? (
							<Image
								src={post.author.image}
								alt={post.author.name || "Author"}
								width={40}
								height={40}
								className="rounded-full"
							/>
						) : (
							<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
								{(post.author.name || "A")[0].toUpperCase()}
							</div>
						)}
					</div>
				)}

				{/* Category */}
				{post.categories && post.categories.length > 0 && (
					<span className="text-xs font-semibold w-fit p-1 px-2.5 text-navyGray dark:text-white bg-gray dark:bg-white/20 rounded-md">
						{post.categories.map((cat, idx) => {
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
								<span key={cat.id}>
									{formatCategoryName(cat.name)}
									{idx < post.categories.length - 1 && ", "}
								</span>
							);
						})}
					</span>
				)}

				{/* Title */}
				<Link href={`/blog/${post.slug}`}>
					<h6 className="text-navyGray dark:text-white font-semibold line-clamp-2 hover:text-primary transition-colors">
						{post.title}
					</h6>
				</Link>

				{/* Meta Info */}
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-6">
							<div className="flex items-center gap-2">
								<Eye className="w-4 h-4 text-navyGray dark:text-white" />
								<p className="text-sm text-navyGray dark:text-white">
									{post.viewCount || 0}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<MessageCircle className="w-4 h-4 text-navyGray dark:text-white" />
								<p className="text-sm text-navyGray dark:text-white">
									{post._count?.comments || 0}
								</p>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-0.5">
						<Calendar className="w-3.5 h-3.5 text-navyGray dark:text-white" />
						<p className="text-xs text-navyGray dark:text-white font-medium">
							{getDateVn(post.createdAt, true)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

