import HeroSection from "@/app/(public)/(home)/_components/hero-section";
import DiscoverCategory from "@/app/(public)/(home)/_components/discover-category";
import ImageCarouselSection from "@/app/(public)/(home)/_components/image-carousel-section";
import Newsletter from "@/app/(public)/(home)/_components/newsletter";
import { getPosts } from "@/actions/posts/queries";
import { getPostCategories } from "@/actions/posts/categories/queries";
import { PostStatus } from ".prisma/client";
import { Metadata } from "next";
import siteMetadata from "@/config/siteMetadata";
import { TPostWithRelation } from "@/actions/posts/validations";

export const metadata: Metadata = {
	title: siteMetadata.logoTitle,
	description: siteMetadata.description,
};

// Hàm shuffle mảng (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export default async function Page() {
	const postsResult = await getPosts({
		page: 1,
		per_page: 20,
		status: PostStatus.PUBLISHED,
		sort: "createdAt.desc",
	});

	const categoriesResult = await getPostCategories({
		page: 1,
		per_page: 20,
		sort: "name.asc",
	});

	const posts = postsResult.data || [];
	const categories = categoriesResult.data || [];
	
	// Shuffle posts để hiển thị ngẫu nhiên bên dưới phần danh mục
	const shuffledPosts = shuffleArray(posts);

	return (
		<>
			<HeroSection posts={posts} />
			<DiscoverCategory posts={shuffledPosts} categories={categories} />
			<ImageCarouselSection />
			<Newsletter />
		</>
	);
}
