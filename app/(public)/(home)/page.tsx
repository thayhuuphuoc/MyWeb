import HeroSection from "@/app/(public)/(home)/_components/hero-section";
import DiscoverCategory from "@/app/(public)/(home)/_components/discover-category";
import Newsletter from "@/app/(public)/(home)/_components/newsletter";
import { getPosts } from "@/actions/posts/queries";
import { PostStatus } from ".prisma/client";
import { Metadata } from "next";
import siteMetadata from "@/config/siteMetadata";

export const metadata: Metadata = {
	title: siteMetadata.logoTitle,
	description: siteMetadata.description,
};

export default async function Page() {
	const postsResult = await getPosts({
		page: 1,
		per_page: 20,
		status: PostStatus.PUBLISHED,
		sort: "createdAt.desc",
	});

	const posts = postsResult.data || [];

	return (
		<>
			<HeroSection posts={posts} />
			<DiscoverCategory posts={posts} />
			<Newsletter />
		</>
	);
}
