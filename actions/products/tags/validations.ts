import * as z from "zod";
import {Prisma, ProductTag} from "@prisma/client";
import ProductTagCreateInput = Prisma.ProductTagCreateInput;
import ProductTagUpdateInput = Prisma.ProductTagUpdateInput;
import ProductTagGetPayload = Prisma.ProductTagGetPayload;
import slug from "slug";

export type TProductTagCreateInput = ProductTagCreateInput
export type TProductTagUpdateInput = ProductTagUpdateInput
export type TProductTag = ProductTag
export type TProductTagWithProductCount = ProductTagGetPayload<{
	select: {
		id: true,
		slug: true,
		name: true,
		_count: {
			select: {
				products: true
			}
		}
	}
}>

export const createProductTagSchema = z.object({
	name: z.string().max(300),
	slug: z.string().max(300).transform((v) => slug(v)),
})

export type TCreateProductTagSchema = z.infer<typeof createProductTagSchema>

export const updateProductTagSchema = z.object({
	name: z.string().max(300).optional(),
	slug: z.string().max(300).transform((v) => slug(v)).optional(),
})

export type TUpdateProductTagSchema = z.infer<typeof updateProductTagSchema>


export const searchParamsSchema = z.object({
	name: z.string().optional(),
	slug: z.string().optional(),

	page: z.coerce.number().default(1),
	per_page: z.coerce.number().default(10),
	sort: z.string().optional(),
	operator: z.enum(["and", "or"]).optional(),
})

export const getProductTagsSchema = searchParamsSchema
export type TGetProductTagsSchema = z.infer<typeof getProductTagsSchema>
