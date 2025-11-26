"use client";
import { TPostWithRelation } from "@/actions/posts/validations";
import Image from "next/image";
import Link from "next/link";

interface TopAuthorsProps {
	posts: TPostWithRelation[];
}

export default function TopAuthors({ posts }: TopAuthorsProps) {
	// Get unique authors from posts
	const uniqueAuthors = posts.filter(
		(post, index, self) =>
			post.author &&
			index ===
				self.findIndex(
					(p) => p.author?.id === post.author?.id && post.author?.id
				)
	);

	const topAuthors = uniqueAuthors.slice(0, 3);

	return (
		<section>
			<div className="dark:bg-baseInk">
				<div className="container mx-auto px-4 sm:px-7">
					<div className="flex flex-col gap-7 md:gap-14 py-10">
						<div className="flex flex-col sm:flex-row items-center text-center justify-between gap-3.5">
							<h3 className="font-semibold text-xl md:text-2xl">
								Explore Authors
							</h3>
							<Link href="/author">
								<p className="text-navyGray dark:text-white/80 font-medium border-b-2 border-primary/70 hover:text-primary dark:hover:text-primary transition-colors">
									View all Authors
								</p>
							</Link>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
							{topAuthors.map((post) => {
								if (!post.author) return null;

								return (
									<div
										key={post.author.id}
										className="group flex flex-col px-8 py-6 gap-4 items-center text-center shadow-card rounded-md hover:scale-[1.01] transition-all"
									>
										<Link href={`/author/${post.author.id}`}>
											{post.author.image ? (
												<Image
													src={post.author.image}
													alt={post.author.name || "Author"}
													width={80}
													height={80}
													className="rounded-full"
												/>
											) : (
												<div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-2xl">
													{(post.author.name || "A")[0].toUpperCase()}
												</div>
											)}
										</Link>
										<div className="flex flex-col gap-2">
											<div className="flex flex-col items-center gap-1">
												<Link href={`/author/${post.author.id}`}>
													<h6 className="text-navyGray dark:text-white font-semibold hover:text-primary transition-colors">
														{post.author.name || "Unknown Author"}
													</h6>
												</Link>
												{post.author.email && (
													<p className="text-xs text-navyGray dark:text-white/80">
														{post.author.email}
													</p>
												)}
											</div>
											{post.author.address && (
												<p className="text-navyGray dark:text-white/80 text-sm">
													{post.author.address}
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

