"use client"

import * as React from "react"
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
	AddPostCategorySheet
} from "@/app/(protected)/dashboard/posts/categories/_components/add-post-category-sheet";

export function CreatePostCategoryDialog() {
	const [showSheet, setShowSheet] =
		React.useState(false)

	return (
		<div>
			<Button variant="outline" size="sm" onClick={() => setShowSheet(true)}>
				<PlusIcon className="mr-2 size-4" aria-hidden="true" />
				Thêm Category
			</Button>
			<AddPostCategorySheet
				open={showSheet}
				onOpenChange={setShowSheet}
			/>
		</div>
	)
}
