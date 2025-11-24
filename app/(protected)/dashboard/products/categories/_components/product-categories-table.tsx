"use client"

import * as React from "react";
import {getProductCategories} from "@/actions/products/categories/queries";
import {DataTableFilterField} from "@/types";
import {useDataTable} from "@/hooks/use-data-table";
import {useCategoriesTable} from "@/app/(protected)/dashboard/products/categories/_components/product-categories-table-provider";
import {
	productCategoriesTableColumns
} from "@/app/(protected)/dashboard/products/categories/_components/product-categories-table-columns";
import {TProductCategoryWithProductCount} from "@/actions/products/categories/validations";
import {DataTableAdvancedToolbar} from "@/components/data-table/advanced/data-table-advanced-toolbar";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import { DataTable } from "@/components/data-table/data-table"
import {
	ProductCategoriesTableToolbarActions
} from "@/app/(protected)/dashboard/products/categories/_components/product-categories-table-toolbar-actions";

interface TableProps {
	productCategoriesPromise: ReturnType<typeof getProductCategories>
}

export default function ProductCategoriesTable({ productCategoriesPromise }: TableProps) {
	const { featureFlags } = useCategoriesTable()
	const { data, pageCount } = React.use(productCategoriesPromise)
	const columns = React.useMemo(() => productCategoriesTableColumns(), [])

	const filterFields: DataTableFilterField<TProductCategoryWithProductCount>[] = [
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
					<ProductCategoriesTableToolbarActions table={table} />
				</DataTableAdvancedToolbar>
			) : (
				<DataTableToolbar table={table} filterFields={filterFields}>
					<ProductCategoriesTableToolbarActions table={table} />
				</DataTableToolbar>
			)}
		</DataTable>
	)
}
