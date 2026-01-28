import {z} from "@/locales/zod-custom"
import validator from "validator";

export const ContactSchema = z.object({
	name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(200, "Họ tên không được quá 200 ký tự"),
	phone: z.string()
		.min(10, "Số điện thoại phải có ít nhất 10 số")
		.refine((phone) => {
			// Remove spaces and special characters for validation
			const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
			return validator.isMobilePhone(cleanPhone, 'vi-VN') || validator.isMobilePhone(cleanPhone, 'any');
		}, {
			message: "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (ví dụ: 0982484950)"
		}),
	email: z.optional(z.string().email("Email không hợp lệ")),
	address: z.string().max(500).optional().default(''), // Optional address for contact form
	note: z.string().min(8, "Nội dung tin nhắn phải có ít nhất 8 ký tự").max(1000, "Nội dung tin nhắn không được quá 1000 ký tự")
})
export type TContactSchema = z.infer<typeof ContactSchema>
export const defaultContactValues: TContactSchema = {
	note: '',
	phone: '',
	address: '',
	name: '',
}
