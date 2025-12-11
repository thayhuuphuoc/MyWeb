"use client"

import * as React from "react";
import {getProductTags} from "@/actions/products/tags/queries";
import {DataTableFilterField} from "@/types";
import {useDataTable} from "@/hooks/use-data-table";
import {useTagsTable} from "@/app/(protected)/dashboard/products/tags/_components/product-tags-table-provider";
import {
	productTagsTableColumns
} from "@/app/(protected)/dashboard/products/tags/_components/product-tags-table-columns";
import {TProductTagWithProductCount} from "@/actions/products/tags/validations";
import {DataTableAdvancedToolbar} from "@/components/data-table/advanced/data-table-advanced-toolbar";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import { DataTable } from "@/components/data-table/data-table"
import {
	ProductTagsTableToolbarActions
} from "@/app/(protected)/dashboard/products/tags/_components/product-tags-table-toolbar-actions";

interface TableProps {
	productTagsPromise: ReturnType<typeof getProductTags>
}

export default function ProductTagsTable({ productTagsPromise }: TableProps) {
	const { featureFlags } = useTagsTable()
	const { data, pageCount } = React.use(productTagsPromise)
	const columns = React.useMemo(() => productTagsTableColumns(), [])

	const filterFields: DataTableFilterField<TProductTagWithProductCount>[] = [
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
					<ProductTagsTableToolbarActions table={table} />
				</DataTableAdvancedToolbar>
			) : (
				<DataTableToolbar table={table} filterFields={filterFields}>
					<ProductTagsTableToolbarActions table={table} />
				</DataTableToolbar>
			)}
		</DataTable>
	)
}
