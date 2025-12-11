'use client'

import React, {createContext, useContext, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {searchParamsSchema} from "@/actions/products/validations";

type TSearchValues = {
	filterParams: {
		page: number,
		title: string | undefined
	}
	setFilterParams: React.Dispatch<React.SetStateAction<{ page: number, title: string | undefined}>>
}

const initValues: TSearchValues = {
	filterParams: {
		page: 1,
		title: '',
	},
	setFilterParams: () => undefined,
}

const SearchContext = createContext(initValues)

export const SearchProvider = (props: {children: React.ReactNode}) => {
	const router = useRouter()
	const pathname = usePathname()

	const searchParams = useSearchParams()
	const search = searchParamsSchema.parse(Object.fromEntries(searchParams))

	const [filterParams, setFilterParams] = useState({
		page: search.page,
		title: search.title,
	})

	// Create query string
	const createQueryString = React.useCallback(
		(params: Record<string, string | number | null>) => {
			const newSearchParams = new URLSearchParams(searchParams?.toString())

			for (const [key, value] of Object.entries(params)) {
				if (value === null) {
					newSearchParams.delete(key)
				} else {
					newSearchParams.set(key, String(value))
				}
			}

			return newSearchParams.toString()
		},
		[searchParams]
	)

	React.useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				page: filterParams.page,
			})}`, {
				scroll: false
			}
		)
	}, [filterParams.page])

	React.useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				title: filterParams.title || null,
				page: 1,
			})}`, {
				scroll: false
			}
		)
	}, [filterParams.title])

	return <SearchContext.Provider value={{
		filterParams,
		setFilterParams
	}}>{props.children}</SearchContext.Provider>
}

export const useSearchContext = () => {
	return useContext(SearchContext)
}












