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

		// Function to update color input background color based on value
		const updateColorInputBackground = (input: HTMLInputElement) => {
			const value = input.value?.trim() || ''
			if (value && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(value)) {
				// Valid hex color - set background color
				input.style.backgroundColor = value
				input.style.backgroundImage = 'none'
			} else if (value && value !== 'transparent' && value !== 'none') {
				// Try to parse as color
				try {
					const ctx = document.createElement('canvas').getContext('2d')
					if (ctx) {
						ctx.fillStyle = value
						input.style.backgroundColor = ctx.fillStyle as string
						input.style.backgroundImage = 'none'
					}
				} catch {
					// Invalid color - use checkerboard pattern
					input.style.backgroundColor = 'transparent'
				}
			} else {
				// No color or transparent - use checkerboard pattern
				input.style.backgroundColor = 'transparent'
			}
		}

		// Function to fix color inputs
		const fixColorInputs = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return

			// Only process properties form, not table select dialog
			if (!popup.classList.contains('ql-table-properties-form')) return

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

		// Simple MutationObserver - wait for properties form to be created
		const observer = new MutationObserver((mutations) => {
			// Only process if there are actual changes
			let hasPropertiesForm = false
			for (const mutation of mutations) {
				for (const node of Array.from(mutation.addedNodes)) {
					if (node instanceof HTMLElement && node.classList.contains('ql-table-properties-form')) {
						hasPropertiesForm = true
						break
					}
					if (node instanceof HTMLElement && node.querySelector('.ql-table-properties-form')) {
						hasPropertiesForm = true
						break
					}
				}
				if (hasPropertiesForm) break
			}

			if (hasPropertiesForm) {
				// Find all properties form popups
				const popups = document.querySelectorAll('.ql-table-properties-form')
				popups.forEach((popup) => {
					if (popup instanceof HTMLElement) {
						const computed = window.getComputedStyle(popup)
						// Only process if visible and is properties form (not select dialog)
						if (popup.classList.contains('ql-table-properties-form') &&
							!(computed.display === 'none' ||
							computed.visibility === 'hidden' ||
							computed.opacity === '0' ||
							popup.classList.contains('ql-hidden'))) {
							// Fix color inputs
							fixColorInputs(popup)
						}
					}
				})
			}
		})

		// Observe quill container only (not document.body to avoid conflicts)
		observer.observe(quill.container, {
			childList: true,
			subtree: true,
			attributes: false // Don't observe attributes to reduce overhead
		})

		// Periodic check as backup - only for properties form
		const interval = setInterval(() => {
			const popups = document.querySelectorAll('.ql-table-properties-form')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement && popup.classList.contains('ql-table-properties-form')) {
					const computed = window.getComputedStyle(popup)
					if (!(computed.display === 'none' ||
						computed.visibility === 'hidden' ||
						computed.opacity === '0' ||
						popup.classList.contains('ql-hidden'))) {
						fixColorInputs(popup)
					}
				}
			})
		}, 500) // Increased interval to reduce overhead

		return () => {
			observer.disconnect()
			clearInterval(interval)
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
