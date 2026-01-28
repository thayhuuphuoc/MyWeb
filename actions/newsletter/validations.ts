import { z } from "zod";

export const NewsletterSchema = z.object({
	email: z.string().email("Email không hợp lệ"),
});

export type TNewsletterSchema = z.infer<typeof NewsletterSchema>;









