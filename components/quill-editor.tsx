"use client"

import React, {useEffect, useRef} from "react";
import '@/styles/quill/quill.css'
import 'quill-better-table/dist/quill-better-table.css'
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

		// Debug: Log when table button is clicked
		// Wait for toolbar to be ready - toolbar might be outside container
		setTimeout(() => {
			// Toolbar might be in parent element or sibling
			const container = quill.container
			const parent = container.parentElement
			const root = quillRef.current
			
			// Try to find toolbar in different locations
			const toolbar1 = container.querySelector('.ql-toolbar')
			const toolbar2 = parent?.querySelector('.ql-toolbar')
			const toolbar3 = root?.querySelector('.ql-toolbar')
			const toolbar4 = document.querySelector('.ql-toolbar')
			
			const toolbar = toolbar1 || toolbar2 || toolbar3 || toolbar4
			
			console.log('=== DEBUG: Looking for toolbar and table button ===')
			console.log('Toolbar in container:', !!toolbar1)
			console.log('Toolbar in parent:', !!toolbar2)
			console.log('Toolbar in root:', !!toolbar3)
			console.log('Toolbar in document:', !!toolbar4)
			console.log('Selected toolbar:', toolbar)
			
			if (toolbar) {
				console.log('Toolbar HTML (first 2000 chars):', toolbar.innerHTML.substring(0, 2000))
				console.log('All toolbar buttons:', Array.from(toolbar.querySelectorAll('button, .ql-picker')).map(btn => ({
					element: btn,
					classes: btn.className,
					dataValue: btn.getAttribute('data-value'),
					tagName: btn.tagName,
					text: btn.textContent?.substring(0, 50)
				})))
			}
			
			// Try multiple possible selectors for table button in toolbar or document
			const tableButton1 = toolbar?.querySelector('.ql-table-better')
			const tableButton2 = toolbar?.querySelector('button[data-value="table-better"]')
			const tableButton3 = document.querySelector('.ql-table-better')
			const tableButton4 = document.querySelector('[class*="table-better"]')
			const tableButton5 = document.querySelector('button.ql-table-better')
			const tableButton6 = toolbar?.querySelector('button[class*="table"]')
			
			const tableButton = tableButton1 || tableButton2 || tableButton3 || tableButton4 || tableButton5 || tableButton6
			
			console.log('Table button (.ql-table-better in toolbar):', tableButton1)
			console.log('Table button (button[data-value="table-better"] in toolbar):', tableButton2)
			console.log('Table button (.ql-table-better in document):', tableButton3)
			console.log('Table button ([class*="table-better"] in document):', tableButton4)
			console.log('Table button (button.ql-table-better in document):', tableButton5)
			console.log('Table button (button[class*="table"] in toolbar):', tableButton6)
			console.log('Selected table button:', tableButton)
			
			if (tableButton) {
				console.log('=== DEBUG: Adding click listener to table button ===')
				console.log('Table button element:', tableButton)
				console.log('Table button classes:', tableButton.className)
				tableButton.addEventListener('click', (e) => {
					console.log('=== TABLE BUTTON CLICKED ===')
					console.log('Event:', e)
					console.log('Quill instance:', quill)
					
					// Check for table module
					const tableModule = quill.getModule('table-better')
					console.log('Table module:', tableModule)
					
					// Check for any popups/dialogs immediately
					console.log('=== Checking for popups/dialogs immediately ===')
					const allPopupsImmediate = document.querySelectorAll('[class*="table"], [class*="select"], [class*="dialog"], [class*="popup"]')
					console.log('Immediate popups found:', allPopupsImmediate.length)
					
					// Check again after a delay
					setTimeout(() => {
						console.log('=== Checking for popups/dialogs after 100ms ===')
						const allPopups = document.querySelectorAll('[class*="table"], [class*="select"], [class*="dialog"], [class*="popup"]')
						console.log('All popups/dialogs found:', allPopups.length)
						allPopups.forEach((popup, index) => {
							const computed = window.getComputedStyle(popup)
							console.log(`Popup ${index}:`, {
								element: popup,
								tagName: popup.tagName,
								classes: popup.className,
								id: popup.id,
								display: computed.display,
								visibility: computed.visibility,
								opacity: computed.opacity,
								zIndex: computed.zIndex,
								position: computed.position,
								width: computed.width,
								height: computed.height,
								innerHTML: popup.innerHTML.substring(0, 100) + '...'
							})
						})
						
						// Check for properties form
						const propertiesForm = document.querySelectorAll('.ql-table-properties-form')
						console.log('Properties forms found:', propertiesForm.length)
						propertiesForm.forEach((form, index) => {
							console.log(`Properties form ${index}:`, {
								element: form,
								classes: form.className,
								dataType: form.getAttribute('data-type'),
								display: window.getComputedStyle(form).display
							})
						})
						
						// Check for table select dialog - try various selectors
						const selectDialog1 = document.querySelectorAll('[class*="select"][class*="table"]')
						const selectDialog2 = document.querySelectorAll('[class*="table"][class*="select"]')
						const selectDialog3 = document.querySelectorAll('.ql-table-select, [class*="table-select"]')
						console.log('Table select dialogs (selector 1):', selectDialog1.length)
						console.log('Table select dialogs (selector 2):', selectDialog2.length)
						console.log('Table select dialogs (selector 3):', selectDialog3.length)
						
						// Check all elements in quill container
						console.log('=== All elements in quill container ===')
						const allElements = quill.container.querySelectorAll('*')
						console.log('Total elements:', allElements.length)
						allElements.forEach((el, index) => {
							if (el.className && (el.className.includes('table') || el.className.includes('select') || el.className.includes('dialog'))) {
								console.log(`Element ${index}:`, {
									tagName: el.tagName,
									classes: el.className,
									display: window.getComputedStyle(el).display,
									visibility: window.getComputedStyle(el).visibility
								})
							}
						})
					}, 100)
				}, { once: false })
			} else {
				console.error('=== ERROR: Table button not found! ===')
				console.log('Quill container:', quill.container)
				console.log('Quill container HTML:', quill.container.innerHTML.substring(0, 500))
			}
		}, 500) // Wait 500ms for toolbar to be ready

		// Debug: Catch all errors
		window.addEventListener('error', (e) => {
			console.error('=== GLOBAL ERROR ===', e.error, e.message, e.filename, e.lineno)
		})

		// Debug: Catch unhandled promise rejections
		window.addEventListener('unhandledrejection', (e) => {
			console.error('=== UNHANDLED PROMISE REJECTION ===', e.reason)
		})

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
					}
				}
			})
		}, 500) // Check every 500ms - frequent enough for properties form, but won't interfere with table insertion

		return () => {
			clearInterval(interval)
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
