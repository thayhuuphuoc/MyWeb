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

		// Get table module
		const tableModule = quill.getModule('table-better')
		if (!tableModule) return

		// Function to force show popup immediately
		const forceShowPopup = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return
			
			// Remove hidden class
			popup.classList.remove('ql-hidden')
			
			// Force visibility with maximum priority
			popup.style.cssText += `
				display: block !important;
				visibility: visible !important;
				opacity: 1 !important;
				z-index: 10001 !important;
				pointer-events: auto !important;
			`
		}

		// Override appendChild to intercept when form is added
		const originalAppendChild = quill.container.appendChild.bind(quill.container)
		quill.container.appendChild = function<T extends Node>(child: T): T {
			const result = originalAppendChild(child) as T
			
			// Check if it's the properties form
			if (child instanceof HTMLElement && child.classList.contains('ql-table-properties-form')) {
				// Force show immediately
				requestAnimationFrame(() => {
					forceShowPopup(child)
					// Also check after a short delay to ensure it stays visible
					setTimeout(() => forceShowPopup(child), 0)
					setTimeout(() => forceShowPopup(child), 10)
					setTimeout(() => forceShowPopup(child), 50)
				})
			}
			
			return result
		}

		// MutationObserver to catch any changes
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				// Check added nodes
				if (mutation.addedNodes.length) {
					for (const node of Array.from(mutation.addedNodes)) {
						if (node instanceof HTMLElement) {
							if (node.classList.contains('ql-table-properties-form')) {
								requestAnimationFrame(() => {
									forceShowPopup(node)
								})
							}
							
							// Check nested
							const popup = node.querySelector('.ql-table-properties-form')
							if (popup instanceof HTMLElement) {
								requestAnimationFrame(() => {
									forceShowPopup(popup)
								})
							}
						}
					}
				}
				
				// Check attribute changes
				if (mutation.type === 'attributes') {
					const target = mutation.target as HTMLElement
					if (target.classList.contains('ql-table-properties-form')) {
						if (target.classList.contains('ql-hidden') ||
						    target.style.display === 'none' ||
						    target.style.visibility === 'hidden') {
							requestAnimationFrame(() => {
								forceShowPopup(target)
							})
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

		// Observe document body
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Periodic check
		const interval = setInterval(() => {
			const popups = document.querySelectorAll('.ql-table-properties-form')
			popups.forEach((popup) => {
				if (popup instanceof HTMLElement) {
					const computed = window.getComputedStyle(popup)
					if (computed.display === 'none' || 
					    computed.visibility === 'hidden' || 
					    computed.opacity === '0' ||
					    popup.classList.contains('ql-hidden')) {
						forceShowPopup(popup)
					}
				}
			})
		}, 50)

		return () => {
			// Restore original appendChild
			if (quill.container.appendChild !== originalAppendChild) {
				quill.container.appendChild = originalAppendChild
			}
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
