"use client";
import { useState } from "react";
import { subscribeNewsletter } from "@/actions/newsletter/actions";
import { toast } from "sonner";

export default function Newsletter() {
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		email: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		// Clear error when user types
		if (error) setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			if (process.env.NODE_ENV === 'development') {
				console.log("[Newsletter] Submitting email:", formData.email);
			}
			const result = await subscribeNewsletter({ email: formData.email });

			if (result.error) {
				if (process.env.NODE_ENV === 'development') {
					console.error("[Newsletter] Error:", result.error);
				}
				setError(result.error);
				toast.error(result.error);
			} else {
				if (process.env.NODE_ENV === 'development') {
					console.log("[Newsletter] Success:", result.data);
				}
				setSubmitted(true);
				setFormData({ email: "" });
				toast.success("Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận bản tin.");
				setTimeout(() => {
					setSubmitted(false);
				}, 10000);
			}
		} catch (err) {
			console.error("[Newsletter] Unexpected error:", err);
			const errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
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
										disabled={loading}
										className="bg-primary/85 dark:bg-primary text-white font-semibold px-10 py-4 rounded-md hover:bg-primary dark:hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? "Đang xử lý..." : "Đăng ký"}
									</button>
								</div>
								{(submitted || error) && (
									<p
										className={`text-sm mt-2 text-center ${
											submitted
												? "text-primary"
												: "text-red-500 dark:text-red-400"
										}`}
									>
										{submitted
											? "Cảm ơn bạn đã đăng ký!"
											: error}
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

