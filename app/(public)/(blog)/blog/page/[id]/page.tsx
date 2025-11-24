import { getPosts} from "@/actions/posts/queries";
import {PostStatus} from ".prisma/client";
import PostsList from "@/components/public/posts/posts-list";
import {Metadata, ResolvingMetadata} from "next";
import siteMetadata from "@/config/siteMetadata";

type Props = {
	params: { id: string }
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

export default function Page({ params }: Props){
	const postsPromise = getPosts({
		page: Number(params.id),
		per_page: 10,
		status: PostStatus.PUBLISHED
	})

	return (
		<PostsList postsPromise={postsPromise} currentPage={Number(params.id)}/>
	)
}
