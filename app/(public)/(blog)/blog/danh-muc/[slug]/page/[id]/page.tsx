import { getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {Metadata, ResolvingMetadata} from "next";
import {notFound} from "next/navigation";
import siteMetadata from "@/config/siteMetadata";
import {getPostCategories, getPostCategoryBySlug} from "@/actions/posts/categories/queries";

type Props = {
	params: { slug: string, id: string }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const {data, error} = await getPostCategoryBySlug(params.slug)

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	return {
		title: `${data.name}`,
		description: `${data.description}`,
		openGraph: {
			title: `${data.name}`,
			description: `${data.description}`,
			images: `${data.image || siteMetadata.ogImage}`
		}
	}
}

export default async function Page({params}: Props) {
	const category = await getPostCategoryBySlug(params.slug)

	if (!category.data || category.error) {
		notFound()
	}

	const postsPromise = getPosts({
		page: Number(params.id),
		per_page: 15,
		status: PostStatus.PUBLISHED,
		category_slug: params.slug,
	})

	return (
		<PostsList
			postsPromise={postsPromise} currentPage={Number(params.id)}
			listTitle={`${category.data.name}`}
			navLink={`/blog/danh-muc/${params.slug}`}
		/>
	)
}
