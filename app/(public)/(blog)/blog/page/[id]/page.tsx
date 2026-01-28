import { getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import BlogWithCategories from "@/components/public/posts/blog-with-categories";
import {getPostCategories} from "@/actions/posts/categories/queries";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";

type Props = {
	params: { id: string }
	searchParams: { category?: string }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {

	return {
		title: `Blog - Trang ${params.id}`,
		description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
		openGraph: {
			title: `Blog - Trang ${params.id}`,
			description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
			images: `${siteMetadata.ogImage}`
		}
	}
}

export default async function Page({ params, searchParams }: Props){
	const categorySlug = searchParams.category;
	
	const postsPromise = getPosts({
		page: Number(params.id),
		per_page: 15,
		status: PostStatus.PUBLISHED,
		category_slug: categorySlug || undefined,
	})

	const categoriesResult = await getPostCategories({
		page: 1,
		per_page: 100,
		sort: "name.asc"
	})

	const categories = categoriesResult.data || []

	return (
		<BlogWithCategories
			initialPostsPromise={postsPromise}
			currentPage={Number(params.id)}
			categories={categories}
		/>
	)
}
