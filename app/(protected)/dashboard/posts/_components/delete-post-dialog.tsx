"use client"

import * as React from "react"
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {TPostWithRelation} from "@/actions/posts/validations";
import {deletePosts} from "@/actions/posts/actions";

interface DeletePostsDialogProps
	extends React.ComponentPropsWithoutRef<typeof Dialog> {
	records: Row<TPostWithRelation>["original"][]
	showTrigger?: boolean
	onSuccess?: () => void
}

export function DeletePostsDialog({
	records,
	showTrigger = true,
	onSuccess,
	...props
}: DeletePostsDialogProps) {
	const [isDeletePending, startDeleteTransition] = React.useTransition()
	const router = useRouter()

	return (
		<Dialog {...props}>
			{showTrigger ? (
				<DialogTrigger asChild>
					<Button variant="outline" size="sm">
						<TrashIcon className="mr-2 size-4" aria-hidden="true" />
						Xóa ({records.length})
					</Button>
				</DialogTrigger>
			) : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Bạn có chắc chắn không?</DialogTitle>
					<DialogDescription>
						Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn {' '}
						<span className="font-medium">{records.length}</span> {' '}
						bài viết khỏi máy chủ.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:space-x-0">
					<DialogClose asChild>
						<Button variant="outline" disabled={isDeletePending}>Hủy</Button>
					</DialogClose>
					<Button
						aria-label="Delete selected rows"
						variant="destructive"
						onClick={() => {
							startDeleteTransition(async () => {
								const ids = records.map((record) => record.id).filter(Boolean)
								
								if (ids.length === 0) {
									return
								}

								const result = await deletePosts({ ids })

								if (result.error) {
									return
								}

								// Đóng dialog và refresh
								props.onOpenChange?.(false)
								router.refresh()
								onSuccess?.()
							})
						}}
						disabled={isDeletePending}
					>
						{isDeletePending && (
							<ReloadIcon
								className="mr-2 size-4 animate-spin"
								aria-hidden="true"
							/>
						)}
						{isDeletePending ? "Đang xóa..." : "Xóa"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
