import {TPostWithRelation} from "@/actions/posts/validations";

import Image from "next/image";
import {getDateVn} from "@/lib/date";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
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
const PostBody = dynamic(() => import("@/components/public/posts/post-body"), {
	ssr: false,
});

export default function Post({data}: {
	data: TPostWithRelation
}){
	const postsPromise = getRandomPublishedPosts(6)

	return (
		<>
			{/* View Counter - Tự động đếm lượt xem */}
			<ViewCounter slug={data.slug} initialViewCount={data.viewCount} />
			
			{/*Breadcrumb*/}
			<div className="container max-w-3xl px-5">
				<ul className={'flex flex-wrap gap-3 px-5'}>
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

			<article className="container mx-auto max-w-[1400px] grid grid-cols-1 gap-8 justify-items-center">
				<div className={'max-w-3xl mx-auto grid grid-cols-1 gap-7 px-5'}>
					<h1 className={'text-2xl md:text-6xl font-black leading-tight md:leading-tight'}>{data.title}</h1>
					<p className={'prose md:prose-lg font-serif'}>{data.description}</p>
					<hr className={'gradient-line'}/>
					<div>
						<span className="text-sm font-medium leading-normal tracking-widest">{getDateVn(data.createdAt)}</span>
					</div>
				</div>
				{data.image && (
					<div className={'blog-item gradient-border p-7 bg-vweb_bg border border-indigo-200 border-opacity-50 max-w-[95vw] w-full'}>
						<div className="vweb-image">
							<picture className={'rounded-md block mb-0 w-full overflow-hidden aspect-[14/7] relative'}>
								<Image src={data.image} alt={`${data.title}`} fill className={'object-center object-cover'}/>
							</picture>
						</div>
					</div>
				)}
				<PostBody data={data}/>

				<RelatedLinks data={parseLinkJson(data.relatedLinks)}/>
				<Tags data={data}/>
			</article>

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
