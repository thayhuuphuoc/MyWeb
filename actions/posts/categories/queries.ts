"use server";

import prisma from "@/lib/prisma";
import {TPostCategory} from "@/actions/posts/categories/validations";
import {Prisma} from ".prisma/client";
import PostCategoryWhereInput = Prisma.PostCategoryWhereInput;
import { filterColumn } from "@/lib/filter-column";
import _ from "lodash";
import {getErrorMessage} from "@/lib/handle-error";

import {TGetCategoriesSchema} from "@/actions/common/category-schema";

export async function getPostCategory(id: string) {
	try {
		const res = await prisma.postCategory.findUnique({where: {id}});
		return {
			data: res,
			error: null,
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
export async function getPostCategoryBySlug(slug: string): Promise<{data: TPostCategory | null, error: string | null}> {
	try {
		const res = await prisma.postCategory.findUnique({
			where: {
				slug: slug
			}
		});
		return {
			data: res,
			error: null
		}
	} catch (e) {
		if (process.env.NODE_ENV === 'development') {
			console.error("Error in post categories queries:", e);
		}
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
export async function getPostCategories(
	input: TGetCategoriesSchema
) {
	const {
		name,
		slug,

		page,
		per_page,
		sort,
		operator,
	} = input

	// sort
	const [column, order] = (sort?.split(".").filter(Boolean) ?? [
		"name",
		"desc",
	]) as [keyof TPostCategory | undefined, "asc" | "desc" | undefined]

	// where
	const expressions: PostCategoryWhereInput[] = [
		name
			? filterColumn({
				column: 'name',
				value: name,
			})
			: {},
		slug
			? filterColumn({
				column: 'slug',
				value: slug,
			})
			: {},
	].filter((i) => !_.isEmpty(i))
	const where =
		!operator || operator === "and" ? {AND: expressions} : {OR: expressions}

	try {
		const [total, data] = await prisma.$transaction([
			prisma.postCategory.count({
				where: where,
			}),
			prisma.postCategory.findMany({
				take: per_page,
				skip: (page - 1) * per_page,
				select: {
					id: true,
					slug: true,
					name: true,
					image: true,
					description: true,
					metaDescription: true,
					_count: {
						select: {
							posts: true
						}
					}
				},
				where: where,
				orderBy: column
					? order === 'asc'
						? {[column]: 'asc'}
						: {[column]: 'desc'}
					: {id: 'desc'},
			})
		])

		const pageCount = Math.ceil(total / per_page)
		return { data, pageCount }
	} catch (e) {
		return { data: [], pageCount: 0 }
	}
}
