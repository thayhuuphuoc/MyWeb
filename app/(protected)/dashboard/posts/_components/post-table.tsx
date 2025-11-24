"use client"

import * as React from "react";
import {DataTableFilterField} from "@/types";
import {useDataTable} from "@/hooks/use-data-table";
import {TPostWithRelation} from "@/actions/posts/validations";
import {DataTableAdvancedToolbar} from "@/components/data-table/advanced/data-table-advanced-toolbar";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import { DataTable } from "@/components/data-table/data-table"
import {PostStatus} from ".prisma/client";
import {getStatusText} from "@/enum/enums";
import {PostTableToolbarActions} from "@/app/(protected)/dashboard/posts/_components/post-table-toolbar-actions";
import {getPostConstants, getPosts} from "@/actions/posts/queries";
import {postTableColumns} from "@/app/(protected)/dashboard/posts/_components/post-table-columns";
import {usePostsTable} from "@/app/(protected)/dashboard/posts/_components/post-table-provider";
import {useEffect} from "react";

interface TableProps {
	postsPromise: ReturnType<typeof getPosts>,
	constantsPromise: ReturnType<typeof getPostConstants>,
}

export default function PostTable({ postsPromise, constantsPromise }: TableProps) {
	const { featureFlags, setConstants } = usePostsTable()
	const { categories, tags } = React.use(constantsPromise)
	const { data, pageCount } = React.use(postsPromise)
	const columns = React.useMemo(() => postTableColumns(), [])

	const filterFields: DataTableFilterField<TPostWithRelation>[] = [
		{
			label: "Tên",
			value: "title",
			placeholder: "Filter tên...",
		},
		{
			label: "Tình trạng",
			value: "status",
			options: Object.values(PostStatus).map((s) => ({
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
					<PostTableToolbarActions table={table} />
				</DataTableAdvancedToolbar>
			) : (
				<DataTableToolbar table={table} filterFields={filterFields}>
					<PostTableToolbarActions table={table} />
				</DataTableToolbar>
			)}
		</DataTable>
	)
}
