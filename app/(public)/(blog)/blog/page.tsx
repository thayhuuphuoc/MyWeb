import {getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
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

export default function Page(){
	const postsPromise = getPosts({
		page: 1,
		per_page: 10,
		status: PostStatus.PUBLISHED
	})

	return (
		<PostsList postsPromise={postsPromise} currentPage={1} enabledSearch/>
	)
}
