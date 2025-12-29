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
		const tableButton = quill.container.querySelector('.ql-table-better')
		if (tableButton) {
			tableButton.addEventListener('click', (e) => {
				console.log('=== TABLE BUTTON CLICKED ===')
				console.log('Event:', e)
				console.log('Quill instance:', quill)
				
				// Check for table module
				const tableModule = quill.getModule('table-better')
				console.log('Table module:', tableModule)
				
				// Check for any popups/dialogs
				setTimeout(() => {
					const allPopups = document.querySelectorAll('[class*="table"], [class*="select"], [class*="dialog"], [class*="popup"]')
					console.log('All popups/dialogs found:', allPopups)
					allPopups.forEach((popup, index) => {
						console.log(`Popup ${index}:`, {
							element: popup,
							classes: popup.className,
							display: window.getComputedStyle(popup).display,
							visibility: window.getComputedStyle(popup).visibility,
							opacity: window.getComputedStyle(popup).opacity,
							zIndex: window.getComputedStyle(popup).zIndex,
							position: window.getComputedStyle(popup).position,
							width: window.getComputedStyle(popup).width,
							height: window.getComputedStyle(popup).height
						})
					})
					
					// Check for properties form
					const propertiesForm = document.querySelectorAll('.ql-table-properties-form')
					console.log('Properties forms found:', propertiesForm)
					
					// Check for table select dialog
					const selectDialog = document.querySelectorAll('[class*="select"][class*="table"], [class*="table"][class*="select"]')
					console.log('Table select dialogs found:', selectDialog)
				}, 100)
			})
		}

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
