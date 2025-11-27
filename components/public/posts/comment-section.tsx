"use client";

import { TPostCommentWithRelation } from "@/actions/comments/validations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDateVn } from "@/lib/date";
import { MessageCircle, Reply, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { deleteComment, updateComment } from "@/actions/comments/actions";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserRole } from "@prisma/client";
import CommentForm from "./comment-form";

interface CommentSectionProps {
	comments: TPostCommentWithRelation[];
	postId: string;
	onCommentAdded?: () => void;
}

interface CommentItemProps {
	comment: TPostCommentWithRelation;
	postId: string;
	onCommentAdded?: () => void;
	level?: number;
}

function CommentItem({ comment, postId, onCommentAdded, level = 0 }: CommentItemProps) {
	const { data: session } = useSession();
	const [isReplying, setIsReplying] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const isAuthor = session?.user?.id === comment.authorId;
	const isAdmin = session?.user?.role === UserRole.ADMIN;
	const canEdit = isAuthor || isAdmin;
	const canDelete = isAuthor || isAdmin;

	const handleDelete = async () => {
		setIsDeleting(true);
		const result = await deleteComment(comment.id);
		setIsDeleting(false);
		setShowDeleteDialog(false);
		if (result.error) {
			alert(result.error);
		} else {
			onCommentAdded?.();
		}
	};

	const getInitials = (name: string | null | undefined) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className={`flex flex-col gap-3 ${level > 0 ? "ml-8 md:ml-12 mt-4" : ""}`}>
			<div className="bg-primary/10 dark:bg-primary/5 px-4 md:px-6 py-4 rounded-md flex flex-col gap-3">
				<div className="flex items-start gap-4">
					<Avatar className="w-10 h-10 flex-shrink-0">
						<AvatarImage src={comment.author?.image || undefined} alt={comment.author?.name || "User"} />
						<AvatarFallback className="bg-primary text-white text-sm">
							{getInitials(comment.author?.name)}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<p className="font-semibold text-navyGray dark:text-white text-sm md:text-base">
								{comment.author?.name || "Người dùng"}
							</p>
							<span className="text-xs text-navyGray/60 dark:text-white/60">
								{getDateVn(comment.createdAt, true)}
							</span>
							{comment.updatedAt.getTime() !== comment.createdAt.getTime() && (
								<span className="text-xs text-navyGray/60 dark:text-white/60 italic">(đã chỉnh sửa)</span>
							)}
						</div>
						{!isEditing ? (
							<p className="text-sm md:text-base font-normal text-navyGray dark:text-white/90 mt-2 whitespace-pre-wrap break-words">
								{comment.comment}
							</p>
						) : (
							<CommentEditForm
								comment={comment}
								onCancel={() => setIsEditing(false)}
								onSuccess={() => {
									setIsEditing(false);
									onCommentAdded?.();
								}}
							/>
						)}
					</div>
				</div>

				{!isEditing && (
					<div className="flex items-center gap-3 flex-wrap">
						{level === 0 && (
							<button
								onClick={() => setIsReplying(!isReplying)}
								className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
							>
								<Reply className="w-4 h-4" />
								<span>Trả lời</span>
							</button>
						)}
						{canEdit && (
							<button
								onClick={() => setIsEditing(true)}
								className="flex items-center gap-2 text-sm text-navyGray dark:text-white/80 hover:text-primary transition-colors"
							>
								<Edit2 className="w-4 h-4" />
								<span>Sửa</span>
							</button>
						)}
						{canDelete && (
							<button
								onClick={() => setShowDeleteDialog(true)}
								className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
							>
								<Trash2 className="w-4 h-4" />
								<span>Xóa</span>
							</button>
						)}
					</div>
				)}

				{isReplying && level === 0 && (
					<div className="mt-2">
						<CommentForm
							postId={postId}
							replyId={comment.id}
							onSuccess={() => {
								setIsReplying(false);
								onCommentAdded?.();
							}}
							onCancel={() => setIsReplying(false)}
						/>
					</div>
				)}
			</div>

			{/* Replies */}
			{comment.replies && comment.replies.length > 0 && (
				<div className="flex flex-col gap-3 mt-2">
					{comment.replies.map((reply) => {
						// Type assertion để fix type error - replies trong replies sẽ luôn là empty array
						const replyWithEmptyReplies = {
							...reply,
							replies: [] as typeof reply.replies,
						};
						return (
							<CommentItem
								key={reply.id}
								comment={replyWithEmptyReplies as TPostCommentWithRelation}
								postId={postId}
								onCommentAdded={onCommentAdded}
								level={level + 1}
							/>
						);
					})}
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa bình luận</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600">
							{isDeleting ? "Đang xóa..." : "Xóa"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function CommentEditForm({
	comment,
	onCancel,
	onSuccess,
}: {
	comment: TPostCommentWithRelation;
	onCancel: () => void;
	onSuccess: () => void;
}) {
	const [editText, setEditText] = useState(comment.comment);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const result = await updateComment(comment.id, { comment: editText.trim() });
		setIsSubmitting(false);

		if (result.error) {
			setError(result.error);
		} else {
			onSuccess();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2">
			<textarea
				value={editText}
				onChange={(e) => setEditText(e.target.value)}
				className="input-class min-h-[100px] resize-none"
				placeholder="Nhập bình luận..."
				required
				maxLength={1000}
			/>
			{error && <p className="text-sm text-red-500">{error}</p>}
			<div className="flex items-center gap-2">
				<Button type="submit" size="sm" disabled={isSubmitting || !editText.trim()}>
					{isSubmitting ? "Đang lưu..." : "Lưu"}
				</Button>
				<Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={isSubmitting}>
					Hủy
				</Button>
			</div>
		</form>
	);
}

export default function CommentSection({ comments, postId, onCommentAdded }: CommentSectionProps) {
	const totalComments = comments.reduce((total, comment) => {
		return total + 1 + (comment.replies?.length || 0);
	}, 0);

	return (
		<div className="flex flex-col gap-4 border-b border-gray-200 dark:border-white/20 pb-6">
			<div className="flex items-center gap-3">
				<h4 className="font-semibold text-navyGray dark:text-white text-lg md:text-xl">Bình luận</h4>
				<div className="flex flex-col bg-primary/10 dark:bg-primary/20 w-fit py-1.5 px-3.5 rounded-md">
					<p className="text-primary font-semibold">{totalComments}</p>
				</div>
			</div>

			{comments.length === 0 ? (
				<p className="text-navyGray dark:text-white/80 text-sm md:text-base py-4">
					Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
				</p>
			) : (
				<div className="flex flex-col gap-4">
					{comments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							postId={postId}
							onCommentAdded={onCommentAdded}
						/>
					))}
				</div>
			)}
		</div>
	);
}

