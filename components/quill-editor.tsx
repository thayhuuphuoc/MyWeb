"use client"

import React, {useEffect, useRef} from "react";
import '@/styles/quill/quill.css'
import 'quill-table-better/dist/quill-table-better.css'
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

		// Function to fix label positioning - override floating label pattern from SCSS
		// Based on quill-table-better SCSS: label has position: absolute, top: -50%, transform: translateY(50%) scale(0.75), display: none
		// SCSS also shows label only on input focus or when input has value - we need to always show it above input
		const fixLabelPositioning = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return

			// Find all label-field-view-input-wrapper elements
			const wrappers = popup.querySelectorAll<HTMLElement>('.label-field-view-input-wrapper')
			
			wrappers.forEach((wrapper) => {
				// Find label and input within wrapper
				const label = wrapper.querySelector('label')
				const input = wrapper.querySelector('.property-input') || wrapper.querySelector('input[type="text"]')

				if (!label || !input) return

				// CRITICAL: Remove label from DOM and re-insert it BEFORE input to ensure it's above
				// This ensures label is always visible and positioned correctly
				if (label.parentNode === wrapper && label.nextSibling !== input) {
					// Label is not right before input, move it
					wrapper.insertBefore(label, input)
				}

				// CRITICAL: Force override floating label pattern with inline styles (!important)
				// Override SCSS: position: absolute, top: -50%, transform: translateY(50%) scale(0.75), display: none
				// Also override SCSS rules that show label only on focus: &:focus + label { display: block; }
				label.style.cssText = `
					position: static !important;
					top: auto !important;
					left: auto !important;
					right: auto !important;
					bottom: auto !important;
					transform: none !important;
					-webkit-transform: none !important;
					display: block !important;
					visibility: visible !important;
					opacity: 1 !important;
					scale: 1 !important;
					margin-bottom: 4px !important;
					margin-top: 0 !important;
					margin-left: 0 !important;
					margin-right: auto !important;
					order: -1 !important;
					color: #666 !important;
					background: #f9f9f9 !important;
					border: 1px solid #e0e0e0 !important;
					padding: 3px 6px !important;
					border-radius: 3px !important;
					font-size: 10px !important;
					font-weight: normal !important;
					white-space: nowrap !important;
					width: fit-content !important;
					z-index: 1 !important;
					pointer-events: auto !important;
				`

				// CRITICAL: Ensure wrapper has flex column layout so label appears above input
				wrapper.style.cssText = `
					display: flex !important;
					flex-direction: column !important;
					align-items: flex-start !important;
					gap: 4px !important;
					position: relative !important;
				`

				// Ensure input order is after label
				if (input instanceof HTMLElement) {
					input.style.setProperty('order', '0', 'important')
				}
			})
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

		// Function to process all visible properties forms
		const processPropertiesForms = () => {
			const popups = document.querySelectorAll('.ql-table-properties-form[data-type="table"], .ql-table-properties-form[data-type="cell"]')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement && popup.isConnected) {
					const computed = window.getComputedStyle(popup)
					// Only process if visible
					if (!(computed.display === 'none' ||
						computed.visibility === 'hidden' ||
						computed.opacity === '0' ||
						popup.classList.contains('ql-hidden'))) {
						fixLabelPositioning(popup)
						fixColorInputs(popup)
					}
				}
			})
		}

		// Process immediately when form appears
		processPropertiesForms()

		// Also use MutationObserver to catch when form is added to DOM
		const formObserver = new MutationObserver(() => {
			processPropertiesForms()
		})
		formObserver.observe(document.body, {
			childList: true,
			subtree: true
		})

		// Periodic check as backup - check more frequently
		const interval = setInterval(() => {
			processPropertiesForms()
		}, 100) // Check every 100ms for faster response

		return () => {
			clearInterval(interval)
			formObserver.disconnect()
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
