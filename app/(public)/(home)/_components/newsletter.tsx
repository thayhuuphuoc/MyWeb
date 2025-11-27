"use client";
import { useState } from "react";

export default function Newsletter() {
	const [submitted, setSubmitted] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Newsletter subscription functionality - currently shows success message
		// Future: Implement API integration for newsletter subscription
		setSubmitted(true);
		setFormData({ email: "" });
		setTimeout(() => {
			setSubmitted(false);
		}, 10000);
	};

	return (
		<section>
			<div className="bg-primary/5 dark:bg-baseInk py-14 md:py-20">
				<div className="container mx-auto px-4 sm:px-7">
					<div className="flex flex-col items-center justify-center">
						<div className="flex flex-col lg:flex-row text-center lg:text-left items-center justify-between gap-6 sm:gap-10 w-full bg-white dark:bg-surfaceDark rounded-md py-8 px-6 sm:px-12">
							<div className="flex flex-col gap-4">
								<h4 className="font-semibold text-xl md:text-2xl">
									Đăng ký nhận bản tin
								</h4>
								<p className="text-navyGray dark:text-white text-base max-w-xl">
									Hãy đăng ký nhận bản tin để không bỏ lỡ những tin tức mới, hấp dẫn được cập nhật mỗi tuần.
								</p>
							</div>

							<form
								onSubmit={handleSubmit}
								className="flex flex-col justify-center gap-1 w-full lg:w-auto"
							>
								<div className="relative w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 rounded-md overflow-hidden bg-white dark:bg-surfaceDark shadow-md">
									<input
										required
										className="flex-grow pl-7 pr-10 py-4 text-navyGray dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none bg-white dark:bg-surfaceDark"
										id="email"
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="Địa chỉ email của bạn"
									/>
									<button
										type="submit"
										className="bg-primary/85 dark:bg-primary text-white font-semibold px-10 py-4 rounded-md hover:bg-primary dark:hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
									>
										Đăng ký
									</button>
								</div>
								{submitted && (
									<p className="text-primary text-sm mt-2 text-center">
										Cảm ơn bạn đã đăng ký!
									</p>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

