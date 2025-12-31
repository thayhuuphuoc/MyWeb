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
		const tableBetter = quill.getModule('table-better') as any
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

		// Function to apply border from table element to cells
		const applyBorderToCells = (table: HTMLElement) => {
			const tableStyle = table.style
			const borderStyle = tableStyle.getPropertyValue('border-style') || tableStyle.getPropertyValue('border').split(' ')[1] || ''
			const borderColor = tableStyle.getPropertyValue('border-color') || tableStyle.getPropertyValue('border').split(' ')[2] || ''
			const borderWidth = tableStyle.getPropertyValue('border-width') || tableStyle.getPropertyValue('border').split(' ')[0] || ''
			
			// If table has border properties, apply them to cells
			if (borderStyle && borderStyle !== 'none') {
				const cells = table.querySelectorAll('td, th')
				cells.forEach((cell) => {
					const cellEl = cell as HTMLElement
					if (borderStyle) cellEl.style.setProperty('border-style', borderStyle, 'important')
					if (borderColor) cellEl.style.setProperty('border-color', borderColor, 'important')
					if (borderWidth) cellEl.style.setProperty('border-width', borderWidth, 'important')
				})
			} else if (table.getAttribute('style')?.includes('border-style')) {
				// Parse from style attribute if style object doesn't have it yet
				const styleAttr = table.getAttribute('style') || ''
				const borderStyleMatch = styleAttr.match(/border-style:\s*([^;]+)/)
				const borderColorMatch = styleAttr.match(/border-color:\s*([^;]+)/)
				const borderWidthMatch = styleAttr.match(/border-width:\s*([^;]+)/)
				
				if (borderStyleMatch && borderStyleMatch[1] !== 'none') {
					const cells = table.querySelectorAll('td, th')
					cells.forEach((cell) => {
						const cellEl = cell as HTMLElement
						if (borderStyleMatch[1]) cellEl.style.setProperty('border-style', borderStyleMatch[1].trim(), 'important')
						if (borderColorMatch && borderColorMatch[1]) cellEl.style.setProperty('border-color', borderColorMatch[1].trim(), 'important')
						if (borderWidthMatch && borderWidthMatch[1]) cellEl.style.setProperty('border-width', borderWidthMatch[1].trim(), 'important')
					})
				}
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
				// Apply border to cells
				applyBorderToCells(tableEl)
			})
		})

		// Listen for DOM mutations to catch when quill-table-better updates table styles
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
					const target = mutation.target as HTMLElement
					if (target.tagName === 'TABLE') {
						applyBorderToCells(target)
					}
				}
			})
		})

		// Observe all tables in the editor
		const observeTables = () => {
			const tables = quill.root.querySelectorAll('table')
			tables.forEach((table) => {
				observer.observe(table, { attributes: true, attributeFilter: ['style'] })
				applyBorderToCells(table as HTMLElement)
			})
		}

		// Initial observation
		setTimeout(observeTables, 100)
		
		// Re-observe on text changes
		quill.on('text-change', observeTables)

		quill.setContents(quill.clipboard.convert({html: props.value || props.defaultValue}), 'silent')

		quill.on('editor-change', () => props.onChange(quill.getSemanticHTML()))
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
