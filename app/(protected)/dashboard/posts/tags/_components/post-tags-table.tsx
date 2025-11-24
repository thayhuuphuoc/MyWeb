"use client"

import * as React from "react";
import {getPostTags} from "@/actions/posts/tags/queries";
import {DataTableFilterField} from "@/types";
import {useDataTable} from "@/hooks/use-data-table";
import {useTagsTable} from "@/app/(protected)/dashboard/posts/tags/_components/post-tags-table-provider";
import {
	postTagsTableColumns
} from "@/app/(protected)/dashboard/posts/tags/_components/post-tags-table-columns";
import {TPostTagWithPostCount} from "@/actions/posts/tags/validations";
import {DataTableAdvancedToolbar} from "@/components/data-table/advanced/data-table-advanced-toolbar";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import { DataTable } from "@/components/data-table/data-table"
import {
	PostTagsTableToolbarActions
} from "@/app/(protected)/dashboard/posts/tags/_components/post-tags-table-toolbar-actions";

interface TableProps {
	postTagsPromise: ReturnType<typeof getPostTags>
}

export default function PostTagsTable({ postTagsPromise }: TableProps) {
	const { featureFlags } = useTagsTable()
	const { data, pageCount } = React.use(postTagsPromise)
	const columns = React.useMemo(() => postTagsTableColumns(), [])

	const filterFields: DataTableFilterField<TPostTagWithPostCount>[] = [
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
					<PostTagsTableToolbarActions table={table} />
				</DataTableAdvancedToolbar>
			) : (
				<DataTableToolbar table={table} filterFields={filterFields}>
					<PostTagsTableToolbarActions table={table} />
				</DataTableToolbar>
			)}
		</DataTable>
	)
}
