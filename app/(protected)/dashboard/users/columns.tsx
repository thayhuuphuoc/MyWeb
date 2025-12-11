"use client"

import { ColumnDef } from "@tanstack/react-table"

import {DataTableColumnHeader} from "@/components/data-table/table-header";
import {getRoleText, getStatusText} from "@/enum/enums";
import React from "react";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import {TUserPayload} from "@/actions/users/users";

export const columns: ColumnDef<TUserPayload>[] = [
	{
		id: 'name',
		accessorKey: "name",
		meta: {
			columnName: 'Tên'
		},
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column}>Tên</DataTableColumnHeader>
			)
		},
	},
	{
		id: 'image',
		accessorKey: "image",
		meta: {
			columnName: 'Ảnh'
		},
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column}>Ảnh</DataTableColumnHeader>
			)
		},
		cell: (props) => {
			const row = props.row
			const item = row.original
			if(!item?.image) return <></>
			return (
				<div className={'w-20 aspect-square relative'}>
					<Image
						src={item.image || ""}
						alt={item.name || ""}
						width={300} height={300}
						className={'object-cover object-center w-full h-full'}
					/>
				</div>
			)
		}
	},
	{
		id: "email",
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column}>Email</DataTableColumnHeader>
			)
		},
	},
	{
		id: "emailVerified",
		accessorKey: "emailVerified",
		header: 'Email Verified',
		meta: {
			columnName: 'Email Verified'
		},
		cell : ({row}) => {
			const item = row.original
			if(!item.emailVerified) return <></>
			return (
				<span>
					{new Date(item.emailVerified).toLocaleString('vi-VN')}
				</span>
			)
		}
	},
	{
		accessorKey: "role",
		header: "Quyền",
		meta: {
			columnName: 'Quyền'
		},
		cell : ({row}) => {
			const item = row.original
			return (
				<>
					<Badge
						variant="secondary"
						className="mr-1 mb-1"
					>{getRoleText(item.role || '')}</Badge>
				</>
			)
		}
	},
	{
		id: 'status',
		accessorKey: "status",
		meta: {
			columnName: 'Tình trạng'
		},
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column}>Tình trạng</DataTableColumnHeader>
			)
		},
		cell: (props) => {
			const row = props.row
			const item = row.original
			return getStatusText(item.status || '')
		}
	},
	{
		id: "updatedAt",
		accessorKey: "updatedAt",
		meta: {
			columnName: 'Cập nhật'
		},
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column}>Cập nhật</DataTableColumnHeader>
			)
		},
		cell : ({row}) => {
			const item = row.original
			if(!item.updatedAt) return <></>
			return (
				<span>
					{new Date(item.updatedAt).toLocaleString('vi-VN')}
				</span>
			)
		}
	},
	{
		id: "createdAt",
		accessorKey: "createdAt",
		meta: {
			columnName: 'Ngày tạo'
		},
		header: ({ column }) => {
			return (
				<DataTableColumnHeader column={column}>Ngày tạo</DataTableColumnHeader>
			)
		},
		cell : ({row}) => {
			const item = row.original
			if(!item.createdAt) return <></>
			return (
				<span>
					{new Date(item.createdAt).toLocaleString('vi-VN')}
				</span>
			)
		}
	},
]
