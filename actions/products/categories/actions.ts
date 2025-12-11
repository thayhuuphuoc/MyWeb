"use server";

import {
	TProductCategoryCreateInput,
	TProductCategoryUpdateInput
} from "@/actions/products/categories/validations";
import prisma from "@/lib/prisma";
import {getProductCategory} from "@/actions/products/categories/queries";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {revalidatePath} from "next/cache";
import {getErrorMessage} from "@/lib/handle-error";

export const addProductCategory = async (
	values: TProductCategoryCreateInput
) => {
	noStore()

	try {
		const res = await prisma.productCategory.create({
			data: values
		})
		revalidatePath("/dashboard/products/categories")

		return {
			data: res,
			error: null
		}
	} catch (e) {
		if (JSON.stringify(e).includes('slug_key')) {
			return {
				error: `Slug "${values.slug}" đã được sử dụng, hãy đổi slug khác`,
				cause: 'slug',
				data: null
			}
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export const updateProductCategory = async (
	values: TProductCategoryUpdateInput,
	id: string,
) => {
	noStore()

	try {
		const res = await prisma.productCategory.update({
			where: {id},
			data: values
		})
		revalidatePath("/dashboard/products/categories")

		return {
			data: res,
			error: null,
		}
	} catch (e) {
		if (JSON.stringify(e).includes('slug_key')) {
			return {
				error: `Slug "${values.slug}" đã được sử dụng, hãy đổi slug khác`,
				cause: 'slug',
				data: null
			}
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}

export async function deleteProductCategory(id: string) {
	try {
		// const resProduct = await getProductCategory(id)
		const [, data] = await prisma.$transaction([
			prisma.productCategory.update({
				where: {id},
				data: {
					products: {
						// disconnect: resProduct.productIDs.map((id) => ({id})),
						set: []
					}
				}
			}),
			prisma.productCategory.delete({where: {id}})
		])
		revalidatePath("/dashboard/products/categories")

		return {
			data: data,
			error: null
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export async function deleteProductCategories(input: {ids: string[]}) {
	try {
		const productCats = await prisma.productCategory.findMany({
			where: {
				id: {
					in: input.ids
				}
			}
		});

		const allProductIds: string[] = []
		productCats.forEach((productCat) => {
			allProductIds.push(...productCat.productIDs)
		})
		const uniqueIds = Array.from(new Set(allProductIds))

		const [, data] = await prisma.$transaction(async (tx) => {

			for (const id of input.ids) {
				await tx.productCategory.update({
					where: {id},
					data: {
						products: {
							// disconnect: resProduct.productIDs.map((id) => ({id})),
							set: []
						}
					}
				})
			}

			const data = await tx.productCategory.deleteMany({
				where: {
					id: {
						in: input.ids
					}
				},
			})

			return [null, data]
		})
		revalidatePath("/dashboard/products/categories")

		return {
			data: data,
			error: null
		};
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
