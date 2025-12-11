"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CommentSection from "./comment-section";
import CommentForm from "./comment-form";
import { TPostCommentWithRelation } from "@/actions/comments/validations";

interface CommentsWrapperProps {
	initialComments: TPostCommentWithRelation[];
	postId: string;
}

export default function CommentsWrapper({ initialComments, postId }: CommentsWrapperProps) {
	const [comments, setComments] = useState(initialComments);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const router = useRouter();

	const handleCommentAdded = async () => {
		// Refresh comments bằng cách revalidate và fetch lại
		setIsRefreshing(true);
		router.refresh();
		// Đợi một chút để đảm bảo revalidation hoàn tất
		setTimeout(() => {
			setIsRefreshing(false);
		}, 500);
	};

	return (
		<div className="mt-10">
			<CommentSection comments={comments} postId={postId} onCommentAdded={handleCommentAdded} />
			<div className="mt-6">
				<h4 className="font-semibold text-navyGray dark:text-white text-lg md:text-xl mb-4">
					Để lại bình luận
				</h4>
				<div className="bg-primary/10 dark:bg-primary/5 rounded-md p-5 md:p-8">
					<CommentForm postId={postId} onSuccess={handleCommentAdded} />
				</div>
			</div>
		</div>
	);
}

