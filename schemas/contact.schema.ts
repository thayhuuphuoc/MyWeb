import {z} from "@/locales/zod-custom"
import validator from "validator";

export const ContactSchema = z.object({
	name: z.string().min(2).max(200),
	phone: z.string().refine((phone) => {
		return validator.isMobilePhone(phone!, 'vi-VN')
	}),
	email: z.optional(z.string().email()),
	address: z.string().min(8).max(500),
	note: z.string().min(8).max(1000)
})
export type TContactSchema = z.infer<typeof ContactSchema>
export const defaultContactValues: TContactSchema = {
	note: '',
	phone: '',
	address: '',
	name: '',
}
