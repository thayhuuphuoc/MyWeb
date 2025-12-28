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

		// Function to force show popup
		const forceShowPopup = (popup: HTMLElement) => {
			if (!popup || !popup.isConnected) return
			
			// Remove all hidden classes
			popup.classList.remove('ql-hidden')
			
			// Use cssText for maximum priority
			const currentStyle = popup.getAttribute('style') || ''
			popup.setAttribute('style', currentStyle + '; display: block !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; z-index: 10001 !important; pointer-events: auto !important;')
			
			// Also set via style object
			popup.style.setProperty('display', 'block', 'important')
			popup.style.setProperty('visibility', 'visible', 'important')
			popup.style.setProperty('opacity', '1', 'important')
			popup.style.setProperty('position', 'fixed', 'important')
			popup.style.setProperty('z-index', '10001', 'important')
			popup.style.setProperty('pointer-events', 'auto', 'important')
			
			// Move to body if needed
			if (popup.parentElement && popup.parentElement !== document.body) {
				const rect = popup.getBoundingClientRect()
				document.body.appendChild(popup)
				popup.style.top = `${rect.top}px`
				popup.style.left = `${rect.left}px`
			}
		}

		// Intercept clicks on table/cell menu items
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			const menuItem = target.closest('[data-category="table"], [data-category="cell"]')
			
			if (menuItem) {
				// Wait a bit for popup to be created, then force show it
				const checkAndShow = () => {
					const popups = document.querySelectorAll('.ql-table-properties-form, .ql-table-better-properties')
					popups.forEach((popup) => {
						if (popup instanceof HTMLElement) {
							forceShowPopup(popup)
						}
					})
				}
				
				// Check multiple times
				setTimeout(checkAndShow, 0)
				setTimeout(checkAndShow, 10)
				setTimeout(checkAndShow, 50)
				setTimeout(checkAndShow, 100)
				setTimeout(checkAndShow, 200)
				setTimeout(checkAndShow, 500)
			}
		}

		// Add click listener
		document.addEventListener('click', handleClick, true)

		// MutationObserver to catch popup creation
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				// Check added nodes
				if (mutation.addedNodes.length) {
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === Node.ELEMENT_NODE) {
							const element = node as HTMLElement
							
							// Check if it's a popup
							if (element.classList?.contains('ql-table-properties-form') ||
							    element.classList?.contains('ql-table-better-properties')) {
								requestAnimationFrame(() => {
									forceShowPopup(element)
								})
							}
							
							// Check nested
							const popup = element.querySelector?.('.ql-table-properties-form, .ql-table-better-properties')
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
					if (target.classList?.contains('ql-table-properties-form') ||
					    target.classList?.contains('ql-table-better-properties')) {
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

		// Observe document
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Observe quill container
		if (quill.container) {
			observer.observe(quill.container, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['class', 'style']
			})
		}

		// Periodic check
		const interval = setInterval(() => {
			const popups = document.querySelectorAll('.ql-table-properties-form, .ql-table-better-properties')
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
			document.removeEventListener('click', handleClick, true)
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
