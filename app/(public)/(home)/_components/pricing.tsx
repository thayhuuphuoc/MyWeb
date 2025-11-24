import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import * as React from "react";
import Link from "next/link";

enum PopularPlan {
	NO = 0,
	YES = 1,
}

interface PlanProps {
	title: string;
	popular: PopularPlan;
	price: number;
	description: string;
	buttonText: string;
	benefitList: string[];
}

const plans: PlanProps[] = [
	{
		title: "Gói Cơ Bản",
		popular: 0,
		price: 6,
		description:
			"Doanh nghiệp nhỏ, mới thành lập, hoặc cá nhân cần một website giới thiệu đơn giản nhưng chuyên nghiệp.",
		buttonText: "Bắt đầu",
		benefitList: [
			"Thiết kế giao diện hiện đại, tối ưu cho mọi thiết bị.",
			"Tích hợp dashboard quản lý nội dung (bài viết, sản phẩm) dễ dàng.",
			"Tối ưu hóa tốc độ và SEO cơ bản.",
			"Tích hợp đăng nhập bằng Google.",
			"Triển khai trên nền tảng miễn phí hosting (Vercel hoặc Netlify).",
			"Hỗ trợ kỹ thuật cơ bản trong 3 tháng.",
		],
	},
	{
		title: "Gói Nâng Cao",
		popular: 1,
		price: 10,
		description:
			"Doanh nghiệp vừa và nhỏ, muốn tạo sự khác biệt với website có nhiều tính năng hơn.",
		buttonText: "Triển khai",
		benefitList: [
			"Tất cả tính năng của gói Cơ Bản.",
			"Thiết kế giao diện tùy chỉnh, độc đáo hơn, thể hiện rõ thương hiệu.",
			"Blog chuyên nghiệp với nhiều bố cục.",
			"Trang sản phẩm chi tiết, hỗ trợ bộ lọc và tìm kiếm.",
			"Form liên hệ, đăng ký nhận tin với hiệu ứng bắt mắt.",
			"Tích hợp mạng xã hội (Facebook, Instagram,...)",
			"Tối ưu hóa SEO nâng cao (từ khóa, meta tags, sitemap).",
			"Hỗ trợ kỹ thuật chuyên sâu trong 6 tháng.",
		],
	},
	{
		title: "Gói Cao Cấp",
		popular: 0,
		price: 20,
		description:
			"Doanh nghiệp lớn, có yêu cầu cao về tính thẩm mỹ, chức năng và hiệu suất của website.",
		buttonText: "Liên hệ",
		benefitList: [
			"Tất cả tính năng của gói Nâng Cao.",
			"Thiết kế giao diện cao cấp, ấn tượng, sử dụng hiệu ứng và animation.",
			"Tích hợp các tính năng nâng cao khác theo yêu cầu (ví dụ: đặt lịch hẹn, thanh toán trực tuyến, đa ngôn ngữ).",
			"Tối ưu hóa SEO chuyên sâu, tư vấn chiến lược SEO.",
			"Bảo trì và cập nhật thường xuyên.",
			"Hỗ trợ kỹ thuật 24/7 trong 1 năm.",
		],
	},
];

export const PricingSection = () => {
	return (
		<section className="container mx-auto py-18 lg:py-24">
			<div className={'mb-10 lg:mb-20'}>
				<h2 className="text-lg text-primary text-center mb-2 tracking-wider">
					Bảng giá
				</h2>

				<h2 className="text-2xl text-center font-bold mb-4">
					Dịch vụ lập trình website NextJS trọn gói
				</h2>

				<hr className="gradient-line mx-auto"/>
			</div>


			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
				{plans.map(
					({ title, popular, price, description, buttonText, benefitList }) => (
						<Card
							key={title}
							className={
								popular === PopularPlan?.YES
									? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
									: ""
							}
						>
							<CardHeader>
								<CardTitle className="pb-2">{title}</CardTitle>

								<CardDescription className="pb-4">
									{description}
								</CardDescription>

								<div>
									<span className="text-2xl font-bold">{Number(price*1000000).toLocaleString('vi-VN')}đ</span>
								</div>
							</CardHeader>

							<CardContent className="flex">
								<div className="space-y-4">
									{benefitList.map((benefit) => (
										<span key={benefit} className="flex">
                      <Check className="text-primary mr-2 flex-shrink-0" />
                      <p className={'text-black text-sm'}>{benefit}</p>
                    </span>
									))}
								</div>
							</CardContent>

							<CardFooter>
								<Button
									variant={
										popular === PopularPlan?.YES ? "default" : "secondary"
									}
									className="w-full"
									asChild
								>
									<Link href={'https://zalo.me/0979788685'} target={'_blank'}>
										{buttonText}
									</Link>
								</Button>
							</CardFooter>
						</Card>
					)
				)}
			</div>
		</section>
	);
};
