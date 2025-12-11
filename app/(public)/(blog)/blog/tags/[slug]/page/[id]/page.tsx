import { getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {Metadata, ResolvingMetadata} from "next";
import {getPostTags, getPostTagBySlug} from "@/actions/posts/tags/queries";
import {notFound} from "next/navigation";
import siteMetadata from "@/config/siteMetadata";

type Props = {
	params: { slug: string, id: string }
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
		title: `Trang ${params.id} | ${data.name}`,
		description: `${data.metaDescription || siteMetadata.description}`,
		openGraph: {
			title: `Trang ${params.id} | ${data.name}`,
			description: `${data.metaDescription || siteMetadata.description}`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

export default async function Page({params}: Props) {
	const tag = await getPostTagBySlug(params.slug)

	if (!tag.data || tag.error) {
		notFound()
	}

	const postsPromise = getPosts({
		page: Number(params.id),
		per_page: 15,
		status: PostStatus.PUBLISHED,
		tag_slug: params.slug,
	})

	return (
		<PostsList
			postsPromise={postsPromise} currentPage={Number(params.id)}
			listTitle={`${tag.data.name}`}
			navLink={`/blog/tags/${params.slug}`}
		/>
	)
}
