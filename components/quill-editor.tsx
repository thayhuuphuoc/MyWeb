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

		// Monkey-patch insertTable to add default border to style
		const tableBetter = quill.getModule('table-better')
		if (tableBetter && tableBetter.insertTable) {
			const originalInsertTable = tableBetter.insertTable.bind(tableBetter)
			tableBetter.insertTable = function(rows: number, columns: number) {
				// Call original method
				const result = originalInsertTable(rows, columns)
				
				// Set border style on the table element after it's created
				// Set border properties separately so getElementStyle can read them
				const setBorder = () => {
					const tables = quill.root.querySelectorAll('table')
					if (tables.length > 0) {
						const lastTable = tables[tables.length - 1] as HTMLElement
						const currentStyle = lastTable.getAttribute('style') || ''
						// Only set if border-style is not already in style
						if (!currentStyle.includes('border-style') && !currentStyle.includes('border:')) {
							// Set border properties separately so getElementStyle can read them
							const newStyle = currentStyle 
								? `${currentStyle}; border-style: solid; border-color: #000000; border-width: 1px`
								: 'border-style: solid; border-color: #000000; border-width: 1px'
							lastTable.setAttribute('style', newStyle)
							return true
						}
					}
					return false
				}
				
				// Try multiple times to catch table creation
				if (!setBorder()) {
					setTimeout(() => {
						if (!setBorder()) {
							setTimeout(setBorder, 50)
						}
					}, 10)
				}
				
				return result
			}
		}

		// Also listen to text-change to ensure border is set for all tables
		quill.on('text-change', () => {
			const tables = quill.root.querySelectorAll('table')
			tables.forEach((table) => {
				const tableEl = table as HTMLElement
				const currentStyle = tableEl.getAttribute('style') || ''
				if (!currentStyle.includes('border-style') && !currentStyle.includes('border:')) {
					const newStyle = currentStyle 
						? `${currentStyle}; border-style: solid; border-color: #000000; border-width: 1px`
						: 'border-style: solid; border-color: #000000; border-width: 1px'
					tableEl.setAttribute('style', newStyle)
				}
			})
		})

		quill.setContents(quill.clipboard.convert({html: props.value || props.defaultValue}), 'silent')

		quill.on('editor-change', () => props.onChange(quill.getSemanticHTML()))
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
