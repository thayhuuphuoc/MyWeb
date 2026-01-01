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
		const applyBorderToCellsWithValues = (table: HTMLElement, borderStyle: string, borderColor: string, borderWidth: string) => {
			const cells = table.querySelectorAll('td, th')
			cells.forEach((cell) => {
				const cellEl = cell as HTMLElement
				
				// Get current style attribute
				let cellStyle = cellEl.getAttribute('style') || ''
				
				// Remove any existing border properties from style string
				cellStyle = cellStyle
					.replace(/border[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-style[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-color[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-width[^:]*:\s*[^;]+;?/gi, '')
					.replace(/;\s*;/g, ';')
					.trim()
				
				// Build new border style string
				const borderParts: string[] = []
				if (borderStyle && borderStyle !== 'none') {
					borderParts.push(`border-style: ${borderStyle} !important`)
				} else if (borderStyle === 'none') {
					borderParts.push(`border-style: none !important`)
				}
				if (borderColor) {
					borderParts.push(`border-color: ${borderColor} !important`)
				}
				if (borderWidth) {
					borderParts.push(`border-width: ${borderWidth} !important`)
				}
				
				// Combine with existing style
				if (borderParts.length > 0) {
					cellStyle = cellStyle ? `${cellStyle}; ${borderParts.join('; ')}` : borderParts.join('; ')
				}
				
				// Set via style object FIRST
				if (borderStyle && borderStyle !== 'none') {
					cellEl.style.setProperty('border-style', borderStyle, 'important')
				}
				if (borderColor) {
					cellEl.style.setProperty('border-color', borderColor, 'important')
				}
				if (borderWidth) {
					cellEl.style.setProperty('border-width', borderWidth, 'important')
				}
				
				// Set style attribute
				cellEl.setAttribute('style', cellStyle)
			})
			
			console.log('Applied border to cells with values:', { borderStyle, borderColor, borderWidth, cellsCount: cells.length })
		}

		// Function to apply border from table element to cells
		const applyBorderToCells = (table: HTMLElement) => {
			// Get style attribute first (most reliable)
			const styleAttr = table.getAttribute('style') || ''
			
			// Parse border properties from style attribute
			// Use more robust regex to handle spaces and !important
			const borderStyleMatch = styleAttr.match(/border-style:\s*([^;!]+)/i)
			const borderColorMatch = styleAttr.match(/border-color:\s*([^;!]+)/i)
			const borderWidthMatch = styleAttr.match(/border-width:\s*([^;!]+)/i)
			
			// Get values from matches or from style object (computed style as fallback)
			let borderStyle = borderStyleMatch ? borderStyleMatch[1].trim() : ''
			let borderColor = borderColorMatch ? borderColorMatch[1].trim() : ''
			let borderWidth = borderWidthMatch ? borderWidthMatch[1].trim() : ''
			
			// If not found in style attribute, try style object
			if (!borderStyle) {
				borderStyle = table.style.getPropertyValue('border-style') || ''
			}
			if (!borderColor) {
				borderColor = table.style.getPropertyValue('border-color') || ''
			}
			if (!borderWidth) {
				borderWidth = table.style.getPropertyValue('border-width') || ''
			}
			
			// If still not found, try computed style (last resort)
			if (!borderStyle || !borderColor || !borderWidth) {
				const computedStyle = window.getComputedStyle(table)
				if (!borderStyle && computedStyle.borderStyle && computedStyle.borderStyle !== 'none') {
					borderStyle = computedStyle.borderStyle
				}
				if (!borderColor && computedStyle.borderColor && computedStyle.borderColor !== 'rgb(0, 0, 0)') {
					borderColor = computedStyle.borderColor
				}
				if (!borderWidth && computedStyle.borderWidth && computedStyle.borderWidth !== '0px') {
					borderWidth = computedStyle.borderWidth
				}
			}
			
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
			
			console.log('applyBorderToCells - table style:', styleAttr, 'parsed:', { borderStyle, borderColor, borderWidth })
			
			// Apply to all cells
			const cells = table.querySelectorAll('td, th')
			let appliedCount = 0
			cells.forEach((cell, index) => {
				const cellEl = cell as HTMLElement
				
				// Get current style attribute
				let cellStyle = cellEl.getAttribute('style') || ''
				const originalStyle = cellStyle
				
				// Remove ALL existing border properties from style string and style object
				// Remove from style attribute string
				cellStyle = cellStyle
					.replace(/border[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-style[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-color[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-width[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-top[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-right[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-bottom[^:]*:\s*[^;]+;?/gi, '')
					.replace(/border-left[^:]*:\s*[^;]+;?/gi, '')
					.replace(/;\s*;/g, ';') // Remove double semicolons
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
				
				// Set individual border properties for each side with !important
				// This ensures we override quill.css default border
				const borderParts: string[] = []
				if (borderStyle && borderStyle !== 'none') {
					// Set shorthand first
					cellEl.style.setProperty('border-style', borderStyle, 'important')
					// Then set individual sides
					cellEl.style.setProperty('border-top-style', borderStyle, 'important')
					cellEl.style.setProperty('border-right-style', borderStyle, 'important')
					cellEl.style.setProperty('border-bottom-style', borderStyle, 'important')
					cellEl.style.setProperty('border-left-style', borderStyle, 'important')
					borderParts.push(`border-style: ${borderStyle} !important`)
					borderParts.push(`border-top-style: ${borderStyle} !important`)
					borderParts.push(`border-right-style: ${borderStyle} !important`)
					borderParts.push(`border-bottom-style: ${borderStyle} !important`)
					borderParts.push(`border-left-style: ${borderStyle} !important`)
				} else if (borderStyle === 'none') {
					cellEl.style.setProperty('border-style', 'none', 'important')
					cellEl.style.setProperty('border-top-style', 'none', 'important')
					cellEl.style.setProperty('border-right-style', 'none', 'important')
					cellEl.style.setProperty('border-bottom-style', 'none', 'important')
					cellEl.style.setProperty('border-left-style', 'none', 'important')
					borderParts.push(`border-style: none !important`)
				}
				if (borderColor) {
					cellEl.style.setProperty('border-color', borderColor, 'important')
					cellEl.style.setProperty('border-top-color', borderColor, 'important')
					cellEl.style.setProperty('border-right-color', borderColor, 'important')
					cellEl.style.setProperty('border-bottom-color', borderColor, 'important')
					cellEl.style.setProperty('border-left-color', borderColor, 'important')
					borderParts.push(`border-color: ${borderColor} !important`)
					borderParts.push(`border-top-color: ${borderColor} !important`)
					borderParts.push(`border-right-color: ${borderColor} !important`)
					borderParts.push(`border-bottom-color: ${borderColor} !important`)
					borderParts.push(`border-left-color: ${borderColor} !important`)
				}
				if (borderWidth) {
					cellEl.style.setProperty('border-width', borderWidth, 'important')
					cellEl.style.setProperty('border-top-width', borderWidth, 'important')
					cellEl.style.setProperty('border-right-width', borderWidth, 'important')
					cellEl.style.setProperty('border-bottom-width', borderWidth, 'important')
					cellEl.style.setProperty('border-left-width', borderWidth, 'important')
					borderParts.push(`border-width: ${borderWidth} !important`)
					borderParts.push(`border-top-width: ${borderWidth} !important`)
					borderParts.push(`border-right-width: ${borderWidth} !important`)
					borderParts.push(`border-bottom-width: ${borderWidth} !important`)
					borderParts.push(`border-left-width: ${borderWidth} !important`)
				}
				
				// Combine with existing style and set attribute
				if (borderParts.length > 0) {
					cellStyle = cellStyle ? `${cellStyle}; ${borderParts.join('; ')}` : borderParts.join('; ')
				} else if (!borderStyle && !borderColor && !borderWidth) {
					cellStyle = cellStyle ? `${cellStyle}; border: none !important` : 'border: none !important'
				}
				cellEl.setAttribute('style', cellStyle)
				
				// Verify it was set (check first cell only for debug)
				if (index === 0) {
					const finalStyle = cellEl.getAttribute('style') || ''
					const computedBorderStyle = window.getComputedStyle(cellEl).borderStyle
					const computedBorderColor = window.getComputedStyle(cellEl).borderColor
					const computedBorderWidth = window.getComputedStyle(cellEl).borderWidth
					console.log('Cell border verification:', {
						originalStyle,
						finalStyle,
						computedBorderStyle,
						computedBorderColor,
						computedBorderWidth,
						hasBorderStyleInAttr: finalStyle.includes('border-style'),
						hasBorderColorInAttr: finalStyle.includes('border-color'),
						hasBorderWidthInAttr: finalStyle.includes('border-width')
					})
				}
				appliedCount++
			})
			
			// Debug log
			console.log('Applied border to cells:', { 
				borderStyle, 
				borderColor, 
				borderWidth, 
				cellsCount: cells.length,
				appliedCount,
				tableStyle: styleAttr
			})
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
							
							// Try to get border properties from form inputs
							const borderStyleInput = form.container?.querySelector?.('[data-property="border-style"] input, [data-property="border-style"] .ql-table-dropdown-properties') as HTMLElement
							const borderColorInput = form.container?.querySelector?.('[data-property="border-color"] input, [data-property="border-color"] .property-input') as HTMLInputElement
							const borderWidthInput = form.container?.querySelector?.('[data-property="border-width"] input, [data-property="border-width"] .property-input') as HTMLInputElement
							
							if (borderStyleInput) {
								// For dropdown, check selected value or text content
								const dropdownValue = borderStyleInput.getAttribute('data-value') || borderStyleInput.textContent?.trim() || ''
								if (dropdownValue) borderStyle = dropdownValue
							}
							if (borderColorInput) {
								borderColor = borderColorInput.value || borderColorInput.getAttribute('value') || ''
							}
							if (borderWidthInput) {
								borderWidth = borderWidthInput.value || borderWidthInput.getAttribute('value') || ''
							}
							
							console.log('Save table action: border properties from form:', { borderStyle, borderColor, borderWidth })
							
							// Call original save action
							originalSaveTableAction()
							
							// Apply border to cells after save - try multiple times with increasing delays
							const tryApply = (attempt: number) => {
								setTimeout(() => {
									const { table } = this.tableMenus
									if (table) {
										const tableStyle = table.getAttribute('style') || ''
										console.log(`Save table action (attempt ${attempt}): table style:`, tableStyle)
										applyBorderToCells(table as HTMLElement)
										// Try again if style doesn't seem updated yet or still has default values
										if (attempt < 5) {
											const hasDefaultBorder = tableStyle.includes('border-style: solid') && tableStyle.includes('#000000') && tableStyle.includes('border-width: 1px')
											if (hasDefaultBorder || !tableStyle.includes('border-style')) {
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
								
								// Try to get border properties from form inputs
								const formContainer = this.container || this.element
								const borderStyleInput = formContainer?.querySelector?.('[data-property="border-style"] input, [data-property="border-style"] .ql-table-dropdown-properties') as HTMLElement
								const borderColorInput = formContainer?.querySelector?.('[data-property="border-color"] input, [data-property="border-color"] .property-input') as HTMLInputElement
								const borderWidthInput = formContainer?.querySelector?.('[data-property="border-width"] input, [data-property="border-width"] .property-input') as HTMLInputElement
								
								if (borderStyleInput) {
									const dropdownValue = borderStyleInput.getAttribute('data-value') || borderStyleInput.textContent?.trim() || ''
									if (dropdownValue) borderStyle = dropdownValue
								}
								if (borderColorInput) {
									borderColor = borderColorInput.value || borderColorInput.getAttribute('value') || ''
								}
								if (borderWidthInput) {
									borderWidth = borderWidthInput.value || borderWidthInput.getAttribute('value') || ''
								}
								
								console.log('Save table action (from createForm): border properties from form:', { borderStyle, borderColor, borderWidth })
								
								originalSave()
								
								// Apply border to cells after save - try multiple times with increasing delays
								const tryApply = (attempt: number) => {
									setTimeout(() => {
										const { table } = this.tableMenus
										if (table) {
											const tableStyle = table.getAttribute('style') || ''
											console.log(`Save table action (from createForm, attempt ${attempt}): table style:`, tableStyle)
											applyBorderToCells(table as HTMLElement)
											// Try again if style doesn't seem updated yet or still has default values
											if (attempt < 5) {
												const hasDefaultBorder = tableStyle.includes('border-style: solid') && tableStyle.includes('#000000') && tableStyle.includes('border-width: 1px')
												if (hasDefaultBorder || !tableStyle.includes('border-style')) {
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
