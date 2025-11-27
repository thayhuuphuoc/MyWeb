import Link from "next/link";
import siteMetadata from "@/config/siteMetadata";
import Image from "next/image";

export default function Footer() {
	return (
		<footer>
			<div className="dark:bg-baseInk">
				<div className="container mx-auto px-4 sm:px-7">
					<div className="flex flex-col md:flex-row items-center justify-between gap-3 py-8 border-b border-gray">
						{/* Bên trái: Copyright */}
						<p className="text-navyGray dark:text-white/80 text-sm md:text-base">
							@PhuocNguyenBlog - All Rights Reserved
						</p>

						{/* Bên phải: Social Icons */}
						<div className="flex items-center gap-6">
							{siteMetadata.social.facebook && (
								<Link
									target="_blank"
									href={siteMetadata.social.facebook}
									className="hover:opacity-70 transition-opacity"
								>
									<Image
										src={"/icons/facebook.png"}
										alt={"facebook"}
										width={24}
										height={24}
										className="hover:opacity-70"
									/>
								</Link>
							)}
							{siteMetadata.social.youtube && (
								<Link
									target="_blank"
									href={siteMetadata.social.youtube}
									className="hover:opacity-70 transition-opacity"
								>
									<Image
										src={"/icons/youtube-circle.webp"}
										alt={"youtube"}
										width={24}
										height={24}
										className="hover:opacity-70"
									/>
								</Link>
							)}
							{siteMetadata.social.zalo && (
								<Link
									target="_blank"
									href={siteMetadata.social.zalo}
									className="hover:opacity-70 transition-opacity"
								>
									<Image
										src={"/icons/zalo.svg"}
										alt={"zalo"}
										width={24}
										height={24}
										className="hover:opacity-70"
									/>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
