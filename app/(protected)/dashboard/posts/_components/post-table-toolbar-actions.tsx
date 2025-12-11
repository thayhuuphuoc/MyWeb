"use client"

import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import {
	DeletePostsDialog
} from "@/app/(protected)/dashboard/posts/_components/delete-post-dialog";
import {TPostWithRelation} from "@/actions/posts/validations";


interface PostsTableToolbarActionsProps {
	table: Table<TPostWithRelation>
}

export function PostTableToolbarActions({
  table,
}: PostsTableToolbarActionsProps) {
	return (
		<div className="flex items-center gap-2">
			{table.getFilteredSelectedRowModel().rows.length > 0 ? (
				<DeletePostsDialog
					records={
						table
						.getFilteredSelectedRowModel()
						.rows.map((row) => row.original)
					}
					onSuccess={() => table.toggleAllRowsSelected(false)}
				/>
			) : null}
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
