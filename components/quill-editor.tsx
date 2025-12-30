"use client"

import React, {useEffect, useRef} from "react";
import '@/styles/quill/quill.css'
import 'quill-table-better/dist/quill-table-better.css'
import '@/styles/quill/table-custom.css' // CRITICAL: Ensure this is imported AFTER quill-table-better.css
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

		// Note: quill-table-better module handles table select container show/hide automatically
		// The module's registerToolbarTable method adds click handler to button
		// We should NOT interfere with it - no custom event listeners or style manipulation

		// Function to update color input background color based on value
		const updateColorInputBackground = (input: HTMLInputElement) => {
			const value = input.value?.trim() || ''
			if (value && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(value)) {
				// Valid hex color - set background color and remove checkerboard pattern
				input.style.setProperty('background-color', value, 'important')
				input.style.setProperty('background-image', 'none', 'important')
			} else if (value && value !== 'transparent' && value !== 'none') {
				// Try to parse as color
				try {
					const ctx = document.createElement('canvas').getContext('2d')
					if (ctx) {
						ctx.fillStyle = value
						input.style.setProperty('background-color', ctx.fillStyle as string, 'important')
						input.style.setProperty('background-image', 'none', 'important')
					}
				} catch {
					// Invalid color - use checkerboard pattern (CSS default)
					input.style.setProperty('background-color', 'transparent', 'important')
					input.style.removeProperty('background-image')
				}
			} else {
				// No color or transparent - use checkerboard pattern (CSS default)
				input.style.setProperty('background-color', 'transparent', 'important')
				input.style.removeProperty('background-image')
			}
		}

		// Function to fix color inputs
		const fixColorInputs = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return

			// Only process properties form with data-type attribute, not table select dialog
			// Table select dialog doesn't have data-type="table" or data-type="cell"
			if (!popup.classList.contains('ql-table-properties-form')) return
			if (!popup.hasAttribute('data-type') || 
				(popup.getAttribute('data-type') !== 'table' && popup.getAttribute('data-type') !== 'cell')) {
				return
			}

			// Find all color inputs (text inputs in color containers)
			const colorInputs = popup.querySelectorAll<HTMLInputElement>(
				'.ql-table-color-container .property-input[type="text"]'
			)

			colorInputs.forEach((input) => {
				// Skip if already processed
				if (input.dataset.colorProcessed === 'true') return
				input.dataset.colorProcessed = 'true'

				// Update background color based on current value
				updateColorInputBackground(input)

				// Add input event listener to update on change
				const handler = () => updateColorInputBackground(input)
				input.addEventListener('input', handler)
				input.addEventListener('change', handler)

				// Also listen for programmatic value changes
				const observer = new MutationObserver(() => {
					updateColorInputBackground(input)
				})
				observer.observe(input, {
					attributes: true,
					attributeFilter: ['value']
				})
			})
		}

		// Function to set default border properties for table form
		// Default: border-style = 'solid', border-color = '#000000' (black), border-width = '1px'
		// Reference: Cell form uses CELL_DEFAULT_VALUES when multiple cells are selected (table-menus.ts:716)
		// Table form doesn't have this logic, so we need to apply defaults similar to cell form
		// The key is to set defaults in options.attribute BEFORE form is created, but since we can't
		// modify the package code, we intercept immediately when form is appended and update both
		// attrs and UI elements to match the expected defaults
		const setDefaultBorderStyle = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return

			// Only process table properties form
			if (!popup.classList.contains('ql-table-properties-form')) return
			if (popup.getAttribute('data-type') !== 'table') return

			// Skip if already processed
			if (popup.dataset.borderStyleSet === 'true') return

			// Try to access form instance from quill module
			const tableModule = quill.getModule('table-better') as any
			if (!tableModule) {
				setTimeout(() => setDefaultBorderStyle(popup), 10)
				return
			}

			const findAndSetDefaults = () => {
				const formInstance = tableModule?.tableMenus?.tablePropertiesForm

				if (formInstance && formInstance.attrs) {
					// Always set defaults for table form (similar to how cell form uses CELL_DEFAULT_VALUES)
					// Set in attrs first
					formInstance.attrs['border-style'] = 'solid'
					formInstance.attrs['border-color'] = '#000000'
					formInstance.attrs['border-width'] = '1px'
					
					// Then call setAttribute to update UI and trigger handlers
					if (typeof formInstance.setAttribute === 'function') {
						formInstance.setAttribute('border-style', 'solid')
						formInstance.setAttribute('border-color', '#000000')
						formInstance.setAttribute('border-width', '1px')
						
						// Call toggleBorderDisabled to enable color and width inputs
						if (typeof formInstance.toggleBorderDisabled === 'function') {
							formInstance.toggleBorderDisabled('solid')
						}
					}
					
					// Also update UI elements directly to ensure they reflect the values
					const borderRow = popup.querySelector('.properties-form-row:not(.properties-form-row-full)')
					if (borderRow) {
						// Update border-style dropdown text
						const borderDropdown = borderRow.querySelector('.ql-table-dropdown-properties')
						if (borderDropdown) {
							const dropText = borderDropdown.querySelector('.ql-table-dropdown-text') as HTMLElement
							if (dropText) {
								dropText.innerText = 'solid'
								
								// Update selected status in dropdown list
								const list = borderDropdown.querySelector('.ql-table-dropdown-list')
								if (list) {
									const lists = Array.from(list.querySelectorAll('li'))
									lists.forEach((li) => {
										li.classList.remove('ql-table-dropdown-selected')
									})
									const solidOption = lists.find((li) => li.textContent?.trim() === 'solid')
									if (solidOption) {
										solidOption.classList.add('ql-table-dropdown-selected')
									}
								}
							}
						}
						
						// Update border-color input
						const colorContainer = borderRow.querySelector('.ql-table-color-container')
						if (colorContainer) {
							const colorInput = colorContainer.querySelector('.property-input[type="text"]') as HTMLInputElement
							if (colorInput) {
								colorInput.value = '#000000'
								colorInput.style.setProperty('background-color', '#000000', 'important')
								colorInput.style.setProperty('background-image', 'none', 'important')
							}
						}
						
						// Update border-width input
						const widthInput = borderRow.querySelector('.label-field-view[data-property="border-width"] .property-input') as HTMLInputElement
						if (widthInput) {
							widthInput.value = '1px'
						}
					}
					
					// Mark as processed
					popup.dataset.borderStyleSet = 'true'
					return true
				}

				// Fallback: try clicking method if form instance not found
				const borderRow = popup.querySelector('.properties-form-row:not(.properties-form-row-full)')
				if (!borderRow) return false

				const borderDropdown = borderRow.querySelector('.ql-table-dropdown-properties')
				if (!borderDropdown) return false

				const dropText = borderDropdown.querySelector('.ql-table-dropdown-text') as HTMLElement
				if (!dropText) return false

				const currentValue = dropText.innerText?.trim()
				if (!currentValue || currentValue === '' || currentValue === 'none' || currentValue.toLowerCase() === 'none') {
					dropText.innerText = 'solid'
					
					const list = borderDropdown.querySelector('.ql-table-dropdown-list')
					if (list) {
						const lists = Array.from(list.querySelectorAll('li'))
						const solidOption = lists.find((li) => li.textContent?.trim() === 'solid')
						
						if (solidOption) {
							lists.forEach((li) => {
								li.classList.remove('ql-table-dropdown-selected')
							})
							solidOption.classList.add('ql-table-dropdown-selected')
							
							const wasHidden = list.classList.contains('ql-hidden')
							if (wasHidden) {
								list.classList.remove('ql-hidden')
							}
							
							;(solidOption as HTMLElement).click()
							
							if (wasHidden) {
								list.classList.add('ql-hidden')
							}
							
							popup.dataset.borderStyleSet = 'true'
							return true
						}
					}
				}
				
				return false
			}
			
			// Try immediately and with delays
			if (!findAndSetDefaults()) {
				setTimeout(() => {
					if (!findAndSetDefaults()) {
						setTimeout(() => findAndSetDefaults(), 100)
					}
				}, 50)
			}
		}

		// Use MutationObserver to detect when table form is added to DOM
		// This ensures we can set default border-style immediately when form is created
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node instanceof HTMLElement) {
						// Check if it's a table properties form
						if (node.classList.contains('ql-table-properties-form') && 
							node.getAttribute('data-type') === 'table') {
							// Set default border-style immediately with multiple attempts
							setTimeout(() => setDefaultBorderStyle(node), 0)
							setTimeout(() => setDefaultBorderStyle(node), 50)
							setTimeout(() => setDefaultBorderStyle(node), 150)
						}
						// Also check for nested forms
						const tableForm = node.querySelector?.('.ql-table-properties-form[data-type="table"]')
						if (tableForm instanceof HTMLElement) {
							setTimeout(() => setDefaultBorderStyle(tableForm), 0)
							setTimeout(() => setDefaultBorderStyle(tableForm), 50)
							setTimeout(() => setDefaultBorderStyle(tableForm), 150)
						}
					}
				})
			})
		})

		// Observe quill container for new forms
		if (quillRef.current) {
			observer.observe(quillRef.current, {
				childList: true,
				subtree: true
			})
		}

		// Simple periodic check - only process properties form when it's visible
		// No MutationObserver or event listeners to avoid interfering with table insertion
		const interval = setInterval(() => {
			// Only check for visible properties forms with data-type attribute
			// This ensures we don't interfere with table select dialog
			const popups = document.querySelectorAll('.ql-table-properties-form[data-type="table"], .ql-table-properties-form[data-type="cell"]')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement && popup.isConnected) {
					const computed = window.getComputedStyle(popup)
					// Only process if visible
					if (!(computed.display === 'none' ||
						computed.visibility === 'hidden' ||
						computed.opacity === '0' ||
						popup.classList.contains('ql-hidden'))) {
						fixColorInputs(popup)
						setDefaultBorderStyle(popup)
					}
				}
			})
		}, 500) // Check every 500ms - frequent enough for properties form, but won't interfere with table insertion

		return () => {
			clearInterval(interval)
			observer.disconnect()
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
