import {getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {getPostTag, getPostTags, getPostTagBySlug} from "@/actions/posts/tags/queries";
import {notFound} from "next/navigation";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";
import {getPostCategories, getPostCategoryBySlug} from "@/actions/posts/categories/queries";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
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

export async function generateStaticParams() {
	const {data, pageCount} = await getPostCategories({
		page: 1,
		per_page: 1000,
	})
	const list = data.filter(cat => cat._count.posts !== 0)

	return list.map((tag) => ({
		slug: tag.slug,
	}))
}

export default async function Page({params}: Props){
	const category = await getPostCategoryBySlug(params.slug)

	if(!category.data || category.error){
		notFound()
	}

	const postsPromise = getPosts({
		page: 1,
		per_page: 15,
		status: PostStatus.PUBLISHED,
		// tagId: tag.data.id,
		category_slug: params.slug,
	})

	return (
		<PostsList
			postsPromise={postsPromise}
		  currentPage={1}
			listTitle={`${category.data.name}`}
			navLink={`/blog/danh-muc/${params.slug}`}
		/>
	)
}
