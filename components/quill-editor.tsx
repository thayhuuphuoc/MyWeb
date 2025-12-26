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

			// Strategy: Find all labels first, then find their associated inputs
			const allLabels = cellPropertiesPopup.querySelectorAll('label')
			
			allLabels.forEach((label: any) => {
				const labelText = (label.textContent || '').trim().toLowerCase()
				const isTargetLabel = ['color', 'width', 'height', 'padding'].includes(labelText)
				
				if (!isTargetLabel) return
				
				// Find the closest container that has both label and input
				let container = label.parentElement as HTMLElement
				if (!container) return
				
				// Look for input in the same container or nearby
				let input = container.querySelector('input[type="text"], input[type="color"]') as HTMLElement
				
				// If input not in direct parent, check if label and input are siblings
				if (!input && container.parentElement) {
					const siblings = Array.from(container.parentElement.children)
					const labelIndex = siblings.indexOf(label)
					// Check next sibling
					if (labelIndex < siblings.length - 1) {
						const nextSibling = siblings[labelIndex + 1] as HTMLElement
						if (nextSibling && (nextSibling.tagName === 'INPUT' || nextSibling.querySelector('input'))) {
							container = container.parentElement as HTMLElement
							input = nextSibling.querySelector('input') as HTMLElement || nextSibling as HTMLElement
						}
					}
				}
				
				if (!input) {
					// Try finding input by going up the DOM tree
					let current = container.parentElement
					while (current && !input) {
						input = current.querySelector('input[type="text"], input[type="color"]') as HTMLElement
						if (input && current.contains(label)) {
							container = current as HTMLElement
							break
						}
						current = current.parentElement
					}
				}
				
				if (input && container && container.contains(label) && container.contains(input)) {
					// Ensure container uses flexbox column layout
					container.style.display = 'flex'
					container.style.flexDirection = 'column'
					container.style.gap = '4px'
					container.style.alignItems = 'flex-start'
					
					// Move label before input in DOM if needed (to ensure visual order)
					if (input.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING) {
						// Label comes after input, move it before
						container.insertBefore(label, input)
					}
					
					// Apply styles to label - make it look like a box above input
					label.style.display = 'block'
					label.style.marginBottom = '4px'
					label.style.marginTop = '0'
					label.style.marginLeft = '0'
					label.style.marginRight = '0'
					label.style.border = '1px solid #e0e0e0'
					label.style.padding = '3px 6px'
					label.style.borderRadius = '3px'
					label.style.background = '#f9f9f9'
					label.style.width = 'fit-content'
					label.style.minWidth = 'fit-content'
					label.style.maxWidth = 'fit-content'
					label.style.fontSize = '12px'
					label.style.color = '#666'
					label.style.order = '-1'
					label.style.boxSizing = 'border-box'
					label.style.position = 'relative'
					label.style.zIndex = '1'
					
					// Ensure input is below label
					input.style.order = '1'
					input.style.marginTop = '0'
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
