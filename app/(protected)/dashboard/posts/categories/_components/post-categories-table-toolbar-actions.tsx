"use client"

import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import {
	DeleteCategoriesDialog
} from "@/app/(protected)/dashboard/posts/categories/_components/delete-post-categories-dialog";
import {TPostCategory, TPostCategoryWithPostCount} from "@/actions/posts/categories/validations";
import {CreatePostCategoryDialog} from "@/app/(protected)/dashboard/posts/categories/_components/create-post-category-dialog";


interface CategoriesTableToolbarActionsProps {
	table: Table<TPostCategoryWithPostCount>
}

export function PostCategoriesTableToolbarActions({
  table,
}: CategoriesTableToolbarActionsProps) {
	return (
		<div className="flex items-center gap-2">
			{table.getFilteredSelectedRowModel().rows.length > 0 ? (
				<DeleteCategoriesDialog
					records={
						table
						.getFilteredSelectedRowModel()
						.rows.map((row) => row.original)
					}
					onSuccess={() => table.toggleAllRowsSelected(false)}
				/>
			) : null}
			<CreatePostCategoryDialog/>
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
