"use server";

import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/handle-error";
import { TPostCommentWithRelation } from "./validations";

export async function getCommentsByPostId(
	postId: string
): Promise<{ data: TPostCommentWithRelation[] | null; error: string | null }> {
	try {
		const comments = await prisma.postComment.findMany({
			where: {
				postId: postId,
				replyId: null, // Chỉ lấy comments gốc, không lấy replies
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true,
						email: true,
					},
				},
				replies: {
					include: {
						author: {
							select: {
								id: true,
								name: true,
								image: true,
								email: true,
							},
						},
						replies: {
							include: {
								author: {
									select: {
										id: true,
										name: true,
										image: true,
										email: true,
									},
								},
							},
						},
					},
					orderBy: {
						createdAt: "asc",
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return {
			data: comments,
			error: null,
		};
	} catch (e) {
		console.error("Error fetching comments:", e);
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

export async function getCommentById(
	commentId: string
): Promise<{ data: TPostCommentWithRelation | null; error: string | null }> {
	try {
		const comment = await prisma.postComment.findUnique({
			where: {
				id: commentId,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true,
						email: true,
					},
				},
				replies: {
					include: {
						author: {
							select: {
								id: true,
								name: true,
								image: true,
								email: true,
							},
						},
						replies: {
							include: {
								author: {
									select: {
										id: true,
										name: true,
										image: true,
										email: true,
									},
								},
							},
						},
					},
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		return {
			data: comment,
			error: null,
		};
	} catch (e) {
		console.error("Error fetching comment:", e);
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

