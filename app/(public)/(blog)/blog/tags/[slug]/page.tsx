import {getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {getPostTag, getPostTags, getPostTagBySlug} from "@/actions/posts/tags/queries";
import {notFound} from "next/navigation";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const {data, error} = await getPostTagBySlug(params.slug)

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	return {
		title: `${data.name}`,
		description: `${data.metaDescription || siteMetadata.description}`,
		openGraph: {
			title: `${data.name}`,
			description: `${data.metaDescription || siteMetadata.description}`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

export async function generateStaticParams() {
	const {data, pageCount} = await getPostTags({
		page: 1,
		per_page: 1000,
	})
	const tags = data.filter(tag => tag._count.posts !== 0)

	return tags.map((tag) => ({
		slug: tag.slug,
	}))
}

export default async function Page({params}: Props){
	const tag = await getPostTagBySlug(params.slug)

	if(!tag.data || tag.error){
		notFound()
	}

	const postsPromise = getPosts({
		page: 1,
		per_page: 15,
		status: PostStatus.PUBLISHED,
		// tagId: tag.data.id,
		tag_slug: params.slug,
	})

	return (
		<PostsList
			postsPromise={postsPromise}
		  currentPage={1}
			listTitle={`${tag.data.name}`}
			navLink={`/blog/tags/${params.slug}`}
		/>
	)
}
