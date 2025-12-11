import * as z from "zod";
import {Prisma, ProductCategory} from "@prisma/client";
import ProductCategoryCreateInput = Prisma.ProductCategoryCreateInput;
import ProductCategoryUpdateInput = Prisma.ProductCategoryUpdateInput;
import ProductCategoryGetPayload = Prisma.ProductCategoryGetPayload;
import slug from "slug";

export type TProductCategoryCreateInput = ProductCategoryCreateInput
export type TProductCategoryUpdateInput = ProductCategoryUpdateInput
export type TProductCategory = ProductCategory
export type TProductCategoryWithProductCount = ProductCategoryGetPayload<{
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

export const createProductCategorySchema = z.object({
	name: z.string().max(300),
	slug: z.string().max(300).transform((v) => slug(v)),
})

export type TCreateProductCategorySchema = z.infer<typeof createProductCategorySchema>

export const updateProductCategorySchema = z.object({
	name: z.string().max(300).optional(),
	slug: z.string().max(300).transform((v) => slug(v)).optional(),
})

export type TUpdateProductCategorySchema = z.infer<typeof updateProductCategorySchema>


export const searchParamsSchema = z.object({
	name: z.string().optional(),
	slug: z.string().optional(),

	page: z.coerce.number().default(1),
	per_page: z.coerce.number().default(10),
	sort: z.string().optional(),
	operator: z.enum(["and", "or"]).optional(),
})

export const getProductCategoriesSchema = searchParamsSchema
export type TGetProductCategoriesSchema = z.infer<typeof getProductCategoriesSchema>
