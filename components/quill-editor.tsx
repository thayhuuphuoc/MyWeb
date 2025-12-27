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

		// Apply label styles for cell properties popup
		const applyLabelStyles = () => {
			const cellPropertiesPopup = document.querySelector('.ql-table-better-cell-properties')
			if (!cellPropertiesPopup) return

			// Find all labels
			const allLabels = cellPropertiesPopup.querySelectorAll('label')
			
			allLabels.forEach((label) => {
				const labelText = (label.textContent || '').trim().toLowerCase()
				const isTargetLabel = ['color', 'width', 'height', 'padding'].includes(labelText)
				
				if (!isTargetLabel) return
				
				const labelEl = label as HTMLElement
				
				// Find associated input
				let input: HTMLElement | null = null
				let container: HTMLElement | null = null
				
				// Try to find input by 'for' attribute
				if (labelEl.hasAttribute('for')) {
					const inputId = labelEl.getAttribute('for')
					input = document.getElementById(inputId || '') as HTMLElement
					if (input) {
						container = input.parentElement as HTMLElement
					}
				}
				
				// Try to find input in parent container
				if (!input) {
					let parent = labelEl.parentElement
					while (parent && parent !== cellPropertiesPopup) {
						input = parent.querySelector('input[type="text"], input[type="color"]') as HTMLElement
						if (input && parent.contains(labelEl)) {
							container = parent as HTMLElement
							break
						}
						parent = parent.parentElement
					}
				}
				
				if (input && container) {
					// Set container to flex column
					container.style.setProperty('display', 'flex', 'important')
					container.style.setProperty('flex-direction', 'column', 'important')
					container.style.setProperty('gap', '4px', 'important')
					
					// Move label before input if needed
					if (container.contains(input) && container.contains(labelEl)) {
						const labelIndex = Array.from(container.children).indexOf(labelEl)
						const inputIndex = Array.from(container.children).indexOf(input)
						if (inputIndex < labelIndex) {
							container.insertBefore(labelEl, input)
						}
					}
					
					// Style label
					labelEl.style.setProperty('display', 'block', 'important')
					labelEl.style.setProperty('margin-bottom', '4px', 'important')
					labelEl.style.setProperty('margin-top', '0', 'important')
					labelEl.style.setProperty('border', '1px solid #e0e0e0', 'important')
					labelEl.style.setProperty('padding', '3px 6px', 'important')
					labelEl.style.setProperty('border-radius', '3px', 'important')
					labelEl.style.setProperty('background', '#f9f9f9', 'important')
					labelEl.style.setProperty('width', 'fit-content', 'important')
					labelEl.style.setProperty('font-size', '12px', 'important')
					labelEl.style.setProperty('color', '#666', 'important')
					labelEl.style.setProperty('order', '-1', 'important')
					
					// Ensure input appears below
					input.style.setProperty('order', '1', 'important')
				}
			})
		}

		// Monitor for properties popup appearance
		const observer = new MutationObserver(() => {
			const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
			if (propertiesPopup) {
				const popup = propertiesPopup as HTMLElement
				// Ensure popup is visible
				popup.style.setProperty('display', 'block', 'important')
				popup.style.setProperty('visibility', 'visible', 'important')
				popup.style.setProperty('opacity', '1', 'important')
				popup.style.setProperty('z-index', '10001', 'important')
				
				// Apply label styles for cell properties
				if (propertiesPopup.classList.contains('ql-table-better-cell-properties')) {
					setTimeout(() => applyLabelStyles(), 50)
					setTimeout(() => applyLabelStyles(), 150)
				}
			}
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
