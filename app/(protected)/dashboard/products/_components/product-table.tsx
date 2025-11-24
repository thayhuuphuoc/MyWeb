"use client"

import * as React from "react";
import {DataTableFilterField} from "@/types";
import {useDataTable} from "@/hooks/use-data-table";
import {TProductWithRelation} from "@/actions/products/validations";
import {DataTableAdvancedToolbar} from "@/components/data-table/advanced/data-table-advanced-toolbar";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import { DataTable } from "@/components/data-table/data-table"
import {ProductStatus} from ".prisma/client";
import {getStatusText} from "@/enum/enums";
import {ProductTableToolbarActions} from "@/app/(protected)/dashboard/products/_components/product-table-toolbar-actions";
import {getProductConstants, getProducts} from "@/actions/products/queries";
import {productTableColumns} from "@/app/(protected)/dashboard/products/_components/product-table-columns";
import {useProductsTable} from "@/app/(protected)/dashboard/products/_components/product-table-provider";
import {useEffect} from "react";

interface TableProps {
	productsPromise: ReturnType<typeof getProducts>,
	constantsPromise: ReturnType<typeof getProductConstants>,
}

export default function ProductTable({ productsPromise, constantsPromise }: TableProps) {
	const { featureFlags, setConstants } = useProductsTable()
	const { categories, tags } = React.use(constantsPromise)
	const { data, pageCount } = React.use(productsPromise)
	const columns = React.useMemo(() => productTableColumns(), [])

	const filterFields: DataTableFilterField<TProductWithRelation>[] = [
		{
			label: "Tên",
			value: "title",
			placeholder: "Filter tên...",
		},
		{
			label: "Tình trạng",
			value: "status",
			options: Object.values(ProductStatus).map((s) => ({
				label: getStatusText(s),
				value: s,
				withCount: true,
			})),
		},
		{
			label: "Tag",
			value: "tags",
			options: tags.map((tag) => ({
				label: tag.name,
				value: tag.id,
			})),
		},
		{
			label: "Categories",
			value: "categories",
			options: categories.map((cat) => ({
				label: cat.name,
				value: cat.id,
			})),
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
		defaultSort: "createdAt.desc",
		defaultVisibility: {
			keywords: false,
			createdAt: false,
		}
	})

	useEffect(() => {
		setConstants({categories, tags})
	}, [])

	return (
		<DataTable
			table={table}
		>
			{featureFlags.includes("advancedFilter") ? (
				<DataTableAdvancedToolbar table={table} filterFields={filterFields}>
					<ProductTableToolbarActions table={table} />
				</DataTableAdvancedToolbar>
			) : (
				<DataTableToolbar table={table} filterFields={filterFields}>
					<ProductTableToolbarActions table={table} />
				</DataTableToolbar>
			)}
		</DataTable>
	)
}
