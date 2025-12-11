"use server";

import {
	TPostCategoryCreateInput,
	TPostCategoryUpdateInput
} from "@/actions/posts/categories/validations";
import prisma from "@/lib/prisma";
import {getPostCategory} from "@/actions/posts/categories/queries";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {revalidatePath} from "next/cache";
import {getErrorMessage} from "@/lib/handle-error";

export const addPostCategory = async (
	values: TPostCategoryCreateInput
) => {
	noStore()

	try {
		const res = await prisma.postCategory.create({
			data: values
		})
		revalidatePath("/dashboard/posts/categories")

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
export const updatePostCategory = async (
	values: TPostCategoryUpdateInput,
	id: string,
) => {
	noStore()

	try {
		const res = await prisma.postCategory.update({
			where: {id},
			data: values
		})
		revalidatePath("/dashboard/posts/categories")

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

export async function deletePostCategory(id: string) {
	try {
		// const resPost = await getPostCategory(id)
		const [, data] = await prisma.$transaction([
			prisma.postCategory.update({
				where: {id},
				data: {
					posts: {
						// disconnect: resPost.postIDs.map((id) => ({id})),
						set: []
					}
				}
			}),
			prisma.postCategory.delete({where: {id}})
		])
		revalidatePath("/dashboard/posts/categories")

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
export async function deletePostCategories(input: {ids: string[]}) {
	try {
		const postCats = await prisma.postCategory.findMany({
			where: {
				id: {
					in: input.ids
				}
			}
		});

		const allPostIds: string[] = []
		postCats.forEach((postCat) => {
			allPostIds.push(...postCat.postIDs)
		})
		const uniqueIds = Array.from(new Set(allPostIds))

		const [, data] = await prisma.$transaction(async (tx) => {

			for (const id of input.ids) {
				await tx.postCategory.update({
					where: {id},
					data: {
						posts: {
							// disconnect: resPost.postIDs.map((id) => ({id})),
							set: []
						}
					}
				})
			}

			const data = await tx.postCategory.deleteMany({
				where: {
					id: {
						in: input.ids
					}
				},
			})

			return [null, data]
		})
		revalidatePath("/dashboard/posts/categories")

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
