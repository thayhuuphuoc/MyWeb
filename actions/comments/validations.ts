import { z } from "@/locales/zod-custom";
import { Prisma } from "@prisma/client";
import { isMongoId } from "validator";
import PostCommentGetPayload = Prisma.PostCommentGetPayload;

export type TPostCommentWithRelation = PostCommentGetPayload<{
	include: {
		author: {
			select: {
				id: true;
				name: true;
				image: true;
				email: true;
			};
		};
		replies: {
			include: {
				author: {
					select: {
						id: true;
						name: true;
						image: true;
						email: true;
					};
				};
				replies: {
					include: {
						author: {
							select: {
								id: true;
								name: true;
								image: true;
								email: true;
							};
						};
					};
				};
			};
		};
	};
}>;

export const AddCommentSchema = z.object({
	comment: z.string().min(1, "Bình luận không được để trống").max(1000, "Bình luận không được quá 1000 ký tự"),
	postId: z.string().refine(isMongoId, "Post ID không hợp lệ"),
	replyId: z.string().refine(isMongoId, "Reply ID không hợp lệ").optional(),
});

export type TAddCommentSchema = z.infer<typeof AddCommentSchema>;

export const UpdateCommentSchema = z.object({
	comment: z.string().min(1, "Bình luận không được để trống").max(1000, "Bình luận không được quá 1000 ký tự"),
});

export type TUpdateCommentSchema = z.infer<typeof UpdateCommentSchema>;

