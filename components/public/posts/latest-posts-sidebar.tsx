import {TPostWithRelation} from "@/actions/posts/validations";
import Link from "next/link";
import Image from "next/image";
import {getDateVn} from "@/lib/date";
import {MessageCircle} from "lucide-react";

export default function LatestPostsSidebar({posts}: {
	posts: TPostWithRelation[]
}){
	if(!posts || posts.length === 0) return null;

	return (
		<aside className="w-full lg:w-[350px] flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
			{/* Header */}
			<div className="bg-gray-800 dark:bg-gray-900 text-white py-3 px-4 mb-0">
				<h2 className="text-lg font-bold m-0">BÀI VIẾT MỚI NHẤT</h2>
			</div>
			<div className="border-t border-gray-300 dark:border-gray-700 mb-4"></div>

			{/* Posts List */}
			<div className="space-y-4">
				{posts.map((post) => (
					<article key={post.id} className="flex flex-col gap-3">
						{/* Image */}
						{post.image && (
							<Link href={`/blog/${post.slug}`} className="block w-full">
								<div className="relative w-full aspect-[16/9] rounded-md overflow-hidden">
									<Image
										src={post.image}
										alt={post.title}
										fill
										className="object-cover object-center"
									/>
								</div>
							</Link>
						)}

						{/* Title */}
						<h3 className="text-base font-bold leading-tight m-0 text-gray-800 dark:text-white">
							<Link 
								href={`/blog/${post.slug}`}
								className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
							>
								{post.title}
							</Link>
						</h3>

						{/* Author, Date, and Comment Count */}
						<div className="flex items-center justify-between gap-2">
							<div className="text-sm text-gray-600 dark:text-gray-400">
								{post.author?.name || "Nguyễn Hữu Phước"} - {getDateVn(post.createdAt, true)}
							</div>
							<div className="flex-shrink-0">
								<div className="bg-black dark:bg-gray-800 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded">
									{post._count?.comments || 0}
								</div>
							</div>
						</div>
					</article>
				))}
			</div>
		</aside>
	);
}

