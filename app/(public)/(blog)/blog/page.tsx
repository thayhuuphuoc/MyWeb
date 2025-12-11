import {getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import BlogWithCategories from "@/components/public/posts/blog-with-categories";
import {getPostCategories} from "@/actions/posts/categories/queries";
import {Metadata} from "next";
import siteMetadata from "@/config/siteMetadata";

export const metadata: Metadata = {
	title: 'Blog',
	description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
	openGraph: {
		title: 'Blog',
		description: `Cập nhật những bài viết mới nhất từ "${siteMetadata.logoTitle}"`,
		images: `${siteMetadata.ogImage}`
	}
}

type Props = {
	searchParams: { category?: string }
}

export default async function Page({ searchParams }: Props){
	const categorySlug = searchParams.category;
	
	const postsPromise = getPosts({
		page: 1,
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
			currentPage={1}
			categories={categories}
			enabledSearch
		/>
	)
}
