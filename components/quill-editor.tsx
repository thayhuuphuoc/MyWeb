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

		// Function to ensure popup is visible
		const ensurePopupVisible = (popup: HTMLElement) => {
			// Remove hidden class if present
			popup.classList.remove('ql-hidden')
			
			// Force visibility with inline styles - highest priority
			popup.style.cssText = `
				display: block !important;
				visibility: visible !important;
				opacity: 1 !important;
				pointer-events: auto !important;
				position: absolute !important;
				z-index: 10001 !important;
			`
		}

		// Hook into appendChild to intercept when popup is added
		const originalAppendChild = quill.container.appendChild.bind(quill.container)
		quill.container.appendChild = function<T extends Node>(child: T): T {
			const result = originalAppendChild(child) as T
			
			// Check if appended child is the popup
			if (child instanceof HTMLElement && child.classList && child.classList.contains('ql-table-properties-form')) {
				// Immediately ensure visibility
				ensurePopupVisible(child)
				
				// Also check after a microtask to ensure it stays visible
				Promise.resolve().then(() => {
					ensurePopupVisible(child)
				})
			}
			
			return result
		}

		// MutationObserver as backup to catch popup
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length) {
					// Convert NodeList to Array for TypeScript compatibility
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === Node.ELEMENT_NODE) {
							const element = node as Element
							
							// Check if the added node is the popup itself
							if (element.classList && element.classList.contains('ql-table-properties-form')) {
								ensurePopupVisible(element as HTMLElement)
							}
							
							// Check if popup is nested inside added node
							const nestedPopup = element.querySelector?.('.ql-table-properties-form')
							if (nestedPopup instanceof HTMLElement) {
								ensurePopupVisible(nestedPopup)
							}
						}
					}
				}
				
				// Watch for class changes that might hide the popup
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					const target = mutation.target as Element
					if (target.classList && target.classList.contains('ql-table-properties-form')) {
						if (target.classList.contains('ql-hidden')) {
							ensurePopupVisible(target as HTMLElement)
						}
					}
				}
			}
		})

		// Observe quill container
		observer.observe(quill.container, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Listen for clicks on table/cell menu items
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			// Check if click is on table or cell properties menu
			const menuItem = target.closest('[data-category="table"], [data-category="cell"]')
			if (menuItem) {
				// Wait for module to create the popup - check multiple times
				const checkPopup = () => {
					const popup = document.querySelector('.ql-table-properties-form') as HTMLElement
					if (popup && popup.isConnected) {
						ensurePopupVisible(popup)
						return true
					}
					return false
				}
				
				// Check immediately and with delays
				setTimeout(checkPopup, 0)
				setTimeout(checkPopup, 10)
				setTimeout(checkPopup, 50)
				setTimeout(checkPopup, 100)
				setTimeout(checkPopup, 200)
			}
		}

		// Add click listener on document
		document.addEventListener('click', handleClick, true)

		return () => {
			observer.disconnect()
			document.removeEventListener('click', handleClick, true)
			// Restore original appendChild
			if (quill.container.appendChild !== originalAppendChild) {
				quill.container.appendChild = originalAppendChild
			}
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
