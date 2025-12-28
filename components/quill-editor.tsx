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

		// Function to ensure popup is visible - with maximum force
		const ensurePopupVisible = (popup: HTMLElement) => {
			try {
				if (!popup || !popup.isConnected || typeof window === 'undefined') return
				
				// Remove any hidden classes first
				popup.classList.remove('ql-hidden')
				
				// Always force visibility styles - don't check, just set
					popup.style.setProperty('display', 'block', 'important')
					popup.style.setProperty('visibility', 'visible', 'important')
					popup.style.setProperty('opacity', '1', 'important')
					popup.style.setProperty('pointer-events', 'auto', 'important')
					popup.style.setProperty('position', 'absolute', 'important')
					popup.style.setProperty('z-index', '10001', 'important')
				
				// Double check and force if still hidden
				requestAnimationFrame(() => {
					try {
						if (popup.isConnected) {
							const computed = window.getComputedStyle(popup)
							if (computed.display === 'none' || 
							    computed.visibility === 'hidden' || 
							    computed.opacity === '0' ||
							    popup.classList.contains('ql-hidden')) {
								popup.classList.remove('ql-hidden')
								popup.style.setProperty('display', 'block', 'important')
								popup.style.setProperty('visibility', 'visible', 'important')
								popup.style.setProperty('opacity', '1', 'important')
							}
						}
					} catch (error) {
						// Silently fail
					}
				})
			} catch (error) {
				// Silently fail - don't break the app
			}
		}

		// Hook into appendChild to intercept when popup is added
		const originalAppendChild = quill.container.appendChild.bind(quill.container)
		quill.container.appendChild = function<T extends Node>(child: T): T {
			const result = originalAppendChild(child) as T
			
			try {
				// Check if appended child is the popup
				if (child instanceof HTMLElement && child.classList && child.classList.contains('ql-table-properties-form')) {
					// Immediately ensure visibility
					setTimeout(() => ensurePopupVisible(child), 0)
					setTimeout(() => ensurePopupVisible(child), 10)
					setTimeout(() => ensurePopupVisible(child), 50)
				}
			} catch (error) {
				// Silently fail
			}
			
			return result
		}

		// MutationObserver to catch popup creation
		const observer = new MutationObserver((mutations) => {
			try {
				for (const mutation of mutations) {
					if (mutation.addedNodes.length) {
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
					
					// Watch for style changes
					if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
						const target = mutation.target as Element
						if (target.classList && target.classList.contains('ql-table-properties-form')) {
							const computed = window.getComputedStyle(target as HTMLElement)
							if (computed.display === 'none' || computed.visibility === 'hidden') {
								ensurePopupVisible(target as HTMLElement)
							}
						}
					}
				}
			} catch (error) {
				// Silently fail
			}
		})

		// Observe quill container and document body for popup creation
		observer.observe(quill.container, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Also observe document body in case popup is appended there
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'style']
		})

		// Periodic check to ensure popup stays visible - check more frequently
		const checkInterval = setInterval(() => {
			try {
				if (typeof document === 'undefined') return
				// Search in entire document, not just container
				const popups = document.querySelectorAll('.ql-table-properties-form')
				popups.forEach((popup) => {
					if (popup instanceof HTMLElement && popup.isConnected) {
						const computed = window.getComputedStyle(popup)
						if (computed.display === 'none' || 
						    computed.visibility === 'hidden' || 
						    computed.opacity === '0' ||
						    popup.classList.contains('ql-hidden')) {
							ensurePopupVisible(popup)
						} else {
							// Even if not hidden, ensure styles are set
							ensurePopupVisible(popup)
						}
					}
					})
				} catch (error) {
					// Silently fail
				}
		}, 50)

		// Listen for clicks on table/cell menu items
		const handleClick = (e: MouseEvent) => {
			try {
				const target = e.target as HTMLElement
				// Check if click is on table or cell properties menu - use more flexible selector
				const menuItem = target.closest('[data-category="table"], [data-category="cell"], .ql-table-menu, .ql-table-better-menu')
				if (menuItem) {
					// Wait for module to create the popup - check multiple times with longer delays
					const checkPopup = () => {
						if (typeof document === 'undefined') return false
						// Search in entire document
						const popup = document.querySelector('.ql-table-properties-form') as HTMLElement
						if (popup && popup.isConnected) {
							ensurePopupVisible(popup)
							return true
						}
						return false
					}
					
					// Check immediately and with delays - more frequent checks
					setTimeout(checkPopup, 0)
					setTimeout(checkPopup, 10)
					setTimeout(checkPopup, 25)
					setTimeout(checkPopup, 50)
					setTimeout(checkPopup, 100)
					setTimeout(checkPopup, 150)
					setTimeout(checkPopup, 200)
					setTimeout(checkPopup, 300)
					setTimeout(checkPopup, 500)
					setTimeout(checkPopup, 800)
					setTimeout(checkPopup, 1000)
				}
			} catch (error) {
				// Silently fail
			}
		}

		// Add click listener on document
		document.addEventListener('click', handleClick, true)

		return () => {
			try {
				observer.disconnect()
				clearInterval(checkInterval)
				document.removeEventListener('click', handleClick, true)
				// Restore original appendChild
				if (quill.container.appendChild !== originalAppendChild) {
					quill.container.appendChild = originalAppendChild
				}
			} catch (error) {
				// Silently fail
			}
		}
	}, []);

	return (
		<div className={props.className} ref={quillRef}></div>
	)
})
QuillEditor.displayName = "QuillEditor"
export {QuillEditor}
