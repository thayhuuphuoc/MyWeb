import { Metadata } from "next";
import siteMetadata from "@/config/siteMetadata";
import Image from "next/image";
import { Mail, Globe } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Giới thiệu",
	description: `Giới thiệu về ${siteMetadata.logoTitle}`,
};

export default function GioiThieuPage() {
	return (
		<div className="container mx-auto max-w-6xl px-5 py-10 md:py-16">
			{/* Main Content Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
				{/* Left Side - Image */}
				<div className="order-2 lg:order-1">
					<div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-card">
						<Image
							src="/images/about/nguyen-huu-phuoc.jpg"
							alt="Nguyễn Hữu Phước - Thạc sĩ Điện - Điện tử"
							fill
							className="object-cover object-center"
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
						/>
					</div>
				</div>

				{/* Right Side - Content */}
				<div className="order-1 lg:order-2 space-y-6">
					<div className="space-y-4">
						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
							Xin chào, tôi là <span className="font-semibold text-foreground">Nguyễn Hữu Phước</span> - Thạc sĩ chuyên ngành Điện – Điện tử, giảng viên kỹ thuật và người sáng tạo nội dung giáo dục về công nghệ. Tôi có nhiều năm kinh nghiệm trong lĩnh vực điện – điện tử, vi điều khiển, IoT và tự động hóa công nghiệp. Song song với hoạt động giảng dạy và nghiên cứu, tôi xây dựng các tài nguyên học tập nhằm hỗ trợ cộng đồng kỹ thuật tại Việt Nam.
						</p>

						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
							Niềm đam mê của tôi là giúp sinh viên, kỹ sư trẻ và người yêu điện tử hiểu sâu bản chất thay vì chỉ ghi nhớ lý thuyết. Tôi tin rằng một nền tảng kỹ thuật vững chắc cần được kết hợp giữa tư duy thực tiễn, khả năng ứng dụng và tinh thần học hỏi suốt đời.
						</p>

						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
							Nếu bạn cũng quan tâm đến điện tử, lập trình nhúng, tự động hóa hoặc đang tìm kiếm các tài nguyên học tập chất lượng, tôi rất vui khi được kết nối cùng bạn.
						</p>
					</div>

					{/* Contact Information */}
					<div className="pt-6 border-t border-border space-y-4">
						<div className="flex items-start gap-4">
							<Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
							<div>
								<p className="font-semibold text-foreground mb-1">Email:</p>
								<Link 
									href="mailto:lienhe@nguyenhuuphuoc.com"
									className="text-primary hover:underline text-lg"
								>
									lienhe@nguyenhuuphuoc.com
								</Link>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<Globe className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
							<div>
								<p className="font-semibold text-foreground mb-1">Website:</p>
								<div className="space-y-1">
									<Link 
										href="https://nguyenhuuphuoc.info"
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline text-lg block"
									>
										nguyenhuuphuoc.info
									</Link>
									<Link 
										href="https://www.nguyenhuuphuoc.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline text-lg block"
									>
										nguyenhuuphuoc.com
									</Link>
									<Link 
										href="https://dientuviet.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-primary hover:underline text-lg block"
									>
										dientuviet.com
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
