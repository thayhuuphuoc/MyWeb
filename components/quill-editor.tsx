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

		// Control toolbar visibility: only show when single cell is selected
		const handleSelectionChange = () => {
			setTimeout(() => {
				// Don't interfere if properties popup is open
				const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
				if (propertiesPopup) {
					return
				}

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
					// Check if multiple cells are selected (table selection)
					const selectedCells = tableElement.querySelectorAll('td.selected, th.selected, td.active, th.active')
					if (selectedCells.length > 1) {
						hideTableToolbar()
						return
					}
					
					// Single cell is selected - show toolbar
					showTableToolbar()
				} else {
					// Not in a cell - hide toolbar
					hideTableToolbar()
				}
			}, 150)
		}

		const hideTableToolbar = () => {
			const menus = document.querySelectorAll('.ql-table-better-menu')
			menus.forEach((menu) => {
				const menuEl = menu as HTMLElement
				if (menuEl && 
					!menuEl.classList.contains('ql-table-better-properties') &&
					!menuEl.classList.contains('ql-table-better-cell-properties') &&
					!menuEl.classList.contains('ql-table-better-table-properties')) {
					menuEl.style.setProperty('display', 'none', 'important')
				}
			})
		}

		const showTableToolbar = () => {
			const menus = document.querySelectorAll('.ql-table-better-menu')
			menus.forEach((menu) => {
				const menuEl = menu as HTMLElement
				if (menuEl && 
					!menuEl.classList.contains('ql-table-better-properties') &&
					!menuEl.classList.contains('ql-table-better-cell-properties') &&
					!menuEl.classList.contains('ql-table-better-table-properties')) {
					menuEl.style.setProperty('display', 'flex', 'important')
					menuEl.style.setProperty('visibility', 'visible', 'important')
					menuEl.style.setProperty('opacity', '1', 'important')
				}
			})
		}

		// Ensure properties popup is visible and interactive when it appears
		const ensurePopupVisible = () => {
			const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
			if (!propertiesPopup) return

			const popup = propertiesPopup as HTMLElement
			// Only ensure visibility - let CSS handle the styling
			if (popup.style.display === 'none' || popup.style.visibility === 'hidden') {
				popup.style.setProperty('display', 'block', 'important')
				popup.style.setProperty('visibility', 'visible', 'important')
				popup.style.setProperty('opacity', '1', 'important')
			}
			popup.style.setProperty('z-index', '10001', 'important')
			popup.style.setProperty('pointer-events', 'auto', 'important')
			
			// Debug: log DOM structure to understand the actual structure
			// Uncomment below line to see DOM structure in console
			// console.log('Popup structure:', propertiesPopup.outerHTML.substring(0, 500))
		}

		// Monitor for properties popup appearance
		const observer = new MutationObserver(() => {
			ensurePopupVisible()
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Listen for selection changes
		quill.on('selection-change', () => {
			const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
			if (!propertiesPopup) {
				handleSelectionChange()
			}
		})

		return () => {
			observer.disconnect()
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
