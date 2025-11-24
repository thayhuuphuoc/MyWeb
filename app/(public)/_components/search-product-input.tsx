import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import _ from "lodash";
import {useSearchContext} from "@/app/(public)/_components/search-provider";

export default function SearchProductInput(){
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
			placeholder="Tìm kiếm sản phẩm..."
			className="h-12 text-lg max-w-md mx-auto bg-white border border-opacity-50 border-indigo-200"
			defaultValue={filterParams.title}
			onChange={debouncedOntTitleChange}
		/>
	)
}