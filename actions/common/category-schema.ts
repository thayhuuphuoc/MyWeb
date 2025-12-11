import {z} from "@/locales/zod-custom";
import slug from "slug";
import {ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE} from "@/enum/enums";

export const defaultCatValue: TCreateCategorySchema = {
	name: "",
	slug: "",
	image: "",
	description: "",
}
export const createCategorySchema = z.object({
	name: z.string().max(300),
	slug: z.string().max(300).transform((v) => slug(v)),
	image: z.any()
	.refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
	.refine(
		(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
		"Only .jpg, .jpeg, .png and .webp formats are supported."
	).or(z.string().nullable()),
	description: z.string(),
	metaDescription: z.string().optional(),
	parentCategoryId: z.string().optional(),
	priority: z.coerce.number().optional(),
})
export type TCreateCategorySchema = z.infer<typeof createCategorySchema>


export const catSearchParamsSchema = z.object({
	name: z.string().optional(),
	slug: z.string().optional(),

	page: z.coerce.number().default(1),
	per_page: z.coerce.number().default(10),
	sort: z.string().optional(),
	operator: z.enum(["and", "or"]).optional(),
})
export const getCategoriesSchema = catSearchParamsSchema
export type TGetCategoriesSchema = z.infer<typeof getCategoriesSchema>
