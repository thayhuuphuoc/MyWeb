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
			// Get style attribute first (most reliable)
			const styleAttr = table.getAttribute('style') || ''
			
			// Parse border properties from style attribute
			const borderStyleMatch = styleAttr.match(/border-style:\s*([^;]+)/i)
			const borderColorMatch = styleAttr.match(/border-color:\s*([^;]+)/i)
			const borderWidthMatch = styleAttr.match(/border-width:\s*([^;]+)/i)
			
			// Get values from matches or from style object
			let borderStyle = borderStyleMatch ? borderStyleMatch[1].trim() : (table.style.getPropertyValue('border-style') || '')
			let borderColor = borderColorMatch ? borderColorMatch[1].trim() : (table.style.getPropertyValue('border-color') || '')
			let borderWidth = borderWidthMatch ? borderWidthMatch[1].trim() : (table.style.getPropertyValue('border-width') || '')
			
			// If no border properties found, check if there's a default border
			if (!borderStyle && !borderColor && !borderWidth) {
				// Check for default border (might be set as single border property)
				const borderMatch = styleAttr.match(/border:\s*([^;]+)/i)
				if (borderMatch) {
					const borderParts = borderMatch[1].trim().split(/\s+/)
					if (borderParts.length >= 3) {
						borderWidth = borderParts[0]
						borderStyle = borderParts[1]
						borderColor = borderParts[2]
					}
				}
			}
			
			// Apply to all cells
			const cells = table.querySelectorAll('td, th')
			cells.forEach((cell) => {
				const cellEl = cell as HTMLElement
				
				// Remove any existing border first
				cellEl.style.removeProperty('border')
				
				// Apply border properties with !important to override CSS
				if (borderStyle) {
					cellEl.style.setProperty('border-style', borderStyle, 'important')
				}
				
				if (borderColor) {
					cellEl.style.setProperty('border-color', borderColor, 'important')
				}
				
				if (borderWidth) {
					cellEl.style.setProperty('border-width', borderWidth, 'important')
				}
				
				// If no border properties, ensure border is none
				if (!borderStyle && !borderColor && !borderWidth) {
					cellEl.style.setProperty('border', 'none', 'important')
				}
			})
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
						// Add small delay to ensure style is fully applied
						setTimeout(() => {
							applyBorderToCells(target)
						}, 10)
					}
				}
			})
		})

		// Observe all tables in the editor
		const observeTables = () => {
			const tables = quill.root.querySelectorAll('table')
			tables.forEach((table) => {
				observer.observe(table, { attributes: true, attributeFilter: ['style'] })
				// Apply border immediately
				setTimeout(() => {
					applyBorderToCells(table as HTMLElement)
				}, 50)
			})
		}

		// Initial observation
		setTimeout(observeTables, 100)
		
		// Re-observe on text changes
		quill.on('text-change', () => {
			setTimeout(observeTables, 50)
		})

		// Also listen for selection changes (when table properties form is closed)
		quill.on('selection-change', () => {
			setTimeout(() => {
				const tables = quill.root.querySelectorAll('table')
				tables.forEach((table) => {
					applyBorderToCells(table as HTMLElement)
				})
			}, 100)
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
