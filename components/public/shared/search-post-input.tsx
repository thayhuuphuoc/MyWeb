import {Input} from "@/components/ui/input";
import React from "react";
import _ from "lodash";
import {useSearchContext} from "@/components/public/shared/search-provider";

export default function SearchPostInput(){
	const {filterParams, setFilterParams} = useSearchContext()

	const onTitleChange = (e: any) => {
		setFilterParams({
			...filterParams,
			page: 1,
			title: e.target.value,
		})
	}
	const debouncedOntTitleChange = _.debounce(onTitleChange, 200)

	return (
		<Input
			type={'search'}
			placeholder="Tìm kiếm..."
			className="h-12 text-lg max-w-md mx-auto bg-white dark:bg-surfaceDark border border-opacity-50 border-indigo-200 dark:border-indigo-800 text-navyGray dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
			defaultValue={filterParams.title}
			onChange={debouncedOntTitleChange}
		/>
	)
}





