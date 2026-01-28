import '@tanstack/react-table'
import {RowData} from "@tanstack/table-core"; //or vue, svelte, solid, qwik, etc.

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		columnName: string
	}
}
