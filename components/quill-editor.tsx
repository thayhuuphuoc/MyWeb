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

		// Fix popup layout and labels styling
		const fixPopupLayout = () => {
			// Ensure properties popups are visible and interactive
			const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
			if (!propertiesPopup) return

			const popup = propertiesPopup as HTMLElement
			// Force visibility and interactivity
			popup.style.setProperty('display', 'block', 'important')
			popup.style.setProperty('visibility', 'visible', 'important')
			popup.style.setProperty('opacity', '1', 'important')
			popup.style.setProperty('z-index', '10001', 'important')
			popup.style.setProperty('pointer-events', 'auto', 'important')
			popup.style.setProperty('position', 'absolute', 'important')
			
			// Fix Border section: ensure labels are inline (left of inputs)
			const borderSection = propertiesPopup.querySelector('[class*="border"]')
			if (borderSection) {
				const borderContainer = borderSection.querySelector('> div:not([class*="label"]):not([class*="title"])') as HTMLElement
				if (borderContainer && borderContainer.style) {
					borderContainer.style.setProperty('display', 'flex', 'important')
					borderContainer.style.setProperty('flex-direction', 'row', 'important')
					borderContainer.style.setProperty('align-items', 'center', 'important')
					borderContainer.style.setProperty('gap', '8px', 'important')
				}
				
				// Border color and width containers - inline layout
				const borderColor = borderSection.querySelector('[class*="color"]') as HTMLElement
				const borderWidth = borderSection.querySelector('[class*="width"]') as HTMLElement
				
				if (borderColor && borderColor.style) {
					borderColor.style.setProperty('display', 'flex', 'important')
					borderColor.style.setProperty('flex-direction', 'row', 'important')
					borderColor.style.setProperty('align-items', 'center', 'important')
					const colorLabel = borderColor.querySelector('label') as HTMLElement
					if (colorLabel && colorLabel.style) {
						colorLabel.style.setProperty('margin', '0', 'important')
						colorLabel.style.setProperty('padding', '0', 'important')
						colorLabel.style.setProperty('border', 'none', 'important')
					}
				}
				
				if (borderWidth && borderWidth.style) {
					borderWidth.style.setProperty('display', 'flex', 'important')
					borderWidth.style.setProperty('flex-direction', 'row', 'important')
					borderWidth.style.setProperty('align-items', 'center', 'important')
					const widthLabel = borderWidth.querySelector('label') as HTMLElement
					if (widthLabel && widthLabel.style) {
						widthLabel.style.setProperty('margin', '0', 'important')
						widthLabel.style.setProperty('padding', '0', 'important')
						widthLabel.style.setProperty('border', 'none', 'important')
					}
				}
			}
			
			// Fix Background section: label above input, no border
			const backgroundSection = propertiesPopup.querySelector('[class*="background"]')
			if (backgroundSection) {
				const backgroundContainer = backgroundSection.querySelector('> div:not([class*="label"]):not([class*="title"])') as HTMLElement
				if (backgroundContainer && backgroundContainer.style) {
					backgroundContainer.style.setProperty('display', 'flex', 'important')
					backgroundContainer.style.setProperty('flex-direction', 'column', 'important')
					backgroundContainer.style.setProperty('gap', '4px', 'important')
				}
				
				const backgroundLabels = backgroundSection.querySelectorAll('label:not([class*="section"])')
				backgroundLabels.forEach((label) => {
					const labelEl = label as HTMLElement
					if (labelEl.style) {
						labelEl.style.setProperty('margin-bottom', '4px', 'important')
						labelEl.style.setProperty('margin-top', '0', 'important')
						labelEl.style.setProperty('border', 'none', 'important')
						labelEl.style.setProperty('padding', '0', 'important')
						labelEl.style.setProperty('background', 'none', 'important')
						labelEl.style.setProperty('display', 'block', 'important')
					}
				})
			}
			
			// Fix Dimensions section
			const dimensionsSection = propertiesPopup.querySelector('[class*="dimensions"]')
			if (dimensionsSection) {
				const dimensionsContainer = dimensionsSection.querySelector('> div:not([class*="label"]):not([class*="title"])') as HTMLElement
				if (dimensionsContainer && dimensionsContainer.style) {
					dimensionsContainer.style.setProperty('display', 'flex', 'important')
					dimensionsContainer.style.setProperty('flex-direction', 'row', 'important')
					dimensionsContainer.style.setProperty('gap', '8px', 'important')
					dimensionsContainer.style.setProperty('align-items', 'flex-start', 'important')
				}
				
				// Each dimension item (width, height, padding) should be column
				const dimensionItems = dimensionsSection.querySelectorAll('[class*="width"], [class*="height"], [class*="padding"]')
				dimensionItems.forEach((item) => {
					const itemEl = item as HTMLElement
					if (itemEl.style) {
						itemEl.style.setProperty('display', 'flex', 'important')
						itemEl.style.setProperty('flex-direction', 'column', 'important')
						itemEl.style.setProperty('gap', '4px', 'important')
					}
				})
				
				// Style labels based on popup type
				const isCellProperties = propertiesPopup.classList.contains('ql-table-better-cell-properties') || 
					propertiesPopup.classList.toString().includes('cell-properties')
				
				const dimensionLabels = dimensionsSection.querySelectorAll('label:not([class*="section"]):not([class*="alignment"])')
				dimensionLabels.forEach((label) => {
					const labelEl = label as HTMLElement
					if (labelEl.style) {
						labelEl.style.setProperty('margin-bottom', '4px', 'important')
						labelEl.style.setProperty('margin-top', '0', 'important')
						labelEl.style.setProperty('display', 'inline-block', 'important')
						
						if (isCellProperties) {
							// Cell properties: labels have border
							labelEl.style.setProperty('border', '1px solid #e0e0e0', 'important')
							labelEl.style.setProperty('padding', '3px 6px', 'important')
							labelEl.style.setProperty('border-radius', '3px', 'important')
							labelEl.style.setProperty('background', '#f9f9f9', 'important')
							labelEl.style.setProperty('width', 'fit-content', 'important')
						} else {
							// Table properties: labels no border
							labelEl.style.setProperty('border', 'none', 'important')
							labelEl.style.setProperty('padding', '0', 'important')
							labelEl.style.setProperty('background', 'none', 'important')
							labelEl.style.setProperty('width', 'auto', 'important')
							labelEl.style.setProperty('display', 'block', 'important')
						}
					}
				})
			}
			
			// Ensure all inputs and buttons are interactive
			const inputs = popup.querySelectorAll('input, select, button')
			inputs.forEach((input) => {
				const el = input as HTMLElement
				el.style.setProperty('pointer-events', 'auto', 'important')
			})
		}

		// Monitor for properties popup appearance and ensure it's interactive
		const observer = new MutationObserver(() => {
			// Apply fixes with delays to ensure DOM is fully rendered
			setTimeout(() => fixPopupLayout(), 0)
			setTimeout(() => fixPopupLayout(), 50)
			setTimeout(() => fixPopupLayout(), 150)
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
