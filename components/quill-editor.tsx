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
		
		// Ensure we're in browser environment
		if (typeof window === 'undefined' || typeof document === 'undefined') return

		const quill = new Quill(quillRef.current, {
			theme: 'snow',
			modules: QuillConfig
		})

		quill.setContents(quill.clipboard.convert({html: props.value || props.defaultValue}), 'silent')

		quill.on('editor-change', () => props.onChange(quill.getSemanticHTML()))

		// Check if table-better module is loaded
		const tableModule = quill.getModule('table-better')
		if (!tableModule) {
			console.error('quill-table-better module not loaded!')
		}

		// Intercept appendChild to catch when form is added to DOM
		const originalAppendChild = quill.container.appendChild.bind(quill.container)
		quill.container.appendChild = function<T extends Node>(node: T): T {
			if (node instanceof HTMLElement && node.classList.contains('ql-table-properties-form')) {
				// Call original appendChild
				const result = originalAppendChild(node)
				// Ensure form is visible after append - wait for positioning to complete
				setTimeout(() => {
					if (node.isConnected) {
						ensurePopupVisible(node)
					}
				}, 50) // Wait a bit longer for positioning
				return result
			}
			return originalAppendChild(node)
		}

		// Intercept removeChild to prevent form from being removed prematurely
		const originalRemoveChild = quill.container.removeChild.bind(quill.container)
		quill.container.removeChild = function<T extends Node>(child: T): T {
			if (child instanceof HTMLElement && child.classList.contains('ql-table-properties-form')) {
				// Only remove if explicitly requested (not by accident)
				return originalRemoveChild(child)
			}
			return originalRemoveChild(child)
		}

		// Function to fix accessibility issues in popup form
		const fixAccessibility = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return
			
			// Fix form fields: add id and name attributes
			const inputs = popup.querySelectorAll('input.property-input, input[type="text"], input[type="color"]')
			inputs.forEach((input, index) => {
				if (input instanceof HTMLInputElement) {
					// Generate unique ID
					const inputId = `ql-table-property-${Date.now()}-${index}`
					
					// Add id if not present
					if (!input.id) {
						input.id = inputId
					}
					
					// Add name if not present (use property name from data attribute or generate)
					if (!input.name) {
						const propertyName = input.closest('.label-field-view')?.getAttribute('data-property') || 
						                     input.closest('[data-property]')?.getAttribute('data-property') ||
						                     `property-${index}`
						input.name = propertyName
					}
					
					// Find associated label and link it
					const wrapper = input.closest('.label-field-view-input-wrapper')
					if (wrapper) {
						const label = wrapper.querySelector('label')
						if (label && !label.getAttribute('for')) {
							label.setAttribute('for', input.id)
						}
					}
					
					// Also check for label in parent container
					const container = input.closest('.label-field-view')
					if (container) {
						const label = container.querySelector('label:not([for])')
						if (label && !label.getAttribute('for')) {
							label.setAttribute('for', input.id)
						}
					}
				}
			})
			
			// Fix select elements
			const selects = popup.querySelectorAll('select')
			selects.forEach((select, index) => {
				if (select instanceof HTMLSelectElement) {
					if (!select.id) {
						select.id = `ql-table-select-${Date.now()}-${index}`
					}
					if (!select.name) {
						select.name = `select-${index}`
					}
					
					// Find associated label
					const label = select.closest('.ql-table-dropdown-properties')?.querySelector('label')
					if (label && !label.getAttribute('for')) {
						label.setAttribute('for', select.id)
					}
				}
			})
			
			// Fix buttons: ensure they have proper attributes
			const buttons = popup.querySelectorAll('button')
			buttons.forEach((button, index) => {
				if (button instanceof HTMLButtonElement) {
					if (!button.id && !button.name) {
						const label = button.getAttribute('data-label') || button.getAttribute('label')
						if (label) {
							button.id = `ql-table-btn-${label}-${index}`
							button.name = label
						}
					}
					
					// Ensure button has type attribute
					if (!button.type) {
						button.type = 'button'
					}
				}
			})
		}

		// Function to ensure popup is visible and in viewport
		const ensurePopupVisible = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return
			
			// Remove hidden class
			popup.classList.remove('ql-hidden')
			
			// Force visibility - let CSS handle most of it, just ensure critical properties
			popup.style.setProperty('display', 'block', 'important')
			popup.style.setProperty('visibility', 'visible', 'important')
			popup.style.setProperty('opacity', '1', 'important')
			popup.style.setProperty('z-index', '10001', 'important')
			popup.style.setProperty('pointer-events', 'auto', 'important')
			
			// Ensure form has background and is visible
			const computedBg = window.getComputedStyle(popup).backgroundColor
			if (!computedBg || computedBg === 'rgba(0, 0, 0, 0)' || computedBg === 'transparent') {
				popup.style.setProperty('background-color', '#ffffff', 'important')
				popup.style.setProperty('box-shadow', '0 2px 8px rgba(0,0,0,0.15)', 'important')
			}
			
			// Check if form is in viewport and adjust if needed
			requestAnimationFrame(() => {
				const rect = popup.getBoundingClientRect()
				const viewportHeight = window.innerHeight || document.documentElement.clientHeight
				const viewportWidth = window.innerWidth || document.documentElement.clientWidth
				
				// If form is below viewport, move it up
				if (rect.bottom > viewportHeight) {
					const newTop = Math.max(10, viewportHeight - rect.height - 10)
					popup.style.setProperty('top', `${newTop}px`, 'important')
				}
				
				// If form is above viewport, move it down
				if (rect.top < 0) {
					popup.style.setProperty('top', '10px', 'important')
				}
				
				// If form is outside viewport horizontally, center it
				if (rect.left < 0 || rect.right > viewportWidth) {
					const centerLeft = Math.max(10, (viewportWidth - rect.width) / 2)
					popup.style.setProperty('left', `${centerLeft}px`, 'important')
				}
				
				// Scroll form into view if needed
				if (rect.bottom > viewportHeight || rect.top < 0) {
					popup.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
				}
			})
			
			// Fix accessibility issues
			fixAccessibility(popup)
		}

		// Simple MutationObserver - wait for form to be created and positioned
		const observer = new MutationObserver(() => {
			// Find all popups
			const popups = document.querySelectorAll('.ql-table-properties-form')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement) {
					const computed = window.getComputedStyle(popup)
					// Only force show if actually hidden
					if (computed.display === 'none' || 
					    computed.visibility === 'hidden' || 
					    computed.opacity === '0' ||
					    popup.classList.contains('ql-hidden')) {
						// Wait a bit for positioning to complete
						setTimeout(() => {
							ensurePopupVisible(popup)
						}, 10)
					} else {
						// Even if visible, fix accessibility
						fixAccessibility(popup)
					}
				}
			})
		})

		// Observe quill container and document body
		observer.observe(quill.container, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Periodic check as backup
		const interval = setInterval(() => {
			const popups = document.querySelectorAll('.ql-table-properties-form')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement) {
					const computed = window.getComputedStyle(popup)
					if (computed.display === 'none' || 
					    computed.visibility === 'hidden' || 
					    computed.opacity === '0' ||
					    popup.classList.contains('ql-hidden')) {
						ensurePopupVisible(popup)
					} else {
						// Fix accessibility even if visible
						fixAccessibility(popup)
					}
				}
			})
		}, 100)

		return () => {
			observer.disconnect()
			clearInterval(interval)
			// Restore original methods
			if (quill.container.appendChild !== originalAppendChild) {
				quill.container.appendChild = originalAppendChild
			}
			if (quill.container.removeChild !== originalRemoveChild) {
				quill.container.removeChild = originalRemoveChild
			}
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
