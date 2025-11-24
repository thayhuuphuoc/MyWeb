import {
	ArrowDownIcon,
	ArrowUpIcon,
	CaretSortIcon,
	EyeNoneIcon,
} from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>,
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	className,
	children
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{children}</div>
	}

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3 h-8 data-[state=open]:bg-accent text-sm"
				onClick={() => column.toggleSorting()}
			>
				<span>{children}</span>
				{column.getIsSorted() === "desc" ? (
					<ArrowDownIcon className="ml-2 h-4 w-4" />
				) : column.getIsSorted() === "asc" ? (
					<ArrowUpIcon className="ml-2 h-4 w-4" />
				) : (
					<CaretSortIcon className="ml-2 h-4 w-4" />
				)}
			</Button>
		</div>
	)
}
