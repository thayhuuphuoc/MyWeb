import prisma from "@/lib/prisma";
import {PostStatus} from ".prisma/client";
import {getErrorMessage} from "@/lib/handle-error";

export async function getPostSiteMap() {
	try {
		const res = await prisma.post.findMany({
			where: {
				status: PostStatus.PUBLISHED
			},
			select: {
				title: true,
				slug: true,
				updatedAt: true,
			}
		});
		return {
			data: res,
			error: null
		}
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}

export async function getPostTagsSiteMap() {
	try {
		const res = await prisma.postTag.findMany({
			select: {
				name: true,
				slug: true,
			}
		});
		return {
			data: res,
			error: null
		}
	} catch (e) {
		return {
			data: null,
			error: getErrorMessage(e),
		}
	}
}
