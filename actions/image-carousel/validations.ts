import * as z from "zod";

// Schema cho form (imageUrl optional vì sẽ được set sau khi upload)
export const ImageCarouselFormSchema = z.object({
	imageUrl: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	order: z.number().int().default(0),
	isActive: z.boolean().default(true),
});

// Schema cho server action (imageUrl required)
export const ImageCarouselSchema = z.object({
	imageUrl: z.string().min(1, "URL hình ảnh là bắt buộc"),
	title: z.string().optional(),
	description: z.string().optional(),
	order: z.number().int().default(0),
	isActive: z.boolean().default(true),
});

export type TImageCarousel = z.infer<typeof ImageCarouselSchema>;
export type TImageCarouselForm = z.infer<typeof ImageCarouselFormSchema>;

