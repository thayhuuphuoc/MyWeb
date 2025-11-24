"use client"

import * as React from "react";
import {getPostCategories} from "@/actions/posts/categories/queries";
import {DataTableFilterField} from "@/types";
import {useDataTable} from "@/hooks/use-data-table";
import {useCategoriesTable} from "@/app/(protected)/dashboard/posts/categories/_components/post-categories-table-provider";
import {
	postCategoriesTableColumns
} from "@/app/(protected)/dashboard/posts/categories/_components/post-categories-table-columns";
import {TPostCategoryWithPostCount} from "@/actions/posts/categories/validations";
import {DataTableAdvancedToolbar} from "@/components/data-table/advanced/data-table-advanced-toolbar";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import { DataTable } from "@/components/data-table/data-table"
import {
	PostCategoriesTableToolbarActions
} from "@/app/(protected)/dashboard/posts/categories/_components/post-categories-table-toolbar-actions";

interface TableProps {
	postCategoriesPromise: ReturnType<typeof getPostCategories>
}

export default function PostCategoriesTable({ postCategoriesPromise }: TableProps) {
	const { featureFlags } = useCategoriesTable()
	const { data, pageCount } = React.use(postCategoriesPromise)
	const columns = React.useMemo(() => postCategoriesTableColumns(), [])

	const filterFields: DataTableFilterField<TPostCategoryWithPostCount>[] = [
		{
			label: "Tên",
			value: "name",
			placeholder: "Filter tên...",
		},
	]

	const { table } = useDataTable({
		data,
		columns,
		pageCount,
		// optional props
		filterFields,
		enableAdvancedFilter: featureFlags.includes("advancedFilter"),
		defaultPerPage: 10,
		defaultSort: "name.desc",
	})

	return (
		<DataTable
			table={table}
		>
			{featureFlags.includes("advancedFilter") ? (
				<DataTableAdvancedToolbar table={table} filterFields={filterFields}>
					<PostCategoriesTableToolbarActions table={table} />
				</DataTableAdvancedToolbar>
			) : (
				<DataTableToolbar table={table} filterFields={filterFields}>
					<PostCategoriesTableToolbarActions table={table} />
				</DataTableToolbar>
			)}
		</DataTable>
	)
}
