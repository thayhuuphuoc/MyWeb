"use client"

import React, {useEffect, useRef} from "react";
import '@/styles/quill/quill.css'
import 'quill-table-better/dist/quill-table-better.css'
import '@/styles/quill/table-custom.css'
import 'highlight.js/styles/github-dark-dimmed.min.css'
import Quill from "quill";
import {QuillConfig} from "@/config/quill-config";


export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string,
	defaultValue?: string,
	formats?: string[],
	id?: string,
	onChange: (data: any) => void,
	value?: string,
}

const QuillEditor = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
	const quillRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if(!quillRef.current) return

		const quill = new Quill(quillRef.current, {
			theme: 'snow',
			modules: QuillConfig
		})

		quill.setContents(quill.clipboard.convert({html: props.value || props.defaultValue}), 'silent')

		quill.on('editor-change', () => props.onChange(quill.getSemanticHTML()))

		// Control toolbar visibility: only show when cell is selected, hide when table is selected
		const handleSelectionChange = () => {
			const selection = quill.getSelection()
			if (!selection) {
				hideTableToolbar()
				return
			}

			// Check if cursor is in a table cell
			const [blot] = quill.getLine(selection.index)
			const cellElement = blot?.parent?.domNode?.closest?.('td, th')
			const tableElement = blot?.parent?.domNode?.closest?.('table')

			if (cellElement && tableElement) {
				// Cell is selected - show toolbar
				showTableToolbar()
			} else {
				// Not in a cell - hide toolbar
				hideTableToolbar()
			}
		}

		const hideTableToolbar = () => {
			const menus = document.querySelectorAll('.ql-table-better-menu, [class*="ql-table-better-menu"]')
			menus.forEach((menu: any) => {
				if (menu && !menu.closest('.ql-table-better-properties')) {
					menu.style.display = 'none'
				}
			})
		}

		const showTableToolbar = () => {
			const menus = document.querySelectorAll('.ql-table-better-menu, [class*="ql-table-better-menu"]')
			menus.forEach((menu: any) => {
				if (menu && !menu.closest('.ql-table-better-properties')) {
					menu.style.display = 'flex'
				}
			})
		}

		// Listen for selection changes
		quill.on('selection-change', handleSelectionChange)
		
		// Also listen for clicks
		quill.root.addEventListener('click', handleSelectionChange, true)
		
		return () => {
			quill.off('selection-change', handleSelectionChange)
			quill.root.removeEventListener('click', handleSelectionChange, true)
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
