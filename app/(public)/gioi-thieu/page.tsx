import { Metadata } from "next";
import siteMetadata from "@/config/siteMetadata";

export const metadata: Metadata = {
	title: "Giới thiệu",
	description: `Giới thiệu về ${siteMetadata.logoTitle}`,
};

export default function GioiThieuPage() {
	return (
		<div className="container mx-auto max-w-4xl px-5 py-10">
			<h1 className="text-3xl md:text-4xl font-bold mb-6">Giới thiệu</h1>
			<div className="prose prose-lg max-w-none">
				<p className="text-lg mb-4">
					Chào mừng bạn đến với <strong>{siteMetadata.logoTitle}</strong>!
				</p>
				<p className="mb-4">
					{siteMetadata.description}
				</p>
				<p className="mb-4">
					Chúng tôi chuyên cung cấp các dịch vụ lập trình website NextJS chuyên nghiệp,
					giúp doanh nghiệp của bạn có một website hiện đại, nhanh chóng và thân thiện với SEO.
				</p>
				<h2 className="text-2xl font-semibold mt-8 mb-4">Về chúng tôi</h2>
				<p className="mb-4">
					Với nhiều năm kinh nghiệm trong lĩnh vực phát triển web, chúng tôi tự hào mang đến
					những giải pháp công nghệ tốt nhất cho khách hàng.
				</p>
				<p className="mb-4">
					Địa chỉ: {siteMetadata.address}
				</p>
				<p>
					Email: {siteMetadata.owner_email}
				</p>
			</div>
		</div>
	);
}

