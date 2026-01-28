"use client";
import { useState } from "react";
import Loader from "@/components/shared/loader";
import { actionSendMail } from "@/actions/mails/actionSendMail";
import { toast } from "sonner";

export default function ContactForm() {
	const [submitted, setSubmitted] = useState(false);
	const [loader, setLoader] = useState(false);
	const [formData, setFormData] = useState({
		firstname: '',
		lastname: '',
		number: '',
		email: '',
		message: '',
	});
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
	};

	const validate = () => {
		const newErrors: { [key: string]: string } = {};
		if (!formData.firstname.trim()) newErrors.firstname = 'Vui lòng nhập họ';
		if (!formData.lastname.trim()) newErrors.lastname = 'Vui lòng nhập tên';
		if (!formData.number.trim()) newErrors.number = 'Vui lòng nhập số điện thoại';
		if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
		if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
			newErrors.email = 'Email không hợp lệ';
		}
		if (!formData.message.trim()) newErrors.message = 'Vui lòng nhập nội dung tin nhắn';
		return newErrors;
	};

	const reset = () => {
		setFormData({
			firstname: '',
			lastname: '',
			number: '',
			email: '',
			message: '',
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setLoader(true);

		try {
			const result = await actionSendMail({
				name: `${formData.firstname} ${formData.lastname}`,
				phone: formData.number,
				email: formData.email,
				address: '', // Form không có trường address
				note: formData.message,
			});

			if (result.error) {
				console.error("[ContactForm] Error from server:", result.error);
				toast.error(result.error || "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.");
				setLoader(false);
			} else {
				setSubmitted(true);
				setLoader(false);
				reset();
				toast.success("Cảm ơn bạn đã gửi tin nhắn!");
			}
		} catch (error) {
			console.error("[ContactForm] Unexpected error:", error);
			setLoader(false);
			toast.error("Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.");
		}
	};

	return (
		<div className="w-full">
			<form
				onSubmit={handleSubmit}
				className='flex flex-col w-full bg-white dark:bg-baseInk rounded-md shadow-card p-5 sm:p-8 gap-8'>
				<div className='flex flex-col md:flex-row gap-6'>
					<div className='w-full flex flex-col gap-2'>
						<label htmlFor='firstname' className="text-foreground font-medium">Họ</label>
						<input
							className='input-class'
							id='firstname'
							type='text'
							name='firstname'
							value={formData.firstname}
							onChange={handleChange}
							placeholder='Nhập họ của bạn'
						/>
						{errors.firstname && <span className="text-red-500 text-sm">{errors.firstname}</span>}
					</div>
					<div className='w-full flex flex-col gap-2'>
						<label htmlFor='lastname' className="text-foreground font-medium">Tên</label>
						<input
							className='input-class'
							id='lastname'
							type='text'
							name='lastname'
							value={formData.lastname}
							onChange={handleChange}
							placeholder='Nhập tên của bạn'
						/>
						{errors.lastname && <span className="text-red-500 text-sm">{errors.lastname}</span>}
					</div>
				</div>
				<div className='flex flex-col md:flex-row gap-6'>
					<div className='w-full flex flex-col gap-2'>
						<label htmlFor='number' className="text-foreground font-medium">Số điện thoại</label>
						<input
							className='input-class'
							id='number'
							type='text'
							name='number'
							value={formData.number}
							onChange={handleChange}
							placeholder='Nhập số điện thoại'
						/>
						{errors.number && <span className="text-red-500 text-sm">{errors.number}</span>}
					</div>
					<div className='w-full flex flex-col gap-2'>
						<label htmlFor='email' className="text-foreground font-medium">Email</label>
						<input
							className='input-class'
							id='email'
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							placeholder='Nhập địa chỉ email'
						/>
						{errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
					</div>
				</div>
				<div className='w-full flex flex-col gap-2'>
					<label htmlFor='message' className="text-foreground font-medium">Tin nhắn</label>
					<textarea
						className='input-class'
						name='message'
						id='message'
						value={formData.message}
						onChange={handleChange}
						placeholder='Nhập tin nhắn của bạn'
						rows={4}
					/>
					{errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
				</div>
				<div>
					<button
						type='submit'
						className='flex items-center bg-transparent hover:bg-black dark:hover:bg-white px-6 py-3 border border-black dark:border-white font-medium text-black dark:text-white hover:text-white dark:hover:text-black rounded-md transition-colors duration-500 ease-in-out cursor-pointer'>
						Gửi tin nhắn {loader && <Loader />}
					</button>
					{submitted && <p className="font-medium text-primary mt-5">Cảm ơn bạn đã gửi tin nhắn!</p>}
				</div>
			</form>
		</div>
	);
}


