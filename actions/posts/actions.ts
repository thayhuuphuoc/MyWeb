"use server";

import prisma from "@/lib/prisma";
import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {getErrorMessage} from "@/lib/handle-error";
import {revalidatePath} from "next/cache";
import {AddPostSchema, TAddPostSchema, TUpdatePostSchema} from "@/actions/posts/validations";

export const addPost = async (
	values: TAddPostSchema
)=> {
	noStore()

	try {
		const res = await prisma.post.create({
			data: {
				...values,
				authorId: values.authorId,
				categories: {
					connect: values.categoryIDs.map((id) => ({id}))
				},
				tags: {
					connect: values.tagIDs.map((id) => ({id}))
				},
			},
		})
		revalidatePath("/dashboard/posts")

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

export const updatePost = async (
	values: TUpdatePostSchema,
	id: string,
) => {
	try {
		await prisma.post.update({
			where: {id: id},
			data: {
				categories: {set: []},
				tags: {set: []}
			}
		})
		const res = await prisma.post.update({
			where: {id: id},
			data: {
				...values,
				updatedAt: new Date(),
				categories: {
					connect: (values.categoryIDs || []).map((id) => ({id}))
				},
				tags: {
					connect: (values.tagIDs || []).map((id) => ({id}))
				}
			}
		})
		revalidatePath("/dashboard/posts")

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

export async function deletePost(id: string){
	try {
		const [, data] = await prisma.$transaction([
			prisma.post.update({
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
			prisma.post.delete({where: {id}})
		])
		revalidatePath("/dashboard/posts")

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

export async function deletePosts(input: {ids: string[]}) {
	try {
		const [, data] = await prisma.$transaction(async (tx) => {
			for (const id of input.ids) {
				await tx.post.update({
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

			const data = await tx.post.deleteMany({
				where: {
					id: {
						in: input.ids
					}
				},
			})

			return [null, data]
		})

		revalidatePath("/dashboard/posts")

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
