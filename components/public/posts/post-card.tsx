import {TPostWithRelation} from "@/actions/posts/validations";
import Link from "next/link";
import Image from "next/image";
import {getDateVn} from "@/lib/date";
import {ArrowRight} from "lucide-react";
import {cn} from "@/lib/utils";

export default function PostCard({post, smallSize}: {
	post: TPostWithRelation,
	smallSize?: boolean
}){
	return (
		<div className={'blog-item gradient-border p-5 lg:p-7 bg-vweb_bg border border-indigo-200 border-opacity-50 flex-col justify-start items-start gap-5 lg:gap-9 inline-flex'}>
			{post.image && (
				<Link href={`/blog/${post.slug}`} className={'block w-full'}>
					<span className="vweb-image">
						<picture className={'rounded-md block mb-0 w-full overflow-hidden aspect-[14/7] relative'}>
							<Image src={post.image} alt={`${post.title}`} fill className={'object-center object-cover'}/>
						</picture>
					</span>
				</Link>
			)}

			<div className={'self-stretch flex-col justify-start items-start gap-3 lg:gap-5 flex'}>
				<h3 className={cn("text-2xl font-black m-0 leading-snug md:leading-snug", {
					"" : Boolean(smallSize),
					"md:text-4xl": !Boolean(smallSize)
				})}>
					<Link href={`/blog/${post.slug}`} className={'transition-all duration-150 hover:text-blue-500'}>
						{post.title}
					</Link>
				</h3>
				{!Boolean(smallSize) && (
					<div className={'self-stretch text-sm font-medium leading-normal tracking-widest'}>
						{getDateVn(post.createdAt, true)}
					</div>
				)}
				<hr className={'gradient-line'}/>
				<div className={cn("self-stretch leading-loose line-clamp-3", {
					"lg:text-lg": !Boolean(smallSize)
				})}>
					{post.description}
				</div>
				{!Boolean(smallSize) && (
					<div className="flex gap-2 flex-wrap">
						{post.tags.map(tag => (
							<Link href={`/blog/tags/${tag.slug}`} key={tag.id} className={'rounded-full p-1 px-2 text-xs lg:text-sm font-bold bg-yellow-200 hover:bg-yellow-300 transition-colors'}>
								#{tag.name}
							</Link>
						))}
					</div>
				)}
			</div>
			<Link
				aria-label={`Link to ${post.title}`}
				href={`/blog/${post.slug}`}
			  className={'text-blue-600 text-sm font-bold tracking-wide relative pr-[20px] transition-all duration-150 after:transition-all after:duration-150 after:w-[0px] hover:after:w-[25px] after:h-[1px] after:bg-blue-600 after:absolute after:top-[10px] after:left-0 hover:pl-[37px]'}
			>
				đọc tiếp <ArrowRight className={'size-3 inline'}/>
			</Link>
		</div>
	)
}
