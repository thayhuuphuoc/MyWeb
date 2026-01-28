"use client"

import { ColumnDef } from "@tanstack/react-table"

import {DataTableColumnHeader} from "@/components/data-table/table-header";
import React from "react";
import {Check, CircleCheck, Eye, MoreHorizontal, SquarePen, Trash} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Checkbox} from "@/components/ui/checkbox";
import {
	DeleteCategoriesDialog
} from "@/app/(protected)/dashboard/posts/categories/_components/delete-post-categories-dialog";
import {TPostCategory, TPostCategoryWithPostCount} from "@/actions/posts/categories/validations";
import {AddPostCategorySheet} from "@/app/(protected)/dashboard/posts/categories/_components/add-post-category-sheet";

export function postCategoriesTableColumns(): ColumnDef<TPostCategoryWithPostCount>[] {
	return [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="translate-y-0.5"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="translate-y-0.5"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			id: 'name',
			accessorKey: "name",
			meta: {
				columnName: 'Tên '
			},
			header: ({ column }) => {
				return (
					<DataTableColumnHeader column={column}>Tên </DataTableColumnHeader>
				)
			},
		},
		{
			accessorKey: "slug",
			header: "Slug",
		},
		{
			accessorKey: "_count",
			header: "Số bài viết",
			cell: ({row}) => (
				<div>{row.original._count.posts}</div>
			)
		},
		{
			id: "actions",
			cell: function Cell({row}){
				const [isUpdatePending, startUpdateTransition] = React.useTransition()
				const [showUpdateItemSheet, setShowUpdateItemSheet] =
					React.useState(false)
				const [showDeleteItemDialog, setShowDeleteItemDialog] =
					React.useState(false)

				const item = row.original

				return (
					<>
						<AddPostCategorySheet
							open={showUpdateItemSheet}
							onOpenChange={setShowUpdateItemSheet}
							data={row.original}
						/>
						<DeleteCategoriesDialog
							open={showDeleteItemDialog}
							onOpenChange={setShowDeleteItemDialog}
							records={[row.original]}
							showTrigger={false}
							onSuccess={() => row.toggleSelected(false)}
						/>
						<Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setShowUpdateItemSheet(true)}>
							<SquarePen className="h-4 w-4" />
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onSelect={() => setShowUpdateItemSheet(true)}>
									Sửa
								</DropdownMenuItem>

								<DropdownMenuSeparator />
								<DropdownMenuItem
									onSelect={() => setShowDeleteItemDialog(true)}
								>
									Xóa
									<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				)
			}
		}
	]
}
