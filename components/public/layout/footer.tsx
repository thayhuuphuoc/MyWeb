import Link from "next/link";
import siteMetadata from "@/config/siteMetadata";
import Image from "next/image";

const footerLinks = [
	{ name: "Điều khoản & Điều kiện", href: "/dieu-khoan-va-dieu-kien" },
	{ name: "Chính sách", href: "/chinh-sach-bao-mat" },
	{ name: "Liên hệ", href: "https://www.nguyenhuuphuoc.com/lien-he" },
	{ name: "Trang 404", href: "/not-found" }
];

export default function Footer() {
	return (
		<footer>
			<div className="dark:bg-baseInk border-t border-gray/50">
				<div className="container mx-auto px-4 sm:px-7">
					{/* Phần trên: Copyright và Social */}
					<div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 border-b border-gray">
						{/* Bên trái: Copyright */}
						<p className="text-navyGray dark:text-white/80 text-sm md:text-base text-center md:text-left">
							© Copywright 2025 - Nguyễn Hữu Phước
						</p>

						{/* Bên phải: Social Icons */}
						<div className="flex items-center gap-4 md:gap-6">
							<span className="text-navyGray dark:text-white/80 text-sm md:text-base font-medium hidden sm:inline">Kết nối với tôi:</span>
							{siteMetadata.social.facebook && (
								<Link
									target="_blank"
									href={siteMetadata.social.facebook}
									className="hover:opacity-70 transition-opacity"
									aria-label="Facebook"
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
									aria-label="YouTube"
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
									aria-label="Zalo"
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
					{/* Footer Links */}
					<div className="py-6">
						<ul className="flex flex-wrap items-center justify-center gap-1">
							{footerLinks.map((item, index) => {
								const isLast = index === footerLinks.length - 1;
								return (
									<div key={index} className="flex items-center">
										<Link href={item.href} className="hover:opacity-80 transition-opacity">
											<li className="text-sm text-navyGray dark:text-white/80 font-medium hover:text-primary dark:hover:text-primary transition-colors">
												{item.name}
											</li>
										</Link>
										{!isLast && (
											<div className="w-1.5 h-1.5 bg-black/30 dark:bg-white/30 rounded-full mx-3" />
										)}
									</div>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}
