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

		// Control toolbar visibility: only show when cell is selected
		const handleSelectionChange = (e?: Event) => {
			// If event target is inside properties popup, completely skip toolbar logic
			if (e && e.target) {
				const target = e.target as HTMLElement
				if (target.closest('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')) {
					return // Don't interfere at all when clicking inside popup
				}
			}

			setTimeout(() => {
				// IMPORTANT: Always check for properties popup FIRST and do NOT interfere with it
				const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
				if (propertiesPopup) {
					// Ensure popup is visible - multiple times to override any other styles
					const popup = propertiesPopup as HTMLElement
					popup.style.setProperty('display', 'block', 'important')
					popup.style.setProperty('visibility', 'visible', 'important')
					popup.style.setProperty('opacity', '1', 'important')
					popup.style.setProperty('z-index', '10001', 'important')
					popup.style.setProperty('position', 'absolute', 'important')
					// Remove any display:none that might have been set
					popup.style.removeProperty('display')
					popup.style.setProperty('display', 'block', 'important')
					return // Don't interfere with toolbar when popup is open
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
					// Check if entire table is selected (not just a cell)
					// If table is selected, don't show toolbar
					const selectedCells = tableElement.querySelectorAll('td.selected, th.selected, td.active, th.active')
					if (selectedCells.length > 1) {
						// Multiple cells selected - might be table selection
						hideTableToolbar()
						return
					}
					
					// Single cell is selected - show toolbar
					showTableToolbar()
				} else {
					// Not in a cell - hide toolbar
					hideTableToolbar()
				}
			}, 200)
		}

		const hideTableToolbar = () => {
			// Only target the menu toolbar, NOT properties popups
			const menus = document.querySelectorAll('.ql-table-better-menu')
			menus.forEach((menu: any) => {
				// Double check - make absolutely sure this is NOT a properties popup
				if (menu && 
					!menu.classList.contains('ql-table-better-properties') &&
					!menu.classList.contains('ql-table-better-cell-properties') &&
					!menu.classList.contains('ql-table-better-table-properties') &&
					!menu.closest('.ql-table-better-properties') &&
					!menu.closest('.ql-table-better-cell-properties') &&
					!menu.closest('.ql-table-better-table-properties')) {
					// Use setProperty with important to override CSS
					menu.style.setProperty('display', 'none', 'important')
				}
			})
		}

		const showTableToolbar = () => {
			// Only target the menu toolbar, NOT properties popups
			const menus = document.querySelectorAll('.ql-table-better-menu')
			menus.forEach((menu: any) => {
				// Double check - make absolutely sure this is NOT a properties popup
				if (menu && 
					!menu.classList.contains('ql-table-better-properties') &&
					!menu.classList.contains('ql-table-better-cell-properties') &&
					!menu.classList.contains('ql-table-better-table-properties') &&
					!menu.closest('.ql-table-better-properties') &&
					!menu.closest('.ql-table-better-cell-properties') &&
					!menu.closest('.ql-table-better-table-properties')) {
					// Use setProperty with important to override CSS
					menu.style.setProperty('display', 'flex', 'important')
					menu.style.setProperty('visibility', 'visible', 'important')
					menu.style.setProperty('opacity', '1', 'important')
				}
			})
		}

		// Apply label styles for cell properties popup
		const applyLabelStyles = () => {
			const cellPropertiesPopup = document.querySelector('.ql-table-better-cell-properties')
			if (!cellPropertiesPopup) return

			// Debug: Log the structure
			console.log('Cell properties popup found:', cellPropertiesPopup)

			// Find all labels with target text
			const allLabels = cellPropertiesPopup.querySelectorAll('label')
			console.log('Found labels:', allLabels.length)
			
			allLabels.forEach((label: any, index: number) => {
				const labelText = (label.textContent || '').trim().toLowerCase()
				const isTargetLabel = ['color', 'width', 'height', 'padding'].includes(labelText)
				
				if (!isTargetLabel) return
				
				console.log(`Processing label "${labelText}" at index ${index}`)
				
				// Find the input associated with this label
				// Try multiple strategies
				let input: HTMLElement | null = null
				let container: HTMLElement | null = null
				
				// Strategy 1: Label has 'for' attribute
				if (label.hasAttribute('for')) {
					const inputId = label.getAttribute('for')
					input = document.getElementById(inputId || '') as HTMLElement
					if (input) {
						container = input.parentElement as HTMLElement
					}
				}
				
				// Strategy 2: Input is next sibling
				if (!input) {
					let next = label.nextElementSibling
					while (next) {
						if (next.tagName === 'INPUT' || next.querySelector('input')) {
							input = (next.tagName === 'INPUT' ? next : next.querySelector('input')) as HTMLElement
							container = label.parentElement as HTMLElement
							break
						}
						next = next.nextElementSibling
					}
				}
				
				// Strategy 3: Input is in parent container
				if (!input) {
					let parent = label.parentElement
					while (parent && parent !== cellPropertiesPopup) {
						input = parent.querySelector('input[type="text"], input[type="color"]') as HTMLElement
						if (input && parent.contains(label)) {
							container = parent as HTMLElement
							break
						}
						parent = parent.parentElement
					}
				}
				
				// Strategy 4: Find input near label by traversing DOM
				if (!input) {
					// Look for any input in a nearby container
					let current: Element | null = label.parentElement
					let level = 0
					while (current && level < 3) {
						const inputs = current.querySelectorAll('input[type="text"], input[type="color"]')
						if (inputs.length > 0) {
							// Find the closest input
							for (let i = 0; i < inputs.length; i++) {
								const inp = inputs[i] as HTMLElement
								if (current.contains(label) && current.contains(inp)) {
									input = inp
									container = current as HTMLElement
									break
								}
							}
							if (input) break
						}
						current = current.parentElement
						level++
					}
				}
				
				if (input && container) {
					console.log(`Found input and container for label "${labelText}"`)
					
					// Ensure container uses flexbox column layout
					container.style.setProperty('display', 'flex', 'important')
					container.style.setProperty('flex-direction', 'column', 'important')
					container.style.setProperty('gap', '4px', 'important')
					container.style.setProperty('align-items', 'flex-start', 'important')
					
					// Move label before input in DOM to ensure visual order
					if (container.contains(input) && container.contains(label)) {
						// Check if label comes after input
						const labelPosition = Array.from(container.children).indexOf(label)
						const inputPosition = Array.from(container.children).indexOf(input)
						
						if (inputPosition < labelPosition) {
							// Input comes before label, move label before input
							container.insertBefore(label, input)
							console.log(`Moved label "${labelText}" before input`)
						}
					}
					
					// Apply comprehensive styles to label
					label.style.setProperty('display', 'block', 'important')
					label.style.setProperty('margin-bottom', '4px', 'important')
					label.style.setProperty('margin-top', '0', 'important')
					label.style.setProperty('margin-left', '0', 'important')
					label.style.setProperty('margin-right', '0', 'important')
					label.style.setProperty('border', '1px solid #e0e0e0', 'important')
					label.style.setProperty('padding', '3px 6px', 'important')
					label.style.setProperty('border-radius', '3px', 'important')
					label.style.setProperty('background', '#f9f9f9', 'important')
					label.style.setProperty('width', 'fit-content', 'important')
					label.style.setProperty('min-width', 'fit-content', 'important')
					label.style.setProperty('max-width', 'fit-content', 'important')
					label.style.setProperty('font-size', '12px', 'important')
					label.style.setProperty('color', '#666', 'important')
					label.style.setProperty('order', '-1', 'important')
					label.style.setProperty('box-sizing', 'border-box', 'important')
					label.style.setProperty('position', 'relative', 'important')
					label.style.setProperty('z-index', '1', 'important')
					
					// Ensure input appears below
					input.style.setProperty('order', '1', 'important')
					input.style.setProperty('margin-top', '0', 'important')
				} else {
					console.log(`Could not find input for label "${labelText}"`)
				}
			})
		}

		// Ensure properties popup is always visible when it exists
		const ensurePropertiesVisible = () => {
			const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
			if (propertiesPopup) {
				const popup = propertiesPopup as HTMLElement
				
				// Remove all inline styles that might hide it
				popup.style.removeProperty('display')
				popup.style.removeProperty('visibility')
				popup.style.removeProperty('opacity')
				popup.style.removeProperty('height')
				popup.style.removeProperty('width')
				popup.style.removeProperty('max-height')
				popup.style.removeProperty('max-width')
				popup.style.removeProperty('overflow')
				
				// Force visibility with highest priority
				popup.style.setProperty('display', 'block', 'important')
				popup.style.setProperty('visibility', 'visible', 'important')
				popup.style.setProperty('opacity', '1', 'important')
				popup.style.setProperty('z-index', '10001', 'important')
				popup.style.setProperty('position', 'absolute', 'important')
				popup.style.setProperty('pointer-events', 'auto', 'important')
				
				// Remove any classes that might hide it
				popup.classList.remove('hidden', 'hide', 'closed')
				popup.classList.add('visible', 'open', 'active')
				
				// Also check for any parent that might be hiding it
				let parent = popup.parentElement
				while (parent && parent !== document.body) {
					const parentEl = parent as HTMLElement
					if (parentEl.style && parentEl.style.display === 'none') {
						parentEl.style.setProperty('display', 'block', 'important')
					}
					if (parentEl.style && parentEl.style.visibility === 'hidden') {
						parentEl.style.setProperty('visibility', 'visible', 'important')
					}
					parent = parent.parentElement
				}
				
				// Apply label styles for cell properties
				if (propertiesPopup.classList.contains('ql-table-better-cell-properties')) {
					setTimeout(() => applyLabelStyles(), 50)
					setTimeout(() => applyLabelStyles(), 150)
					setTimeout(() => applyLabelStyles(), 300)
				}
				
				return true // Popup exists and was made visible
			}
			return false // No popup found
		}
		
		// Continuously monitor and force show popup - aggressive approach
		let popupCheckInterval: any = null
		const startPopupMonitoring = () => {
			if (popupCheckInterval) return // Already monitoring
			
			popupCheckInterval = window.setInterval(() => {
				const popup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
				if (popup) {
					ensurePropertiesVisible()
				}
			}, 50) // Check every 50ms
		}
		
		const stopPopupMonitoring = () => {
			if (popupCheckInterval) {
				window.clearInterval(popupCheckInterval)
				popupCheckInterval = null
			}
		}

		// Monitor for properties popup appearance - with higher frequency
		const observer = new MutationObserver((mutations) => {
			// Check if any added node is a properties popup
			let popupAdded = false
			mutations.forEach(mutation => {
				mutation.addedNodes.forEach(node => {
					if (node.nodeType === 1) {
						const el = node as HTMLElement
						if (el.classList?.contains('ql-table-better-properties') ||
							el.classList?.contains('ql-table-better-cell-properties') ||
							el.classList?.contains('ql-table-better-table-properties') ||
							el.querySelector?.('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')) {
							popupAdded = true
							// Immediately ensure visibility when popup is added
							setTimeout(() => ensurePropertiesVisible(), 0)
						}
					}
				})
				
				// Also check for style changes that might hide popup
				if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
					const target = mutation.target as HTMLElement
					if (target.classList?.contains('ql-table-better-properties') ||
						target.classList?.contains('ql-table-better-cell-properties') ||
						target.classList?.contains('ql-table-better-table-properties')) {
						ensurePropertiesVisible()
					}
				}
			})
			
			if (popupAdded) {
				// Popup was just added, ensure it's visible immediately with multiple attempts
				setTimeout(() => ensurePropertiesVisible(), 0)
				setTimeout(() => ensurePropertiesVisible(), 10)
				setTimeout(() => ensurePropertiesVisible(), 50)
				setTimeout(() => ensurePropertiesVisible(), 100)
			}
			
			// Always check and ensure visibility
			ensurePropertiesVisible()
			
			// Apply label styles when DOM changes
			setTimeout(() => applyLabelStyles(), 10)
			setTimeout(() => applyLabelStyles(), 50)
			setTimeout(() => applyLabelStyles(), 100)
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style', 'display', 'visibility']
		})
		
		// Listen for click events - especially on buttons that open popups
		document.addEventListener('click', (e) => {
			const target = e.target as HTMLElement
			
			// Check if click is on a button that might open properties popup
			const menuButton = target.closest('.ql-table-better-menu button')
			if (menuButton) {
				// Button in menu was clicked - start aggressive monitoring
				startPopupMonitoring()
				
				// Wait for popup to appear with multiple attempts
				for (let i = 0; i < 20; i++) {
					setTimeout(() => {
						if (ensurePropertiesVisible()) {
							// Popup found and made visible
						}
					}, i * 50) // Every 50ms for 1 second
				}
			}
			
			// If clicking inside popup, ensure it stays visible
			if (target.closest('.ql-table-better-cell-properties, .ql-table-better-table-properties, .ql-table-better-properties')) {
				startPopupMonitoring()
				ensurePropertiesVisible()
				setTimeout(() => applyLabelStyles(), 50)
				setTimeout(() => applyLabelStyles(), 150)
			} else {
				// Clicked outside popup - check if popup should close
				setTimeout(() => {
					const popup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
					if (!popup) {
						stopPopupMonitoring()
					}
				}, 1000)
			}
		}, true)
		
		// Also listen with capture phase to catch events early
		document.addEventListener('mousedown', (e) => {
			const target = e.target as HTMLElement
			const menuButton = target.closest('.ql-table-better-menu button')
			if (menuButton) {
				// Prevent any immediate hiding
				e.stopPropagation()
				// Start monitoring immediately
				startPopupMonitoring()
			}
		}, true)

		// Listen for selection changes - but skip if popup is open
		quill.on('selection-change', (range, oldRange, source) => {
			// Skip if properties popup is currently visible
			const propertiesPopup = document.querySelector('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')
			if (propertiesPopup) {
				ensurePropertiesVisible()
				return
			}
			handleSelectionChange()
		})
		
		// Also listen for clicks - but skip if clicking in popup
		quill.root.addEventListener('click', (e) => {
			const target = e.target as HTMLElement
			// Skip if clicking inside properties popup
			if (target.closest('.ql-table-better-properties, .ql-table-better-cell-properties, .ql-table-better-table-properties')) {
				return
			}
			handleSelectionChange(e)
		}, true)
		
		return () => {
			stopPopupMonitoring()
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
