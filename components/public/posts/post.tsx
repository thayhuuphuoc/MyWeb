import {TPostWithRelation} from "@/actions/posts/validations";

import Image from "next/image";
import {getDateVn} from "@/lib/date";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Eye, MessageCircle, Calendar} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {CaretRightIcon, HomeIcon} from "@radix-ui/react-icons";
import {getRandomPublishedPosts} from "@/actions/posts/queries";
import RelatedPosts from "@/app/(public)/(blog)/blog/_components/related-posts";
import RelatedLinks from "@/app/(public)/_components/related-links";
import Tags from "@/app/(public)/_components/tags";
import {parseLinkJson} from "@/actions/common/ralated-link-schema";
import Categories from "@/app/(public)/_components/categories";
import ViewCounter from "@/components/public/posts/view-counter";
import CommentsWrapper from "@/components/public/posts/comments-wrapper";
import { getCommentsByPostId } from "@/actions/comments/queries";
const PostBody = dynamic(() => import("@/components/public/posts/post-body"), {
	ssr: false,
});

export default async function Post({data}: {
	data: TPostWithRelation
}){
	const postsPromise = getRandomPublishedPosts(6)
	const commentsResult = await getCommentsByPostId(data.id);
	const comments = commentsResult.data || [];

	return (
		<>
			{/* View Counter - Tự động đếm lượt xem */}
			<ViewCounter slug={data.slug} initialViewCount={data.viewCount} />
			
			{/*Breadcrumb*/}
			<div className="container mx-auto max-w-4xl px-5">
				<ul className={'flex flex-wrap gap-3'}>
					<li>
						<Link
							title={'Home'}
							className={'text-indigo-600 hover:opacity-80 transition-colors font-medium'}
							href={'/'}
						>
							<HomeIcon className={'size-5 inline'}/> <CaretRightIcon className={'size-5 inline'}/>
						</Link>
					</li>
					<li>
						<Link
							title={'blog'}
							className={'text-indigo-600 hover:opacity-80 transition-colors font-medium'}
							href={'/blog'}
						>
							blog <CaretRightIcon className={'size-5 inline'}/>
						</Link>
					</li>
					<li className={'font-medium'}>{data.title}</li>
				</ul>
			</div>

			<article className="container mx-auto max-w-4xl px-5">
				{/* Title */}
				<div className="mb-6">
					<h1 className={'text-xl md:text-3xl font-black leading-tight md:leading-tight text-navyGray dark:text-white'}>
						{data.title}
					</h1>
				</div>

				{/* Description */}
				<div className="mb-8">
					<p className={'prose md:prose-lg font-serif text-navyGray dark:text-white'}>
						{data.description}
					</p>
				</div>

				{/* Featured Image with Overlay */}
				{data.image && (
					<div className="relative w-full aspect-[16/9] mb-8 rounded-md overflow-hidden">
						<Image
							src={data.image}
							alt={data.title}
							fill
							className="object-contain object-center"
						/>
						{/* Gradient Overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10" />

						{/* Author Avatar */}
						{data.author && (
							<div className="absolute top-6 left-6 z-20 group">
								<div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 whitespace-nowrap">
									{data.author.name || "Unknown"}
								</div>
								{data.author.image ? (
									<Image
										src={data.author.image}
										alt={data.author.name || "Author"}
										width={40}
										height={40}
										className="rounded-full cursor-pointer"
									/>
								) : (
									<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
										{(data.author.name || "A")[0].toUpperCase()}
									</div>
								)}
							</div>
						)}

						{/* Category Badge */}
						{data.categories && data.categories.length > 0 && (() => {
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
										{formatCategoryName(data.categories[0].name)}
									</span>
								</div>
							);
						})()}

						{/* Meta Info at Bottom */}
						<div className="absolute bottom-6 left-6 right-6 text-white z-20">
							<div className="flex justify-between items-center gap-2">
								<div className="flex items-center gap-6">
									<div className="flex items-center gap-2">
										<Eye className="w-4 h-4" />
										<p className="text-sm">{data.viewCount || 0}</p>
									</div>
									<div className="flex items-center gap-2">
										<MessageCircle className="w-4 h-4" />
										<p className="text-sm">{data._count?.comments || 0}</p>
									</div>
								</div>
								<div className="flex items-center gap-0.5">
									<Calendar className="w-3.5 h-3.5" />
									<p className="text-xs font-medium">
										{getDateVn(data.createdAt, true)}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Post Body (includes Table of Contents and Content) */}
				<PostBody data={data}/>

				{/* Related Links and Tags */}
				<div className="mt-8">
					<RelatedLinks data={parseLinkJson(data.relatedLinks)}/>
					<Tags data={data}/>
				</div>
			</article>

			{/* Comments Section */}
			<CommentsWrapper initialComments={comments} postId={data.id} />

			<RelatedPosts postsPromise={postsPromise}/>

			<div className={'mt-20 text-center flex items-center justify-center px-5'}>
				<Button variant={'outline-front'} className={'rounded-full'} asChild>
					<Link href={'/blog'}>
						<ArrowLeft className={'size-4 mr-1'}/> Tất cả bài viết
					</Link>
				</Button>
			</div>
		</>
	)
}
