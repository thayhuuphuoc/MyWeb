'use client'

import React, {useState} from "react";
import _ from "lodash";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SearchIcon} from "lucide-react";
import {useRouter} from "next/navigation";

export function SearchInput() {
	const router = useRouter()

	const [term, setTerm] = useState('')
	const onTitleChange = (e: any) => {
		setTerm(e.target.value)
	}
	const debouncedOnTitleChange = _.debounce(onTitleChange, 200)

	return (
		<form onSubmit={(e)=>{
			e.preventDefault()
			router.push(`/blog/tim-kiem?title=${term}`)
		}} className="flex items-center justify-center w-fit mx-auto gap-2">
			<Input
				type={'search'}
				placeholder="Tìm kiếm..."
				className="h-12 text-lg w-full lg:w-80 mx-auto bg-white dark:bg-surfaceDark border border-opacity-50 border-indigo-200 dark:border-gray-700 text-navyGray dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
				onChange={debouncedOnTitleChange}
			/>
			<div>
				<Button type={'submit'} size={'icon'} className={'h-12 w-12'} variant={'primary'}>
					<SearchIcon/>
				</Button>
			</div>
		</form>
	)
}
