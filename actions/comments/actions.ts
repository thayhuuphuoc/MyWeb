"use server";

import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/handle-error";
import { revalidatePath } from "next/cache";
import { AddCommentSchema, TAddCommentSchema, TUpdateCommentSchema, UpdateCommentSchema } from "./validations";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export async function addComment(values: TAddCommentSchema) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return {
				data: null,
				error: "Bạn cần đăng nhập để bình luận",
			};
		}

		// Validate schema
		const validatedFields = AddCommentSchema.safeParse(values);
		if (!validatedFields.success) {
			return {
				data: null,
				error: validatedFields.error.errors[0]?.message || "Dữ liệu không hợp lệ",
			};
		}

		const { comment, postId, replyId } = validatedFields.data;

		// Kiểm tra bài viết có tồn tại không
		const post = await prisma.post.findUnique({
			where: { id: postId },
		});

		if (!post) {
			return {
				data: null,
				error: "Bài viết không tồn tại",
			};
		}

		// Nếu là reply, kiểm tra comment gốc có tồn tại không
		if (replyId) {
			const parentComment = await prisma.postComment.findUnique({
				where: { id: replyId },
			});

			if (!parentComment) {
				return {
					data: null,
					error: "Bình luận không tồn tại",
				};
			}
		}

		// Tạo comment
		const newComment = await prisma.postComment.create({
			data: {
				comment: comment.trim(),
				postId: postId,
				authorId: session.user.id,
				replyId: replyId || null,
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
					},
				},
			},
		});

		// Revalidate trang bài viết
		const postSlug = post.slug;
		revalidatePath(`/blog/${postSlug}`);
		revalidatePath("/blog");

		return {
			data: newComment,
			error: null,
		};
	} catch (e) {
		console.error("Error adding comment:", e);
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

export async function updateComment(commentId: string, values: TUpdateCommentSchema) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return {
				data: null,
				error: "Bạn cần đăng nhập để sửa bình luận",
			};
		}

		// Validate schema
		const validatedFields = UpdateCommentSchema.safeParse(values);
		if (!validatedFields.success) {
			return {
				data: null,
				error: validatedFields.error.errors[0]?.message || "Dữ liệu không hợp lệ",
			};
		}

		// Kiểm tra comment có tồn tại không
		const existingComment = await prisma.postComment.findUnique({
			where: { id: commentId },
			include: {
				post: true,
			},
		});

		if (!existingComment) {
			return {
				data: null,
				error: "Bình luận không tồn tại",
			};
		}

		// Kiểm tra quyền: chỉ author hoặc admin mới được sửa
		const isAuthor = existingComment.authorId === session.user.id;
		const isAdmin = session.user.role === UserRole.ADMIN;

		if (!isAuthor && !isAdmin) {
			return {
				data: null,
				error: "Bạn không có quyền sửa bình luận này",
			};
		}

		// Cập nhật comment
		const updatedComment = await prisma.postComment.update({
			where: { id: commentId },
			data: {
				comment: validatedFields.data.comment.trim(),
				updatedAt: new Date(),
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
					},
				},
			},
		});

		// Revalidate trang bài viết
		if (existingComment.post) {
			revalidatePath(`/blog/${existingComment.post.slug}`);
			revalidatePath("/blog");
		}

		return {
			data: updatedComment,
			error: null,
		};
	} catch (e) {
		console.error("Error updating comment:", e);
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

export async function deleteComment(commentId: string) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return {
				data: null,
				error: "Bạn cần đăng nhập để xóa bình luận",
			};
		}

		// Kiểm tra comment có tồn tại không
		const existingComment = await prisma.postComment.findUnique({
			where: { id: commentId },
			include: {
				post: true,
			},
		});

		if (!existingComment) {
			return {
				data: null,
				error: "Bình luận không tồn tại",
			};
		}

		// Kiểm tra quyền: chỉ author hoặc admin mới được xóa
		const isAuthor = existingComment.authorId === session.user.id;
		const isAdmin = session.user.role === UserRole.ADMIN;

		if (!isAuthor && !isAdmin) {
			return {
				data: null,
				error: "Bạn không có quyền xóa bình luận này",
			};
		}

		// Xóa comment (replies sẽ được xóa tự động nếu có onDelete: Cascade)
		await prisma.postComment.delete({
			where: { id: commentId },
		});

		// Revalidate trang bài viết
		if (existingComment.post) {
			revalidatePath(`/blog/${existingComment.post.slug}`);
			revalidatePath("/blog");
		}

		return {
			data: { success: true },
			error: null,
		};
	} catch (e) {
		console.error("Error deleting comment:", e);
		return {
			data: null,
			error: getErrorMessage(e),
		};
	}
}

