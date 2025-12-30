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

		// Function to set default border-style for table form
		const setDefaultBorderStyle = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return

			// Only process table properties form
			if (!popup.classList.contains('ql-table-properties-form')) return
			if (popup.getAttribute('data-type') !== 'table') return

			// Skip if already processed
			if (popup.dataset.borderStyleSet === 'true') return

			// Find border style dropdown in border section
			const borderRow = popup.querySelector('.properties-form-row:not(.properties-form-row-full)')
			if (!borderRow) return

			const borderDropdown = borderRow.querySelector('.ql-table-dropdown-properties')
			if (!borderDropdown) return

			const dropText = borderDropdown.querySelector('.ql-table-dropdown-text') as HTMLElement
			if (!dropText) return

			// Set default to 'solid' if dropdown is empty, 'none', or undefined
			// Always set to 'solid' for table form default (like cell form)
			const currentValue = dropText.innerText?.trim()
			if (!currentValue || currentValue === '' || currentValue === 'none' || currentValue.toLowerCase() === 'none') {
				// Set text immediately so user sees 'solid' right away
				dropText.innerText = 'solid'
				
				// Try multiple times with increasing delays to ensure list is rendered and click works
				const trySetSolid = (attempt = 0) => {
					const list = borderDropdown.querySelector('.ql-table-dropdown-list')
					
					if (list) {
						const lists = Array.from(list.querySelectorAll('li'))
						const solidOption = lists.find((li) => li.textContent?.trim() === 'solid')
						
						if (solidOption) {
							// Update selected status first
							lists.forEach((li) => {
								li.classList.remove('ql-table-dropdown-selected')
							})
							solidOption.classList.add('ql-table-dropdown-selected')
							
							// Set text to ensure it's displayed
							dropText.innerText = 'solid'
							
							// Trigger click event on solid option to properly update attribute
							// This will call setAttribute and toggleBorderDisabled internally
							;(solidOption as HTMLElement).click()
							
							// Verify the click worked by checking text again after a short delay
							setTimeout(() => {
								if (dropText.innerText?.trim() !== 'solid') {
									// If not set, try clicking again
									dropText.innerText = 'solid'
									;(solidOption as HTMLElement).click()
								}
							}, 50)
							
							// Mark as processed
							popup.dataset.borderStyleSet = 'true'
							return true
						}
					}
					
					// If not found and haven't tried too many times, try again
					if (attempt < 10) {
						setTimeout(() => trySetSolid(attempt + 1), 50 * (attempt + 1))
					} else {
						// Final fallback: text is already set, mark as processed
						popup.dataset.borderStyleSet = 'true'
					}
					
					return false
				}
				
				// Start trying immediately and also after delays to catch different render times
				trySetSolid(0)
				setTimeout(() => trySetSolid(0), 50)
				setTimeout(() => trySetSolid(0), 150)
				setTimeout(() => trySetSolid(0), 300)
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
