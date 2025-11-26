"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { addComment } from "@/actions/comments/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, X } from "lucide-react";
import Link from "next/link";

interface CommentFormProps {
	postId: string;
	replyId?: string;
	onSuccess?: () => void;
	onCancel?: () => void;
	placeholder?: string;
}

export default function CommentForm({
	postId,
	replyId,
	onSuccess,
	onCancel,
	placeholder = "Nhập bình luận của bạn...",
}: CommentFormProps) {
	const { data: session } = useSession();
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const result = await addComment({
			comment: comment.trim(),
			postId,
			replyId,
		});

		setIsSubmitting(false);

		if (result.error) {
			setError(result.error);
		} else {
			setComment("");
			setError(null);
			onSuccess?.();
		}
	};

	if (!session?.user) {
		return (
			<div className="bg-primary/10 dark:bg-primary/5 rounded-md p-6 text-center">
				<div className="flex flex-col items-center gap-3">
					<MessageCircle className="w-12 h-12 text-primary" />
					<p className="text-navyGray dark:text-white font-medium">
						Bạn cần đăng nhập để bình luận
					</p>
					<Button asChild variant="default">
						<Link href={`/auth/login?callbackUrl=/blog`}>Đăng nhập</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{replyId && onCancel && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-navyGray dark:text-white/80 font-medium">Trả lời bình luận</p>
					<button
						onClick={onCancel}
						className="text-navyGray dark:text-white/80 hover:text-primary transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			)}
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<Textarea
					value={comment}
					onChange={(e) => {
						setComment(e.target.value);
						setError(null);
					}}
					placeholder={placeholder}
					className="min-h-[100px] resize-none bg-white dark:bg-surfaceDark border-gray-200 dark:border-white/20 text-navyGray dark:text-white"
					required
					maxLength={1000}
					disabled={isSubmitting}
				/>
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						{error && <p className="text-sm text-red-500">{error}</p>}
						<p className="text-xs text-navyGray/60 dark:text-white/60">
							{comment.length}/1000 ký tự
						</p>
					</div>
					<div className="flex items-center gap-2">
						{onCancel && (
							<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
								Hủy
							</Button>
						)}
						<Button type="submit" disabled={isSubmitting || !comment.trim()} className="gap-2">
							{isSubmitting ? (
								<>Đang gửi...</>
							) : (
								<>
									<Send className="w-4 h-4" />
									Gửi bình luận
								</>
							)}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

