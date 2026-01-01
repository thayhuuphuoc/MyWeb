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

		// Function to apply border to cells with specific values (bypass table element reading)
		const applyBorderToCellsWithValues = (table: HTMLElement, borderStyle?: string, borderColor?: string, borderWidth?: string) => {
			if (!borderStyle && !borderColor && !borderWidth) {
				// No values provided, fallback to reading from table
				applyBorderToCells(table)
				return
			}
			
			const cells = table.querySelectorAll('td, th')
			let appliedCount = 0
			cells.forEach((cell, index) => {
				const cellEl = cell as HTMLElement
				
				// Get current style attribute
				let cellStyle = cellEl.getAttribute('style') || ''
				const originalStyle = cellStyle
				
				// Remove ALL existing border properties from style string and style object
				cellStyle = cellStyle
					.replace(/border[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-style[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-color[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-width[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-top[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-right[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-bottom[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-left[^:]*:\s*[^;]+;?/gi, '')
					.replace(/;\s*;/g, ';')
					.trim()
				
				// Remove from style object
				const borderProps = ['border', 'border-style', 'border-color', 'border-width',
					'border-top', 'border-right', 'border-bottom', 'border-left',
					'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
					'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
					'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width']
				borderProps.forEach(prop => {
					cellEl.style.removeProperty(prop)
				})
				
				// Build border style string with !important
				const borderParts: string[] = []
				if (borderStyle && borderStyle !== 'none') {
					borderParts.push(`border-style: ${borderStyle} !important`)
					borderParts.push(`border-top-style: ${borderStyle} !important`)
					borderParts.push(`border-right-style: ${borderStyle} !important`)
					borderParts.push(`border-bottom-style: ${borderStyle} !important`)
					borderParts.push(`border-left-style: ${borderStyle} !important`)
				} else if (borderStyle === 'none') {
					borderParts.push(`border-style: none !important`)
				}
				if (borderColor) {
					borderParts.push(`border-color: ${borderColor} !important`)
					borderParts.push(`border-top-color: ${borderColor} !important`)
					borderParts.push(`border-right-color: ${borderColor} !important`)
					borderParts.push(`border-bottom-color: ${borderColor} !important`)
					borderParts.push(`border-left-color: ${borderColor} !important`)
				}
				if (borderWidth) {
					borderParts.push(`border-width: ${borderWidth} !important`)
					borderParts.push(`border-top-width: ${borderWidth} !important`)
					borderParts.push(`border-right-width: ${borderWidth} !important`)
					borderParts.push(`border-bottom-width: ${borderWidth} !important`)
					borderParts.push(`border-left-width: ${borderWidth} !important`)
				}
				
				// Combine with existing style and set attribute directly
				// Setting style attribute directly ensures inline styles are applied
				if (borderParts.length > 0) {
					cellStyle = cellStyle ? `${cellStyle}; ${borderParts.join('; ')}` : borderParts.join('; ')
				} else if (!borderStyle && !borderColor && !borderWidth) {
					cellStyle = cellStyle ? `${cellStyle}; border: none !important` : 'border: none !important'
				}
				
				// Set style attribute directly - this is the most reliable way
				cellEl.setAttribute('style', cellStyle)
				
				// Also set via style object to ensure browser recognizes it
				// Set individual properties with !important
				if (borderStyle && borderStyle !== 'none') {
					cellEl.style.setProperty('border-style', borderStyle, 'important')
					cellEl.style.setProperty('border-top-style', borderStyle, 'important')
					cellEl.style.setProperty('border-right-style', borderStyle, 'important')
					cellEl.style.setProperty('border-bottom-style', borderStyle, 'important')
					cellEl.style.setProperty('border-left-style', borderStyle, 'important')
				} else if (borderStyle === 'none') {
					cellEl.style.setProperty('border-style', 'none', 'important')
					cellEl.style.setProperty('border-top-style', 'none', 'important')
					cellEl.style.setProperty('border-right-style', 'none', 'important')
					cellEl.style.setProperty('border-bottom-style', 'none', 'important')
					cellEl.style.setProperty('border-left-style', 'none', 'important')
				}
				if (borderColor) {
					cellEl.style.setProperty('border-color', borderColor, 'important')
					cellEl.style.setProperty('border-top-color', borderColor, 'important')
					cellEl.style.setProperty('border-right-color', borderColor, 'important')
					cellEl.style.setProperty('border-bottom-color', borderColor, 'important')
					cellEl.style.setProperty('border-left-color', borderColor, 'important')
				}
				if (borderWidth) {
					cellEl.style.setProperty('border-width', borderWidth, 'important')
					cellEl.style.setProperty('border-top-width', borderWidth, 'important')
					cellEl.style.setProperty('border-right-width', borderWidth, 'important')
					cellEl.style.setProperty('border-bottom-width', borderWidth, 'important')
					cellEl.style.setProperty('border-left-width', borderWidth, 'important')
				}
				
				// Force a reflow to ensure styles are applied
				void cellEl.offsetHeight
				
				// Debug: Check if styles were actually set (first cell only)
				if (index === 0) {
					const finalStyleAttr = cellEl.getAttribute('style') || ''
					const inlineBorderStyle = cellEl.style.getPropertyValue('border-style')
					const inlineBorderColor = cellEl.style.getPropertyValue('border-color')
					const inlineBorderWidth = cellEl.style.getPropertyValue('border-width')
					const computed = window.getComputedStyle(cellEl)
					console.log('applyBorderToCellsWithValues - Cell 0 debug:', {
						expectedStyle: borderStyle,
						expectedColor: borderColor,
						expectedWidth: borderWidth,
						finalStyleAttr,
						inlineBorderStyle,
						inlineBorderColor,
						inlineBorderWidth,
						computedBorderStyle: computed.borderStyle,
						computedBorderColor: computed.borderColor,
						computedBorderWidth: computed.borderWidth,
						hasBorderInAttr: finalStyleAttr.includes('border-style') || finalStyleAttr.includes('border-color') || finalStyleAttr.includes('border-width')
					})
				}
				
				appliedCount++
			})
			
			console.log('Applied border to cells with values:', { borderStyle, borderColor, borderWidth, cellsCount: cells.length, appliedCount })
		}

		// Function to apply border from table element to cells
		// This follows quill-table-better pattern: read border from table, apply to cells
		const applyBorderToCells = (table: HTMLElement) => {
			// Read border properties from table style attribute (as quill-table-better does)
			const styleAttr = table.getAttribute('style') || ''
			
			// Parse border properties from style attribute
			const borderStyleMatch = styleAttr.match(/border-style:\s*([^;!]+)/i)
			const borderColorMatch = styleAttr.match(/border-color:\s*([^;!]+)/i)
			const borderWidthMatch = styleAttr.match(/border-width:\s*([^;!]+)/i)
			
			let borderStyle = borderStyleMatch ? borderStyleMatch[1].trim() : ''
			let borderColor = borderColorMatch ? borderColorMatch[1].trim() : ''
			let borderWidth = borderWidthMatch ? borderWidthMatch[1].trim() : ''
			
			// If not found, try style object
			if (!borderStyle) borderStyle = table.style.getPropertyValue('border-style') || ''
			if (!borderColor) borderColor = table.style.getPropertyValue('border-color') || ''
			if (!borderWidth) borderWidth = table.style.getPropertyValue('border-width') || ''
			
			console.log('applyBorderToCells called:', { 
				styleAttr, 
				borderStyle, 
				borderColor, 
				borderWidth 
			})
			
			// Apply to all cells
			const cells = table.querySelectorAll('td, th')
			console.log('Found cells:', cells.length)
			
			cells.forEach((cell, index) => {
				const cellEl = cell as HTMLElement
				
				// Remove existing border properties from style object
				cellEl.style.removeProperty('border')
				cellEl.style.removeProperty('border-style')
				cellEl.style.removeProperty('border-color')
				cellEl.style.removeProperty('border-width')
				cellEl.style.removeProperty('border-top')
				cellEl.style.removeProperty('border-right')
				cellEl.style.removeProperty('border-bottom')
				cellEl.style.removeProperty('border-left')
				cellEl.style.removeProperty('border-top-style')
				cellEl.style.removeProperty('border-right-style')
				cellEl.style.removeProperty('border-bottom-style')
				cellEl.style.removeProperty('border-left-style')
				cellEl.style.removeProperty('border-top-color')
				cellEl.style.removeProperty('border-right-color')
				cellEl.style.removeProperty('border-bottom-color')
				cellEl.style.removeProperty('border-left-color')
				cellEl.style.removeProperty('border-top-width')
				cellEl.style.removeProperty('border-right-width')
				cellEl.style.removeProperty('border-bottom-width')
				cellEl.style.removeProperty('border-left-width')
				
				// Set border properties with !important to override quill.css
				if (borderStyle && borderStyle !== 'none') {
					cellEl.style.setProperty('border-style', borderStyle, 'important')
					cellEl.style.setProperty('border-top-style', borderStyle, 'important')
					cellEl.style.setProperty('border-right-style', borderStyle, 'important')
					cellEl.style.setProperty('border-bottom-style', borderStyle, 'important')
					cellEl.style.setProperty('border-left-style', borderStyle, 'important')
				} else if (borderStyle === 'none') {
					cellEl.style.setProperty('border-style', 'none', 'important')
					cellEl.style.setProperty('border-top-style', 'none', 'important')
					cellEl.style.setProperty('border-right-style', 'none', 'important')
					cellEl.style.setProperty('border-bottom-style', 'none', 'important')
					cellEl.style.setProperty('border-left-style', 'none', 'important')
				}
				
				if (borderColor) {
					cellEl.style.setProperty('border-color', borderColor, 'important')
					cellEl.style.setProperty('border-top-color', borderColor, 'important')
					cellEl.style.setProperty('border-right-color', borderColor, 'important')
					cellEl.style.setProperty('border-bottom-color', borderColor, 'important')
					cellEl.style.setProperty('border-left-color', borderColor, 'important')
				}
				
				if (borderWidth) {
					cellEl.style.setProperty('border-width', borderWidth, 'important')
					cellEl.style.setProperty('border-top-width', borderWidth, 'important')
					cellEl.style.setProperty('border-right-width', borderWidth, 'important')
					cellEl.style.setProperty('border-bottom-width', borderWidth, 'important')
					cellEl.style.setProperty('border-left-width', borderWidth, 'important')
				}
				
				// Debug first cell
				if (index === 0) {
					const computed = window.getComputedStyle(cellEl)
					console.log('Cell 0 after applying border:', {
						inlineBorderStyle: cellEl.style.getPropertyValue('border-style'),
						inlineBorderColor: cellEl.style.getPropertyValue('border-color'),
						inlineBorderWidth: cellEl.style.getPropertyValue('border-width'),
						computedBorderStyle: computed.borderStyle,
						computedBorderColor: computed.borderColor,
						computedBorderWidth: computed.borderWidth,
						expectedStyle: borderStyle,
						expectedColor: borderColor,
						expectedWidth: borderWidth
					})
				}
			})
			
			console.log('applyBorderToCells completed')
		}

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
							// Apply border to cells
							applyBorderToCells(lastTable)
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

		// Monkey-patch saveTableAction to apply border to cells after save
		if (tableBetter && tableBetter.tableMenus) {
			// Wait a bit for tableMenus to be initialized
			setTimeout(() => {
				const tableMenus = tableBetter.tableMenus
				// Patch when tablePropertiesForm is accessed
				const originalGetTablePropertiesForm = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(tableMenus), 'tablePropertiesForm')?.get
				if (tableMenus.tablePropertiesForm) {
					const form = tableMenus.tablePropertiesForm
					if (form && form.saveTableAction) {
						const originalSaveTableAction = form.saveTableAction.bind(form)
						form.saveTableAction = function() {
							// Get border properties from form inputs BEFORE saving
							let borderStyle = ''
							let borderColor = ''
							let borderWidth = ''
							
							// Try multiple selectors to find border style dropdown
							const borderStyleDropdown = form.container?.querySelector?.('.ql-table-dropdown-properties[data-property="border-style"], [data-property="border-style"] .ql-table-dropdown-properties') as HTMLElement
							if (borderStyleDropdown) {
								// Check for selected item in dropdown list
								const selectedItem = borderStyleDropdown.querySelector('.ql-table-dropdown-list li.ql-selected, .ql-table-dropdown-list li[data-selected="true"]') as HTMLElement
								if (selectedItem) {
									borderStyle = selectedItem.getAttribute('data-value') || selectedItem.textContent?.trim() || ''
								} else {
									// Check dropdown text
									const dropdownText = borderStyleDropdown.querySelector('.ql-table-dropdown-text') as HTMLElement
									if (dropdownText) {
										borderStyle = dropdownText.textContent?.trim() || ''
									}
								}
							}
							
							// Try to get border color from color input
							const borderColorInput = form.container?.querySelector?.('[data-property="border-color"] .property-input, .ql-table-color-container[data-property="border-color"] .property-input') as HTMLInputElement
							if (borderColorInput) {
								borderColor = borderColorInput.value || borderColorInput.getAttribute('value') || ''
								// If empty, try to get from color picker button
								if (!borderColor) {
									const colorButton = form.container?.querySelector?.('[data-property="border-color"] .color-button') as HTMLElement
									if (colorButton) {
										borderColor = colorButton.getAttribute('data-color') || colorButton.style.backgroundColor || ''
									}
								}
							}
							
							// Try to get border width from width input
							const borderWidthInput = form.container?.querySelector?.('[data-property="border-width"] .property-input, .label-field-view[data-property="border-width"] .property-input') as HTMLInputElement
							if (borderWidthInput) {
								borderWidth = borderWidthInput.value || borderWidthInput.getAttribute('value') || ''
							}
							
							console.log('Save table action: border properties from form:', { borderStyle, borderColor, borderWidth })
							
							// Call original save action
							originalSaveTableAction()
							
							// Apply border to cells using form values directly
							const tryApply = (attempt: number) => {
								setTimeout(() => {
									const { table } = this.tableMenus
									if (table) {
										// If we have form values, use them directly
										if (borderStyle || borderColor || borderWidth) {
											console.log(`Save table action (attempt ${attempt}): applying border from form values:`, { borderStyle, borderColor, borderWidth })
											applyBorderToCellsWithValues(table as HTMLElement, borderStyle || undefined, borderColor || undefined, borderWidth || undefined)
										} else {
											// Fallback: read from table style
											const tableStyle = table.getAttribute('style') || ''
											console.log(`Save table action (attempt ${attempt}): table style:`, tableStyle)
											applyBorderToCells(table as HTMLElement)
											// Try again if style doesn't seem updated yet
											if (attempt < 5 && (!tableStyle.includes('border-style') || (tableStyle.includes('border-style: solid') && tableStyle.includes('#000000')))) {
												tryApply(attempt + 1)
											}
										}
									}
								}, attempt * 200) // 200ms, 400ms, 600ms, 800ms, 1000ms
							}
							tryApply(1)
						}
					}
				}
			}, 500)

			// Also patch createTablePropertiesForm to catch when form is created
			const originalCreateTablePropertiesForm = tableBetter.tableMenus.createTablePropertiesForm
			if (originalCreateTablePropertiesForm) {
				tableBetter.tableMenus.createTablePropertiesForm = function(type: string) {
					const result = originalCreateTablePropertiesForm.call(this, type)
					// Patch saveTableAction after form is created
					setTimeout(() => {
						if (this.tablePropertiesForm && this.tablePropertiesForm.saveTableAction) {
							const originalSave = this.tablePropertiesForm.saveTableAction.bind(this.tablePropertiesForm)
							this.tablePropertiesForm.saveTableAction = function() {
								// Get border properties from form inputs BEFORE saving
								let borderStyle = ''
								let borderColor = ''
								let borderWidth = ''
								
								// Try multiple selectors to find border style dropdown
								const formContainer = this.container || this.element
								const borderStyleDropdown = formContainer?.querySelector?.('.ql-table-dropdown-properties[data-property="border-style"], [data-property="border-style"] .ql-table-dropdown-properties') as HTMLElement
								if (borderStyleDropdown) {
									// Check for selected item in dropdown list
									const selectedItem = borderStyleDropdown.querySelector('.ql-table-dropdown-list li.ql-selected, .ql-table-dropdown-list li[data-selected="true"]') as HTMLElement
									if (selectedItem) {
										borderStyle = selectedItem.getAttribute('data-value') || selectedItem.textContent?.trim() || ''
									} else {
										// Check dropdown text
										const dropdownText = borderStyleDropdown.querySelector('.ql-table-dropdown-text') as HTMLElement
										if (dropdownText) {
											borderStyle = dropdownText.textContent?.trim() || ''
										}
									}
								}
								
								// Try to get border color from color input
								const borderColorInput = formContainer?.querySelector?.('[data-property="border-color"] .property-input, .ql-table-color-container[data-property="border-color"] .property-input') as HTMLInputElement
								if (borderColorInput) {
									borderColor = borderColorInput.value || borderColorInput.getAttribute('value') || ''
									// If empty, try to get from color picker button
									if (!borderColor) {
										const colorButton = formContainer?.querySelector?.('[data-property="border-color"] .color-button') as HTMLElement
										if (colorButton) {
											borderColor = colorButton.getAttribute('data-color') || colorButton.style.backgroundColor || ''
										}
									}
								}
								
								// Try to get border width from width input
								const borderWidthInput = formContainer?.querySelector?.('[data-property="border-width"] .property-input, .label-field-view[data-property="border-width"] .property-input') as HTMLInputElement
								if (borderWidthInput) {
									borderWidth = borderWidthInput.value || borderWidthInput.getAttribute('value') || ''
								}
								
								console.log('Save table action (from createForm): border properties from form:', { borderStyle, borderColor, borderWidth })
								
								originalSave()
								
								// Apply border to cells using form values directly
								const tryApply = (attempt: number) => {
									setTimeout(() => {
										const { table } = this.tableMenus
										if (table) {
											// If we have form values, use them directly
											if (borderStyle || borderColor || borderWidth) {
												console.log(`Save table action (from createForm, attempt ${attempt}): applying border from form values:`, { borderStyle, borderColor, borderWidth })
												applyBorderToCellsWithValues(table as HTMLElement, borderStyle || undefined, borderColor || undefined, borderWidth || undefined)
											} else {
												// Fallback: read from table style
												const tableStyle = table.getAttribute('style') || ''
												console.log(`Save table action (from createForm, attempt ${attempt}): table style:`, tableStyle)
												applyBorderToCells(table as HTMLElement)
												// Try again if style doesn't seem updated yet
												if (attempt < 5 && (!tableStyle.includes('border-style') || (tableStyle.includes('border-style: solid') && tableStyle.includes('#000000')))) {
													tryApply(attempt + 1)
												}
											}
										}
									}, attempt * 200) // 200ms, 400ms, 600ms, 800ms, 1000ms
								}
								tryApply(1)
							}
						}
					}, 200)
					return result
				}
			}
		}

		// Listen for click on save button to apply border to cells
		const handleSaveButtonClick = () => {
			// Listen for clicks on save button
			document.addEventListener('click', (e) => {
				const target = e.target as HTMLElement
				// Check if clicked element is save button or inside save button
				const saveButton = target.closest('button[label="save"], button[data-label="save"]')
				if (saveButton) {
					// Wait a bit for save action to complete
					setTimeout(() => {
						const tables = quill.root.querySelectorAll('table')
						tables.forEach((table) => {
							applyBorderToCells(table as HTMLElement)
						})
					}, 200)
				}
			}, true)
		}
		handleSaveButtonClick()

		// Also monkey-patch saveTableAction to apply border to cells after save
		if (tableBetter && tableBetter.tableMenus) {
			// Wait a bit for tableMenus to be initialized
			setTimeout(() => {
				const tableMenus = tableBetter.tableMenus
				// Patch when tablePropertiesForm is accessed
				if (tableMenus.tablePropertiesForm) {
					const form = tableMenus.tablePropertiesForm
					if (form && form.saveTableAction) {
						const originalSaveTableAction = form.saveTableAction.bind(form)
						form.saveTableAction = function() {
							// Call original save action
							originalSaveTableAction()
							// Apply border to cells after save
							setTimeout(() => {
								const { table } = this.tableMenus
								if (table) {
									applyBorderToCells(table as HTMLElement)
								}
							}, 200)
						}
					}
				}
			}, 500)

			// Also patch createTablePropertiesForm to catch when form is created
			const originalCreateTablePropertiesForm = tableBetter.tableMenus.createTablePropertiesForm
			if (originalCreateTablePropertiesForm) {
				tableBetter.tableMenus.createTablePropertiesForm = function(type: string) {
					const result = originalCreateTablePropertiesForm.call(this, type)
					// Patch saveTableAction after form is created
					setTimeout(() => {
						if (this.tablePropertiesForm && this.tablePropertiesForm.saveTableAction) {
							const originalSave = this.tablePropertiesForm.saveTableAction.bind(this.tablePropertiesForm)
							this.tablePropertiesForm.saveTableAction = function() {
								originalSave()
								setTimeout(() => {
									const { table } = this.tableMenus
									if (table) {
										applyBorderToCells(table as HTMLElement)
									}
								}, 200)
							}
						}
					}, 200)
					return result
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
		// Use a debounce mechanism to avoid too many calls
		let mutationTimeout: NodeJS.Timeout | null = null
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
					const target = mutation.target as HTMLElement
					if (target.tagName === 'TABLE') {
						const tableStyle = target.getAttribute('style') || ''
						// Only apply if style contains border properties
						if (tableStyle.includes('border-style') || tableStyle.includes('border-color') || tableStyle.includes('border-width')) {
							console.log('MutationObserver: table style changed', tableStyle)
							// Clear previous timeout
							if (mutationTimeout) {
								clearTimeout(mutationTimeout)
							}
							// Add delay to ensure style is fully applied (debounced)
							mutationTimeout = setTimeout(() => {
								applyBorderToCells(target)
								mutationTimeout = null
							}, 200)
						}
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
				}, 100)
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
