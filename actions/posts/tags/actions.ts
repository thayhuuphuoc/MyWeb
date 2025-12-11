"use server";

import {
	TPostTagCreateInput,
	TPostTagUpdateInput
} from "@/actions/posts/tags/validations";
import prisma from "@/lib/prisma";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {revalidatePath} from "next/cache";
import {getErrorMessage} from "@/lib/handle-error";

export const addPostTag = async (
	values: TPostTagCreateInput
) => {
	noStore()

	try {
		const res = await prisma.postTag.create({
			data: values
		})
		revalidatePath("/dashboard/posts/tags")

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
export const updatePostTag = async (
	values: TPostTagUpdateInput,
	id: string,
) => {
	noStore()

	try {
		const res = await prisma.postTag.update({
			where: {id},
			data: values
		})
		revalidatePath("/dashboard/posts/tags")

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

export async function deletePostTag(id: string) {
	try {
		// const resPost = await getPostTag(id)
		const [, data] = await prisma.$transaction([
			prisma.postTag.update({
				where: {id},
				data: {
					posts: {
						// disconnect: resPost.postIDs.map((id) => ({id})),
						set: []
					}
				}
			}),
			prisma.postTag.delete({where: {id}})
		])
		revalidatePath("/dashboard/posts/tags")

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
export async function deletePostTags(input: {ids: string[]}) {
	try {
		const postTags = await prisma.postTag.findMany({
			where: {
				id: {
					in: input.ids
				}
			}
		});

		const allPostIds: string[] = []
		postTags.forEach((postTag) => {
			allPostIds.push(...postTag.postIDs)
		})
		const uniqueIds = Array.from(new Set(allPostIds))

		const [, data] = await prisma.$transaction(async (tx) => {
			for (const id of input.ids) {
				await tx.postTag.update({
					where: {id},
					data: {
						posts: {
							// disconnect: resPost.postIDs.map((id) => ({id})),
							set: []
						}
					}
				})
			}

			const data = await tx.postTag.deleteMany({
				where: {
					id: {
						in: input.ids
					}
				},
			})

			return [null, data]
		})
		revalidatePath("/dashboard/posts/tags")

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
