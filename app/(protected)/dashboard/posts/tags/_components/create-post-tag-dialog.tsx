"use client"

import * as React from "react"
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {AddPostTagSheet} from "@/app/(protected)/dashboard/posts/tags/_components/add-post-tag-sheet";

export function CreatePostTagDialog() {
	const [showSheet, setShowSheet] =
		React.useState(false)


	return (
		<div>
			<Button variant="outline" size="sm" onClick={() => setShowSheet(true)}>
				<PlusIcon className="mr-2 size-4" aria-hidden="true" />
				Thêm Tag
			</Button>
			<AddPostTagSheet
				open={showSheet}
				onOpenChange={setShowSheet}
			/>
		</div>
	)
}
