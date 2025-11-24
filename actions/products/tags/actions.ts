"use server";

import {
	TProductTagCreateInput,
	TProductTagUpdateInput
} from "@/actions/products/tags/validations";
import prisma from "@/lib/prisma";
import {getProductTag} from "@/actions/products/tags/queries";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {revalidatePath} from "next/cache";
import {getErrorMessage} from "@/lib/handle-error";

export const addProductTag = async (
	values: TProductTagCreateInput
) => {
	noStore()

	try {
		const res = await prisma.productTag.create({
			data: values
		})
		revalidatePath("/dashboard/products/tags")

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
export const updateProductTag = async (
	values: TProductTagUpdateInput,
	id: string,
) => {
	noStore()

	try {
		const res = await prisma.productTag.update({
			where: {id},
			data: values
		})
		revalidatePath("/dashboard/products/tags")

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

export async function deleteProductTag(id: string) {
	try {
		// const resProduct = await getProductTag(id)
		const [, data] = await prisma.$transaction([
			prisma.productTag.update({
				where: {id},
				data: {
					products: {
						// disconnect: resProduct.productIDs.map((id) => ({id})),
						set: []
					}
				}
			}),
			prisma.productTag.delete({where: {id}})
		])
		revalidatePath("/dashboard/products/tags")

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
export async function deleteProductTags(input: {ids: string[]}) {
	try {
		const productTags = await prisma.productTag.findMany({
			where: {
				id: {
					in: input.ids
				}
			}
		});

		const allProductIds: string[] = []
		productTags.forEach((productTag) => {
			allProductIds.push(...productTag.productIDs)
		})
		const uniqueIds = Array.from(new Set(allProductIds))

		const [, data] = await prisma.$transaction(async (tx) => {

			for (const id of input.ids) {
				await tx.productTag.update({
					where: {id},
					data: {
						products: {
							// disconnect: resProduct.productIDs.map((id) => ({id})),
							set: []
						}
					}
				})
			}

			const data = await tx.productTag.deleteMany({
				where: {
					id: {
						in: input.ids
					}
				},
			})

			return [null, data]
		})
		revalidatePath("/dashboard/products/tags")

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
