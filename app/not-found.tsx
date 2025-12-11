import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "404 - Trang không tìm thấy",
	description: "Trang bạn đang tìm kiếm không tồn tại",
};

export default function NotFound() {
	return (
		<section>
			<div className="pb-14 md:pb-20 pt-28 md:pt-40 dark:bg-baseInk">
				<div className="container">
					<div className="flex flex-col items-center gap-8">
						<div>
							<Image
								src="/images/notfound/errorimg.svg"
								alt="Trang không tìm thấy"
								height={400}
								width={500}
								unoptimized
							/>
						</div>
						<div className="flex flex-col gap-6 justify-center items-center max-w-xl text-center">
							<h2 className="font-normal text-navyGray dark:text-white">
								Oops! Trang bạn đang tìm kiếm không tồn tại
							</h2>
							<p className="text-base md:text-lg text-navyGray dark:text-white/80">
								Rất tiếc, chúng tôi không thể tìm thấy trang này. Có thể trang đã bị xóa hoặc địa chỉ URL không chính xác.
							</p>
							<Link 
								href="/" 
								className="bg-transparent hover:bg-black dark:hover:bg-white px-6 py-3 border border-black dark:border-white font-medium text-black dark:text-white hover:text-white dark:hover:text-black rounded-md transition-colors duration-500 ease-in-out"
							>
								<span>Quay lại Trang chủ</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}


