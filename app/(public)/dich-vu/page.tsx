import { Metadata } from "next";
import siteMetadata from "@/config/siteMetadata";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Dịch vụ",
	description: `Các dịch vụ của ${siteMetadata.logoTitle}`,
};

export default function DichVuPage() {
	const services = [
		{
			id: "nextjs-development",
			title: "Lập trình Website NextJS",
			description: "Thiết kế và phát triển website chuyên nghiệp với NextJS, đảm bảo tốc độ tải nhanh và SEO tối ưu.",
			icon: "/home/speed.webp",
		},
		{
			id: "seo-optimization",
			title: "Tối ưu SEO",
			description: "Tối ưu hóa website để đạt thứ hạng cao trên các công cụ tìm kiếm, thu hút khách hàng tiềm năng.",
			icon: "/home/seo.webp",
		},
		{
			id: "interface-design",
			title: "Thiết kế Giao diện",
			description: "Thiết kế giao diện độc đáo, ấn tượng, thể hiện cá tính thương hiệu riêng biệt của bạn.",
			icon: "/home/customize.webp",
		},
		{
			id: "website-security",
			title: "Bảo mật Website",
			description: "Đảm bảo website của bạn được bảo vệ an toàn với các biện pháp bảo mật hiện đại.",
			icon: "/home/shield.webp",
		},
		{
			id: "support-maintenance",
			title: "Hỗ trợ & Bảo trì",
			description: "Dịch vụ hỗ trợ kỹ thuật và bảo trì website 24/7, đảm bảo website luôn hoạt động tốt.",
			icon: "/home/support.webp",
		},
	];

	return (
		<>
			<div className="mt-10 mb-6">
				<h1 className="container mx-auto max-w-6xl px-5 text-center text-2xl md:text-3xl font-bold m-0">
					Dịch vụ của chúng tôi
				</h1>
			</div>
			<div className="container mx-auto max-w-6xl px-5 pb-10">
				<p className="text-center text-lg mb-10 text-muted-foreground">
					Các dịch vụ chuyên nghiệp giúp doanh nghiệp của bạn phát triển
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{services.map((service) => (
					<div
						key={service.id}
						className="rounded-lg bg-white dark:bg-surfaceDark border border-indigo-200 dark:border-white/20 border-opacity-50 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
					>
						{service.icon && (
							<Image
								src={service.icon}
								alt={service.title}
								width={96}
								height={96}
								className="aspect-square size-24 mb-4"
							/>
						)}
						<h3 className="font-semibold text-lg mb-2">{service.title}</h3>
						<p className="text-sm text-muted-foreground">{service.description}</p>
					</div>
				))}
			</div>

			<div className="mt-10 mb-16 text-center">
				<Link
					href="/contact"
					className="inline-flex h-14 rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-green-400 p-[2px]"
				>
					<span className="text-base font-bold tracking-wide flex rounded-full h-full items-center justify-center bg-vweb_bg dark:bg-surfaceDark back px-6 transition-all duration-150 hover:bg-opacity-80 text-[15px]">
						Liên hệ ngay
					</span>
				</Link>
			</div>
		</div>
		</>
	);
}



