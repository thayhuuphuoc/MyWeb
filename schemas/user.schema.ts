import * as z from "zod";
import validator from "validator";
import {UserRole, UserStatus} from "@prisma/client";

export const EditUserSchema = z.object({
	name: z.optional(z.string()),
	image: z.optional(z.string()),
	visible: z.optional(z.boolean()),
	address: z.optional(z.string()),
	phoneNum: z.optional(
		z.string().refine((phone) => {
			return validator.isMobilePhone(phone!, 'vi-VN')
		}, {
			message: 'Số điện thoại không hợp lệ '
		})
	),
	password: z.optional(
		z
			.string()
			.min(8, { message: 'Yêu cầu tối thiểu 8 ký tự' })
			.max(64, {
				message: 'Tối đa 64 ký ự',
			})
			.refine(
				(value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value ?? ''),
				'Mật khẩu phải chứa cả số và chữ'
			),
	),
	status: z.optional(z.nativeEnum(UserStatus)),
	role: z.optional(z.nativeEnum(UserRole))
})

export type TEditUserSchema = z.infer<typeof EditUserSchema>
