import { Metadata } from "next";
import siteMetadata from "@/config/siteMetadata";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "./_components/contact-form";

export const metadata: Metadata = {
	title: "Liên hệ",
	description: `Liên hệ với ${siteMetadata.logoTitle}`,
};

export default function ContactPage() {
	return (
		<section>
			<div className="dark:bg-baseInk">
				<div className="container">
					<div className="flex flex-col gap-7 md:gap-14 py-20 pt-28 md:pt-40">
						{/* Breadcrumb */}
						<div className="flex flex-col md:flex-row gap-4 text-center md:text-left items-center justify-between">
							<h1 className="font-semibold text-2xl md:text-4xl">Chúng tôi rất vui khi được lắng nghe từ bạn</h1>
							<div className="flex items-center gap-4">
								<Link href={"/"} className="text-navyGray dark:text-white/80 hover:text-primary dark:hover:text-primary font-semibold">
									TRANG CHỦ
								</Link>
								<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M9 6l6 6l-6 6"></path>
								</svg>
								<p className="text-navyGray dark:text-white/80 font-semibold">LIÊN HỆ</p>
							</div>
						</div>

						{/* Main Content */}
						<div className="flex flex-col lg:flex-row items-start gap-8">
							{/* Left Side - Info Card */}
							<div className="relative bg-primary rounded-md w-full lg:max-w-sm">
								{/* Background decoration - optional image */}
								<div className="absolute right-0 top-0 w-32 h-32 opacity-20">
									<div className="w-full h-full bg-white/10 rounded-full blur-2xl"></div>
								</div>
								<div className="relative z-10 p-7">
									<div className="flex flex-col gap-4">
										<h6 className="text-white font-bold text-lg">Liên hệ ngay hôm nay</h6>
										<p className="text-white/90">Bạn có câu hỏi hoặc cần hỗ trợ? Chúng tôi chỉ cách bạn một tin nhắn.</p>
									</div>
									<div className="my-8 h-px border-0 border-t border-white/20" />
									<div className="flex flex-col gap-4">
										<h6 className="text-white font-bold text-lg">Thông tin liên hệ</h6>
										<div className="space-y-3 text-white/90">
											<p>
												<strong>Email:</strong> {siteMetadata.owner_email}
											</p>
											<p>
												<strong>Địa chỉ:</strong> {siteMetadata.address}
											</p>
											<div className="flex items-center gap-3 mt-4">
												{siteMetadata.social.facebook && (
													<a 
														href={siteMetadata.social.facebook} 
														target="_blank" 
														rel="noopener noreferrer"
														className="text-white hover:text-primary transition-colors"
													>
														<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
															<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
														</svg>
													</a>
												)}
												{siteMetadata.social.zalo && (
													<a 
														href={siteMetadata.social.zalo} 
														target="_blank" 
														rel="noopener noreferrer"
														className="text-white hover:text-primary transition-colors"
													>
														<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
															<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
														</svg>
													</a>
												)}
												{siteMetadata.social.youtube && (
													<a 
														href={siteMetadata.social.youtube} 
														target="_blank" 
														rel="noopener noreferrer"
														className="text-white hover:text-primary transition-colors"
													>
														<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
															<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
														</svg>
													</a>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Right Side - Contact Form */}
							<ContactForm />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
