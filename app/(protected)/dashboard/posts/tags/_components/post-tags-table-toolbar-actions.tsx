"use client"

import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import {
	DeleteTagsDialog
} from "@/app/(protected)/dashboard/posts/tags/_components/delete-post-tags-dialog";
import {TPostTag, TPostTagWithPostCount} from "@/actions/posts/tags/validations";
import {CreatePostTagDialog} from "@/app/(protected)/dashboard/posts/tags/_components/create-post-tag-dialog";


interface TagsTableToolbarActionsProps {
	table: Table<TPostTagWithPostCount>
}

export function PostTagsTableToolbarActions({
  table,
}: TagsTableToolbarActionsProps) {
	return (
		<div className="flex items-center gap-2">
			{table.getFilteredSelectedRowModel().rows.length > 0 ? (
				<DeleteTagsDialog
					records={
						table
						.getFilteredSelectedRowModel()
						.rows.map((row) => row.original)
					}
					onSuccess={() => table.toggleAllRowsSelected(false)}
				/>
			) : null}
			<CreatePostTagDialog/>
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					exportTableToCSV(table, {
						filename: "orders",
						excludeColumns: ["select", "actions"],
					})
				}
			>
				<DownloadIcon className="mr-2 size-4" aria-hidden="true" />
				Export
			</Button>
		</div>
	)
}
