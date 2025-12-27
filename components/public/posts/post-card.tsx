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
		<div className={'blog-item gradient-border p-3 lg:p-4 bg-vweb_bg dark:bg-surfaceDark border border-indigo-200 dark:border-white/20 border-opacity-50 flex-col justify-start items-start gap-2 lg:gap-3 inline-flex'}>
			{post.image && (
				<Link href={`/blog/${post.slug}`} className={'block w-full'}>
					<span className="vweb-image">
						<picture className={'rounded-md block mb-0 w-full overflow-hidden aspect-[16/9] relative'}>
							<Image src={post.image} alt={`${post.title}`} fill className={'object-center object-cover'}/>
						</picture>
					</span>
				</Link>
			)}

			<div className={'self-stretch flex-col justify-start items-start gap-2 lg:gap-3 flex'}>
				<h3 className={cn("text-lg font-black m-0 leading-tight md:leading-tight text-navyGray dark:text-white", {
					"" : Boolean(smallSize),
					"md:text-xl lg:text-2xl": !Boolean(smallSize)
				})}>
					<Link href={`/blog/${post.slug}`} className={'transition-all duration-150 hover:text-blue-500 text-navyGray dark:text-white'}>
						{post.title}
					</Link>
				</h3>
				{!Boolean(smallSize) && (
					<div className={'self-stretch text-sm font-medium leading-normal tracking-widest text-navyGray dark:text-white/80'}>
						{getDateVn(post.createdAt, true)}
					</div>
				)}
				<hr className={'gradient-line'}/>
				<div className={cn("self-stretch leading-relaxed line-clamp-3 text-sm text-navyGray dark:text-white", {
					"md:text-base": !Boolean(smallSize)
				})}>
					{post.description}
				</div>
				{!Boolean(smallSize) && (
					<div className="flex gap-2 flex-wrap">
						{post.tags.map(tag => (
							<Link href={`/blog/tags/${tag.slug}`} key={tag.id} className={'rounded-full p-1 px-2 text-xs lg:text-sm font-bold bg-indigo-100 dark:bg-indigo-600 hover:bg-indigo-200 dark:hover:bg-indigo-700 text-indigo-800 dark:text-white transition-colors'}>
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
