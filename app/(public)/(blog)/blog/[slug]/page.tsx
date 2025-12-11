import {Metadata, ResolvingMetadata} from "next";
import {getPublishedPostBySlug, getPosts} from "@/actions/posts/queries";
import {notFound} from "next/navigation";
import Post from "@/components/public/posts/post";
import siteMetadata from "@/config/siteMetadata";
import {PostStatus} from ".prisma/client";

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const slug = params.slug
	const {data, error} = await getPublishedPostBySlug(slug)

	if(!data || error) {
		return {
			title: 'Not Found'
		}
	}

	return {
		title: data.title,
		keywords: data?.keywords,
		description: String(data.metaDescription),
		openGraph: {
			images: data.image || `${siteMetadata.ogImage}`,
			title: data.metaTitle || data.title,
			description: String(data.metaDescription),
		},
	}
}
export async function generateStaticParams() {
	const {data} = await getPosts({
		page: 1,
		per_page: 1000,
		status: PostStatus.PUBLISHED
	})

	return data.map((post) => ({
		slug: post.slug,
	}))
}

export default async function Page({params}: Props) {
	const {data, error} = await getPublishedPostBySlug(params.slug)

	if(!data || error){
		notFound()
	}

	return (
		<Post data={data} />
	)
}
