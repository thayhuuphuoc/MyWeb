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
			// Delay to allow popup to show first
			setTimeout(() => {
				// Check if properties popup is open - if so, don't hide/show toolbar
				const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
				if (propertiesPopup) {
					return // Don't interfere when popup is open
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
					// Cell is selected - show toolbar
					showTableToolbar()
				} else {
					// Not in a cell - hide toolbar
					hideTableToolbar()
				}
			}, 100)
		}

		const hideTableToolbar = () => {
			const menus = document.querySelectorAll('.ql-table-better-menu, [class*="ql-table-better-menu"]')
			menus.forEach((menu: any) => {
				// Only hide menu toolbar, not properties popup
				if (menu && 
					!menu.classList.contains('ql-table-better-properties') &&
					!menu.classList.contains('ql-table-better-cell-properties') &&
					!menu.classList.contains('ql-table-better-table-properties') &&
					!menu.closest('.ql-table-better-properties') &&
					!menu.closest('.ql-table-better-cell-properties') &&
					!menu.closest('.ql-table-better-table-properties')) {
					menu.style.display = 'none'
				}
			})
		}

		const showTableToolbar = () => {
			const menus = document.querySelectorAll('.ql-table-better-menu, [class*="ql-table-better-menu"]')
			menus.forEach((menu: any) => {
				// Only show menu toolbar, not properties popup
				if (menu && 
					!menu.classList.contains('ql-table-better-properties') &&
					!menu.classList.contains('ql-table-better-cell-properties') &&
					!menu.classList.contains('ql-table-better-table-properties') &&
					!menu.closest('.ql-table-better-properties') &&
					!menu.closest('.ql-table-better-cell-properties') &&
					!menu.closest('.ql-table-better-table-properties')) {
					menu.style.display = 'flex'
				}
			})
		}

		// Apply label styles for cell properties popup
		const applyLabelStyles = () => {
			const cellPropertiesPopup = document.querySelector('.ql-table-better-cell-properties')
			if (!cellPropertiesPopup) return

			// Find all inputs and their associated labels
			const allInputs = cellPropertiesPopup.querySelectorAll('input[type="text"], input[type="color"]')
			
			allInputs.forEach((input: any) => {
				// Find the parent container
				let container = input.parentElement
				if (!container) return
				
				// Look for label that might be a sibling or in the same container
				// First try to find label before the input (common pattern)
				let label = input.previousElementSibling
				
				// If not found, look for label anywhere in parent
				if (!label || label.tagName !== 'LABEL') {
					label = container.querySelector('label')
				}
				
				if (label && container) {
					const labelText = (label.textContent || '').trim().toLowerCase()
					const isTargetLabel = ['color', 'width', 'height', 'padding'].includes(labelText)
					
					if (isTargetLabel) {
						// Apply styles to parent container to make it column layout
						container.style.display = 'flex'
						container.style.flexDirection = 'column'
						container.style.gap = '4px'
						container.style.alignItems = 'flex-start'
						
						// Apply styles to label
						(label as HTMLElement).style.display = 'block'
						(label as HTMLElement).style.marginBottom = '4px'
						(label as HTMLElement).style.marginTop = '0'
						(label as HTMLElement).style.border = '1px solid #e0e0e0'
						(label as HTMLElement).style.padding = '3px 6px'
						(label as HTMLElement).style.borderRadius = '3px'
						(label as HTMLElement).style.background = '#f9f9f9'
						(label as HTMLElement).style.width = 'fit-content'
						(label as HTMLElement).style.fontSize = '12px'
						(label as HTMLElement).style.color = '#666'
						(label as HTMLElement).style.order = '-1'
						(label as HTMLElement).style.boxSizing = 'border-box'
					}
				}
			})
		}

		// Ensure properties popup is always visible when it exists
		const ensurePropertiesVisible = () => {
			const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
			if (propertiesPopup) {
				;(propertiesPopup as HTMLElement).style.display = 'block'
				;(propertiesPopup as HTMLElement).style.visibility = 'visible'
				;(propertiesPopup as HTMLElement).style.opacity = '1'
				
				// Apply label styles for cell properties
				if (propertiesPopup.classList.contains('ql-table-better-cell-properties')) {
					setTimeout(() => applyLabelStyles(), 50)
				}
			}
		}

		// Monitor for properties popup appearance
		const observer = new MutationObserver(() => {
			ensurePropertiesVisible()
			// Also apply styles when DOM changes
			applyLabelStyles()
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Listen for selection changes
		quill.on('selection-change', handleSelectionChange)
		
		// Also listen for clicks
		quill.root.addEventListener('click', handleSelectionChange, true)
		
		return () => {
			observer.disconnect()
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
