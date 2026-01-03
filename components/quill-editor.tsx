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
			
			// Mark that border was applied from form values to prevent MutationObserver from resetting it
			table.setAttribute('data-border-applied-from-form', 'true')
			
			// CRITICAL: Create dynamic style element with highest specificity
			// This must be done BEFORE applying inline styles to ensure CSS rules are in place
			if (borderStyle && borderColor && borderWidth) {
				createDynamicStyleForTable(table, borderStyle, borderColor, borderWidth)
				// Force a small delay to ensure style element is processed by browser
				setTimeout(() => {
					// Verify style was created
					const tableId = table.getAttribute('data-table-id')
					const styleEl = document.getElementById(`dynamic-style-${tableId}`)
					if (styleEl) {
						console.log(`Dynamic style verified for table ${tableId} (from applyBorderToCellsWithValues)`)
					} else {
						console.error(`Dynamic style NOT found for table ${tableId} (from applyBorderToCellsWithValues)`)
					}
				}, 10)
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

		// Function to create or update dynamic style element for a specific table
		const createDynamicStyleForTable = (table: HTMLElement, borderStyle: string, borderColor: string, borderWidth: string) => {
			// Generate unique ID for this table if it doesn't have one
			let tableId = table.getAttribute('data-table-id')
			if (!tableId) {
				tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
				table.setAttribute('data-table-id', tableId)
			}
			
			// Remove existing style element for this table if it exists
			const existingStyle = document.getElementById(`dynamic-style-${tableId}`)
			if (existingStyle) {
				existingStyle.remove()
			}
			
			// Create new style element with specific CSS rules for this table
			if (borderStyle && borderColor && borderWidth) {
				const styleEl = document.createElement('style')
				styleEl.id = `dynamic-style-${tableId}`
				// Use maximum specificity to override quill.css
				// quill.css has: .ql-editor table, .ql-editor table * { border-color: #000 !important; }
				// quill.css also has: .ql-editor table td { border: 1px solid #000; }
				// We need higher specificity: html body .ql-editor table[data-table-id] td
				// Also need to override the universal selector rule
				styleEl.textContent = `
					/* Dynamic style for table ${tableId} - maximum specificity to override quill.css */
					/* CRITICAL: Set border-collapse and border-spacing on table to make borders visible */
					/* IMPORTANT: Remove border from table element itself - only cells should have borders */
					html body .ql-editor table[data-table-id="${tableId}"],
					html body .ql-editor .ql-table-better[data-table-id="${tableId}"] {
						border-collapse: collapse !important;
						border-spacing: 0 !important;
						/* Remove border from table element - only cells should have borders */
						border: none !important;
						border-style: none !important;
						border-width: 0 !important;
						border-color: transparent !important;
					}
					/* Override .ql-editor table, .ql-editor table * { border-color: #000 !important; } */
					/* But only apply border-color to cells, not table element */
					html body .ql-editor table[data-table-id="${tableId}"] td,
					html body .ql-editor table[data-table-id="${tableId}"] th,
					html body .ql-editor .ql-table-better[data-table-id="${tableId}"] td,
					html body .ql-editor .ql-table-better[data-table-id="${tableId}"] th {
						border-color: ${borderColor} !important;
					}
					/* Override .ql-editor table td { border: 1px solid #000; } */
					/* Also override Tailwind CSS: *, :after, :before { border: 0 solid #e5e7eb; } */
					/* CRITICAL: Override table-custom.css rule that sets border: none for cells without inline styles */
					/* Use maximum specificity: html body .ql-editor table[data-table-id] td[style] */
					html body .ql-editor table[data-table-id="${tableId}"] td,
					html body .ql-editor table[data-table-id="${tableId}"] td[style],
					html body .ql-editor .ql-table-better[data-table-id="${tableId}"] td,
					html body .ql-editor .ql-table-better[data-table-id="${tableId}"] td[style],
					html body .ql-editor table[data-table-id="${tableId}"] th,
					html body .ql-editor table[data-table-id="${tableId}"] th[style],
					html body .ql-editor .ql-table-better[data-table-id="${tableId}"] th,
					html body .ql-editor .ql-table-better[data-table-id="${tableId}"] th[style] {
						/* Override Tailwind's border: 0 by setting all border properties explicitly */
						/* Override table-custom.css border: none rule */
						/* CRITICAL: Ensure border is visible by setting all properties */
						/* Must override *, :after, :before { border: 0 solid #e5e7eb; } from Tailwind */
						border: ${borderWidth} ${borderStyle} ${borderColor} !important;
						border-style: ${borderStyle} !important;
						border-color: ${borderColor} !important;
						border-width: ${borderWidth} !important;
						border-top: ${borderWidth} ${borderStyle} ${borderColor} !important;
						border-top-style: ${borderStyle} !important;
						border-top-color: ${borderColor} !important;
						border-top-width: ${borderWidth} !important;
						border-right: ${borderWidth} ${borderStyle} ${borderColor} !important;
						border-right-style: ${borderStyle} !important;
						border-right-color: ${borderColor} !important;
						border-right-width: ${borderWidth} !important;
						border-bottom: ${borderWidth} ${borderStyle} ${borderColor} !important;
						border-bottom-style: ${borderStyle} !important;
						border-bottom-color: ${borderColor} !important;
						border-bottom-width: ${borderWidth} !important;
						border-left: ${borderWidth} ${borderStyle} ${borderColor} !important;
						border-left-style: ${borderStyle} !important;
						border-left-color: ${borderColor} !important;
						border-left-width: ${borderWidth} !important;
						/* Ensure border is not transparent or hidden */
						opacity: 1 !important;
						visibility: visible !important;
					}
				`
				// CRITICAL: Append to end of head to ensure it loads after Tailwind CSS
				// This ensures our styles have the highest priority
				document.head.appendChild(styleEl)
				
				// Force browser to recalculate styles
				// Access offsetHeight to trigger reflow
				const testEl = document.createElement('div')
				testEl.style.display = 'none'
				document.body.appendChild(testEl)
				const _ = testEl.offsetHeight
				document.body.removeChild(testEl)
				
				console.log(`Created dynamic style for table ${tableId}:`, { borderStyle, borderColor, borderWidth })
				// Log the actual CSS rule created
				console.log(`Dynamic style CSS:`, styleEl.textContent)
			}
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
			
			// CRITICAL: Create dynamic style element with highest specificity
			// This must be done BEFORE applying inline styles to ensure CSS rules are in place
			if (borderStyle && borderColor && borderWidth) {
				createDynamicStyleForTable(table, borderStyle, borderColor, borderWidth)
				// Force a small delay to ensure style element is processed by browser
				setTimeout(() => {
					// Verify style was created
					const tableId = table.getAttribute('data-table-id')
					const styleEl = document.getElementById(`dynamic-style-${tableId}`)
					if (styleEl) {
						console.log(`Dynamic style verified for table ${tableId}`)
					} else {
						console.error(`Dynamic style NOT found for table ${tableId}`)
					}
				}, 10)
			}
			
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
				// Use setAttribute to set inline style directly, which has highest specificity
				let newStyle = cellEl.getAttribute('style') || ''
				
				// Remove all border-related properties from style string
				newStyle = newStyle
					.replace(/border[^:;]*:\s*[^;!]+(!important)?;?/gi, '')
					.replace(/border-top[^:;]*:\s*[^;!]+(!important)?;?/gi, '')
					.replace(/border-right[^:;]*:\s*[^;!]+(!important)?;?/gi, '')
					.replace(/border-bottom[^:;]*:\s*[^;!]+(!important)?;?/gi, '')
					.replace(/border-left[^:;]*:\s*[^;!]+(!important)?;?/gi, '')
					.replace(/;\s*;/g, ';')
					.trim()
				
				// Build new border properties
				const borderProps: string[] = []
				
				if (borderStyle && borderStyle !== 'none') {
					borderProps.push(`border-style: ${borderStyle} !important`)
					borderProps.push(`border-top-style: ${borderStyle} !important`)
					borderProps.push(`border-right-style: ${borderStyle} !important`)
					borderProps.push(`border-bottom-style: ${borderStyle} !important`)
					borderProps.push(`border-left-style: ${borderStyle} !important`)
				} else if (borderStyle === 'none') {
					borderProps.push(`border-style: none !important`)
					borderProps.push(`border-top-style: none !important`)
					borderProps.push(`border-right-style: none !important`)
					borderProps.push(`border-bottom-style: none !important`)
					borderProps.push(`border-left-style: none !important`)
				}
				
				if (borderColor) {
					borderProps.push(`border-color: ${borderColor} !important`)
					borderProps.push(`border-top-color: ${borderColor} !important`)
					borderProps.push(`border-right-color: ${borderColor} !important`)
					borderProps.push(`border-bottom-color: ${borderColor} !important`)
					borderProps.push(`border-left-color: ${borderColor} !important`)
				}
				
				if (borderWidth) {
					borderProps.push(`border-width: ${borderWidth} !important`)
					borderProps.push(`border-top-width: ${borderWidth} !important`)
					borderProps.push(`border-right-width: ${borderWidth} !important`)
					borderProps.push(`border-bottom-width: ${borderWidth} !important`)
					borderProps.push(`border-left-width: ${borderWidth} !important`)
				}
				
				// Combine all styles
				if (borderProps.length > 0) {
					if (newStyle && !newStyle.endsWith(';')) {
						newStyle += '; '
					}
					newStyle += borderProps.join('; ')
				}
				
				// Set the complete style attribute
				cellEl.setAttribute('style', newStyle)
				
				// CRITICAL: Also set CSS custom properties on table to allow CSS to read values
				// This provides a fallback if inline styles don't work
				if (borderStyle && borderColor && borderWidth) {
					const table = cellEl.closest('table') as HTMLElement
					if (table) {
						table.style.setProperty('--cell-border-style', borderStyle)
						table.style.setProperty('--cell-border-color', borderColor)
						table.style.setProperty('--cell-border-width', borderWidth)
						// Also set data attributes as fallback
						table.setAttribute('data-cell-border-style', borderStyle)
						table.setAttribute('data-cell-border-color', borderColor)
						table.setAttribute('data-cell-border-width', borderWidth)
					}
				}
				
				// Also set via style object for immediate effect
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
				
				// CRITICAL: Force browser to recalculate styles by temporarily removing and re-adding style attribute
				// This ensures inline styles with !important override CSS rules from quill.css
				if (borderStyle && borderStyle !== 'none' && borderColor && borderWidth) {
					const currentStyle = cellEl.getAttribute('style')
					if (currentStyle) {
						// Temporarily remove style to force recalculation
						cellEl.removeAttribute('style')
						// Force reflow
						void cellEl.offsetHeight
						// Re-add style
						cellEl.setAttribute('style', currentStyle)
						// Force reflow again
						void cellEl.offsetHeight
					}
				}
				
				// Debug first cell
				if (index === 0) {
					const computed = window.getComputedStyle(cellEl)
					const styleAttr = cellEl.getAttribute('style') || ''
					const table = cellEl.closest('table') as HTMLElement
					const tableId = table?.getAttribute('data-table-id')
					const tableHasId = table?.hasAttribute('data-table-id')
					const dynamicStyleEl = tableId ? document.getElementById(`dynamic-style-${tableId}`) : null
					
					// Check if cell matches dynamic style selector
					const cellMatchesSelector = tableId && (
						cellEl.matches(`html body .ql-editor table[data-table-id="${tableId}"] td`) ||
						cellEl.matches(`html body .ql-editor table[data-table-id="${tableId}"] th`)
					)
					
					// Check parent chain
					const parentChain: string[] = []
					let current: HTMLElement | null = cellEl
					while (current && current !== document.body) {
						parentChain.push(`${current.tagName}${current.className ? '.' + current.className.split(' ').join('.') : ''}${current.id ? '#' + current.id : ''}`)
						current = current.parentElement
					}
					
					console.log('=== Cell 0 Debug Info ===')
					console.log('Style Attribute:', styleAttr)
					console.log('Inline Border Style:', cellEl.style.getPropertyValue('border-style'))
					console.log('Inline Border Color:', cellEl.style.getPropertyValue('border-color'))
					console.log('Inline Border Width:', cellEl.style.getPropertyValue('border-width'))
					console.log('Computed Border Style:', computed.borderStyle)
					console.log('Computed Border Color:', computed.borderColor)
					console.log('Computed Border Width:', computed.borderWidth)
					console.log('Computed Border Top:', computed.borderTop)
					console.log('Computed Border Right:', computed.borderRight)
					console.log('Computed Border Bottom:', computed.borderBottom)
					console.log('Computed Border Left:', computed.borderLeft)
					console.log('Expected Style:', borderStyle)
					console.log('Expected Color:', borderColor)
					console.log('Expected Width:', borderWidth)
					console.log('Table ID:', tableId)
					console.log('Table Has ID:', tableHasId)
					console.log('Dynamic Style Exists:', !!dynamicStyleEl)
					console.log('Cell Matches Selector:', cellMatchesSelector)
					console.log('Parent Chain:', parentChain.join(' > '))
					console.log('Table Classes:', table?.className)
					console.log('Table Attributes:', table ? Array.from(table.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', ') : 'no table')
					console.log('========================')
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
								console.log('Found borderWidthInput:', { value: borderWidthInput.value, attribute: borderWidthInput.getAttribute('value'), final: borderWidth })
							} else {
								console.warn('borderWidthInput not found')
							}
							
							console.log('Save table action: border properties from form:', { borderStyle, borderColor, borderWidth })
							console.log('Form container:', form.container)
							console.log('All inputs in form:', form.container?.querySelectorAll('input, select'))
							
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
			// Listen for ALL clicks to debug
			document.addEventListener('click', (e) => {
				const target = e.target as HTMLElement
				console.log('Click detected on:', target.tagName, target.className, target.textContent?.substring(0, 50))
				
				// Try multiple selectors to find save button
				let saveButton = target.closest('button[label="save"], button[data-label="save"], button[aria-label*="save" i], button[title*="save" i], button[title*="Save" i]')
				// Also check if button text contains "save"
				if (!saveButton && target.tagName === 'BUTTON') {
					const buttonText = target.textContent?.toLowerCase() || ''
					const buttonLabel = target.getAttribute('label')?.toLowerCase() || ''
					const buttonAriaLabel = target.getAttribute('aria-label')?.toLowerCase() || ''
					if (buttonText.includes('save') || buttonLabel.includes('save') || buttonAriaLabel.includes('save')) {
						saveButton = target
					}
				}
				// Also check parent button
				if (!saveButton) {
					const parentButton = target.closest('button')
					if (parentButton) {
						const parentText = parentButton.textContent?.toLowerCase() || ''
						const parentLabel = parentButton.getAttribute('label')?.toLowerCase() || ''
						const parentAriaLabel = parentButton.getAttribute('aria-label')?.toLowerCase() || ''
						if (parentText.includes('save') || parentLabel.includes('save') || parentAriaLabel.includes('save')) {
							saveButton = parentButton
						}
					}
				}
				
				if (saveButton) {
					console.log('Save button clicked, reading form values...', saveButton)
					
					// Find form container from save button - traverse up the DOM tree
					let formContainer: HTMLElement | null = null
					let current: HTMLElement | null = saveButton as HTMLElement
					
					// Traverse up to find form container
					while (current && !formContainer) {
						// Check if current element is a form container
						if (current.classList.contains('ql-table-properties-form') || 
							current.classList.contains('ql-table-dialog') ||
							current.classList.contains('ql-table-form') ||
							current.querySelector('[data-property="border-style"]') ||
							current.querySelector('[data-property="border-color"]') ||
							current.querySelector('[data-property="border-width"]')) {
							formContainer = current
							break
						}
						current = current.parentElement
					}
					
					// If not found, try document query
					if (!formContainer) {
						formContainer = document.querySelector('.ql-table-properties-form, .ql-table-dialog, [class*="table-properties"], [class*="table-form"], [class*="ql-table-dialog"]') as HTMLElement
					}
					
					console.log('Form container found:', !!formContainer, formContainer)
					if (formContainer) {
						console.log('Form container classes:', formContainer.className)
						console.log('Form container HTML (first 2000 chars):', formContainer.innerHTML?.substring(0, 2000))
					}
					
					let borderStyle = ''
					let borderColor = ''
					let borderWidth = ''
					
					// Search in entire document if formContainer not found
					const searchRoot = formContainer || document
					
					// Try to get border style - FIRST check the dropdown text element (most reliable)
					// Look specifically in the form container for "Cell properties" form
					if (formContainer) {
						// Try direct query in form container first
						const directDropdownText = formContainer.querySelector('.ql-table-dropdown-text') as HTMLElement
						if (directDropdownText) {
							borderStyle = directDropdownText.textContent?.trim().toLowerCase() || ''
							console.log('borderStyle from direct query in formContainer:', borderStyle)
						}
						
						// If not found, try finding dropdown-properties in form container
						if (!borderStyle) {
							const borderStyleDropdown = formContainer.querySelector('.ql-table-dropdown-properties') as HTMLElement
							console.log('borderStyleDropdown found in formContainer:', !!borderStyleDropdown, borderStyleDropdown)
							if (borderStyleDropdown) {
								const dropdownText = borderStyleDropdown.querySelector('.ql-table-dropdown-text') as HTMLElement
								console.log('dropdownText found:', !!dropdownText, dropdownText?.textContent)
								if (dropdownText) {
									borderStyle = dropdownText.textContent?.trim().toLowerCase() || ''
									console.log('borderStyle from dropdownText:', borderStyle)
								}
							}
						}
					}
					
					// If still not found, try in searchRoot
					if (!borderStyle) {
						const borderStyleDropdown = searchRoot.querySelector('.ql-table-dropdown-properties') as HTMLElement
						console.log('borderStyleDropdown found in searchRoot:', !!borderStyleDropdown, borderStyleDropdown)
						if (borderStyleDropdown) {
							const dropdownText = borderStyleDropdown.querySelector('.ql-table-dropdown-text') as HTMLElement
							if (dropdownText) {
								borderStyle = dropdownText.textContent?.trim().toLowerCase() || ''
								console.log('borderStyle from searchRoot:', borderStyle)
							}
						}
					}
					
					// If not found, look for selected LI element with ql-table-dropdown-selected class
					if (!borderStyle) {
						const allLis = searchRoot.querySelectorAll('li')
						console.log('Found LI elements:', allLis.length)
						allLis.forEach((li, idx) => {
							const text = li.textContent?.trim().toLowerCase() || ''
							const validStyles = ['inset', 'solid', 'dashed', 'dotted', 'double', 'groove', 'none', 'outset', 'ridge']
							if (validStyles.includes(text)) {
								console.log(`LI ${idx} with border style text:`, text, li.className, li.classList.contains('ql-table-dropdown-selected'))
								if (li.classList.contains('ql-table-dropdown-selected') || li.classList.contains('ql-selected') || li.getAttribute('data-selected') === 'true') {
									borderStyle = text
									console.log('Found selected border style:', borderStyle)
								}
							}
						})
					}
					
					// Try to get border color - FIRST check the color-button element (most reliable)
					const colorButton = searchRoot.querySelector('.color-button') as HTMLElement
					if (colorButton) {
						const bgColor = colorButton.style.backgroundColor || window.getComputedStyle(colorButton).backgroundColor || ''
						if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
							borderColor = bgColor
							console.log('borderColor from color-button:', borderColor)
						}
					}
					
					// If not found, try input approach
					if (!borderColor) {
						const borderColorInput = searchRoot.querySelector('[data-property="border-color"] input, [data-property="border-color"] .property-input, [data-property="border-color"] input[type="color"], [data-property="border-color"] input[type="text"]') as HTMLInputElement
						console.log('borderColorInput found:', !!borderColorInput, borderColorInput)
						if (borderColorInput) {
							borderColor = borderColorInput.value || borderColorInput.getAttribute('value') || ''
							console.log('borderColor from input:', borderColor)
						}
					}
					
					// If still not found, look for color elements with red/rgb values
					if (!borderColor) {
						const colorElements = searchRoot.querySelectorAll('[data-property="border-color"], [class*="color-button"], [style*="background-color"]')
						console.log('Found color elements:', colorElements.length)
						colorElements.forEach((el, idx) => {
							if (idx < 5) {
								const text = (el as HTMLElement).textContent?.trim() || ''
								const bgColor = (el as HTMLElement).style.backgroundColor || window.getComputedStyle(el as HTMLElement).backgroundColor || ''
								const dataColor = el.getAttribute('data-color') || ''
								console.log(`Color element ${idx}:`, text, bgColor, dataColor, el.className)
								if (bgColor && (bgColor.toLowerCase().includes('rgb(255') || bgColor.toLowerCase().includes('#ff') || bgColor.toLowerCase().includes('red'))) {
									borderColor = bgColor || dataColor || text
									console.log('Found border color:', borderColor)
								}
							}
						})
					}
					
					// Try to get border width - FIRST look for input in border width field specifically
					const borderWidthInput = searchRoot.querySelector('[data-property="border-width"] input, [data-property="border-width"] .property-input, [data-property="border-width"] input[type="text"], [data-property="border-width"] input[type="number"]') as HTMLInputElement
					console.log('borderWidthInput found:', !!borderWidthInput, borderWidthInput)
					if (borderWidthInput) {
						borderWidth = borderWidthInput.value || borderWidthInput.getAttribute('value') || ''
						if (borderWidth && !borderWidth.includes('px')) {
							borderWidth = borderWidth + 'px'
						}
						console.log('borderWidth from specific input:', borderWidth)
					}
					
					// If not found, look for input with "width" label in Cell properties form
					// IMPORTANT: Only look in "Cell properties" form, not "Table properties" form
					if (!borderWidth && formContainer) {
						// Check if this is "Cell properties" form by checking the header
						const formHeader = formContainer.querySelector('.properties-form-header')?.textContent?.toLowerCase() || ''
						const isCellPropertiesForm = formHeader.includes('cell')
						
						if (isCellPropertiesForm) {
							// Look for input with label containing "width" in Cell properties form
							// Find the "Border" row first, then look for width input in that row
							const allRows = formContainer.querySelectorAll('.properties-form-row')
							let borderRow: HTMLElement | null = null
							// Find the row that contains "Border" label
							for (let i = 0; i < allRows.length; i++) {
								const row = allRows[i] as HTMLElement
								const borderLabel = row.querySelector('.ql-table-dropdown-label')
								if (borderLabel && borderLabel.textContent?.toLowerCase().includes('border')) {
									borderRow = row
									break
								}
							}
							
							if (borderRow) {
								// Look for input with label "width" in the same row or in the next row
								// First try in the same row
								let widthInput = borderRow.querySelector('input.property-input, input[type="text"], input[type="number"]') as HTMLInputElement
								// If not found, try in the next row (width might be in a separate row)
								if (!widthInput || !widthInput.value) {
									const rowIndex = Array.from(allRows).indexOf(borderRow)
									if (rowIndex < allRows.length - 1) {
										const nextRow = allRows[rowIndex + 1] as HTMLElement
										widthInput = nextRow.querySelector('input.property-input, input[type="text"], input[type="number"]') as HTMLInputElement
									}
								}
								
								if (widthInput && widthInput.value) {
									const value = widthInput.value || ''
									// Check if this input has a label with "width"
									let current: HTMLElement | null = widthInput.parentElement
									let foundWidthLabel = false
									while (current && current !== formContainer) {
										const label = current.querySelector('label')?.textContent?.toLowerCase() || ''
										if (label.includes('width')) {
											foundWidthLabel = true
											break
										}
										current = current.parentElement
									}
									
									if (foundWidthLabel && value && (value.includes('px') || !isNaN(parseFloat(value)))) {
										borderWidth = value
										if (borderWidth && !borderWidth.includes('px') && !isNaN(parseFloat(borderWidth))) {
											borderWidth = borderWidth + 'px'
										}
										console.log('Found border width from Cell properties form border row:', borderWidth)
									}
								}
							}
							
							// If still not found, look through all inputs but stop at first match
							if (!borderWidth) {
								const allInputs = formContainer.querySelectorAll('.property-input, input[type="text"], input[type="number"]')
								console.log('Found input elements in Cell properties form:', allInputs.length)
								for (let idx = 0; idx < allInputs.length; idx++) {
									const input = allInputs[idx] as HTMLInputElement
									const value = input.value || ''
									// Traverse up to find the label
									let current: HTMLElement | null = input.parentElement
									let foundWidthLabel = false
									while (current && current !== formContainer) {
										const label = current.querySelector('label')?.textContent?.toLowerCase() || ''
										if (label.includes('width')) {
											foundWidthLabel = true
											break
										}
										current = current.parentElement
									}
									
									if (foundWidthLabel && value && (value.includes('px') || !isNaN(parseFloat(value)))) {
										borderWidth = value
										if (borderWidth && !borderWidth.includes('px') && !isNaN(parseFloat(borderWidth))) {
											borderWidth = borderWidth + 'px'
										}
										console.log(`Found border width from Cell properties form (input ${idx}):`, borderWidth)
										break // CRITICAL: Stop immediately after finding first match
									}
								}
							}
						}
					}
					
					// Normalize empty strings to undefined
					const normalizedBorderStyle = borderStyle && borderStyle.trim() ? borderStyle.trim() : undefined
					const normalizedBorderColor = borderColor && borderColor.trim() ? borderColor.trim() : undefined
					const normalizedBorderWidth = borderWidth && borderWidth.trim() ? borderWidth.trim() : undefined
					
					console.log('Form values read from save button click:', { borderStyle: normalizedBorderStyle, borderColor: normalizedBorderColor, borderWidth: normalizedBorderWidth })
					
					// Wait a bit for save action to complete, then apply border
					setTimeout(() => {
						const tables = quill.root.querySelectorAll('table')
						tables.forEach((table) => {
							if (normalizedBorderStyle || normalizedBorderColor || normalizedBorderWidth) {
								console.log('Applying border from form values:', { borderStyle: normalizedBorderStyle, borderColor: normalizedBorderColor, borderWidth: normalizedBorderWidth })
								applyBorderToCellsWithValues(table as HTMLElement, normalizedBorderStyle, normalizedBorderColor, normalizedBorderWidth)
							} else {
								console.log('No form values, reading from table')
								applyBorderToCells(table as HTMLElement)
							}
						})
					}, 300)
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
							console.log('saveTableAction called (patch 1)')
							console.log('Form container:', form.container)
							console.log('Form container HTML:', form.container?.innerHTML?.substring(0, 500))
							
							// Get border properties from form inputs BEFORE saving
							let borderStyle = ''
							let borderColor = ''
							let borderWidth = ''
							
							// Try multiple selectors to find border style dropdown
							const borderStyleDropdown = form.container?.querySelector?.('.ql-table-dropdown-properties[data-property="border-style"], [data-property="border-style"] .ql-table-dropdown-properties, [data-property="border-style"], .ql-table-dropdown-properties[data-property="border-style"]') as HTMLElement
							console.log('borderStyleDropdown found:', !!borderStyleDropdown, borderStyleDropdown)
							if (borderStyleDropdown) {
								const selectedItem = borderStyleDropdown.querySelector('.ql-table-dropdown-list li.ql-selected, .ql-table-dropdown-list li[data-selected="true"], .ql-selected') as HTMLElement
								console.log('selectedItem found:', !!selectedItem, selectedItem)
								if (selectedItem) {
									borderStyle = selectedItem.getAttribute('data-value') || selectedItem.textContent?.trim() || ''
									console.log('borderStyle from selectedItem:', borderStyle)
								} else {
									const dropdownText = borderStyleDropdown.querySelector('.ql-table-dropdown-text, .dropdown-text') as HTMLElement
									console.log('dropdownText found:', !!dropdownText, dropdownText)
									if (dropdownText) {
										borderStyle = dropdownText.textContent?.trim() || ''
										console.log('borderStyle from dropdownText:', borderStyle)
									}
								}
							} else {
								console.warn('borderStyleDropdown not found, trying alternative selectors')
								// Try alternative selectors
								const altDropdown = form.container?.querySelector?.('[data-property="border-style"]') as HTMLElement
								if (altDropdown) {
									console.log('Found altDropdown:', altDropdown)
									borderStyle = altDropdown.textContent?.trim() || altDropdown.getAttribute('data-value') || ''
								}
							}
							
							// Try to get border color from color input
							const borderColorInput = form.container?.querySelector?.('[data-property="border-color"] .property-input, .ql-table-color-container[data-property="border-color"] .property-input, [data-property="border-color"] input[type="color"], [data-property="border-color"] input') as HTMLInputElement
							console.log('borderColorInput found:', !!borderColorInput, borderColorInput)
							if (borderColorInput) {
								borderColor = borderColorInput.value || borderColorInput.getAttribute('value') || ''
								console.log('borderColor from input:', borderColor)
								if (!borderColor) {
									const colorButton = form.container?.querySelector?.('[data-property="border-color"] .color-button, [data-property="border-color"] button') as HTMLElement
									console.log('colorButton found:', !!colorButton, colorButton)
									if (colorButton) {
										borderColor = colorButton.getAttribute('data-color') || colorButton.style.backgroundColor || colorButton.getAttribute('style')?.match(/background-color:\s*([^;]+)/)?.[1] || ''
										console.log('borderColor from colorButton:', borderColor)
									}
								}
							} else {
								console.warn('borderColorInput not found')
							}
							
							// Try to get border width from width input
							const borderWidthInput = form.container?.querySelector?.('[data-property="border-width"] .property-input, .label-field-view[data-property="border-width"] .property-input, [data-property="border-width"] input') as HTMLInputElement
							console.log('borderWidthInput found:', !!borderWidthInput, borderWidthInput)
							if (borderWidthInput) {
								borderWidth = borderWidthInput.value || borderWidthInput.getAttribute('value') || ''
								console.log('borderWidth from input:', borderWidth)
							} else {
								console.warn('borderWidthInput not found')
							}
							
							console.log('Save table action (patch 1): border properties from form:', { borderStyle, borderColor, borderWidth })
							
							// Call original save action
							originalSaveTableAction()
							
							// Apply border to cells using form values directly
							const tryApply = (attempt: number) => {
								setTimeout(() => {
									const { table } = this.tableMenus
									if (table) {
										if (borderStyle || borderColor || borderWidth) {
											console.log(`Save table action (patch 1, attempt ${attempt}): applying border from form values:`, { borderStyle, borderColor, borderWidth })
											applyBorderToCellsWithValues(table as HTMLElement, borderStyle || undefined, borderColor || undefined, borderWidth || undefined)
										} else {
											console.log(`Save table action (patch 1, attempt ${attempt}): no form values, reading from table`)
											applyBorderToCells(table as HTMLElement)
										}
										if (attempt < 3) {
											tryApply(attempt + 1)
										}
									}
								}, attempt * 100)
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
								console.log('saveTableAction called (patch 2)')
								// Get border properties from form inputs BEFORE saving
								let borderStyle = ''
								let borderColor = ''
								let borderWidth = ''
								
								const formContainer = this.container || this.element
								const borderStyleDropdown = formContainer?.querySelector?.('.ql-table-dropdown-properties[data-property="border-style"], [data-property="border-style"] .ql-table-dropdown-properties') as HTMLElement
								if (borderStyleDropdown) {
									const selectedItem = borderStyleDropdown.querySelector('.ql-table-dropdown-list li.ql-selected, .ql-table-dropdown-list li[data-selected="true"]') as HTMLElement
									if (selectedItem) {
										borderStyle = selectedItem.getAttribute('data-value') || selectedItem.textContent?.trim() || ''
									} else {
										const dropdownText = borderStyleDropdown.querySelector('.ql-table-dropdown-text') as HTMLElement
										if (dropdownText) {
											borderStyle = dropdownText.textContent?.trim() || ''
										}
									}
								}
								
								const borderColorInput = formContainer?.querySelector?.('[data-property="border-color"] .property-input, .ql-table-color-container[data-property="border-color"] .property-input') as HTMLInputElement
								if (borderColorInput) {
									borderColor = borderColorInput.value || borderColorInput.getAttribute('value') || ''
									if (!borderColor) {
										const colorButton = formContainer?.querySelector?.('[data-property="border-color"] .color-button') as HTMLElement
										if (colorButton) {
											borderColor = colorButton.getAttribute('data-color') || colorButton.style.backgroundColor || ''
										}
									}
								}
								
								const borderWidthInput = formContainer?.querySelector?.('[data-property="border-width"] .property-input, .label-field-view[data-property="border-width"] .property-input') as HTMLInputElement
								if (borderWidthInput) {
									borderWidth = borderWidthInput.value || borderWidthInput.getAttribute('value') || ''
								}
								
								console.log('Save table action (patch 2): border properties from form:', { borderStyle, borderColor, borderWidth })
								
								originalSave()
								
								// Apply border to cells using form values directly
								const tryApply = (attempt: number) => {
									setTimeout(() => {
										const { table } = this.tableMenus
										if (table) {
											if (borderStyle || borderColor || borderWidth) {
												console.log(`Save table action (patch 2, attempt ${attempt}): applying border from form values:`, { borderStyle, borderColor, borderWidth })
												applyBorderToCellsWithValues(table as HTMLElement, borderStyle || undefined, borderColor || undefined, borderWidth || undefined)
											} else {
												console.log(`Save table action (patch 2, attempt ${attempt}): no form values, reading from table`)
												applyBorderToCells(table as HTMLElement)
											}
											if (attempt < 3) {
												tryApply(attempt + 1)
											}
										}
									}, attempt * 100)
								}
								tryApply(1)
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
						// CRITICAL: Don't reset border if it was applied from form values
						if (target.getAttribute('data-border-applied-from-form') === 'true') {
							console.log('MutationObserver: Skipping applyBorderToCells - border was applied from form values')
							return
						}
						
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
