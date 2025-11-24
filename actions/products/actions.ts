"use server";

import prisma from "@/lib/prisma";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {getErrorMessage} from "@/lib/handle-error";
import {revalidatePath} from "next/cache";
import {AddProductSchema, TAddProductSchema, TUpdateProductSchema} from "@/actions/products/validations";

export const addProduct = async (
	values: TAddProductSchema
)=> {
	noStore()

	try {
		const res = await prisma.product.create({
			data: {
				...values,
				authorId: values.authorId,
				categories: {
					connect: values.categoryIDs.map((id) => ({id}))
				},
				tags: {
					connect: values.tagIDs.map((id) => ({id}))
				},
			}
		})
		revalidatePath("/dashboard/products")

		return {
			data: res,
			error: null
		}
	} catch(e) {
		if(JSON.stringify(e).includes('slug_key')){
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
export const updateProduct = async (
	values: TUpdateProductSchema,
	id: string,
) => {
	try {
		const temp = {...values}
		delete temp?.categoryIDs
		delete temp?.tagIDs
		delete temp?.authorId

		await prisma.product.update({
			where: {id: id},
			data: {
				categories: {set: []},
				tags: {set: []}
			}
		})
		const res = await prisma.product.update({
			where: {id: id},
			data: {
				...temp,
				updatedAt: new Date(),
				categories: {
					connect: (values.categoryIDs || []).map((id) => ({id}))
				},
				tags: {
					connect: (values.tagIDs || []).map((id) => ({id}))
				}
			}
		})
		revalidatePath("/dashboard/products")

		return {
			data: res,
			error: null
		}
	} catch(e) {
		if(JSON.stringify(e).includes('slug_key')){
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


export async function deleteProduct(id: string){
	try {
		const [, data] = await prisma.$transaction([
			prisma.product.update({
				where: {id},
				data: {
					categories: {
						// disconnect: res.data?.categoryIDs.map((id) => ({id})),
						set: []
					},
					tags: {
						set: []
					}
				}
			}),
			prisma.product.delete({where: {id}})
		])
		revalidatePath("/dashboard/products")

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

export async function deleteProducts(input: {ids: string[]}) {
	try {
		const [, data] = await prisma.$transaction(async (tx) => {
			for (const id of input.ids) {
				await tx.product.update({
					where: {id},
					data: {
						categories: {
							set: []
						},
						tags: {
							set: [],
						}
					}
				})
			}

			const data = await tx.product.deleteMany({
				where: {
					id: {
						in: input.ids
					}
				},
			})

			return [null, data]
		})

		revalidatePath("/dashboard/products")

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
