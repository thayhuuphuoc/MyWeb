"use server";

import prisma from "@/lib/prisma";
import {getErrorMessage} from "@/lib/handle-error";
import {TGetPostsSchema, TPost, TPostWithRelation} from "@/actions/posts/validations";
import {filterColumn} from "@/lib/filter-column";
import _ from "lodash";
import {PostStatus, Prisma} from ".prisma/client";
import PostWhereInput = Prisma.PostWhereInput;

export async function findPost(id: string) {
	try {
		const res = await prisma.post.findUnique({where: {id}});
		return {
			data: res,
			error: null
		}
	} catch (e) {
		if (JSON.stringify(e).includes('12 bytes')) {
			return {
				data: null,
				error: 'ID không tồn tại',
			}
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export async function getPublishedPostBySlug(slug: string): Promise<{data: TPostWithRelation | null, error: string | null}> {
	try {
		const res = await prisma.post.findUnique({
			where: {
				slug: slug,
				status: PostStatus.PUBLISHED
			},
			include: {
				author: true,
				categories: true,
				tags: true,
				_count: {
					select: {
						comments: true,
					},
				},
			},
		});
		return {
			data: res,
			error: null
		}
	} catch (e) {
		console.log(e)
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export async function getRandomPublishedPosts(limit: number) {
	try {
		const postsCount = await prisma.post.count({where: {status: PostStatus.PUBLISHED}});
		const skip = Math.max(Math.floor(Math.random() * (postsCount-limit)),0);

		const res = await prisma.post.findMany({
			where: {
				status: PostStatus.PUBLISHED
			},
			include: {
				author: true,
				categories: true,
				tags: true,
				_count: {
					select: {
						comments: true,
					},
				},
			},
			take: limit,
			skip,
			orderBy: {
				updatedAt: 'desc'
			}
		});
		return {
			data: res,
			error: null
		}
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error('[getRandomPublishedPosts] Error:', e);
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export async function getPosts(
	input: TGetPostsSchema
): Promise<{data: TPostWithRelation[], pageCount: number}> {
	const {
		title,
		slug,
		authorId,
		status,

		enabledRelated,

		tags,
		tag_slug,
		categories,
		category_slug,

		page,
		per_page,
		sort,
		operator,
		from,
		to,
	} = input

	// sort
	const [column, order] = (sort?.split(".").filter(Boolean) ?? [
		"createdAt",
		"desc",
	]) as [keyof TPost | undefined, "asc" | "desc" | undefined]

	// date
	let fromDay = from ? new Date(from) : undefined
	let toDay = to ? new Date(to) : undefined
	if(fromDay && toDay) {
		fromDay.setHours(0,0,0,0);
		toDay.setHours(23, 59, 59, 999)
	}

	// where
	const expressions: PostWhereInput[] = [
		title
			? filterColumn({
				column: 'title',
				value: title,
			})
			: {},
		slug
			? filterColumn({
				column: 'slug',
				value: slug,
			})
			: {},
		status
			? filterColumn({
				column: 'status',
				value: status,
				isSelectable: true
			})
			: {},
		typeof enabledRelated === "boolean"
			? {
				enabledRelated
			}
			: {},
		fromDay && toDay
			? {
				createdAt: {
					gte: fromDay,
					lte: toDay
				}
			}
			: {},
		tags
			? filterColumn({
				column: 'tags',
				value: tags,
				relation: {
					filterKey: 'id'
				}
			})
			: {},
		categories
			? filterColumn({
				column: 'categories',
				value: categories,
				relation: {
					filterKey: 'id'
				}
			})
			: {},
		tag_slug
			? filterColumn({
				column: 'tags',
				value: tag_slug,
				relation: {
					filterKey: 'slug'
				}
			})
			: {},
		category_slug
			? filterColumn({
				column: 'categories',
				value: category_slug,
				relation: {
					filterKey: 'slug'
				}
			})
			: {},
	].filter((i) => !_.isEmpty(i))
	const where =
		!operator || operator === "and" ? {AND: expressions} : {OR: expressions}

	try {
		const [total, data] = await prisma.$transaction(async (tx) => {
			const total = await prisma.post.count({
				where: where,
			})
			const data = await prisma.post.findMany({
				take: per_page,
				skip: (page - 1) * per_page,
				where: where,
				orderBy: column
					? order === 'asc'
						? {[column]: 'asc'}
						: {[column]: 'desc'}
					: {id: 'desc'},
				include: {
					author: true,
					categories: true,
					tags: true,
					_count: {
						select: {
							comments: true,
						},
					},
				},
			})
			return [total, data]
		})

		const pageCount = Math.ceil(total / per_page)
		return { data, pageCount }
	} catch (e) {
		return { data: [], pageCount: 0 }
	}
}

export type TShortPostConstant = {
	id: string,
	name: string,
	slug: string,
}
export async function getPostConstants() {
	const res = await prisma.$transaction([
		prisma.postCategory.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
			}
		}),
		prisma.postTag.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
			}
		})
	]);
	return {
		categories: res[0],
		tags: res[1]
	}
}
