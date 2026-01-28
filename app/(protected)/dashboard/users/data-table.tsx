"use client"

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
	getPaginationRowModel,
	getSortedRowModel,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"

import React, {useState} from "react";
import {DataTablePagination} from "@/components/data-table/data-table-pagination";
import {DataTableViewOptions} from "@/components/data-table/data-table-view-options";
import {useToast} from "@/components/ui/use-toast";
import ActionCol from "@/app/(protected)/dashboard/users/action-col";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[],
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
	const { toast } = useToast()

	const {columns} = props
	const [data, setData] = useState(props.data)

	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({
			status: false,
			createdAt: false,
		})

	const table = useReactTable({
		data,
		columns: [
			...columns,
			{
				id: "actions",
				cell: (props) => {
					const row = props.row

					return <ActionCol toast={toast} row={row} setData={setData} data={data}/>
				},
			},
		],
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	})
	return (
		<div className={'space-y-5'}>
			<div className="flex items-center">
				<Input
					type={'search'}
					placeholder="Lọc email..."
					value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
					onChange={(event) => {
						table.getColumn("email")?.setFilterValue(event.target.value)
					}}
					className="h-10 max-w-sm"
				/>
				<DataTableViewOptions table={table} />
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	)
}
