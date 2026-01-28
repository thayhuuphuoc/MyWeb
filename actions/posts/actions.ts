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
		if (!input.ids || input.ids.length === 0) {
			return {
				data: null,
				error: "Không có ID nào để xóa"
			}
		}

		// Filter out any invalid IDs
		const validIds = input.ids.filter(id => id && typeof id === 'string')

		if (validIds.length === 0) {
			return {
				data: null,
				error: "Không có ID hợp lệ để xóa"
			}
		}

		// Delete comments first (outside transaction)
		await prisma.postComment.deleteMany({
			where: {
				postId: {
					in: validIds
				}
			}
		})

		// Disconnect relationships (outside transaction)
		await Promise.all(
			validIds.map(id => 
				prisma.post.update({
					where: {id},
					data: {
						categories: { set: [] },
						tags: { set: [] }
					}
				})
			)
		)

		// Finally, delete the posts
		const deleteResult = await prisma.post.deleteMany({
			where: {
				id: {
					in: validIds
				}
			}
		})

		if (process.env.NODE_ENV === 'development') {
			console.log('[deletePosts] Deleted count:', deleteResult.count);
		}
		
		revalidatePath("/dashboard/posts")

		return {
			data: deleteResult,
			error: null
		};
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error('[deletePosts] Error:', e);
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
