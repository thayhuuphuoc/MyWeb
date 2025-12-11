import {z} from "@/locales/zod-custom";
import slug from "slug";

export const defaultTagValue: TCreateTagSchema = {
	name: "",
	slug: "",
	description: "",
}
export const createTagSchema = z.object({
	name: z.string().max(300),
	slug: z.string().max(300).transform((v) => slug(v)),
	description: z.string(),
	metaDescription: z.string().optional(),
})
export type TCreateTagSchema = z.infer<typeof createTagSchema>

export const tagSearchParamsSchema = z.object({
	name: z.string().optional(),
	slug: z.string().optional(),

	page: z.coerce.number().default(1),
	per_page: z.coerce.number().default(10),
	sort: z.string().optional(),
	operator: z.enum(["and", "or"]).optional(),
})
export const getTagsSchema = tagSearchParamsSchema
export type TGetTagsSchema = z.infer<typeof getTagsSchema>
